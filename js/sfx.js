/* ==========================================================================
   버튼 효과음 — 게임 카드 · 「플레이하러 가자!」 · 팝업 닫기(X) 버튼을 누를 때 재생
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 설정 ---------- */
  var SRC = 'assets/' + encodeURIComponent('버튼.mp3');
  var VOLUME = 1;                      // 0~1
  // 효과음이 나야 하는 요소들 (이 안의 어느 곳을 눌러도 된다)
  var TARGETS = '.card, #modal-play, #modal-close';

  // 처음 누를 때 지연이 없도록 미리 받아 둔다
  var warm = new Audio(SRC);
  warm.preload = 'auto';

  function play() {
    try {
      var a = new Audio(SRC);          // 매번 새로 만들어서 빠르게 연타해도 겹쳐서 재생된다
      a.volume = VOLUME;
      var p = a.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) { /* 재생이 막혀도 버튼 동작에는 영향이 없다 */ }
  }

  // 클릭 하나로 마우스·터치·키보드(Enter/Space) 조작을 모두 잡는다.
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest(TARGETS);
    if (!el) return;
    if (el.getAttribute('aria-disabled') === 'true') return;   // 링크가 없는 비활성 「플레이」 버튼
    play();
  });
})();
