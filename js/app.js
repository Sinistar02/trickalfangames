/* ==========================================================================
   트릭컬그라운즈 — 앱 로직 (빌드 도구 없이 그대로 동작하는 순수 JS)

   화면 상태   : <html data-view="splash | home | list">  (애니메이션은 CSS가 담당)
   주소(해시)  : #/                      홈
                 #/c/<분류>              전체 목록
                 #/g/<게임>              홈 + 게임 상세
                 #/c/<분류>/g/<게임>     전체 목록 + 게임 상세
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var DATA = window.TG_DATA || { categories: [], games: [] };
  var I18N = window.TG_I18N;

  var SPLASH_MS = 1600;   // 첫 화면을 보여 주는 시간 (클릭·스크롤·키 입력으로 건너뛸 수 있음)
  var BGM_WAIT_MS = 2500; // 배경음악의 자동 재생 결과를 기다려 주는 최대 시간
  var SWAP_MS = 180;      // 화면 전환 때 목록 내용이 사라지는 시간
  var HOME_MAX = 24;      // 홈에서 분류마다 최대로 그려 두는 카드 수 (실제 표시는 한 줄 분량)

  var RIGHT_ICON = '<svg viewBox="0 0 10 12" aria-hidden="true"><path d="M1 .5 9.5 6 1 11.5z" fill="currentColor"/></svg>';
  var LEFT_ICON  = '<svg viewBox="0 0 10 12" aria-hidden="true"><path d="M9 .5 .5 6 9 11.5z" fill="currentColor"/></svg>';

  var reduceMotion = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- 작은 도구들 ---------- */
  function $(id) { return document.getElementById(id); }

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 저장 불가여도 동작에는 문제 없음 */ } },
  };

  // h('div', {class: 'x', text: '...'}, [자식, ...]) — 값은 항상 textContent/속성으로 들어가므로 안전하다.
  function h(tag, props, kids) {
    var el = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v == null || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else el.setAttribute(k, v === true ? '' : v);
      });
    }
    (kids || []).forEach(function (c) { if (c) el.append(c); });
    return el;
  }

  function icon(svg) {
    var t = document.createElement('template');
    t.innerHTML = svg;
    return t.content.firstChild;
  }

  function safeDecode(s) { try { return decodeURIComponent(s); } catch (e) { return s; } }

  function safeUrl(u) {
    if (!u) return null;
    try {
      var parsed = new URL(u, location.href);
      return /^https?:$/.test(parsed.protocol) ? parsed.href : null;
    } catch (e) { return null; }
  }

  /* ---------- 상태 ---------- */
  var state = {
    lang: I18N.langs.indexOf(root.lang) >= 0 ? root.lang : I18N.defaultLang,
    theme: root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
    cat: null,      // 전체 목록에서 보고 있는 분류 id
  };

  function t(key) {
    var s = I18N.strings[state.lang] || {};
    return s[key] != null ? s[key] : I18N.strings[I18N.defaultLang][key];
  }

  // 언어별 값 고르기: 문자열은 그대로, {ko, ja, en} 은 현재 언어 → 기본 언어 → 아무거나
  function pick(v) {
    if (v == null) return '';
    if (typeof v !== 'object' || Array.isArray(v)) return v;
    if (v[state.lang] != null) return v[state.lang];
    if (v[I18N.defaultLang] != null) return v[I18N.defaultLang];
    var keys = Object.keys(v);
    return keys.length ? v[keys[0]] : '';
  }

  function list(v) {
    var r = pick(v);
    if (r === '' || r == null) return [];
    return (Array.isArray(r) ? r : [r]).map(pick).filter(Boolean);
  }

  /* ---------- 단어장 (단어.xlsx) ----------
     games.js 의 genres / tags 에는 한국어 단어만 적고, 한국어가 아닌 언어일 때는
     단어.xlsx 에서 같은 단어를 찾아 해당 언어의 값으로 바꿔 보여 준다.
     시트 이름 = 항목(genres, tags), 1행 = 언어 이름, 1열 = 한국어 단어.
     못 찾거나 파일을 못 읽으면 한국어 단어를 그대로 보여 준다. */
  var WORDS_URL = encodeURI('단어.xlsx');
  var WORDS_HEADERS = { '한국어': 'ko', '日本語': 'ja', 'English': 'en' };
  var words = {};   // words[시트][한국어 단어][언어] = 번역

  function parseWords(buffer) {
    var wb = XLSX.read(buffer, { type: 'array' });
    wb.SheetNames.forEach(function (name) {
      var rows = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, defval: '' });
      if (!rows.length) return;
      var cols = rows[0].map(function (c) { return WORDS_HEADERS[String(c).trim()] || null; });
      var sheet = words[name] = {};
      rows.slice(1).forEach(function (row) {
        var ko = String(row[0] == null ? '' : row[0]).trim();
        if (!ko) return;
        var entry = sheet[ko] = {};
        cols.forEach(function (lang, i) {
          var v = row[i] == null ? '' : String(row[i]).trim();
          if (lang && v) entry[lang] = v;
        });
      });
    });
  }

  function loadWords(done) {
    if (!window.XLSX || !window.fetch) return;
    fetch(WORDS_URL)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then(function (buf) { parseWords(buf); done(); })
      .catch(function (e) { console.warn('[단어.xlsx] 불러오기 실패 — 한국어로 표시합니다:', e); });
  }

  function word(sheet, ko) {
    var e = words[sheet] && words[sheet][ko];
    return (e && e[state.lang]) || ko;
  }

  function wordList(sheet, v) {
    return list(v).map(function (w) { return word(sheet, w); });
  }

  function formatReleased(v) {
    if (!v) return '';
    var m = /^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?$/.exec(String(v).trim());
    if (!m) return String(v);
    try {
      var opts = { year: 'numeric', timeZone: 'UTC' };
      if (m[2]) opts.month = 'long';
      if (m[3]) opts.day = 'numeric';
      var d = new Date(Date.UTC(+m[1], (m[2] ? +m[2] : 1) - 1, m[3] ? +m[3] : 1));
      return new Intl.DateTimeFormat(state.lang, opts).format(d);
    } catch (e) { return String(v); }
  }

  /* ---------- 데이터 ---------- */
  var categories = DATA.categories || [];
  var games = DATA.games || [];
  var catIndex = {};
  var gameIndex = {};

  categories.forEach(function (c) { catIndex[c.id] = c; });
  games.forEach(function (g) {
    if (gameIndex[g.id]) console.warn('[games.js] 중복된 게임 id:', g.id);
    gameIndex[g.id] = g;
    if (!catIndex[g.category]) console.warn('[games.js] 알 수 없는 분류:', g.id, '→', g.category);
  });

  function gamesOf(catId) {
    return games.filter(function (g) { return g.category === catId; });
  }

  /* ---------- 썸네일 ---------- */
  function fillThumb(box, game, eager) {
    box.className = box.className.replace(/\bthumb--empty\b/g, '').trim();
    box.replaceChildren();
    if (!game.thumbnail) { box.classList.add('thumb--empty'); return box; }
    var img = h('img', { src: game.thumbnail, alt: eager ? String(pick(game.title)) : '', decoding: 'async' });
    if (!eager) img.setAttribute('loading', 'lazy');
    img.addEventListener('error', function () {
      img.remove();
      box.classList.add('thumb--empty');
    });
    box.append(img);
    return box;
  }

  /* ---------- 홈 / 전체 목록 렌더링 ---------- */
  function gameHref(game, catId) {
    return (catId ? '#/c/' + encodeURIComponent(catId) : '#') + '/g/' + encodeURIComponent(game.id);
  }

  function card(game, catId) {
    var a = h('a', { class: 'card', href: gameHref(game, catId), 'data-game': game.id }, [
      fillThumb(h('div', { class: 'thumb' }), game, false),
      h('span', { class: 'card__title', text: String(pick(game.title)) }),
      h('span', { class: 'card__creator', text: String(pick(game.creator)) }),
    ]);
    return h('li', null, [a]);
  }

  function emptyNote() {
    return h('p', { class: 'cat__empty', text: t('empty') });
  }

  function renderHome() {
    var wrap = h('div', { class: 'view view--home' });
    categories.forEach(function (cat) {
      var items = gamesOf(cat.id);
      var head = h('header', { class: 'cat__head' }, [
        h('h2', { class: 'cat__title', text: String(pick(cat.name)) }),
        items.length
          ? h('a', { class: 'cat__more', href: '#/c/' + encodeURIComponent(cat.id) }, [t('viewAll'), icon(RIGHT_ICON)])
          : null,
      ]);
      var body = items.length
        ? h('ul', { class: 'grid grid--home' }, items.slice(0, HOME_MAX).map(function (g) { return card(g, null); }))
        : emptyNote();
      wrap.append(h('section', { class: 'cat' }, [head, body]));
    });
    return wrap;
  }

  function renderList(catId) {
    var cat = catIndex[catId];
    var items = gamesOf(catId);
    var head = h('div', { class: 'list-head' }, [
      h('a', { class: 'back', href: '#/' }, [icon(LEFT_ICON), t('backToStart')]),
      h('h2', { class: 'list-title', text: String(pick(cat.name)) }),
    ]);
    var body = items.length
      ? h('ul', { class: 'grid grid--list' }, items.map(function (g) { return card(g, catId); }))
      : emptyNote();
    return h('div', { class: 'view view--list' }, [head, body]);
  }

  var panelContent = $('panel-content');

  // 홈의 분류별 목록은 "한 줄"만 보여 준다: 한 줄에 들어가는 카드 수는 화면 폭과 UI 배율이 정한다.
  function fitHomeGrid(grid) {
    var cols = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
    Array.prototype.forEach.call(grid.children, function (li, i) { li.hidden = i >= cols; });
  }

  var homeObserver = window.ResizeObserver
    ? new ResizeObserver(function (entries) {
        entries.forEach(function (e) { fitHomeGrid(e.target); });
      })
    : null;

  function renderPanel() {
    var view = root.getAttribute('data-view');
    if (homeObserver) homeObserver.disconnect();
    panelContent.replaceChildren(
      view === 'list' && catIndex[state.cat] ? renderList(state.cat) : renderHome()
    );
    panelContent.querySelectorAll('.grid--home').forEach(function (grid) {
      fitHomeGrid(grid);
      if (homeObserver) homeObserver.observe(grid);
    });
  }

  // 목록 내용을 서서히 지웠다가 새 화면으로 바꾼다. (로고·위치 이동은 CSS 전환이 맡는다)
  var swapTimer = null;
  function swapPanel(nextView, after) {
    clearTimeout(swapTimer);
    if (reduceMotion) {
      if (nextView) root.setAttribute('data-view', nextView);
      after();
      return;
    }
    panelContent.classList.add('is-swapping');
    if (nextView) root.setAttribute('data-view', nextView);
    swapTimer = setTimeout(function () {
      after();
      panelContent.classList.remove('is-swapping');
    }, SWAP_MS);
  }

  /* ---------- 첫 화면(splash) ---------- */
  var splashTimer = null;
  var splashEvents = ['pointerdown', 'wheel', 'touchmove', 'keydown'];
  var splashActive = false;

  function cancelSplash() {
    splashActive = false;
    clearTimeout(splashTimer);
    splashEvents.forEach(function (e) { window.removeEventListener(e, leaveSplash); });
  }

  function leaveSplash() {
    if (!splashActive) return;
    cancelSplash();
    if (root.getAttribute('data-view') === 'splash') root.setAttribute('data-view', 'home');
    updateTitle();
  }

  function startSplash() {
    splashActive = true;
    splashEvents.forEach(function (e) { window.addEventListener(e, leaveSplash, { passive: true }); });
    var logo = $('logo');
    var ready = logo.decode ? logo.decode().catch(function () {}) : Promise.resolve();
    ready.then(function () {
      if (splashActive) splashTimer = setTimeout(autoLeave, SPLASH_MS);
    });
  }

  // 시간이 지났을 때: 배경음악이 브라우저에 자동 재생을 막혔다면 첫 조작(클릭·터치·키)을 기다린다.
  // 그 조작으로 음악이 시작되면서 홈으로 넘어가므로, 항상 소리와 함께 입장하게 된다.
  // 자동 재생이 허용됐거나 사용자가 음악을 꺼 둔 경우에는 지금처럼 자동으로 넘어간다.
  function autoLeave() {
    if (!splashActive) return;
    var bgm = window.TG_BGM;
    if (!bgm) { leaveSplash(); return; }
    Promise.race([
      bgm.whenSettled(),
      new Promise(function (resolve) { setTimeout(function () { resolve('timeout'); }, BGM_WAIT_MS); }),
    ]).then(function (state) {
      if (!splashActive) return;
      if (state === 'blocked') waitForInput();
      else leaveSplash();
    });
  }

  function waitForInput() {
    // 스크롤·터치 이동은 브라우저가 '사용자 조작'으로 인정하지 않아 음악을 못 켜므로 입구에서 뺀다.
    ['wheel', 'touchmove'].forEach(function (e) { window.removeEventListener(e, leaveSplash); });
    var hint = $('splash-hint');
    if (hint) hint.classList.add('is-visible');
  }

  /* ---------- 게임 상세 팝업 ---------- */
  var modalEl = $('modal');
  var dialogEl = $('modal-dialog');
  var modal = { id: null, byNav: false, lastFocus: null };

  function renderModal(game) {
    $('modal-title').textContent = String(pick(game.title));
    $('modal-creator').textContent = String(pick(game.creator));
    $('modal-released').textContent = [formatReleased(game.released), wordList('platform', game.platform).join(', ')]
      .filter(Boolean).join(' | ');
    $('modal-genres').textContent = wordList('genres', game.genres).concat(wordList('tags', game.tags)).join(', ');
    $('modal-desc').textContent = String(pick(game.description));
    fillThumb($('modal-thumb'), game, true);

    var play = $('modal-play');
    var url = safeUrl(game.url);
    if (url) {
      play.setAttribute('href', url);
      play.removeAttribute('aria-disabled');
      play.removeAttribute('tabindex');
      play.textContent = t('play');
    } else {
      play.removeAttribute('href');
      play.setAttribute('aria-disabled', 'true');
      play.setAttribute('tabindex', '-1');
      play.textContent = t('noLink');
    }
  }

  function openModal(game) {
    var wasOpen = modal.id !== null;
    modal.id = game.id;
    renderModal(game);
    if (wasOpen) return;
    modal.lastFocus = document.activeElement;
    dialogEl.scrollTop = 0;
    modalEl.removeAttribute('inert');
    modalEl.setAttribute('aria-hidden', 'false');
    modalEl.classList.add('is-open');
    root.classList.add('modal-open');
    dialogEl.focus({ preventScroll: true });
  }

  function closeModal() {
    if (modal.id === null) return;
    var id = modal.id;
    modal.id = null;
    modal.byNav = false;
    modalEl.classList.remove('is-open');
    modalEl.setAttribute('aria-hidden', 'true');
    modalEl.setAttribute('inert', '');
    root.classList.remove('modal-open');

    // 열기 전에 누른 카드로 포커스를 돌려준다 (목록이 다시 그려졌다면 같은 게임 카드를 찾는다)
    var last = modal.lastFocus;
    var back = last && last !== document.body && document.contains(last)
      ? last
      : panelContent.querySelector('[data-game="' + (window.CSS && CSS.escape ? CSS.escape(id) : id) + '"]');
    if (back && back.focus) back.focus({ preventScroll: true });
    modal.lastFocus = null;
  }

  // 닫기 버튼 · 바깥 클릭 · Esc → 열기 전 화면으로
  function requestCloseModal() {
    if (modal.id === null) return;
    if (modal.byNav) {
      history.back();            // hashchange → applyRoute → closeModal
    } else {
      history.replaceState(null, '', state.cat ? '#/c/' + encodeURIComponent(state.cat) : '#/');
      applyRoute(false);
    }
  }

  modalEl.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) requestCloseModal();
  });

  document.addEventListener('keydown', function (e) {
    if (modal.id === null) return;
    if (e.key === 'Escape') { e.preventDefault(); requestCloseModal(); return; }
    if (e.key !== 'Tab') return;
    // 팝업 밖으로 포커스가 나가지 않게 가둔다
    var focusables = Array.prototype.filter.call(
      dialogEl.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])'),
      function (el) { return !el.disabled && el.offsetParent !== null; }
    );
    if (!focusables.length) { e.preventDefault(); return; }
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogEl)) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });

  /* ---------- 라우팅 ---------- */
  function parseHash() {
    var h = location.hash.replace(/^#/, '');
    var route = { cat: null, game: null };
    var m = /^\/c\/([^/]+)(?:\/g\/([^/]+))?\/?$/.exec(h);
    if (m) {
      route.cat = safeDecode(m[1]);
      route.game = m[2] ? safeDecode(m[2]) : null;
    } else if ((m = /^\/g\/([^/]+)\/?$/.exec(h))) {
      route.game = safeDecode(m[1]);
    }
    if (route.cat && !catIndex[route.cat]) route.cat = null;
    if (route.game && !gameIndex[route.game]) route.game = null;
    return route;
  }

  function applyRoute(fromNav) {
    var route = parseHash();
    var target = route.cat ? 'list' : 'home';
    var current = root.getAttribute('data-view');

    if (current === 'splash') {
      // 주소가 그냥 "#/" 이면 첫 화면을 유지하고, 그 밖의 주소면 첫 화면을 건너뛴다.
      if (target !== 'home' || route.game) {
        cancelSplash();
        state.cat = route.cat;
        root.setAttribute('data-view', target);
        renderPanel();
      }
    } else if (current !== target || (target === 'list' && route.cat !== state.cat)) {
      state.cat = route.cat;
      swapPanel(target, function () {
        renderPanel();
        window.scrollTo(0, 0);
      });
    }

    if (route.game) {
      if (modal.id === null) modal.byNav = !!fromNav;
      openModal(gameIndex[route.game]);
    } else {
      closeModal();
    }
    updateTitle();
  }

  window.addEventListener('hashchange', function () { applyRoute(true); });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ---------- 언어 · 테마 ---------- */
  function updateTitle() {
    var site = t('siteName');
    var title = site;
    if (modal.id !== null && gameIndex[modal.id]) {
      title = pick(gameIndex[modal.id].title) + ' · ' + site;
    } else if (root.getAttribute('data-view') === 'list' && catIndex[state.cat]) {
      title = pick(catIndex[state.cat].name) + ' · ' + site;
    }
    document.title = title;
  }

  var langSelect = $('lang-select');
  var themeSwitch = $('theme-switch');

  function applyLang(lang, persist) {
    if (I18N.langs.indexOf(lang) < 0) lang = I18N.defaultLang;
    state.lang = lang;
    root.setAttribute('lang', lang);
    langSelect.value = lang;
    if (persist) store.set('tg-lang', lang);

    $('lang-label').textContent = t('language');
    themeSwitch.setAttribute('aria-label', t('darkMode'));
    $('modal-close').setAttribute('aria-label', t('close'));
    $('site-title').textContent = t('siteName');
    $('splash-hint').textContent = t('clickToStart');
    $('site-footer').textContent = String(pick(DATA.creator) || '');   // 맨 밑 문구
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t('siteDescription'));

    renderPanel();
    if (modal.id !== null) renderModal(gameIndex[modal.id]);
    updateTitle();
  }

  function applyTheme(theme, persist) {
    state.theme = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', state.theme);
    themeSwitch.setAttribute('aria-checked', state.theme === 'dark' ? 'true' : 'false');
    if (persist) store.set('tg-theme', state.theme);
  }

  langSelect.addEventListener('change', function () { applyLang(langSelect.value, true); });
  themeSwitch.addEventListener('click', function () {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark', true);
  });

  /* ---------- 시작 ---------- */
  (function init() {
    var route = parseHash();
    var view = root.getAttribute('data-view');
    // <head> 의 초기 스크립트가 정한 화면을 실제 주소와 맞춘다.
    if (route.cat) view = 'list';
    else if (view === 'list') view = 'home';
    else if (view === 'splash' && route.game) view = 'home';
    root.setAttribute('data-view', view);
    state.cat = route.cat;

    applyTheme(state.theme, false);
    applyLang(state.lang, false);            // 목록도 여기서 처음 그려진다
    // 단어장은 뒤늦게 도착해도 되므로 화면을 막지 않고, 도착하면 열려 있는 팝업만 다시 그린다.
    loadWords(function () { if (modal.id !== null) renderModal(gameIndex[modal.id]); });

    if (route.game) {
      modal.byNav = false;
      openModal(gameIndex[route.game]);
      updateTitle();
    }
    if (view === 'splash') startSplash();

    // 첫 프레임을 그린 뒤부터 전환 애니메이션을 켠다.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { root.classList.remove('no-anim'); });
    });
  })();
})();
