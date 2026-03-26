export type MeterFillClassName = "expFill" | "hpFill" | "magicFill";

export type StatusCard = {
  label: string;
  value: string;
};

export type Meter = {
  label: string;
  valueLabel: string;
  width: number;
  fillClassName?: MeterFillClassName;
  levelLabel?: string;
  progressLabel?: string;
  nextLevelLabel?: string;
};

export type Location = {
  era: string;
  title: string;
  description: string;
  stats: string[];
  markerLabel: string;
  x: string;
  y: string;
  alternate?: boolean;
};

export type Quest = {
  type: string;
  title: string;
  description: string;
  chips: string[];
};

export type SideQuestLink = {
  title: string;
  href: string;
};

export type SideQuest = {
  type: string;
  title: string;
  description: string;
  chips: string[];
  links: SideQuestLink[];
};

export type Inventory = {
  title: string;
  items: string[];
  note: string;
};

export type Trophy = {
  year: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

export type CadArtifact = {
  type: string;
  title: string;
  description: string;
  highlights: string[];
  modelSrc: string;
  alt: string;
};

export type Hobby = {
  iconName: string;
  title: string;
  description: string;
};

export type ParallelStage = {
  era: string;
  title: string;
  description: string;
  stats: string[];
  markerLabel: string;
};

export type TechStackCategory = {
  title: string;
  items: string[];
};

export type PastProject = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  href: string;
  ctaLabel: string;
  opensPreview?: boolean;
  secondaryLinks?: {
    label: string;
    href: string;
  }[];
};

export type ContactLink = {
  label: string;
  href: string;
  ghost?: boolean;
};

export const systemMessages = [
  "SYSTEM > Career data loaded...",
  "SYSTEM > Hardware skill tree confirmed.",
  "SYSTEM > Frontend class unlocked.",
  "SYSTEM > Architecture skill updated.",
  "SYSTEM > Interactive portfolio ready.",
  "SYSTEM > 3D relic chamber ready.",
];

export const terminalLogs = {
  bus: [
    "> AUTO BUS summoned.",
    "> Mobility field knowledge synced.",
    "> Hardware reality check bonus +15.",
    "> Remote operation UI affinity detected.",
  ],
  drone: [
    "> DRONE summoned.",
    "> Monitoring / operations mindset boosted.",
    "> Incident response vision expanded.",
    "> Cross-functional radar online.",
  ],
  crystal: [
    "> CRYSTAL summoned.",
    "> Architecture insight highlighted.",
    "> Strategic pattern recognition activated.",
    "> Future quest route illuminated.",
  ],
} as const;

export type ModelKey = keyof typeof terminalLogs;

export const themes = ["theme-night", "theme-sunset", "theme-void"] as const;

export type SkyColorSlot = {
  id: number;
  label: string;
  topHex: string;
  bottomHex: string;
  swatchHex: string;
  glowRgb: string;
  theme: (typeof themes)[number];
};

export const skyColorSlots: SkyColorSlot[] = [
  {
    id: 0,
    label: "slot 00",
    topHex: "#173B6D",
    bottomHex: "#091325",
    swatchHex: "#2D7DD2",
    glowRgb: "45, 125, 210",
    theme: "theme-night",
  },
  {
    id: 1,
    label: "slot 01",
    topHex: "#5D2E8C",
    bottomHex: "#1D0C31",
    swatchHex: "#8B5CF6",
    glowRgb: "139, 92, 246",
    theme: "theme-void",
  },
  {
    id: 2,
    label: "slot 02",
    topHex: "#0F766E",
    bottomHex: "#06201E",
    swatchHex: "#14B8A6",
    glowRgb: "20, 184, 166",
    theme: "theme-night",
  },
  {
    id: 3,
    label: "slot 03",
    topHex: "#9A3412",
    bottomHex: "#2A1107",
    swatchHex: "#F97316",
    glowRgb: "249, 115, 22",
    theme: "theme-sunset",
  },
  {
    id: 4,
    label: "slot 04",
    topHex: "#BE185D",
    bottomHex: "#350717",
    swatchHex: "#EC4899",
    glowRgb: "236, 72, 153",
    theme: "theme-sunset",
  },
  {
    id: 5,
    label: "slot 05",
    topHex: "#854D0E",
    bottomHex: "#221405",
    swatchHex: "#EAB308",
    glowRgb: "234, 179, 8",
    theme: "theme-sunset",
  },
  {
    id: 6,
    label: "slot 06",
    topHex: "#166534",
    bottomHex: "#071B0E",
    swatchHex: "#22C55E",
    glowRgb: "34, 197, 94",
    theme: "theme-night",
  },
  {
    id: 7,
    label: "slot 07",
    topHex: "#7C2D12",
    bottomHex: "#240C04",
    swatchHex: "#F97316",
    glowRgb: "251, 146, 60",
    theme: "theme-sunset",
  },
  {
    id: 8,
    label: "slot 08",
    topHex: "#1D4ED8",
    bottomHex: "#091533",
    swatchHex: "#3B82F6",
    glowRgb: "59, 130, 246",
    theme: "theme-night",
  },
  {
    id: 9,
    label: "slot 09",
    topHex: "#7E22CE",
    bottomHex: "#220934",
    swatchHex: "#A855F7",
    glowRgb: "168, 85, 247",
    theme: "theme-void",
  },
  {
    id: 10,
    label: "slot 10",
    topHex: "#C2410C",
    bottomHex: "#351103",
    swatchHex: "#FB923C",
    glowRgb: "251, 146, 60",
    theme: "theme-sunset",
  },
  {
    id: 11,
    label: "slot 11",
    topHex: "#0F172A",
    bottomHex: "#020617",
    swatchHex: "#334155",
    glowRgb: "51, 65, 85",
    theme: "theme-void",
  },
] as const;

export const statusCards: StatusCard[] = [
  { label: "CLASS", value: "Frontend Engineer / Hardware Engineer" },
  {
    label: "MAIN QUEST",
    value: "自動運転の運行を支える監視・管理システムのフロントエンド開発",
  },
  { label: "SIDE QUEST", value: "kutsulab CTO / 革靴ECサイト開発・運用" },
  {
    label: "WORLD",
    value: "モビリティ・Webアプリケーション・ハードウェア・CAD領域",
  },
];

export const locations: Location[] = [
  {
    era: "STAGE 2015 - 2018",
    title: "Award Village",
    description:
      "学生時代にIoT・生活デザイン・ハッカソンで複数受賞。技術だけでなく、生活に届く体験設計も強みとして蓄積したフェーズ。",
    stats: [
      "学生奨励賞 / 最優秀賞 / 優秀賞を複数獲得",
      "IoT、家電、生活UX、ハードウェア試作に挑戦",
      "大学院で電気電子工学を専攻（回路設計・組み込みシステム）し修了",
    ],
    markerLabel: "2015",
    x: "18%",
    y: "64%",
  },
  {
    era: "STAGE 2018",
    title: "Hardware Garage",
    description:
      "モビリティ領域で車載ハードウェア担当としてスタート。車内環境センサー、電源 / 回路設計、現地取り付け、検証まで一気通貫で担当。",
    stats: [
      "電気回路設計 / 配線設計 / 部材選定",
      "2D / 3D CADを用いた設計・開発",
      "現地作業・トラブルシュート・再発防止まで対応",
    ],
    markerLabel: "2018",
    x: "34%",
    y: "52%",
  },
  {
    era: "STAGE 2020",
    title: "Frontend City",
    description:
      "フロントエンドへ転向。React / TypeScriptを中心に、自動運転の遠隔監視サービスや関連機能の実装・運用・テストに従事。",
    stats: [
      "React / TypeScript / Vite / Svelte",
      "単体テスト・E2Eテストの設計と運用",
      "要件定義から実装、リリース、改善まで担当",
    ],
    markerLabel: "2020",
    x: "51%",
    y: "42%",
  },
  {
    era: "STAGE 2024",
    title: "Quality Forge",
    description:
      "フロントエンド領域で、レビュー、開発標準化、オンボーディング、品質改善を継続推進。",
    stats: [
      "レビュー観点の整理とチーム内共有",
      "レビュー基準、リリース手順、環境構築資料を整備",
      "再発防止やテスト観点整理など品質改善を推進",
    ],
    markerLabel: "2024",
    x: "67%",
    y: "28%",
  },
  {
    era: "STAGE 2025 - NOW",
    title: "Architecture Citadel",
    description:
      "車載 / バック / フロントをまたぎ、アーキテクチャ方針と開発運用設計の両方を担うステージ。",
    stats: [
      "統合組織での役割整理・フロー設計・優先順位付け",
      "品質 / 保守性 / 拡張性を踏まえた技術方針の検討",
      "開発体験と保守運用を意識した改善を推進",
    ],
    markerLabel: "2025",
    x: "83%",
    y: "19%",
  },
  {
    era: "CURRENT STAGE",
    title: "Current Mission",
    description:
      "モビリティ領域を軸に、フロントエンド、アーキテクチャ設計、品質改善、運用設計をまたいで価値提供を継続している現在地。",
    stats: [
      "実装と設計判断の両方を担う開発推進",
      "品質改善、運用整理、保守性向上を継続",
      "本業と副業をまたぐ複線的な活動を継続",
    ],
    markerLabel: "NOW",
    x: "91%",
    y: "12%",
  },
];

export const parallelStages: ParallelStage[] = [
  {
    era: "PARALLEL ROUTE 2022",
    title: "kutsulab Founding",
    description:
      "kutsulab合同会社を設立し、ブランド運営と技術支援を並走させる副業ルートを立ち上げたフェーズ。",
    stats: [
      "kutsulab合同会社を設立",
      "EC / サービス運営の基盤づくりを開始",
      "技術と事業の両面から支援を開始",
    ],
    markerLabel: "2022",
  },
  {
    era: "PARALLEL ROUTE NOW",
    title: "kutsulab CTO",
    description:
      "kutsulab合同会社のCTOとして、ShopifyベースのEC / サービスサイト改善や足測定ツール開発を担当。",
    stats: [
      "パターンオーダー革靴ブランドのテーマ改修",
      "商品導線・カスタマイズ導線の改善",
      "足測定ツールの企画 / 設計 / 開発",
    ],
    markerLabel: "NOW",
  },
];

export const mainQuests: Quest[] = [
  {
    type: "MAIN QUEST",
    title: "Remote Operation System",
    description:
      "自動運転の遠隔監視・運行管理システムのフロントエンド開発に従事。要件整理、UI実装、運用改善、品質改善を一貫して担当し、現場運用を支えるシステムの構築と改善を推進。",
    chips: ["React", "TypeScript", "運用改善", "要件定義"],
  },
];

export const sideQuest: SideQuest = {
  type: "SIDE QUEST",
  title: "kutsulab CTO / Shopify Growth",
  description:
    "パターンオーダー革靴ブランドのEC / サービス運営に参画。テーマ改修、購入導線改善、ブランド発信、足測定ツール開発まで横断して担当。",
  chips: ["Shopify", "EC改善", "CTO", "足測定ツール"],
  links: [
    {
      title: "kutsulab 公式ショップ",
      href: "https://kutsulab.shop/",
    },
    {
      title: "kutsulab 紹介記事",
      href: "https://morinooto.jp/2022/02/16/kutsulab/",
    },
    {
      title: "kutsulab Instagram",
      href: "https://www.instagram.com/kutsulab_shoes/",
    },
  ],
};

export const inventories: Inventory[] = [
  {
    title: "Frontend Stack",
    items: ["TypeScript", "React", "Vite", "Cypress / Testing Library"],
    note: "UIの視認性に加え、運用時の確実性と保守性を重視した設計。",
  },
  {
    title: "Hardware Gear",
    items: ["電気電子回路設計", "配線 / 車載搭載", "2D / 3D CAD開発"],
    note: "現地稼働を前提に、机上検討で終わらせない設計スタンス。",
  },
];

export const trophies: Trophy[] = [
  {
    year: "2018",
    title: "浜松市ものづくりハッカソン 最優秀賞",
    description: "作品名：エレクトリカルプレート",
    href: "https://jellyware.jp/hamamatsuhack/2018/",
    linkLabel: "URL",
  },
  {
    year: "2016",
    title: "RECAIUS × ハードウェア ハンズオン・ハッカソン 最優秀賞",
    description: "作品名：いっしょCooking",
    href: "https://jellyware.jp/hackathon/recaius/index.html",
    linkLabel: "URL",
  },
  {
    year: "2016",
    title: "第3回ワイヤレス・アイデア・コンテスト 最優秀賞",
    description: "作品名：Life Assist Laundry Pole",
    href: "https://it.cqpub.co.jp/tse/201511OWA/?NV=KS",
    linkLabel: "URL",
  },
  {
    year: "2016",
    title: "第3回生活デザインコンテスト 優秀賞",
    description: "作品名：VFcom",
    href: "https://www.he.kanagawa-it.ac.jp/~masao/index.html%40p%3D337.html",
    linkLabel: "URL",
  },
  {
    year: "2015",
    title: "情報処理学会 CDS研究会 学生奨励賞",
    description: "論文：IoT技術を用いた「洗濯物取り込みロボット」の研究",
    href: "https://www.ipsj.or.jp/award/cds-award2.html",
    linkLabel: "URL",
  },
];

export const cadArtifacts: CadArtifact[] = [
  {
    type: "3D CAD MODEL",
    title: "Residential Exterior Study",
    description:
      "住宅の外観を立体で検討するために作った家のモデルです。住宅図面をもとに制作しました。",
    highlights: [
      "住宅形状の立体モデリング",
      "外観バランスの確認",
      "空間把握と面構成の調整",
    ],
    modelSrc: "/models/home_with_mtl.glb",
    alt: "家の3D CADモデル",
  },
  {
    type: "PRODUCT CAD MODEL",
    title: "Moonlight Saturn LED Lamp",
    description:
      "月をモチーフにしたフルカラーLED照明のモデルです。MDF版をレーザカットし色調節可能な月の照明に仕上げています。",
    highlights: [
      "月型照明のプロダクトモデリング",
      "フルカラーLED照明の筐体イメージ検討",
      "曲面を含む造形表現",
    ],
    modelSrc: "/models/moon-led-saturn.glb",
    alt: "月型のフルカラーLED照明の3D CADモデル",
  },
];

export const hobbies: Hobby[] = [
  {
    iconName: "set_meal",
    title: "釣り",
    description:
      "海釣りが好きでよく小田原に出かけます。小田原に行けば毎回何かしらの魚が釣れるので必ず楽しめます。釣れなければ網ですくいます。",
  },
  {
    iconName: "movie",
    title: "映画鑑賞",
    description:
      "お金がかかっている映画から、あまりかかっていない映画までなんでも見ます。",
  },
  {
    iconName: "construction",
    title: "工作",
    description:
      "手を動かして何か形にすることがとても好きです。アイデアを思いついた時にすぐに作り出したいので、センサーや開発ボードなど買っては家に溜め込んでいます。いずれ使うと信じて。",
  },
  {
    iconName: "grass",
    title: "草むしり",
    description:
      "家の周りは雑草がたくさん生えてくるので月2回くらいむしってます。以前は嫌いな作業でしたが、最近は見たことがない草が生えてくるので、ギリギリ興味が勝っています。",
  },
];

export const developmentBoardCategories: TechStackCategory[] = [
  {
    title: "Raspberry Pi",
    items: [
      "Raspberry Pi 2 Model B",
      "Raspberry Pi 3 Model B",
      "Raspberry Pi 3 Model B+",
      "Raspberry Pi 4 Model B",
      "Raspberry Pi Pico",
      "Raspberry Pi Zero",
    ],
  },
  {
    title: "Arduino / ESP32",
    items: [
      "Arduino Yún",
      "Arduino Mega 2560",
      "Arduino Uno",
      "Arduino Mini",
      "ESP32",
    ],
  },
  {
    title: "NVIDIA Jetson",
    items: ["NVIDIA Jetson Nano"],
  },
];

export const techStackCategories: TechStackCategory[] = [
  {
    title: "Frontend Stack / Quality",
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Svelte",
      "TypeScript",
      "Vite",
      "Biome",
      "ESLint",
      "Cypress / Testing Library",
      "Playwright",
    ],
  },
  {
    title: "Hardware / Electronics",
    items: ["電気電子回路設計", "配線"],
  },
  {
    title: "CAD / Digital Fabrication",
    items: ["Fusion 360", "2D / 3D CAD開発", "3D Printing", "Laser Cutter"],
  },
  {
    title: "Scripting / Device Control",
    items: ["Python"],
  },
  {
    title: "AI Coding Tools",
    items: ["Cursor", "Codex", "GitHub Copilot"],
  },
  {
    title: "Cloud / Infrastructure",
    items: [
      "Amazon API Gateway",
      "AWS Lambda",
      "Amazon DynamoDB",
      "Amazon EC2",
      "Amazon CloudFront",
      "Amazon Route 53",
      "AWS CodeCommit",
    ],
  },
  {
    title: "Quality Ops",
    items: ["SonarQube"],
  },
];

export const pastProjects: PastProject[] = [
  {
    eyebrow: "AI PHOTO FRAME",
    title: "宇宙猫召喚装置",
    subtitle: "電子工作",
    description:
      "Raspberry Pi 4 と Inky Impression で、生成画像の作成と表示をループさせるフォトフレーム。Fusion 360 で筐体を設計し、ファンを組み込んだ実機まで制作。",
    imageSrc: "/images/projects/space-cat-photo-frame.png",
    imageAlt: "宇宙猫召喚装置で表示する猫のアートワーク",
    href: "https://qiita.com/kyazoooo/items/3fa5e929ebf3d2c6e028",
    ctaLabel: "VIEW WORK",
    secondaryLinks: [{ label: "X", href: "https://x.com/kyazoooo" }],
  },
  {
    eyebrow: "PLAYABLE PROJECT",
    title: "トロールタワーバトル",
    subtitle: "ブラウザゲーム",
    description:
      "ブラウザで遊べる個人制作ゲーム。ステージにトロールを落として、どれだけたくさん積めるか挑戦！",
    imageSrc: "/images/projects/troll-tower-battle.png",
    imageAlt: "トロールタワーバトルのゲーム画面",
    href: "https://skazuno1205.github.io/troll-tower-battle/",
    ctaLabel: "PLAY GAME",
  },
  {
    eyebrow: "MEMORY DEVICE",
    title: "メモリアルタイムスリップ",
    subtitle: "電子工作",
    description:
      "スイッチと回転センサで過去の日付を選ぶと、その日に撮影した写真の中から1枚をランダムに電子ペーパーへ表示する思い出再生デバイス。",
    imageSrc: "/images/projects/memorial-time-slip.png",
    imageAlt: "メモリアルタイムスリップの表示イメージ",
    href: "/images/projects/memorial-time-slip.png",
    ctaLabel: "VIEW WORK",
    opensPreview: true,
  },
  {
    eyebrow: "LIGHTING OBJECT",
    title: "インフィニティミラーギア",
    subtitle: "電子工作",
    description:
      "インフィニティミラー内部にLED照明と回転する歯車を組み込んだアート作品",
    imageSrc: "/images/projects/infinity-mirror-gear.gif",
    imageAlt: "インフィニティミラーギアの発光表現",
    href: "/images/projects/infinity-mirror-gear.gif",
    ctaLabel: "VIEW WORK",
    opensPreview: true,
  },
  {
    eyebrow: "LIGHTING OBJECT",
    title: "LEDコースター",
    subtitle: "電子工作",
    description:
      "LEDが組み込まれたコースター。点灯パターンは複数あり電源を入れるたびに変化する",
    imageSrc: "/images/projects/led-coaster.gif",
    imageAlt: "LEDコースターの点灯イメージ",
    href: "/images/projects/led-coaster.gif",
    ctaLabel: "VIEW WORK",
    opensPreview: true,
  },
  {
    eyebrow: "LIGHTING OBJECT",
    title: "LEDボール",
    subtitle: "電子工作",
    description:
      "サッカーボールと同じ構造を持ち、３軸ジャイロセンサーの値からLEDのRGB値を調整。ボールを置く角度によって色を固定できる。",
    imageSrc: "/images/projects/led-ball.gif",
    imageAlt: "LEDボールの発光イメージ",
    href: "/images/projects/led-ball.gif",
    ctaLabel: "VIEW WORK",
    opensPreview: true,
  },
  {
    eyebrow: "LIGHTING OBJECT",
    title: "3coins月の魔改造ライト",
    subtitle: "電子工作",
    description:
      "3coinsの月ライトを分解し月の部分を利用。内部にフルカラーLEDを持ち回転センサーから各RGB値を制御し好きな色に調整できる。",
    imageSrc: "/images/projects/moon-light.gif",
    imageAlt: "月のライトの発光イメージ",
    href: "/images/projects/moon-light.gif",
    ctaLabel: "VIEW WORK",
    opensPreview: true,
  },
];

export const contactLinks: ContactLink[] = [
  { label: "FACEBOOK", href: "https://www.facebook.com/shota.kazuno.9" },
  { label: "X / SHOTA", href: "https://x.com/shota_k1205" },
  { label: "QIITA", href: "https://qiita.com/kyazoooo" },
  { label: "GITHUB", href: "https://github.com/skazuno1205" },
];

export const sceneModels: ModelKey[] = ["bus", "drone", "crystal"];
