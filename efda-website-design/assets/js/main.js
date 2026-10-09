/* =========================================================
   EFDA website design — behaviour
   No dependencies. Works from file:// and any static host.

   i18n contract (mirrors next-intl message paths):
     data-i18n="ns.key"              -> element text
     data-i18n="ns.list.0.field"     -> arrays use numeric indexes
     data-i18n-attr="alt:ns.key;aria-label:ns.key2"
     data-n="7" + "{n}" in the string -> simple interpolation
   ========================================================= */
(function () {
  'use strict';

  var LOCALES = window.EFDA_LOCALES || {};
  var LANGS = ['en', 'am', 'om'];
  var STORAGE_KEY = 'efda-lang';

  /* ---------- language state ---------- */
  function readLang() {
    try {
      var fromUrl = new URLSearchParams(window.location.search).get('lang');
      if (LANGS.indexOf(fromUrl) > -1) return fromUrl;
      var saved = window.localStorage.getItem(STORAGE_KEY);
      if (LANGS.indexOf(saved) > -1) return saved;
    } catch (e) { /* storage blocked: fall through */ }
    return 'en';
  }

  var lang = readLang();

  function lookup(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }

  function t(path) {
    var v = lookup(LOCALES[lang], path);
    if (v == null) v = lookup(LOCALES.en, path); // fall back to English
    return v;
  }

  function format(str, el) {
    if (el && el.hasAttribute('data-n')) return str.replace('{n}', el.getAttribute('data-n'));
    return str;
  }

  function within(root, selector) {
    var found = Array.prototype.slice.call(root.querySelectorAll(selector));
    if (root.matches && root.matches(selector)) found.unshift(root);
    return found;
  }

  function applyI18n(root) {
    root = root || document;
    within(root, '[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (typeof v === 'string') el.textContent = format(v, el);
    });
    within(root, '[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var i = pair.indexOf(':');
        if (i < 0) return;
        var attr = pair.slice(0, i).trim();
        var v = t(pair.slice(i + 1).trim());
        if (typeof v === 'string') el.setAttribute(attr, v);
      });
    });
  }

  function setTitle() {
    var key = document.body.getAttribute('data-title');
    if (!key) return;
    document.title = document.body.getAttribute('data-page') === 'home'
      ? (t(key).indexOf('EFDA') > -1 ? t(key) : 'EFDA — ' + t(key))
      : t(key) + ' — EFDA';
  }

  function setLang(next, persist) {
    if (LANGS.indexOf(next) < 0) return;
    lang = next;
    document.documentElement.setAttribute('lang', next);
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === next));
    });
    applyI18n(document);
    setTitle();
    if (persist) {
      try { window.localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
      try {
        var url = new URL(window.location.href);
        if (url.searchParams.has('lang')) {
          url.searchParams.set('lang', next);
          window.history.replaceState(null, '', url);
        }
      } catch (e) { /* ignore */ }
    }
  }

  function initLanguageSwitch() {
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); });
    });
    // Keep other open tabs/pages in sync.
    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY && LANGS.indexOf(e.newValue) > -1) setLang(e.newValue, false);
    });
  }

  /* ---------- mobile menu ---------- */
  function initMenu() {
    var burger = document.querySelector('.burger');
    var menu = document.getElementById('mobile-menu');
    if (!burger || !menu) return;
    function close() { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); }
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') !== 'true';
      menu.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      if (open) { var first = menu.querySelector('a'); if (first) first.focus(); }
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { close(); burger.focus(); }
    });
  }

  /* ---------- home: program switcher ---------- */
  function initPrograms() {
    var list = document.querySelector('[data-programs]');
    var panel = document.querySelector('[data-program-detail]');
    if (!list || !panel) return;
    var buttons = list.querySelectorAll('.prog');
    var photo = panel.querySelector('[data-prog-photo]');
    var img = photo.querySelector('img');
    var quote = panel.querySelector('[data-prog-quote]');

    function select(k) {
      buttons.forEach(function (b, i) { b.setAttribute('aria-pressed', String(i === k)); });
      panel.querySelectorAll('[data-prog-field]').forEach(function (el) {
        el.setAttribute('data-i18n', 'home.programs.' + k + '.' + el.getAttribute('data-prog-field'));
      });
      var src = buttons[k].getAttribute('data-img');
      if (src) {
        img.src = src;
        img.setAttribute('data-i18n-attr', 'alt:home.programs.' + k + '.alt');
        photo.hidden = false;
        quote.hidden = true;
      } else {
        photo.hidden = true;
        quote.hidden = false;
      }
      applyI18n(panel);
    }

    buttons.forEach(function (b, i) { b.addEventListener('click', function () { select(i); }); });
  }

  /* ---------- home: before/after slider ---------- */
  function initCompare() {
    document.querySelectorAll('[data-compare]').forEach(function (box) {
      var range = box.querySelector('.compare__range');
      function update() {
        var pos = Number(range.value);
        box.style.setProperty('--pos', pos + '%');
        box.style.setProperty('--clip', (100 - pos) + '%');
      }
      range.addEventListener('input', update);
      update();
    });
  }

  /* ---------- projects: filters ---------- */
  function initProjectFilters() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-project]'));
    if (!cards.length) return;
    var themeBtns = document.querySelectorAll('[data-filter-theme]');
    var regionBtns = document.querySelectorAll('[data-filter-region]');
    var showing = document.querySelector('[data-showing]');
    var empty = document.querySelector('[data-empty]');
    var state = { theme: 'all', region: 'all' };

    function matches(card, theme, region) {
      return (theme === 'all' || card.getAttribute('data-theme') === theme) &&
             (region === 'all' || card.getAttribute('data-region') === region);
    }

    function render() {
      var n = 0;
      cards.forEach(function (c) {
        var ok = matches(c, state.theme, state.region);
        c.hidden = !ok;
        if (ok) n++;
      });
      themeBtns.forEach(function (b) {
        var th = b.getAttribute('data-filter-theme');
        b.setAttribute('aria-pressed', String(th === state.theme));
        var count = cards.filter(function (c) { return matches(c, th, state.region); }).length;
        var span = b.querySelector('.chip__count');
        if (span) span.textContent = String(count);
      });
      regionBtns.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-filter-region') === state.region));
      });
      showing.setAttribute('data-n', String(n));
      applyI18n(showing);
      empty.hidden = n !== 0;
    }

    themeBtns.forEach(function (b) {
      b.addEventListener('click', function () { state.theme = b.getAttribute('data-filter-theme'); render(); });
    });
    regionBtns.forEach(function (b) {
      b.addEventListener('click', function () { state.region = b.getAttribute('data-filter-region'); render(); });
    });
    render();
  }

  /* ---------- contact: topics + demo submit ---------- */
  function initContactForm() {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;
    var sent = document.querySelector('[data-sent]');
    var topicInput = form.querySelector('input[name="topic"]');
    var topics = form.querySelectorAll('.topic');

    topics.forEach(function (b) {
      b.addEventListener('click', function () {
        topics.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        topicInput.value = b.getAttribute('data-topic');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      // DESIGN DEMO ONLY: nothing is sent. In production, POST the FormData to your
      // endpoint (see Build Document §10), and show this state only on a 2xx response.
      form.hidden = true;
      sent.hidden = false;
      sent.focus();
    });

    sent.querySelector('[data-reset]').addEventListener('click', function () {
      form.reset();
      topics.forEach(function (x, i) { x.setAttribute('aria-pressed', String(i === 0)); });
      topicInput.value = topics[0].getAttribute('data-topic');
      sent.hidden = true;
      form.hidden = false;
      form.querySelector('input:not([type="hidden"]):not([tabindex="-1"])').focus();
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initLanguageSwitch();
    initMenu();
    initPrograms();
    initCompare();
    initProjectFilters();
    initContactForm();
    setLang(lang, false);
  });
})();
