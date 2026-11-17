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
     platform    : 플랫폼 — 한국어 단어를 문자열 또는 배열로 적는다. "PC" / ["PC", "모바일"]
                   상세 팝업에서 제작 시기 옆에 「 | 」로 구분되어 표시됨
     genres      : 게임 장르 목록 — 한국어 단어만 배열로 적는다. ["액션", "캐주얼"]
     tags        : 태그 목록     — 한국어 단어만 배열로 적는다. ["1인용", "생존"]
                   (platform / genres / tags 모두, 한국어가 아닌 언어에서는 단어.xlsx 의 같은 이름 시트에서 같은 단어를
                    찾아 해당 언어 값으로 바꿔 보여 준다. 새 단어는 단어.xlsx 에 행을 추가할 것.)
     description : 게임 설명. 줄바꿈은 \n
     url         : 「플레이하러 가자!」를 눌렀을 때 이동할 주소 (https://...)

   [사이트 맨 밑 문구]
     최상위 `creator` (games 와 같은 단계)에 적은 텍스트가 화면 맨 밑에 작은 글씨로 표시된다.
     줄바꿈은 \n. 아래 두 가지 방식으로 언어별로 적을 수도 있다.

   title / creator / description 은 두 가지 방식으로 적을 수 있다.
     1) 그냥 문자열           → 모든 언어에서 똑같이 표시
     2) { ko: "", ja: "", en: "" } → 언어별로 표시 (없는 언어는 한국어로 대체)
   ========================================================================== */
window.TG_DATA = {
  categories: [
    {
      id: "online",
      name: { ko: "온라인 게임", ja: "ネットゲーム", en: "Online Games" },
    },
    {
      id: "web",
      name: { ko: "웹게임", ja: "ブラウザゲーム", en: "Browser Games" },
    },
    {
      id: "offline",
      name: { ko: "패키지 게임", ja: "DLゲーム", en: "Downloadable Games" },
    },
  ],

  creator:
    "2026.11 sakotan45\n본 사이트는 에피드게임즈와 아무런 관련이 없습니다.",

  // ↓ 아래 항목들은 레이아웃 확인용 샘플이다. 실제 게임으로 교체해서 쓰면 된다.
  games: [
    {
      id: "jubee-adventure",
      category: "web",
      title: {
        ko: "쥬비의 모험",
        ja: "ジュビーの冒険",
        en: "Jubee's Adventure",
      },
      creator: "rmfprm",
      thumbnail: "assets/thumbs/jubee-adventure.png",
      released: "2022-04-29",
      platform: "PC",
      genres: ["액션", "캐주얼"],
      tags: ["1인용", "생존", "원버튼"],
      description: {
        ko: "플래피 버드와 유사한 쥬비 비행 게임입니다.\n마우스 클릭이나 스페이스 바로 쥬비를 통통 뛰게 해서, 최대한 오래 살아남으면 됩니다.",
        ja: "フラッピーバードに似たジュビー飛行ゲームです。\nマウスクリックやスペースバーでジュビーをぴょんぴょん跳ねさせ、できるだけ長く生き残ればOKです。",
        en: "A Jubee flying game similar to Flappy Bird.\nMake Jubee bounce with mouse clicks or space to survive as long as possible.",
      },
      url: "https://scratch.mit.edu/projects/526375538/fullscreen/",
    },
    {
      id: "minigame-melon",
      category: "offline",
      title: {
        ko: "미니 게임 멜론",
        ja: "ミニゲームメロン",
        en: "Minigame Melon",
      },
      creator: "게으른농부",
      thumbnail: "assets/thumbs/minigame-melon.webp",
      released: "2023-09-23",
      platform: "PC",
      genres: ["액션", "캐주얼"],
      tags: ["1인용", "생존", "원버튼"],
      description: {
        ko: "마우스 클릭으로 멜룬을 조작하여 다가오는 땃쥐를 넘거나 밟으면 됩니다.\n공중 점프가 가능하며, 땃쥐를 밟거나 땅에 착지해서 충전합니다.\n땃쥐와 서로 충돌하면 게임 오버입니다.",
        ja: "マウスクリックでメルンを操作し、近づいてくるネズミを乗り越えるか踏んでください。\n空中ジャンプが可能で、ネズミを踏むか地面に着地してチャージします。\nネズミと互いに衝突するとゲームオーバーになります。",
        en: "Use the mouse to control Melun and either dodge or step on the approaching mice.\nYou can also perform aerial jumps. It can be charged by stepping on any mouse or landing on the ground.\nIf you collide with the mouse, game over.",
      },
      url: "https://arca.live/b/trickcal/86924912",
    },
    {
      id: "butter-game",
      category: "offline",
      title: {
        ko: "버터 수박 게임",
        ja: "バタースイカゲーム",
        en: "Butter Watermelon Game",
      },
      creator: "colus23",
      thumbnail: "assets/thumbs/butter-game.png",
      released: "2023-12-08",
      platform: ["PC", "모바일"],
      genres: ["퍼즐", "캐주얼"],
      tags: ["1인용", "생존", "간단한 조작"],
      description: {
        ko: "'수박 게임'을 패러디한 '트릭컬 RE:VIVE'의 2차 창작 게임입니다.\n같은 사도의 두 공을 합치면 더 큰 공이 됩니다.\n계속 공을 합치다 보면, 언젠가 귀여운 '버터 공'이 만들어집니다!\n공이 점선 밖으로 넘치면 게임 오버입니다.\n죽지 않고 최대한 많이 합쳐보세요!",
        ja: "「スイカゲーム」からインスピレーションを得て制作された「トリックカル RE:VIVE」の二次創作ゲームです。\n同じキャラクターのボールを2つ合成すると、より大きなボールになります。\nずっとボールを合わせていると、いつかかわいい「バター玉」ができます！\nボールが点線の外にはみ出したらゲームオーバーです。",
        en: "This game is a fan-made game of 'Trickcal RE:VIVE' and is a type of 'Suika-Game.'\nWhen you combine two identical character ball, they transform into a larger ball.\nBy collecting ball continuously, you can create the adorable Butter!\nIf a pog hits the top dashed line of the box, it's game over.\nSo, don't die and try to collect as many points as possible!",
      },
      url: "https://colus23.itch.io/butter-game",
    },
    {
      id: "erpin-marshmellow",
      category: "web",
      title: {
        ko: "요정여왕 에르핀의 마시멜로 대작전!",
        ja: "妖精の女王エルフィンのマシュマロ大作戦！",
        en: "Fairy queen Erpin CRAVES marshmellows!",
      },
      creator: "GM로네",
      thumbnail: "assets/thumbs/erpin-marshmellow.png",
      released: "2022-07-14",
      platform: ["PC", "모바일"],
      genres: ["아케이드", "액션"],
      tags: ["1인용", "타임 어택", "원버튼"],
      description: {
        ko: "\"더 많은 케이크를 모두에게 공평하게 분배하겠다!\"\n에르핀이 잠꼬대로도 외치는 이 구호는 스스로 만든 '케이크의 공정한 분배'라는 이론을 기반으로 한 것. 교주가 직접 나서 4시간 동안 반박했음에도 전혀 굴하지 않은 에르핀은 이를 직접 시행하기 위해 나섰는데......\n사실 다른 요정들 몰래 단 것을 마구마구 먹고 싶어하는 본능이 표출되고만 에르핀!​\n과연 그녀는 다른 감시자(네르)의 눈을 피해 얼마나 많은 마시멜로를 먹을 수 있을까?​\n그녀의 소망을 이뤄줄 수 있는 건 오직 교주님 뿐이야!\n네르의 인내심이 폭발하기 전 최대한 많은 마시멜로를 먹어봐!\n\n본 게임은 PC로 가볍게 즐기실 수 있는 웹 기반의 미니게임입니다.\n(iOS 및 일부 모바일에서는 정상적으로 실행되지 않습니다).",
        ja: "「もっと多くのケーキを、みんなに公平に配ります！」\nエルフィンが寝言でさえ叫ぶこのスローガンは、自らが作り上げた「ケーキの公平な分配」という理論に基づいている。 教祖が自ら立ち上がり、4時間にわたって反論したにもかかわらず、まったくひるまなかったエルフィンは、これを自ら実行するために立ち上がったが……\n実は他の妖精たちに内緒で甘いものをむさぼり食いたいという本能が爆発したエルフィン！\n果たして彼女は、別の監視者（ネル）の目を盗んで、どれだけのマシュマロを食べられるだろうか？\n彼女の願いを叶えてくれるのは、教主様だけだ！\nネルの忍耐力が爆発する前に、できるだけたくさんのマシュマロを食べてみて！\n\n本ゲームは、PCで手軽にプレイできるウェブベースのミニゲームです。\n(iOSおよび一部のモバイルでは正常に実行されません)。",
        en: "\"I'll share the extra cake equally with everyone!\"\nThis chant, which Erpin even repeats in his sleep, is based on his self-created theory of the “fair distribution of the cake.” Even after the cult leader personally rebutted for four hours, Erfin remained unyielding and went to carry it out himself...\nErpin’s instinct to binge-eat sweets without the other fairies knowing has completely surfaced!\nHow many marshmallows can she eat while avoiding the watchful eyes of the other watcher (Ner)?\nThe only one who can make her wish come true is the cult leader!\nEat as many marshmallows as you can before Ner's patience runs out!\n\nThis game is a web-based mini-game that you can enjoy on PC.\n(Does not run properly on iOS and some mobile devices).",
      },
      url: "https://rohnegm.github.io/ErpinMarshmallow/",
    },
    {
      id: "speakittt",
      category: "web",
      title: {
        ko: "스피키 틱택토",
        ja: "スピッキーティックタックトー",
        en: "Speaki Tic Tac Toe",
      },
      creator: "aoaochan",
      thumbnail: "assets/thumbs/speakittt.png",
      released: "2025-06-03",
      platform: ["PC", "모바일"],
      genres: ["퍼즐", "포인트 앤 클릭"],
      tags: ["1인용", "원버튼"],
      description: {
        ko: "스피키의 이마에 틱택토를 그리며 AI와 대결하는 게임입니다. 세 가지 난이도로 구성되어 있으며, 승리할 때마다 다음 난이도로 도전할 수 있습니다.\n1. 스피키의 이마에 있는 3x3 보드에 O를 그립니다.\n2. AI가 X를 그립니다.\n3. 가로, 세로, 대각선으로 O를 먼저 완성하면 승리!\n4. 승리하면 다음 난이도로 도전할 수 있습니다.",
        ja: "スピッキーの額にティックタックトーを描きながらAIと対戦するゲームです。 3つの難易度で構成されており、勝利するたびに次の難易度に挑戦できます。\n1. スピッキーの額にある3x3のボードにOを描きます。\n2. AIがXを描きます。\n3. 横、縦、斜めにOを先に完成させたら勝利！\n4. 勝利すると、次の難易度に挑戦できます。",
        en: "It's a game where you draw tic-tac-toe on Speaki's forehead and battle against AI. There are three difficulty levels, and you can move on to the next one after winning.\n1. Draw an O on 3x3 board on Speaki's forehead.\n2. AI draws an X.\n3. Win by completing the O first horizontally, vertically, or diagonally!\n4. If you win, you can challenge the next difficulty.",
      },
      url: "https://aoaochan.itch.io/speaki-tic-tac-toe",
    },
    {
      id: "cursor-trickal",
      category: "offline",
      title: {
        ko: "커서 트릭컬",
        ja: "カーソルトリッカル",
        en: "Cursor Trickal",
      },
      creator: "게으른농부",
      thumbnail: "assets/thumbs/cursor-trickal.webp",
      released: "2024-01-17",
      platform: "PC",
      genres: ["액션", "뱀서라이크"],
      tags: ["1인용", "간단한 조작"],
      description: {
        ko: "화면에 보이는 적 사도들을 마우스로 마구 문질러 주면 됩니다.\n사도들이 쏘는 공격에 주의하세요!\n각 라운드마다 아군 사도를 선택해서 도움을 받을 수도 있습니다.",
        ja: "画面に表示されている敵使徒をマウスでどんどんなぞってください。\n使徒たちの放つ攻撃にご注意ください！\n各ラウンドごとに味方の使徒を選んで支援を受けることもできます。",
        en: "Just attack the enemy apostles on the screen with your mouse.\nBeware of the apostles’ attacks!\nIn each round, you can also choose friendly apostles for assistance.",
      },
      url: "https://arca.live/b/breaking/96850409",
    },
    {
      id: "ed-defense",
      category: "web",
      title: { ko: "이드 디펜스", ja: "イートを守ろう！", en: "Ed Defense" },
      creator: "Hyeonin",
      thumbnail: "assets/thumbs/ed-defense.png",
      released: "2024-04-26",
      platform: ["PC", "모바일"],
      genres: ["뱀서라이크"],
      tags: ["1인용", "원버튼"],
      description: {
        ko: "사방에서 몰려나오는 요상한 바이러스들로부터 나타가 이드를 지키는 게임입니다.\n마우스 클릭으로 레이저를 발사해서 몰려오는 바이러스를 처치할 수 있습니다.\n오른쪽 위에 있는 버튼을 클릭해 나타를 업그레이드할 수 있습니다.",
        ja: "四方から押し寄せてくる奇妙なウイルスたちから、「ナタ」が「イード」を守るゲームです。\nマウスクリックでレーザーを発射し、押し寄せてくるウイルスを撃退できます。\n右上のボタンをクリックすると、表示をアップグレードできます。",
        en: "It's a game where Nata protects Ed from strange viruses spreading from all directions.\nYou can shoot lasers with a mouse click to defeat the incoming viruses.\nYou can upgrade the appearance by clicking the button in the upper right corner.",
      },
      url: "https://hyeon-in.github.io/eddefense/",
    },
    {
      id: "ed-super-dream",
      category: "offline",
      title: "ED: SUPER DREAM",
      creator: "mata_",
      thumbnail: "assets/thumbs/ed-super-dream.png",
      released: "2025-01-25",
      platform: "PC",
      genres: ["액션", "아케이드", "리듬"],
      tags: ["1인용", "간단한 조작"],
      description: {
        ko: "ED: SUPER DREAM은 Super Hexagon에 영감을 받아 개발한 트릭컬:리바이브 팬게임입니다.\n빠르게 다가오는 도형으로 가득한 이드의 꿈 속에서 신나는 노래를 즐겨보세요!",
        ja: "ED: SUPER DREAMは、『Super Hexagon』にインスパイアされて開発されたトリッカル:もちもちほっぺ大作戦の二次創作ゲームです。  速く迫ってくる図形でいっぱいのイドの夢の中で、ワクワクする歌をお楽しみください！",
        en: "ED: SUPER DREAM is Trickcal's fan-made game developed with inspiration from 'Super Hexagon.'  Enjoy an exciting song in Ed’s dream filled with rapidly approaching shapes!",
      },
      url: "https://mata-studio.itch.io/ed-super-dream",
    },
    {
      id: "nerbollttagoo",
      category: "web",
      title: {
        ko: "정신 차려라 사제장!!!",
        ja: "正気を取り戻せ、師弟長！",
        en: "Get a grip, Ner!",
      },
      creator: "Memelru",
      thumbnail: "assets/thumbs/nerbollttagoo.png",
      released: "2024-10-18",
      platform: ["PC", "모바일"],
      genres: ["포인트 앤 클릭"],
      tags: ["원버튼"],
      description: {
        ko: "네르의 볼따구를 네르는 게임입니다.챱챱챱",
        ja: "ネルのほっぺをめちゃくちゃ叩くゲームです。パチパチ",
        en: "Ner cheek hit hit",
      },
      url: "https://memelru.itch.io/nerbollttagoo",
    },
    {
      id: "clean-time",
      category: "web",
      title: {
        ko: "크레페와 크레페의 교단 대청소",
        ja: "クレープとクレープの教団大掃除",
        en: "Crepe and Crepe do House Cleaning",
      },
      creator: "개해",
      thumbnail: "assets/thumbs/clean-time.gif",
      released: "2024-11-26",
      platform: ["PC", "모바일"],
      genres: ["액션", "아케이드"],
      tags: ["1인용", "타임어택", "간단한 조작"],
      description: {
        ko: '"교단의 쌓인 잡다한 자재들을 분류하고 청소하고자 하는 크레페,\n크레페가 되자마자 고된 업무를 앞두게 된 크레페,\n과연 크레페와 크레페는 이번 교단 대청소를 무사히 넘길 수 있을까요?"\n\n교주가 오기 전까지 최대한 많이 쓰레기를 청소하는 게임입니다.\n크레페도 기뻐할 정도로 에이스 크레페가 될지, 아무것도 안 하고 잠만 자는 폐급 크레페가 될지는 오로지 크레페에게 달렸습니다.',
        ja: "教団に積み重なった雑多な資材を分類し、清掃しようとするクレペ、クレープは、クレープになった途端に過酷な業務を控えることになり、\n果たしてクレープとクレープは、今回の教団大掃除を無事に乗り切ることができるのでしょうか？\n教主が来るまで、できるだけ多くのゴミを掃除するゲームです。\nクレープも喜ぶほどのエースクレープになるのか、何もしないで寝てばかりのダメクレープになるのかは、すべてクレープ次第です。",
        en: "\"Crepe, who wants to sort through and clean the denominations\' piled-up miscellaneous materials,\nAs soon as Crepe got the job, he was faced with a demanding workload,\nWill Crepe and the Crepe be able to get through this big cleaning session safely?\"\nIt\'s a game where you clean up as much trash as possible before Master arrives.\nWhether be nice Crepe that makes everyone happy or be low-effort Crepe who just sleeps all day is entirely up to Crepe.",
      },
      url: "https://solodosi49.itch.io/c-and-c-clean-time",
    },
    {
      id: "speaki-mmo",
      category: "online",
      title: { ko: "스피키 키우기", ja: "スピキ育成", en: "Speaki Online" },
      creator: "단특",
      thumbnail: "assets/thumbs/speaki-mmo.png",
      released: "2026-08-03",
      platform: ["PC", "모바일"],
      genres: ["액션", "어드벤처", "RPG"],
      tags: ["다인용", "협력", "생존", "다양함"],
      description: {
        ko: "출시 직후부터 많은 사랑을 받아 온 온라인 2차 창작 게임입니다.\n플레이어가 스피키가 되어 몬스터를 사냥하고 퀘스트를 수행하며 캐릭터를 성장시킵니다. 이름과는 달리 기본적인 구조는 고전적인 MMORPG에 가깝습니다.\n이외에도 전 세계 교주들과 함께 할 수 있는 미니게임, 귀여운 스킨, 농장 등 컨텐츠가 상당합니다.",
        ja: "リリース直後から多くの支持を集めてきたオンライン二次創作ゲーム。\nプレイヤーはｽﾋﾟｷとなり、モンスターを狩り、クエストをこなし、キャラクターを成長させる。 名前とは裏腹に、基本的な構造は古典的なMMORPGに近い。\nこのほかにも、世界中の教主たちと一緒に楽しめるミニゲームや、かわいいスキン、農場など、コンテンツが豊富だ。",
        en: "An online fan-made game that has been loved since its release.\nPlayers take on the role of Speaki, hunting monsters, completing quests, and leveling up their character. Despite its name, the basic structure is closer to a classic MMORPG.\nIn addition, there is a wide range of content, including mini-games to play with global leaders, cute skins, and a farm.",
      },
      url: "https://speakirpg.overture.io.kr/",
    },
    {
      id: "dudu-jump",
      category: "web",
      title: {
        ko: "두두의 폴짝폴짝 대모험",
        ja: "ドゥドゥのぴょんぴょん大冒険",
        en: "Dudu's Bouncy Adventure",
      },
      creator: "마이볼빠앙",
      thumbnail: "assets/thumbs/dudu-jump.png",
      released: "2026-11-07",
      platform: ["PC", "모바일"],
      genres: ["액션", "어드벤처", "플랫포머"],
      tags: ["1인용", "간단한 조작", "타임어택"],
      description: {
        ko: "두두와 함께 수인숲, 모나티엄, 에르피엔을 지나 엄마가 기다리는 방까지 이동하는 2D 횡스크롤 플랫포머 팬게임입니다.",
        ja: "ドゥドゥと一緒にスインの森、モナティウム、エルピエンを通り、お母さんが待っている部屋まで移動する2D横スクロールプラットフォーマーファンゲームです。",
        en: "A simple 2D side-scrolling platformer fan game where you travel with Dudu through Werebeast Tribe, Monatium, and Erpien to the room where her mom is waiting.",
      },
      url: "https://kimeast123-gif.github.io/trickcal_dudu_jump/",
    },
    {
      id: "speaki-wants-candy",
      category: "offline",
      title: {
        ko: "스핔이 왕사탕 대작전!",
        ja: "ｽﾋﾟｷはキャンディーをたべたい!",
        en: "Speaki Wants Candy!",
      },
      creator: "사코탄45",
      thumbnail: "assets/thumbs/speaki-wants-candy.png",
      released: "2026-06-23",
      platform: ["PC", "모바일"],
      genres: ["액션", "아케이드"],
      tags: ["1인용", "생존", "원버튼"],
      description: {
        ko: "어느 날, 작고 귀여운 스핔이가 있었어요.\n스핔이는 배고파서 왕사탕을 찾고 있었어요. 쉬운 일은 아니었죠.\n한참을 찾은 끝에, 저 멀리 커다란 왕사탕이 있는 걸 발견했어요!\n하지만 원래 주인인 메가스핔이가 왕사탕 곁에서 지키고 있는 게 아니겠어요?\n스핔이는 고민 끝에, 메가스핔이 몰래 왕사탕을 훔쳐먹기로 결정했어요.\n과연 스핔이는 왕사탕까지 잘 도달할 수 있을까요?",
        ja: "ある日、小さくて可愛いｽﾋﾟｷがいました。 \nｽﾋﾟｷはお腹が空いてキャンディを探していました。簡単なことではありませんでしたが。\nしばらく探した末に、遠くに大きなキャンディがあるのを見つけました！\nしかし、元々の飼い主であるメガｽﾋﾟｷがキャンディのそばで守っているのではないでしょうか？\nｽﾋﾟｷは悩んだ末、メガｽﾋﾟｷに内緒で大きなキャンディを盗んで食べることに決めました。\n果たしてｽﾋﾟｷはキャンディまでうまくたどり着けるのでしょうか？",
        en: "One day, a cute, little Speaki was hungry.\nShe looked for food, but food didn't want to show up.\nAfter having a hard time, she finally found a candy!\nIt was not a regular candy, it was a BIG candy!\nHowever, a big Speaki was also there to keep her food from the others...\nCould little Speaki find her way to get a big candy, or regret making a bad decision?",
      },
      url: "https://sakotan.itch.io/speaki-wants-candy",
    },
    {
      id: "trickalstone",
      category: "offline",
      title: { ko: "트릭컬스톤", ja: "トリッカルストーン", en: "Trickalstone" },
      creator: "NAN",
      thumbnail: "assets/thumbs/trickalstone.png",
      released: "2025-05-26",
      platform: "PC",
      genres: ["CCG/TCG", "전략"],
      tags: ["1인용", "어려움"],
      description: {
        ko: "놀랄 만큼 쉽고 믿기 힘들 만큼 재미있습니다.\n\'트릭컬 리바이브\'와 \'하스스톤\'의 2차 창작 팬게임입니다.\n\n...사실 버터가 카드를 좋아하는 것만 골라 넣어서 쉽진 않습니다.",
        ja: "驚くほど簡単で、信じられないほど面白いです。\n『トリッカル:もちもちほっぺ大作戦』と『ハースストーン』の二次創作ファンゲームです。\n\n...実は、バターがカードの好きなものだけを選んで入れるのは簡単ではありません。",
        en: "It\'s surprisingly easy and unbelievably fun.\nThis is a fan game based on \'Trickcal:Chibi Go\' and \'Hearthstone\'.\n\n...In fact, it\'s not that easy because Butter only picked the ones she likes.",
      },
      url: "https://nan-itch.itch.io/trickalstone",
    },
    {
      id: "trickal-tycoon",
      category: "web",
      title: {
        ko: "트릭컬 타이쿤",
        ja: "トリッカルタイクーン",
        en: "Trickal Tycoon",
      },
      creator: "이데이",
      thumbnail: "assets/thumbs/trickal-tycoon.webp",
      released: "2026-09-23",
      platform: ["PC", "모바일"],
      genres: ["액션", "경영 시뮬레이션", "덱 빌딩"],
      tags: ["1인용", "다양함", "랭킹", "생존"],
      description: {
        ko: "에르핀과 함께 빵집을 운영하는 게임입니다.\n사도들을 고용하고, 꾸미기도 하고, 지점도 내고, 빵집을 위협하는 세력으로부터 지켜내고, 어딘가 이상한 세상도 가 보고... 빵집 운영 말고도 할 일이 많습니다!\n그것이 교주의 의무니까요.",
        ja: "エルフィンと一緒にパン屋を経営するゲームです。\n使徒たちを雇い、身支度を整え、支店も開き、パン屋を脅かす勢力から守り抜き、どこか不思議な世界にも足を踏み入れてみて··· パン屋の運営以外にもやることがたくさんあります！\nそれが教主の義務だからです。",
        en: "It's a game where you run a bakery with Erpin.\nHiring apostles, decorating the place, opening a branch, protecting the bakery from threats, and even exploring some strange world... There’s plenty more to do besides running the bakery!\nBecause that is what Master's duty about.",
      },
      url: "https://arca.live/b/trickcal/183849278",
    },
    {
      id: "sample-16",
      category: "web",
      title: "제목 16",
      creator: "제작자 16",
      released: "2025-03",
      genres: ["육성"],
      description: "샘플 설명입니다.",
      url: "https://example.com/",
    },

    {
      id: "sample-17",
      category: "offline",
      title: "제목 17",
      creator: "제작자 17",
      released: "2024-03",
      genres: ["캐주얼"],
      description: "샘플 설명입니다.",
      url: "https://example.com/",
    },
    {
      id: "sample-18",
      category: "offline",
      title: "제목 18",
      creator: "제작자 18",
      released: "2024-05",
      genres: ["퍼즐"],
      description: "샘플 설명입니다.",
      url: "https://example.com/",
    },
    {
      id: "sample-19",
      category: "offline",
      title: "제목 19",
      creator: "제작자 19",
      released: "2024-10",
      genres: ["리듬"],
      description: "샘플 설명입니다.",
      url: "https://example.com/",
    },

    {
      id: "sample-20",
      category: "offline",
      title: "제목 20",
      creator: "제작자 20",
      released: "2024-06",
      genres: ["어드벤처"],
      description: "샘플 설명입니다.",
      url: "https://example.com/",
    },
    {
      id: "sample-21",
      category: "offline",
      title: "제목 21",
      creator: "제작자 21",
      released: "2024-12",
      genres: ["RPG"],
      description: "샘플 설명입니다.",
      url: "https://example.com/",
    },
  ],
};
