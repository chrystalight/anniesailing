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

  /* gallery lightbox */
  var lb = document.getElementById('lightbox');
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
  if (lb && items.length) {
    var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('figcaption');
    var cur = 0, lastFocus = null;
    var show = function (i) {
      cur = (i + items.length) % items.length;
      var it = items[cur];
      lbImg.src = it.getAttribute('href');
      lbImg.alt = it.querySelector('img').alt;
      lbCap.textContent = it.getAttribute('data-caption') || '';
    };
    var open = function (i) { lastFocus = document.activeElement; show(i); lb.hidden = false; document.body.style.overflow = 'hidden'; lb.querySelector('.lightbox__close').focus(); };
    var close = function () { lb.hidden = true; document.body.style.overflow = ''; lbImg.removeAttribute('src'); if (lastFocus) lastFocus.focus(); };
    items.forEach(function (it, i) {
      it.addEventListener('click', function (e) { e.preventDefault(); open(i); });
    });
    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.querySelector('.lightbox__prev').addEventListener('click', function () { show(cur - 1); });
    lb.querySelector('.lightbox__next').addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'ArrowRight') show(cur + 1);
    });
  }
})();

/* explainer video: autoplay (muted, looping) when on screen, pause when off screen */
(function () {
  var v = document.querySelector('.explain__video video');
  if (!v) return;
  v.muted = true;
  v.defaultMuted = true;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { v.removeAttribute('autoplay'); v.pause(); return; }
  var userPaused = false;
  v.addEventListener('pause', function () { if (v.dataset.auto !== '1') userPaused = true; });
  v.addEventListener('play', function () { userPaused = false; });
  function play() { v.dataset.auto = '1'; var p = v.play(); if (p && p.catch) p.catch(function () {}); setTimeout(function () { v.dataset.auto = ''; }, 50); }
  function pause() { v.dataset.auto = '1'; v.pause(); setTimeout(function () { v.dataset.auto = ''; }, 50); }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { if (!userPaused) play(); } else { pause(); }
      });
    }, { threshold: 0.35 }).observe(v);
  } else { play(); }
})();

/* click any standalone photo (headshot, "through the years", moments, feature news) to enlarge it */
(function () {
  var sel = '.snapshot__photo, .years img, .years__lead img, .moments img, .feature__media img, .about__whimsy img';
  var imgs = Array.prototype.slice.call(document.querySelectorAll(sel)).filter(function (im) { return !im.closest('a'); });
  if (!imgs.length) return;
  var ov = document.createElement('div');
  ov.className = 'lightbox';
  ov.hidden = true;
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.setAttribute('aria-label', 'Photo viewer');
  ov.innerHTML = '<button class="lightbox__close" type="button" aria-label="Close">&times;</button><figure class="lightbox__fig"><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(ov);
  var big = ov.querySelector('img'), cap = ov.querySelector('figcaption');
  var close = function () { ov.hidden = true; document.body.style.overflow = ''; big.removeAttribute('src'); };
  imgs.forEach(function (im) {
    im.style.cursor = 'zoom-in';
    im.addEventListener('click', function () {
      big.src = im.currentSrc || im.src;
      big.alt = im.alt;
      var fc = im.closest('figure') && im.closest('figure').querySelector('figcaption');
      cap.textContent = fc ? fc.textContent : '';
      ov.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });
  ov.addEventListener('click', function (e) { if (e.target === ov || e.target.className === 'lightbox__close') close(); });
  document.addEventListener('keydown', function (e) { if (!ov.hidden && e.key === 'Escape') close(); });
})();

/* On phones, the Results menu link opens the results page */
(function(){
  try{
    if(!window.matchMedia('(max-width:600px)').matches)return;
    var a=document.querySelector('.index__links a[href="#results"]');
    if(a)a.setAttribute('href','results.html');
  }catch(e){}
})();
