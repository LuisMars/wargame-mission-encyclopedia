(function () {
  'use strict';

  // ── Helpers ──────────────────────────────────────────────
  var $ = function (id) { return document.getElementById(id); };
  var base = (document.querySelector('meta[name="baseurl"]') || {}).content || '';

  // ── Dictionaries ────────────────────────────────────────
  var uiDict = JSON.parse(($('i18n-dict') || {}).textContent || '{}');
  var pageDictEl = $('page-dict');
  var pageDict = pageDictEl ? JSON.parse(pageDictEl.textContent) : null;
  var langs = Object.keys(uiDict);

  // ── Dark mode toggle ────────────────────────────────────
  var themeBtn = $('theme-toggle');
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('wme-theme', t);
    if (themeBtn) themeBtn.textContent = t === 'dark' ? '\u2600' : '\u263E';
  }

  var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  if (themeBtn) {
    themeBtn.textContent = currentTheme === 'dark' ? '\u2600' : '\u263E';
    themeBtn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(cur === 'dark' ? 'light' : 'dark');
    });
  }

  // ── Language system ─────────────────────────────────────
  var langBtn = $('lang-toggle');

  function isIndexPage() {
    var path = window.location.pathname;
    if (path === base + '/' || path === base) return true;
    for (var i = 0; i < langs.length; i++) {
      if (path === base + '/' + langs[i] + '/' || path === base + '/' + langs[i]) return true;
    }
    return false;
  }

  function setLanguage(newLang) {
    // Index pages → navigate to the correct language root
    if (isIndexPage()) {
      window.location.href = base + (newLang === 'en' ? '/' : '/' + newLang + '/');
      return;
    }

    // Detail pages → swap in place
    document.documentElement.lang = newLang;
    localStorage.setItem('wme-lang', newLang);

    // Update dropdown to reflect current language
    if (langBtn) {
      langBtn.value = newLang;
    }

    // Patch all [data-i18n] elements (textContent)
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var text;
      if (key.indexOf('page:') === 0) {
        text = pageDict && pageDict[newLang] ? pageDict[newLang][key.slice(5)] : null;
      } else {
        text = uiDict[newLang] ? uiDict[newLang][key] : null;
      }
      if (text != null) el.textContent = text;
    });

    // Patch all [data-i18n-html] elements (innerHTML)
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      var html;
      if (key.indexOf('page:') === 0) {
        html = pageDict && pageDict[newLang] ? pageDict[newLang][key.slice(5)] : null;
      } else {
        html = uiDict[newLang] ? uiDict[newLang][key] : null;
      }
      if (html != null) el.innerHTML = html;
    });

    // Toggle body content language blocks
    document.querySelectorAll('.archetype-body [lang]').forEach(function (el) {
      el.style.display = el.getAttribute('lang') === newLang ? 'block' : 'none';
    });
  }

  // Language dropdown
  if (langBtn) {
    langBtn.addEventListener('change', function () {
      setLanguage(langBtn.value);
    });
  }

  // On index pages, persist the current lang so detail pages inherit it
  if (isIndexPage()) {
    localStorage.setItem('wme-lang', document.documentElement.lang || 'en');
  }

  // Restore saved language on detail pages
  var savedLang = localStorage.getItem('wme-lang');
  if (savedLang && langBtn && !isIndexPage()) {
    setLanguage(savedLang);
  }

  // ── Index page filtering ────────────────────────────────
  var grid = $('archetype-grid');
  if (!grid) return;

  var tagSelect = $('tag-filter');
  var searchInput = $('search-input');
  var countEl = $('count');
  var noResults = $('no-results');
  var clearBtn = $('clear-filters-btn');
  var chipsContainer = $('active-chips');
  var pillContainer = $('family-pills');

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.archetype-card'));
  var pills = pillContainer ? Array.prototype.slice.call(pillContainer.querySelectorAll('.family-node')) : [];

  // State
  var state = { family: 'all', tag: 'all', query: '' };

  // ── URL sync ────────────────────────────────────────────
  function readURL() {
    var params = new URLSearchParams(window.location.search);
    state.family = params.get('family') || 'all';
    state.tag = params.get('tag') || 'all';
    state.query = params.get('q') || '';
  }

  function writeURL() {
    var params = new URLSearchParams();
    if (state.family !== 'all') params.set('family', state.family);
    if (state.tag !== 'all') params.set('tag', state.tag);
    if (state.query) params.set('q', state.query);
    var qs = params.toString();
    var newURL = window.location.pathname + (qs ? '?' + qs : '');
    history.replaceState(null, '', newURL);
  }

  // ── Apply filters ───────────────────────────────────────
  function applyFilters() {
    var visible = 0;
    var family = state.family;
    var tag = state.tag;
    var query = state.query.toLowerCase().trim();

    cards.forEach(function (card) {
      var cardFamily = card.getAttribute('data-family');
      var cardTags = (card.getAttribute('data-tags') || '').split(',');
      var cardSearch = card.getAttribute('data-search') || '';

      var show = true;
      if (family !== 'all' && cardFamily !== family) show = false;
      if (tag !== 'all' && cardTags.indexOf(tag) === -1) show = false;
      if (query && cardSearch.indexOf(query) === -1) show = false;

      if (show) {
        card.classList.remove('card-hidden');
        visible++;
      } else {
        card.classList.add('card-hidden');
      }
    });

    countEl.textContent = visible;

    // No results state
    if (noResults) {
      if (visible === 0) {
        noResults.classList.add('visible');
        grid.style.display = 'none';
      } else {
        noResults.classList.remove('visible');
        grid.style.display = '';
      }
    }

    // Sync UI
    syncPills();
    syncChips();
    writeURL();
  }

  // ── Pill state sync ─────────────────────────────────────
  function syncPills() {
    pills.forEach(function (pill) {
      if (pill.getAttribute('data-family') === state.family) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  // ── Active filter chips ─────────────────────────────────
  function syncChips() {
    if (!chipsContainer) return;
    chipsContainer.innerHTML = '';

    var hasFilter = state.family !== 'all' || state.tag !== 'all' || state.query;

    if (state.family !== 'all') {
      var pill = pillContainer.querySelector('[data-family="' + state.family + '"]');
      var nameEl = pill ? pill.querySelector('.family-node__name') : null;
      var label = nameEl ? nameEl.textContent.trim() : state.family;
      addChip(label, function () { state.family = 'all'; applyFilters(); });
    }

    if (state.tag !== 'all') {
      var opt = tagSelect.querySelector('option[value="' + state.tag + '"]');
      var tagLabel = opt ? opt.textContent : state.tag;
      addChip(tagLabel, function () { state.tag = 'all'; tagSelect.value = 'all'; applyFilters(); });
    }

    if (state.query) {
      addChip('"' + state.query + '"', function () { state.query = ''; searchInput.value = ''; applyFilters(); });
    }

    if (hasFilter) {
      var clearLink = document.createElement('button');
      clearLink.className = 'clear-all-link';
      clearLink.textContent = clearBtn ? clearBtn.textContent : 'Clear';
      clearLink.addEventListener('click', resetAll);
      chipsContainer.appendChild(clearLink);
    }
  }

  function addChip(label, onRemove) {
    var btn = document.createElement('button');
    btn.className = 'chip';
    btn.innerHTML = label + ' <span class="chip-x">\u00D7</span>';
    btn.addEventListener('click', onRemove);
    chipsContainer.appendChild(btn);
  }

  // ── Reset ───────────────────────────────────────────────
  function resetAll() {
    state.family = 'all';
    state.tag = 'all';
    state.query = '';
    tagSelect.value = 'all';
    searchInput.value = '';
    applyFilters();
  }

  // ── Event listeners ─────────────────────────────────────

  // Family pills
  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      state.family = pill.getAttribute('data-family');
      applyFilters();
    });
  });

  // Tag select
  tagSelect.addEventListener('change', function () {
    state.tag = tagSelect.value;
    applyFilters();
  });

  // Search
  searchInput.addEventListener('input', function () {
    state.query = searchInput.value;
    applyFilters();
  });

  // Clear all button (in no-results)
  if (clearBtn) {
    clearBtn.addEventListener('click', resetAll);
  }

  // Back/forward
  window.addEventListener('popstate', function () {
    readURL();
    tagSelect.value = state.tag;
    searchInput.value = state.query;
    applyFilters();
  });

  // Footer family links — intercept and filter instead of navigating
  var footerLinks = document.querySelectorAll('.footer-families a');
  Array.prototype.slice.call(footerLinks).forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      var match = href.match(/[?&]family=([^&]+)/);
      if (match) {
        e.preventDefault();
        state.family = match[1];
        applyFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // ── Init ────────────────────────────────────────────────
  readURL();
  tagSelect.value = state.tag;
  searchInput.value = state.query;
  applyFilters();

})();
