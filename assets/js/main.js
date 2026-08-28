/* anniesailing.ca — light progressive enhancement */
(function () {
  'use strict';

  /* current year in footer */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* scroll reveal */
  var revealed = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    revealed.forEach(function (el) { io.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add('in'); });
  }

  /* sticky index — active section highlight */
  var links = Array.prototype.slice.call(document.querySelectorAll('.index__links a'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* contact form — Web3Forms via fetch, with graceful fallback */
  var form = document.querySelector('.cform');
  if (form) {
    var status = form.querySelector('.cform__status');
    var key = form.querySelector('[name="access_key"]');
    var configured = key && key.value && key.value.indexOf('REPLACE_WITH') === -1;

    form.addEventListener('submit', function (ev) {
      if (!configured) return; // let the native POST handle it once a key is set
      ev.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      status.className = 'cform__status';
      status.textContent = 'Sending…';
      btn.disabled = true;

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            form.reset();
            status.className = 'cform__status ok';
            status.textContent = 'Thanks — your message is on its way.';
          } else {
            status.className = 'cform__status err';
            status.textContent = data.message || 'Something went wrong. Please try Instagram.';
          }
        })
        .catch(function () {
          status.className = 'cform__status err';
          status.textContent = 'Network error. Please try again or reach out on Instagram.';
        })
        .finally(function () { btn.disabled = false; });
    });
  }
})();
