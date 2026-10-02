/* Site search — searches the home page, gallery captions, full results and finances.
   Reads the live pages, so new content is searchable automatically. */
(function () {
  'use strict';
  var PAGES = [
    { url: 'index.html', label: '' },
    { url: 'full-results.html', label: 'Full results' },
    { url: 'gallery.html', label: 'Gallery' },
    { url: 'finances.html', label: 'Finances' }
  ];
  var SECTION_LABELS = { top: 'Home', support: 'Support', news: 'Recent News', results: 'Results', moments: 'Moments', gallery: 'Gallery', contact: 'Contact', instagram: 'Instagram' };
  var index = null, loading = null;

  function norm(s) { return (s || '').replace(/\s+/g, ' ').trim(); }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function extract(doc, page) {
    var out = [], seen = {};
    function add(text, hash, label, href, thumb) {
      text = norm(text);
      if (text.length < 4) return;
      var key = page.url + '|' + text;
      if (seen[key]) return;
      seen[key] = 1;
      out.push({ text: text, lower: text.toLowerCase(), href: href || (page.url + (hash ? '#' + hash : '')), label: label, thumb: thumb || '' });
    }
    var skip = 'nav, footer, form, script, style, .lightbox, .sched__strip, [aria-hidden="true"]';
    doc.querySelectorAll('h1,h2,h3,p,li,figcaption,summary').forEach(function (el) {
      if (el.closest(skip) && !el.matches('li') ) return;
      if (el.closest('nav, footer, form, .lightbox, .sched__strip, .powered, .index')) return;
      var sec = el.closest('section[id]');
      var id = sec ? sec.id : '';
      var label = page.url === 'index.html' ? (SECTION_LABELS[id] || 'Home') : page.label;
      add(el.textContent, id, label);
    });
    doc.querySelectorAll('a[data-caption]').forEach(function (a) {
      var img = a.querySelector('img');
      var src = img ? img.getAttribute('src') : '';
      add(a.getAttribute('data-caption'), 'gallery', 'Gallery photo', page.url === 'index.html' ? 'gallery.html' : page.url, src);
    });
    return out;
  }

  function load() {
    if (index) return Promise.resolve(index);
    if (loading) return loading;
    loading = Promise.all(PAGES.map(function (p) {
      return fetch(p.url, { cache: 'no-cache' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (html) {
        if (!html) return [];
        return extract(new DOMParser().parseFromString(html, 'text/html'), p);
      }).catch(function () { return []; });
    })).then(function (parts) {
      index = [].concat.apply([], parts);
      if (!index.length) index = extract(document, { url: 'index.html', label: '' });
      return index;
    });
    return loading;
  }

  function snippet(text, tokens) {
    var lower = text.toLowerCase(), pos = -1, i;
    for (i = 0; i < tokens.length; i++) { var p = lower.indexOf(tokens[i]); if (p >= 0 && (pos < 0 || p < pos)) pos = p; }
    var start = Math.max(0, pos - 50), end = Math.min(text.length, start + 170);
    var s = (start > 0 ? '… ' : '') + text.slice(start, end) + (end < text.length ? ' …' : '');
    s = esc(s);
    tokens.forEach(function (t) {
      if (!t) return;
      s = s.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
    });
    return s;
  }

  var overlay, input, list, status, lastFocus;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'ssearch';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Search the site');
    overlay.innerHTML =
      '<div class="ssearch__box">' +
      '<div class="ssearch__bar"><input class="ssearch__input" type="search" placeholder="Search the site…" aria-label="Search the site" autocomplete="off">' +
      '<button class="ssearch__close" type="button" aria-label="Close search">&times;</button></div>' +
      '<p class="ssearch__status" aria-live="polite">Type to search results, news, schedule, photos and more.</p>' +
      '<ul class="ssearch__list"></ul></div>';
    document.body.appendChild(overlay);
    input = overlay.querySelector('.ssearch__input');
    list = overlay.querySelector('.ssearch__list');
    status = overlay.querySelector('.ssearch__status');
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    overlay.querySelector('.ssearch__close').addEventListener('click', close);
    input.addEventListener('input', run);
    list.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      var here = location.pathname.split('/').pop() || 'index.html';
      if (href.split('#')[0] === here || (href.charAt(0) === '#')) { close(); }
    });
  }

  function run() {
    var q = input.value.toLowerCase().trim();
    list.innerHTML = '';
    if (q.length < 2) { status.textContent = 'Type to search results, news, schedule, photos and more.'; return; }
    status.textContent = 'Searching…';
    load().then(function (idx) {
      if (input.value.toLowerCase().trim() !== q) return;
      var tokens = q.split(/\s+/).filter(Boolean);
      var hits = [];
      idx.forEach(function (it) {
        var ok = tokens.every(function (t) { return it.lower.indexOf(t) >= 0; });
        if (!ok) return;
        var score = it.lower.indexOf(q) >= 0 ? 2 : 1;
        if (it.text.length < 90) score += 0.5;
        hits.push({ it: it, score: score });
      });
      hits.sort(function (a, b) { return b.score - a.score; });
      hits = hits.slice(0, 25);
      if (!hits.length) { status.textContent = 'No matches for “' + input.value.trim() + '”.'; return; }
      status.textContent = hits.length + (hits.length === 1 ? ' match' : ' matches');
      list.innerHTML = hits.map(function (h) {
        var it = h.it;
        return '<li><a href="' + esc(it.href) + '">' +
          (it.thumb ? '<img src="' + esc(it.thumb) + '" alt="" loading="lazy">' : '') +
          '<span class="ssearch__txt"><span class="ssearch__where">' + esc(it.label || 'Home') + '</span>' +
          '<span class="ssearch__snip">' + snippet(it.text, tokens) + '</span></span></a></li>';
      }).join('');
    });
  }

  function open() {
    if (!overlay) build();
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.documentElement.classList.add('ssearch-open');
    input.focus();
    input.select();
    load();
  }
  function close() {
    if (!overlay) return;
    overlay.hidden = true;
    document.documentElement.classList.remove('ssearch-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-search-open]');
    if (b) { e.preventDefault(); open(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && !overlay.hidden) close();
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
  });
})();
