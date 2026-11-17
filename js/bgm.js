/* ==========================================================================
   배경음악 — 사이트에 머무르는 동안 무한 반복

   - 페이지를 열면 바로 재생을 시도한다. 브라우저가 소리 있는 자동 재생을 막으면
     처음 클릭·터치·키 입력이 있을 때 시작한다. (브라우저 정책이라 코드로 우회할 수 없다)
   - 막힌 경우 첫 화면(splash)이 그 입력을 기다리도록 app.js 에 알려 준다 (window.TG_BGM).
     그래서 클릭하는 순간 음악이 시작되면서 홈으로 넘어간다.
   - 오른쪽 위의 스피커 버튼으로 끄고 켤 수 있고, 선택은 브라우저에 저장된다.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var btn = document.getElementById("bgm-toggle");
  if (!btn) return;

  /* ---------- 설정 ---------- */
  var SRC = "assets/bgm/" + encodeURIComponent("트릭컬 메인 테마.mp3");
  var VOLUME = 0.4; // 0~1 — 스피키 음성이 묻히지 않도록 조금 낮게
  var FADE_IN_MS = 1500; // 재생을 시작할 때 서서히 커지는 시간
  var KEY = "tg-bgm"; // 저장값: 'off' 면 사용자가 꺼 둔 상태

  var store = {
    get: function (k) {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    },
    set: function (k, v) {
      try {
        localStorage.setItem(k, v);
      } catch (e) {
        /* 저장 불가여도 동작에는 문제 없음 */
      }
    },
  };

  var enabled = store.get(KEY) !== "off";

  // 첫 화면이 물어보는 창구: 처음 재생 시도의 결과를 한 번만 알려 준다.
  //   "playing" 재생 중 / "blocked" 브라우저가 자동 재생을 막음(첫 조작 필요) / "off" 꺼 두었거나 재생 불가
  var settle;
  var settled = new Promise(function (resolve) {
    settle = resolve;
  });
  window.TG_BGM = {
    whenSettled: function () {
      return settled;
    },
  };

  var audio = new Audio();
  audio.loop = true; // 끝나면 처음부터 무한 반복
  audio.preload = "none"; // 파일이 크므로 재생을 시작할 때까지 받지 않는다
  audio.src = SRC;
  audio.volume = 0;

  /* ---------- 표시 ---------- */
  function syncUI() {
    btn.setAttribute("aria-checked", audio.paused ? "false" : "true");
  }
  audio.addEventListener("play", syncUI);
  audio.addEventListener("pause", syncUI);
  audio.addEventListener("error", syncUI);

  function syncLabel() {
    var I18N = window.TG_I18N;
    var lang = root.getAttribute("lang");
    var s =
      I18N &&
      I18N.strings &&
      (I18N.strings[lang] || I18N.strings[I18N.defaultLang]);
    var label = (s && s.bgm) || "BGM";
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
  }
  new MutationObserver(syncLabel).observe(root, {
    attributes: true,
    attributeFilter: ["lang"],
  });
  syncLabel();
  syncUI();

  /* ---------- 재생 ---------- */
  var fadeTimer = null;
  function fadeIn() {
    clearInterval(fadeTimer);
    var t0 = Date.now();
    audio.volume = 0;
    fadeTimer = setInterval(function () {
      var k = Math.min(1, (Date.now() - t0) / FADE_IN_MS);
      audio.volume = VOLUME * k;
      if (k >= 1) clearInterval(fadeTimer);
    }, 50);
  }

  var gestureEvents = [
    "pointerdown",
    "pointerup",
    "touchend",
    "click",
    "keydown",
  ];

  function removeGestureListeners() {
    gestureEvents.forEach(function (ev) {
      document.removeEventListener(ev, onGesture, true);
    });
  }

  var lastError = null;

  // 재생을 시도하고, 성공했는지(Promise<boolean>)를 돌려준다.
  function start() {
    if (!enabled) return Promise.resolve(false);
    if (!audio.paused) return Promise.resolve(true);
    var p;
    try {
      p = audio.play();
    } catch (e) {
      return Promise.resolve(false);
    }
    if (!p || !p.then) {
      fadeIn();
      removeGestureListeners();
      return Promise.resolve(true);
    }
    return p.then(
      function () {
        fadeIn();
        removeGestureListeners();
        return true;
      },
      function (err) {
        lastError = err;
        return false;
      },
    ); // 자동 재생이 막힌 경우
  }

  // 자동 재생이 막혔을 때: 처음 사용자 조작이 있으면 그 순간에 시작한다.
  function onGesture(e) {
    if (e.target && e.target.closest && e.target.closest("#bgm-toggle")) return; // 버튼 자신의 조작은 버튼이 처리
    start();
  }

  btn.addEventListener("click", function () {
    if (audio.paused) {
      enabled = true;
      store.set(KEY, "on");
      start();
    } else {
      enabled = false;
      store.set(KEY, "off");
      clearInterval(fadeTimer);
      audio.pause();
    }
  });

  gestureEvents.forEach(function (ev) {
    document.addEventListener(ev, onGesture, true);
  });

  if (!enabled) {
    settle("off");
  } else {
    start().then(function (ok) {
      if (ok) settle("playing");
      else if (lastError && lastError.name === "NotAllowedError") settle("blocked");
      else settle("off"); // 파일을 못 찾는 등 — 기다려도 소용없으니 첫 화면은 그냥 넘어간다
    });
  }
})();
