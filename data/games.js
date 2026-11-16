/* ==========================================================================
   게임 데이터 — 새 게임은 아래 `games` 배열에 항목을 추가하고 커밋하면 된다.

   [분류 categories]
     id    : 영문 소문자 식별자 (게임의 category 값과 연결됨)
     name  : 언어별 이름. 분류를 추가하려면 항목 하나만 더 적으면 된다.
             화면에는 이 배열의 순서대로 표시된다.

   [게임 games]
     id          : 고유한 영문/숫자/하이픈 식별자 (주소 #/g/<id> 에 쓰임)
     category    : 위 categories 의 id
     title       : 제목
     creator     : 제작자
     thumbnail   : 썸네일 이미지 경로 (예: "assets/thumbs/my-game.webp").
                   비워 두거나 없으면 회색 상자가 대신 표시된다. (권장 비율 3:2)
     released    : 제작 시기. "2024", "2024-05", "2024-05-17" 형식 (언어에 맞게 표시됨)
     genres      : 게임 장르 목록
     tags        : 태그 목록
     description : 게임 설명. 줄바꿈은 \n
     url         : 「플레이하러 가자!」를 눌렀을 때 이동할 주소 (https://...)

   title / creator / description / genres / tags 는 두 가지 방식으로 적을 수 있다.
     1) 그냥 문자열           → 모든 언어에서 똑같이 표시
     2) { ko: "", ja: "", en: "" } → 언어별로 표시 (없는 언어는 한국어로 대체)
   ========================================================================== */
window.TG_DATA = {
  categories: [
    { id: 'realtime', name: { ko: '실시간 온라인', ja: 'リアルタイムオンライン', en: 'Real-time Online' } },
    { id: 'async',    name: { ko: '비동기 온라인', ja: '非同期オンライン',       en: 'Asynchronous Online' } },
    { id: 'minigame', name: { ko: '미니게임',      ja: 'ミニゲーム',             en: 'Mini Games' } },
    { id: 'offline',  name: { ko: '오프라인',      ja: 'オフライン',             en: 'Offline' } },
  ],

  // ↓ 아래 항목들은 레이아웃 확인용 샘플이다. 실제 게임으로 교체해서 쓰면 된다.
  games: [
    {
      id: 'sample-1',
      category: 'realtime',
      title: { ko: '제목 1', ja: 'タイトル 1', en: 'Title 1' },
      creator: { ko: '제작자 1', ja: '制作者 1', en: 'Creator 1' },
      thumbnail: '',
      released: '2024-05',
      genres: { ko: ['액션'], ja: ['アクション'], en: ['Action'] },
      tags: { ko: ['협동', '멀티'], ja: ['協力', 'マルチ'], en: ['Co-op', 'Multiplayer'] },
      description: {
        ko: '게임 설명. 다람쥐 헌 쳇바퀴에 타고파. 다람쥐 헌 쳇바퀴에 타고파.\n게임 설명. 다람쥐 헌 쳇바퀴에 타고파. 다람쥐 헌 쳇바퀴에 타고파.\n게임 설명. 다람쥐 헌 쳇바퀴에 타고파. 다람쥐 헌 쳇바퀴에 타고파.\n게임 설명. 다람쥐 헌 쳇바퀴에 타고파. 다람쥐 헌 쳇바퀴에 타고파.',
        ja: 'ゲーム説明。サンプルのテキストです。サンプルのテキストです。\nゲーム説明。サンプルのテキストです。サンプルのテキストです。',
        en: 'Game description. This is sample text. This is sample text.\nGame description. This is sample text. This is sample text.',
      },
      url: 'https://example.com/',
    },
    { id: 'sample-2',  category: 'realtime', title: '제목 2',  creator: '제작자 2',  released: '2024-06', genres: ['레이싱'], description: '샘플 설명입니다.', url: 'https://example.com/' },
    { id: 'sample-3',  category: 'realtime', title: '제목 3',  creator: '제작자 3',  released: '2024-08', genres: ['퍼즐'],   description: '샘플 설명입니다.', url: 'https://example.com/' },
    { id: 'sample-4',  category: 'realtime', title: '제목 4',  creator: '제작자 4',  released: '2024-09', genres: ['슈팅'],   description: '샘플 설명입니다.', url: 'https://example.com/' },
    { id: 'sample-5',  category: 'realtime', title: '제목 5',  creator: '제작자 5',  released: '2024-10', genres: ['RPG'],    description: '샘플 설명입니다.', url: 'https://example.com/' },
    { id: 'sample-6',  category: 'realtime', title: '제목 6',  creator: '제작자 6',  released: '2024-11', genres: ['액션'],   description: '샘플 설명입니다.', url: 'https://example.com/' },
    { id: 'sample-7',  category: 'realtime', title: '제목 7',  creator: '제작자 7',  released: '2024-12', genres: ['퍼즐'],   description: '샘플 설명입니다.', url: 'https://example.com/' },
    { id: 'sample-8',  category: 'realtime', title: '제목 8',  creator: '제작자 8',  released: '2025-01', genres: ['슈팅'],   description: '샘플 설명입니다.', url: 'https://example.com/' },
    { id: 'sample-9',  category: 'realtime', title: '제목 9',  creator: '제작자 9',  released: '2025-02', genres: ['레이싱'], description: '샘플 설명입니다.', url: 'https://example.com/' },
    { id: 'sample-10', category: 'realtime', title: '제목 10', creator: '제작자 10', released: '2025-03', genres: ['RPG'],    description: '샘플 설명입니다.', url: 'https://example.com/' },

    { id: 'sample-11', category: 'async', title: '제목 11', creator: '제작자 11', released: '2024-04', genres: ['육성'],     description: '샘플 설명입니다.', url: 'https://example.com/' },
    { id: 'sample-12', category: 'async', title: '제목 12', creator: '제작자 12', released: '2024-07', genres: ['방치형'],   description: '샘플 설명입니다.', url: 'https://example.com/' },
    { id: 'sample-13', category: 'async', title: '제목 13', creator: '제작자 13', released: '2024-09', genres: ['랭킹'],     description: '샘플 설명입니다.', url: 'https://example.com/' },
    { id: 'sample-14', category: 'async', title: '제목 14', creator: '제작자 14', released: '2025-01', genres: ['전략'],     description: '샘플 설명입니다.', url: 'https://example.com/' },
    { id: 'sample-15', category: 'async', title: '제목 15', creator: '제작자 15', released: '2025-02', genres: ['카드'],     description: '샘플 설명입니다.', url: 'https://example.com/' },
    { id: 'sample-16', category: 'async', title: '제목 16', creator: '제작자 16', released: '2025-03', genres: ['육성'],     description: '샘플 설명입니다.', url: 'https://example.com/' },

    { id: 'sample-17', category: 'minigame', title: '제목 17', creator: '제작자 17', released: '2024-03', genres: ['캐주얼'], description: '샘플 설명입니다.', url: 'https://example.com/' },
    { id: 'sample-18', category: 'minigame', title: '제목 18', creator: '제작자 18', released: '2024-05', genres: ['퍼즐'],   description: '샘플 설명입니다.', url: 'https://example.com/' },
    { id: 'sample-19', category: 'minigame', title: '제목 19', creator: '제작자 19', released: '2024-10', genres: ['리듬'],   description: '샘플 설명입니다.', url: 'https://example.com/' },

    { id: 'sample-20', category: 'offline', title: '제목 20', creator: '제작자 20', released: '2024-06', genres: ['어드벤처'], description: '샘플 설명입니다.', url: 'https://example.com/' },
    { id: 'sample-21', category: 'offline', title: '제목 21', creator: '제작자 21', released: '2024-12', genres: ['RPG'],       description: '샘플 설명입니다.', url: 'https://example.com/' },
  ],
};
