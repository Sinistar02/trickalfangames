/* ==========================================================================
   스피키 — 화면 맨 밑을 통통 뛰며 돌아다니는 장식 (최대 10마리)

   - 스피키는 가장자리에서 뛰어 들어와 한동안 돌아다니다가 가장자리로 뛰어 나간다.
     새로 들어오는 간격과 머무는 시간은 무작위라서, 동시에 1~10마리가 존재한다.
   - 클릭하면 잠시 speaki-cry 로 바뀌면서 몸이 좌우로 늘어났다가 젤리처럼 출렁이며 돌아오고,
     같은 순간에 음성 4개 중 하나가 무작위로 재생된다.
   - 첫 화면(splash)이 끝난 뒤부터 나타난다. 「움직임 줄이기」 설정을 쓰는 사람에게는 나타나지 않는다.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var field = document.getElementById('speaki-field');
  if (!field) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ---------- 설정 (여기 값만 바꾸면 된다) ---------- */
  var BASE = 'assets/apostles/';
  var SRC = {
    happy: BASE + 'speaki-happy.png',
    cry: BASE + 'speaki-cry.png',
    // 클릭했을 때 이 중 하나가 무작위로 재생된다. 음성을 늘리려면 파일을 assets/apostles 에 넣고 여기에 이름을 적으면 된다.
    sounds: ['네르지마세요.mp3', '스피키네르지마세요.mp3', '에으.mp3', '흐에에.mp3']
      .map(function (name) { return BASE + encodeURIComponent(name); }),
  };
  var MAX = 10;                    // 동시에 존재할 수 있는 최대 마리 수
  var SPAWN_MS = [4000, 12000];    // 새 스피키가 들어오는 간격(무작위 범위)
  var LIFE_MS = [20000, 60000];    // 한 마리가 화면에 머무는 시간(무작위 범위)
  var CRY_FALLBACK_MS = 1300;      // 울음 표정 유지 시간 (음원 길이를 알면 그 길이를 쓴다)

  var HOP_HEIGHT = [0.35, 0.7];    // 점프 높이 (스피키 크기 대비)
  var HOP_TIME = [0.42, 0.6];      // 점프 한 번의 체공 시간(초)
  var HOP_DIST = [0.6, 1.5];       // 점프 한 번에 가는 가로 거리 (스피키 크기 대비)
  var TURN_CHANCE = 0.28;          // 착지 후 방향을 바꿀 확률

  // 젤리 스프링: 값이 클수록 단단하고 빠르게, 감쇠가 작을수록 더 오래 출렁인다.
  var STIFFNESS = 300;
  var DAMPING = 10;
  var CLICK_STRETCH = 0.45;        // 클릭했을 때 좌우로 늘어나는 정도 (0.45 = 폭이 1.45배, 키는 그만큼 낮아짐)
  var PRESS_SEC = 0.08;            // 늘어나는 데 걸리는 시간

  /* ---------- 도구 ---------- */
  function rand(range) { return range[0] + Math.random() * (range[1] - range[0]); }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  var viewW = root.clientWidth;
  window.addEventListener('resize', function () { viewW = root.clientWidth; });

  var soundMs = [];                  // 음성별 길이(ms) — 메타데이터를 읽으면 채워진다
  var zTop = 1;

  // 음성 하나를 무작위로 골라 재생하고, 그 음성에 맞춘 울음 표정 유지 시간(ms)을 돌려준다.
  function playCry() {
    var i = Math.floor(Math.random() * SRC.sounds.length);
    try {
      var a = new Audio(SRC.sounds[i]);  // 매번 새로 만들어서 연타해도 겹쳐서 재생된다
      var p = a.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) { /* 재생이 막혀도 애니메이션은 그대로 */ }
    return soundMs[i] ? clamp(soundMs[i], 900, 3000) : CRY_FALLBACK_MS;
  }

  /* ---------- 스피키 한 마리 ---------- */
  function Speaki(side) {            // side: -1 왼쪽에서 / 1 오른쪽에서 들어옴
    var el = document.createElement('div');
    el.className = 'speaki';
    var body = document.createElement('div');
    body.className = 'speaki__body';
    var happy = new Image(); happy.className = 'speaki__happy'; happy.src = SRC.happy; happy.alt = ''; happy.draggable = false;
    var cry = new Image();   cry.className = 'speaki__cry';     cry.src = SRC.cry;     cry.alt = '';   cry.draggable = false;
    body.appendChild(happy);
    body.appendChild(cry);
    el.appendChild(body);
    field.appendChild(el);

    this.el = el;
    this.body = body;
    this.w = el.offsetWidth || 56;

    this.dir = side < 0 ? 1 : -1;                         // 이미지는 오른쪽을 보고 있다
    this.x = side < 0 ? -this.w * 1.3 : viewW + this.w * 0.3;
    this.y = 0;                                           // 바닥에서 뜬 높이(px)
    this.vx = 0; this.vy = 0; this.g = 0; this.v0 = 1;
    this.state = 'rest';
    this.rest = 0.05;
    this.entered = false;                                 // 화면 안으로 완전히 들어왔는가
    this.leaving = false;                                 // 나가는 중인가
    this.dieAt = 0;
    this.cryUntil = 0;

    this.a = 0; this.av = 0;                              // 좌우 변형 (클릭): 음수면 넓어지고 양수면 좁아진다
    this.b = 0; this.bv = 0;                              // 위아래로 눌림 (점프·착지)
    this.press = 0;

    var self = this;
    el.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      e.stopPropagation();
      self.poke(performance.now());
    });
  }

  Speaki.prototype.poke = function (now) {
    var ms = playCry();                                   // 표정이 바뀌는 바로 그 순간에 재생
    this.cryUntil = now + ms;                             // 울음 표정은 재생되는 음성 길이만큼
    this.el.classList.add('is-crying');
    this.el.style.zIndex = String(++zTop);
    this.press = PRESS_SEC;
    this.vx = 0;                                          // 울고 있는 동안은 제자리에서
  };

  Speaki.prototype.hop = function () {
    var S = this.w;
    var h = rand(HOP_HEIGHT) * S;
    var T = rand(HOP_TIME);
    var dist = rand(HOP_DIST) * S;

    if (!this.leaving) {
      if (this.entered) {
        if (Math.random() < TURN_CHANCE) this.dir = -this.dir;
        // 가장자리에 가까우면 안쪽으로 향한다
        if (this.x < dist * 0.8) this.dir = 1;
        else if (this.x > viewW - this.w - dist * 0.8) this.dir = -1;
      }
    }
    this.v0 = 4 * h / T;
    this.g = 8 * h / (T * T);
    this.vy = this.v0;
    this.vx = this.dir * dist / T;
    this.state = 'air';
    this.b = 0.16;                                        // 박차고 오르는 순간 살짝 눌렸다가 늘어난다
  };

  Speaki.prototype.land = function () {
    this.y = 0;
    this.vy = 0;
    this.vx = 0;
    this.state = 'rest';
    this.b = 0.24;                                        // 착지하며 납작해졌다가 출렁
    this.bv = 0;
    this.rest = Math.random() < 0.15 ? 0.8 + Math.random() * 0.8 : 0.05 + Math.random() * 0.45;
  };

  Speaki.prototype.update = function (dt, now) {
    if (!this.leaving && now > this.dieAt) {
      this.leaving = true;
      this.dir = this.x + this.w / 2 < viewW / 2 ? -1 : 1;   // 가까운 가장자리로
    }
    var crying = now < this.cryUntil;
    if (!crying && this.el.classList.contains('is-crying')) this.el.classList.remove('is-crying');

    if (this.state === 'rest') {
      this.rest -= dt;
      if (this.rest <= 0 && !crying) this.hop();
    } else {
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.vy -= this.g * dt;

      if (!this.leaving) {
        var maxX = viewW - this.w;
        if (!this.entered) {
          if (this.x >= 0 && this.x <= maxX) this.entered = true;
        } else if (this.x < 0) {
          this.x = 0; this.vx = Math.abs(this.vx); this.dir = 1;
        } else if (this.x > maxX) {
          this.x = maxX; this.vx = -Math.abs(this.vx); this.dir = -1;
        }
      }
      if (this.y <= 0 && this.vy < 0) this.land();
    }

    // 젤리 스프링
    var targetB = this.state === 'air' ? -0.12 * Math.min(1, Math.abs(this.vy) / this.v0) : 0;
    this.bv += (STIFFNESS * (targetB - this.b) - DAMPING * this.bv) * dt;
    this.b += this.bv * dt;

    if (this.press > 0) {                                 // 클릭 직후: 빠르게 좌우로 늘어난다
      this.press -= dt;
      this.a += (-CLICK_STRETCH - this.a) * Math.min(1, dt / 0.035);
      this.av = 0;
    } else {                                              // 이후 스프링이 되튀며(좁아졌다 넓어졌다) 원래대로
      this.av += (-STIFFNESS * this.a - DAMPING * this.av) * dt;
      this.a += this.av * dt;
    }
    this.render();
  };

  Speaki.prototype.render = function () {
    var sx = clamp(1 - this.a + 0.5 * this.b, 0.25, 1.8);
    var sy = clamp(1 + 0.55 * this.a - this.b, 0.5, 1.6);
    this.el.style.transform = 'translate3d(' + this.x.toFixed(1) + 'px,' + (-this.y).toFixed(1) + 'px,0)';
    this.body.style.transform = 'scale(' + (sx * this.dir).toFixed(3) + ',' + sy.toFixed(3) + ')';
  };

  Speaki.prototype.gone = function () {
    return this.leaving && (this.x < -this.w * 1.2 || this.x > viewW + this.w * 0.2);
  };

  /* ---------- 전체 관리 ---------- */
  var list = [];
  var ready = false;        // 이미지·음원 준비 완료
  var last = 0;
  var nextSpawn = 0;
  var started = false;

  function frame(ts) {
    requestAnimationFrame(frame);
    var dt = Math.min(0.04, (ts - last) / 1000 || 0);
    last = ts;
    if (!ready || root.getAttribute('data-view') === 'splash') return;

    if (!started) { started = true; nextSpawn = ts + 500; }
    if (ts >= nextSpawn) {
      if (list.length < MAX) {
        var s = new Speaki(Math.random() < 0.5 ? -1 : 1);
        s.dieAt = ts + rand(LIFE_MS);
        list.push(s);
        nextSpawn = ts + rand(SPAWN_MS);
      } else {
        nextSpawn = ts + 1000;
      }
    }
    for (var i = list.length - 1; i >= 0; i--) {
      list[i].update(dt, ts);
      if (list[i].gone()) {
        list[i].el.remove();
        list.splice(i, 1);
      }
    }
  }

  // 페이지가 다 뜬 뒤에 이미지·음원을 받아 둔다 (처음 표시를 방해하지 않도록)
  function prepare() {
    var pending = [SRC.happy, SRC.cry].map(function (src) {
      var img = new Image();
      img.src = src;
      return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
    });
    SRC.sounds.forEach(function (src, i) {
      var sound = new Audio(src);
      sound.preload = 'auto';
      sound.addEventListener('loadedmetadata', function () {
        if (isFinite(sound.duration) && sound.duration > 0) soundMs[i] = sound.duration * 1000;
      });
    });
    Promise.all(pending).then(function () { ready = true; });
  }

  if (document.readyState === 'complete') prepare();
  else window.addEventListener('load', prepare);
  requestAnimationFrame(frame);
})();
