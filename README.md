# 트릭컬그라운즈 / トリッカルグラウンズ / TRICKALGROUNDS

트릭컬 팬게임들을 모두 모아, 쉽고 빠르게.

게임 파일을 직접 올리지 않고, 게임이 따로 올라가 있는 사이트로 연결해 주는 **순수 정적 사이트**입니다. 서버·DB·빌드 도구 없이 GitHub Pages에서 그대로 동작합니다.

- 언어: 한국어(기본) · 日本語 · English
- 테마: 라이트(기본) · 다크 (오른쪽 위 스위치, 선택은 브라우저에 저장됨)
- 화면: 첫 화면 → 홈(분류별 목록) → 전체 목록 → 게임 상세 팝업

## 폴더 구조

```
index.html          페이지 뼈대
css/style.css       스타일 · 색상 · 반응형 · 전환 애니메이션
js/app.js           화면 전환 · 주소 처리 · 팝업 등 앱 로직
js/i18n.js          UI 문자열 (한/일/영)
js/speaki.js        화면 맨 밑을 돌아다니는 스피키 (장식)
js/bgm.js           배경음악 (무한 반복, 오른쪽 위 스피커 버튼으로 끄고 켬)
assets/bgm/         배경음악 파일
data/games.js       ★ 분류와 게임 목록 — 보통 이 파일만 고치면 됩니다
assets/logo.webp    로고
assets/thumbs/      게임 썸네일을 넣을 곳 (직접 만들어 사용)
assets/apostles/    스피키 이미지(speaki-happy / speaki-cry)와 클릭 음성(mp3, js/speaki.js 의 SRC.sounds 에 등록)
```

## 게임 추가하기

`data/games.js`의 `games` 배열에 항목을 추가하고 커밋하면 끝입니다. 자세한 필드 설명은 그 파일 맨 위 주석에 있습니다.

```js
{
  id: 'my-game',                       // 고유 식별자 (영문/숫자/하이픈)
  category: 'realtime',                // 분류 id
  title: { ko: '제목', ja: 'タイトル', en: 'Title' },   // 문자열 하나만 써도 됨
  creator: '제작자',
  thumbnail: 'assets/thumbs/my-game.webp',   // 없으면 회색 상자 (권장 비율 3:2)
  released: '2025-03',                 // 2025 / 2025-03 / 2025-03-17
  platform: 'PC',                      // 문자열/배열/언어별 모두 가능. 제작 시기 옆에 「 | 」로 표시
  genres: ['액션'],
  tags: ['협동'],
  description: '게임 설명\n줄바꿈은 \\n',
  url: 'https://...',                  // 「플레이하러 가자!」가 열 주소 (새 탭)
}
```

- 홈에서는 분류마다 한 줄에 들어가는 만큼(화면 폭과 UI 배율에 따라 달라짐)만 보이고, 「전체 목록」에서 모두 보입니다. 표시 순서는 배열 순서입니다.
- 분류를 추가하려면 `categories`에 `{ id, name: { ko, ja, en } }` 를 하나 더 적으면 됩니다.
- 현재 들어 있는 `sample-*` 항목은 레이아웃 확인용 샘플이니 실제 게임으로 교체하세요.

## 주소(해시) 구조

GitHub Pages에서 별도 설정 없이 새로고침·공유가 되도록 `#` 주소를 씁니다.

| 주소 | 화면 |
| --- | --- |
| `#/` | 홈 (처음 접속하면 첫 화면 → 홈) |
| `#/c/<분류id>` | 전체 목록 |
| `#/g/<게임id>` | 홈 + 게임 상세 |
| `#/c/<분류id>/g/<게임id>` | 전체 목록 + 게임 상세 |

## 로컬에서 보기

`index.html`을 바로 열어도 되고, 서버로 확인하려면:

```bash
python -m http.server 5173
```

그 뒤 http://localhost:5173 으로 접속합니다.

## GitHub Pages 배포

저장소 **Settings → Pages → Build and deployment** 에서 *Deploy from a branch* 를 고르고, 브랜치(`main`)와 폴더(`/ (root)`)를 지정합니다.

## 손쉽게 바꿀 수 있는 값

- 첫 화면 유지 시간: `js/app.js` 의 `SPLASH_MS` (기본 1.6초, 클릭·스크롤·키 입력으로 건너뜀)
- 전환 애니메이션 길이: `css/style.css` 의 `--dur` (기본 0.8초)
- UI 배율: `css/style.css` 의 `--ui-scale` (기본 0.5). 글자·카드·간격·팝업이 함께 커지고 작아집니다. 로고와 오른쪽 위 컨트롤은 영향을 받지 않습니다. 좁은 화면에서 너무 작아지지 않게 `--ui-min-root`(8px)가 하한을 잡습니다.
- 배경음악: `js/bgm.js` 맨 위 설정값 — 파일 `SRC`, 음량 `VOLUME`(기본 0.4), 시작할 때 서서히 커지는 시간 `FADE_IN_MS`. 페이지를 열면 바로 재생을 시도합니다. 브라우저가 소리 있는 자동 재생을 막으면(대부분의 첫 방문) 첫 화면이 자동으로 넘어가지 않고 「클릭하여 시작」 안내를 띄워서, 클릭·터치·키 입력과 함께 음악이 시작되며 홈으로 넘어갑니다(스크롤은 입장 조작으로 인정되지 않음). 자동 재생이 허용된 브라우저나 사용자가 음악을 꺼 둔 경우에는 첫 화면이 자동으로 넘어갑니다. 끈 상태는 브라우저에 저장됩니다. 안내 문구는 `js/i18n.js` 의 `clickToStart`, 기다리는 최대 시간은 `js/app.js` 의 `BGM_WAIT_MS` 입니다.
- 스피키: `js/speaki.js` 맨 위 설정값 — 최대 마리 수 `MAX`(10), 들어오는 간격 `SPAWN_MS`, 머무는 시간 `LIFE_MS`, 점프 크기·속도, 클릭했을 때 좌우로 늘어나는 정도 `CLICK_STRETCH`, 젤리 탄성 `STIFFNESS`/`DAMPING`. 크기는 `css/style.css` 의 `--speaki-w`. 「움직임 줄이기」 설정을 쓰는 사람에게는 나타나지 않습니다.
- 색상(라이트/다크): `css/style.css` 맨 위의 `:root`, `:root[data-theme="dark"]`
- 글꼴: Google Fonts의 Noto Sans KR / Noto Sans JP (`index.html`의 `<link>`), 실패 시 시스템 글꼴

## 정적 사이트의 한계

업로드·댓글·로그인·조회수/좋아요 집계처럼 **서버가 있어야 하는 기능**을 추가하는 순간 순수 정적 구성(GitHub Pages)만으로는 구현할 수 없습니다. 그런 기능이 필요해지면 외부 서비스(예: Firebase, Supabase, giscus 등)나 별도 서버를 붙여야 합니다.
