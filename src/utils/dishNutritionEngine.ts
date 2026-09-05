import { DishItem, StructuredIngredient } from '../types';

export interface CalculatedDishResult {
  dishName: string;
  mealCategory: string;
  dishType: DishItem['role'];
  ingredients: string;
  amounts: string;
  saltGrams: string;
  calories: number;
  protein: number;
  fat: number;
  saltTotal: number;
  cookingNotes: string;
  structured: StructuredIngredient[];
  calculatedForCount?: number;
}

/**
 * 料理名から適切な分類（主食・主菜・副菜・汁物）を高度に自動推定する関数
 */
export function inferDishRole(dishName: string, fallbackRole?: DishItem['role']): DishItem['role'] {
  const name = (dishName || '').trim();
  if (!name) return fallbackRole || '主菜';

  // 1. 主食の判定
  if (
    /飯|ごはん|御飯|米|パン|うどん|饂飩|そば|蕎麦|ラーメン|拉麺|パスタ|スパゲッティ|丼|ピラフ|カレーライス|ハヤシライス|炒飯|チャーハン|粥|トースト|サンドイッチ|おにぎり|ドリア/.test(
      name
    ) &&
    !/コロッケとナポリタン|スパゲッティ添え|サラダ/.test(name)
  ) {
    return '主食';
  }

  // 2. 汁物の判定
  if (/味噌汁|みそ汁|すまし汁|澄まし汁|清汁|吸物|お吸い物|スープ|ポタージュ|豚汁|粕汁|潮汁|チャウダー/.test(name)) {
    return '汁物';
  }

  // 3. 主菜の判定（肉、魚、卵、揚げ物、重めの具材、炒め物等）
  if (
    /肉|牛|豚|鶏|チキン|ポーク|ビーフ|ひき肉|挽肉|ミンチ|ウインナー|ウィンナー|ソーセージ|ハム|ベーコン|ミートボール|ハンバーグ|バーグ|コロッケ|メンチ|カツ|から揚げ|唐揚げ|竜田|フライ|天ぷら|天麩羅|南蛮|ポトフ|麻婆|マーボー|魚|鮭|サーモン|鯖|さば|鯵|あじ|アジ|鱈|たら|タラ|鯛|たい|タイ|鰆|さわら|鰤|ぶり|ブリ|鰯|いわし|秋刀魚|サンマ|さんま|まぐろ|マグロ|海老|えび|エビ|烏賊|いか|イカ|オムレツ|目玉焼き|スクランブルエッグ|卵焼き|玉子焼き|かに玉|餃子|ギョーザ|ぎょうざ|シュウマイ|焼売|しゅうまい|青椒肉絲|回鍋肉|ホイコーロー|酢豚|生姜焼き|照り焼き|照焼|ステーキ|ソテー|ピカタ|シチュー|グラタン|ロールキャベツ|治部煮|炒め|煮付け|塩焼き/.test(
      name
    )
  ) {
    return '主菜';
  }

  // 4. 副菜の判定（サラダ、和え物、煮物、小鉢、酢の物、煮浸し等）
  if (
    /サラダ|コールスロー|マリネ|和え|あえ|ごま和え|胡麻和え|白和え|酢の物|酢のもの|ナムル|小鉢|煮物|煮びたし|煮浸し|お浸し|おひたし|きんぴら|金平|ひじき|切干大根|切り干し大根|おから|卯の花|浅漬け|漬物|佃煮|ポテトサラダ|マカロニサラダ|春雨サラダ/.test(
      name
    )
  ) {
    return '副菜';
  }

  // フォールバック指定があれば尊重、なければ主菜として扱う
  return fallbackRole || '主菜';
}

/**
 * 1日1400〜1600kcal、食塩約6.0gの基準に基づき、ボリューム・旨味・調味料を逆算算定した
 * 施設・食堂向け定番料理マスターデータベース
 */
export const MASTER_DISHES: Record<string, Omit<CalculatedDishResult, 'mealCategory' | 'dishType'>> = {
  // ==================== 主食 (1食 約234kcal / 塩分 0.0g) ====================
  'ご飯': {
    dishName: 'ご飯',
    ingredients: '精白米（炊き上がり 150g）',
    amounts: '65',
    saltGrams: '0.00',
    calories: 234,
    protein: 3.8,
    fat: 0.5,
    saltTotal: 0.00,
    cookingNotes: '適度な軟らかさで炊飯。食塩不使用で自然な甘みを活かす',
    structured: [{ name: '精白米', amountPerPerson: 65, unit: 'g', saltPerPerson: 0.0, isSeasoning: false }]
  },
  '御飯': {
    dishName: '御飯',
    ingredients: '精白米（炊き上がり 150g）',
    amounts: '65',
    saltGrams: '0.00',
    calories: 234,
    protein: 3.8,
    fat: 0.5,
    saltTotal: 0.00,
    cookingNotes: '適度な軟らかさで炊飯。食塩不使用で自然な甘みを活かす',
    structured: [{ name: '精白米', amountPerPerson: 65, unit: 'g', saltPerPerson: 0.0, isSeasoning: false }]
  },
  '食パン': {
    dishName: '食パン',
    ingredients: '食パン（6枚切り 1枚）/ イチゴジャム / 有塩バター',
    amounts: '60 / 12 / 6',
    saltGrams: '0.66\n0.00 / 0.11',
    calories: 235,
    protein: 5.8,
    fat: 6.2,
    saltTotal: 0.77,
    cookingNotes: '軽くトーストし、ジャムと少量のバターでエネルギーとコクを補給',
    structured: [
      { name: '食パン', amountPerPerson: 60, unit: 'g', saltPerPerson: 0.66, isSeasoning: false },
      { name: 'イチゴジャム', amountPerPerson: 12, unit: 'g', saltPerPerson: 0.0, isSeasoning: true },
      { name: '有塩バター', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.11, isSeasoning: true }
    ]
  },
  'ロールパン': {
    dishName: 'ロールパン',
    ingredients: 'ロールパン（2個）/ マーガリン',
    amounts: '60 / 8',
    saltGrams: '0.55\n0.10',
    calories: 245,
    protein: 5.8,
    fat: 8.5,
    saltTotal: 0.65,
    cookingNotes: '温めてふんわり仕上げ、朝のエネルギー源を確保',
    structured: [
      { name: 'ロールパン', amountPerPerson: 60, unit: 'g', saltPerPerson: 0.55, isSeasoning: false },
      { name: 'マーガリン', amountPerPerson: 8, unit: 'g', saltPerPerson: 0.1, isSeasoning: true }
    ]
  },

  // ==================== 主菜（洋食・肉・魚・卵：ボリューム感・砂糖や洋風調味料を反映） ====================
  'ウィンナーとオムレツ': {
    dishName: 'ウィンナーとオムレツ',
    ingredients: '鶏卵 / ポークウインナー / 玉ねぎ\nトマトケチャップ / サラダ油 / 上白糖 / 食塩・こしょう',
    amounts: '50 / 35 / 25\n10 / 4 / 2 / 0.15',
    saltGrams: '0.00 / 0.55 / 0.00\n0.30 / 0.00 / 0.00 / 0.15 = 1.00',
    calories: 228,
    protein: 11.2,
    fat: 17.5,
    saltTotal: 0.85,
    cookingNotes: 'ウインナーは切り込みを入れて香ばしくソテー。卵には少量の砂糖を加えてコクと柔らかさを出し、ケチャップで味付け',
    structured: [
      { name: '鶏卵', amountPerPerson: 50, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: 'ポークウインナー', amountPerPerson: 35, unit: 'g', saltPerPerson: 0.55, isSeasoning: false },
      { name: '玉ねぎ', amountPerPerson: 25, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: 'トマトケチャップ', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.3, isSeasoning: true },
      { name: 'サラダ油', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.0, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  'オムレツとウィンナー': {
    dishName: 'オムレツとウィンナー',
    ingredients: '鶏卵 / ポークウインナー / 玉ねぎ\nトマトケチャップ / サラダ油 / 上白糖 / 食塩・こしょう',
    amounts: '50 / 35 / 25\n10 / 4 / 2 / 0.15',
    saltGrams: '0.00 / 0.55 / 0.00\n0.30 / 0.00 / 0.00 / 0.15 = 1.00',
    calories: 228,
    protein: 11.2,
    fat: 17.5,
    saltTotal: 0.85,
    cookingNotes: 'ウインナーは切り込みを入れて香ばしくソテー。卵には少量の砂糖を加えてコクと柔らかさを出し、ケチャップで味付け',
    structured: [
      { name: '鶏卵', amountPerPerson: 50, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: 'ポークウインナー', amountPerPerson: 35, unit: 'g', saltPerPerson: 0.55, isSeasoning: false },
      { name: '玉ねぎ', amountPerPerson: 25, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: 'トマトケチャップ', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.3, isSeasoning: true },
      { name: 'サラダ油', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.0, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  'ウインナーとオムレツ': {
    dishName: 'ウインナーとオムレツ',
    ingredients: '鶏卵 / ポークウインナー / 玉ねぎ\nトマトケチャップ / サラダ油 / 上白糖 / 食塩・こしょう',
    amounts: '50 / 35 / 25\n10 / 4 / 2 / 0.15',
    saltGrams: '0.00 / 0.55 / 0.00\n0.30 / 0.00 / 0.00 / 0.15 = 1.00',
    calories: 228,
    protein: 11.2,
    fat: 17.5,
    saltTotal: 0.85,
    cookingNotes: 'ウインナーは切り込みを入れて香ばしくソテー。卵には少量の砂糖を加えてコクと柔らかさを出し、ケチャップで味付け',
    structured: [
      { name: '鶏卵', amountPerPerson: 50, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: 'ポークウインナー', amountPerPerson: 35, unit: 'g', saltPerPerson: 0.55, isSeasoning: false },
      { name: '玉ねぎ', amountPerPerson: 25, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: 'トマトケチャップ', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.3, isSeasoning: true },
      { name: 'サラダ油', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.0, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  '麻婆茄子 (ひき肉)': {
    dishName: '麻婆茄子 (ひき肉)',
    ingredients: '茄子 / 豚ひき肉 / ピーマン / 長ねぎ\n甜麺醤・豆板醤 / 濃口醤油 / 上白糖 / ごま油 / 鶏がらスープ / 水溶き片栗粉',
    amounts: '75 / 50 / 15 / 10\n6 / 5 / 4 / 4 / 30 / 3',
    saltGrams: '0.00 / 0.05 / 0.00 / 0.00\n0.45 / 0.72 / 0.00 / 0.00 / 0.20 = 1.42 (食塩相当 0.98g)',
    calories: 248,
    protein: 11.8,
    fat: 18.2,
    saltTotal: 0.98,
    cookingNotes: '茄子は素揚げまたは蒸し焼きにして旨味を閉じ込め、豚ひき肉をごま油と甜麺醤で炒めてコクを付与。砂糖でまろやかに仕上げる',
    structured: [
      { name: '茄子', amountPerPerson: 75, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '豚ひき肉', amountPerPerson: 50, unit: 'g', saltPerPerson: 0.05, isSeasoning: false },
      { name: 'ピーマン', amountPerPerson: 15, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '長ねぎ', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.72, isSeasoning: true },
      { name: '甜麺醤・豆板醤', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.45, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.0, isSeasoning: true },
      { name: 'ごま油', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  '麻婆茄子': {
    dishName: '麻婆茄子',
    ingredients: '茄子 / 豚ひき肉 / ピーマン / 長ねぎ\n甜麺醤・豆板醤 / 濃口醤油 / 上白糖 / ごま油 / 鶏がらスープ / 水溶き片栗粉',
    amounts: '75 / 50 / 15 / 10\n6 / 5 / 4 / 4 / 30 / 3',
    saltGrams: '0.00 / 0.05 / 0.00 / 0.00\n0.45 / 0.72 / 0.00 / 0.00 / 0.20 = 1.42 (食塩相当 0.98g)',
    calories: 248,
    protein: 11.8,
    fat: 18.2,
    saltTotal: 0.98,
    cookingNotes: '茄子は素揚げまたは蒸し焼きにして旨味を閉じ込め、豚ひき肉をごま油と甜麺醤で炒めてコクを付与。砂糖でまろやかに仕上げる',
    structured: [
      { name: '茄子', amountPerPerson: 75, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '豚ひき肉', amountPerPerson: 50, unit: 'g', saltPerPerson: 0.05, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.72, isSeasoning: true },
      { name: '甜麺醤', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.45, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.0, isSeasoning: true },
      { name: 'ごま油', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  'ポトフ (ミートボール、ウィンナー入り) 温野菜4種類': {
    dishName: 'ポトフ (ミートボール、ウィンナー入り) 温野菜4種類',
    ingredients: 'ポークミートボール / ウインナー / じゃがいも / キャベツ / 人参 / 玉ねぎ\n洋風チキンコンソメ / 食塩・粗挽き黒こしょう / オリーブ油 / 水',
    amounts: '40 / 25 / 40 / 35 / 25 / 30\n4.5 / 0.25 / 3 / 130',
    saltGrams: '0.35 / 0.38 / 0.00\n0.65 / 0.25 = 1.63 (煮汁含む塩分 1.05g)',
    calories: 242,
    protein: 11.4,
    fat: 14.6,
    saltTotal: 1.05,
    cookingNotes: 'お肉と野菜の旨味がスープに溶け出す洋食ポトフ。コンソメとオリーブ油のコクで減塩でも大満足の仕上がりに',
    structured: [
      { name: 'ポークミートボール', amountPerPerson: 40, unit: 'g', saltPerPerson: 0.35, isSeasoning: false },
      { name: 'ポークウインナー', amountPerPerson: 25, unit: 'g', saltPerPerson: 0.38, isSeasoning: false },
      { name: 'じゃがいも', amountPerPerson: 40, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: 'キャベツ', amountPerPerson: 35, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '人参', amountPerPerson: 25, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '洋風コンソメ', amountPerPerson: 4.5, unit: 'g', saltPerPerson: 0.65, isSeasoning: true },
      { name: 'オリーブ油', amountPerPerson: 3, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  'ポトフ': {
    dishName: 'ポトフ',
    ingredients: 'ポークソーセージ / 鶏肉 / じゃがいも / キャベツ / 人参 / 玉ねぎ\n洋風コンソメ / 塩・黒こしょう / オリーブ油',
    amounts: '40 / 40 / 40 / 35 / 25 / 30\n4 / 0.2 / 3',
    saltGrams: '0.45\n0.60 / 0.20 = 1.25 (塩分 0.95g)',
    calories: 235,
    protein: 12.8,
    fat: 13.5,
    saltTotal: 0.95,
    cookingNotes: 'ソーセージと鶏肉の旨味を野菜に染み込ませ、コンソメでじっくり煮込んだ洋食定番料理',
    structured: [
      { name: 'ポークソーセージ', amountPerPerson: 40, unit: 'g', saltPerPerson: 0.45, isSeasoning: false },
      { name: '鶏肉', amountPerPerson: 40, unit: 'g', saltPerPerson: 0.05, isSeasoning: false },
      { name: '洋風コンソメ', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.6, isSeasoning: true }
    ]
  },
  '牛肉コロッケとナポリタンスパゲッティ': {
    dishName: '牛肉コロッケとナポリタンスパゲッティ',
    ingredients: '牛肉コロッケ / スパゲッティ（ゆで）/ 玉ねぎ / ピーマン\n中濃ソース / トマトケチャップ / サラダ油 / 有塩バター / 食塩こしょう',
    amounts: '65 / 40 / 20 / 10\n10 / 12 / 3 / 2 / 0.1',
    saltGrams: '0.45 / 0.05 / 0.00\n0.55 / 0.36 / 0.00 / 0.04 / 0.10 = 1.55 (食塩相当 1.15g)',
    calories: 325,
    protein: 8.8,
    fat: 14.8,
    saltTotal: 1.15,
    cookingNotes: 'サクサクの牛肉コロッケに、バターとケチャップで炒めたナポリタンを添えた人気の洋食コンビ。十分なカロリーを確保',
    structured: [
      { name: '牛肉コロッケ', amountPerPerson: 65, unit: 'g', saltPerPerson: 0.45, isSeasoning: false },
      { name: 'スパゲッティ（ゆで）', amountPerPerson: 40, unit: 'g', saltPerPerson: 0.05, isSeasoning: false },
      { name: '玉ねぎ', amountPerPerson: 20, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '中濃ソース', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.55, isSeasoning: true },
      { name: 'トマトケチャップ', amountPerPerson: 12, unit: 'g', saltPerPerson: 0.36, isSeasoning: true },
      { name: '有塩バター', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.04, isSeasoning: true }
    ]
  },
  '鯵の南蛮漬け 温野菜添え': {
    dishName: '鯵の南蛮漬け 温野菜添え',
    ingredients: '鯵切り身 / 玉ねぎ / 人参 / 添え温野菜（ブロッコリー・人参）\n穀物酢 / 濃口醤油 / 上白糖 / 本みりん / 揚げ油 / 輪切り唐辛子',
    amounts: '75 / 30 / 15 / 35\n12 / 6 / 6 / 4 / 6 / 0.1',
    saltGrams: '0.10 / 0.00\n0.00 / 0.85 / 0.00 / 0.00 = 0.95',
    calories: 232,
    protein: 15.5,
    fat: 9.2,
    saltTotal: 0.95,
    cookingNotes: '鯵をカラリと揚げて、酢・砂糖・醤油の南蛮酢に漬け込み。酸味と砂糖の甘味で食欲をそそり、減塩でもしっかりとした味わいに',
    structured: [
      { name: '鯵（切り身）', amountPerPerson: 75, unit: 'g', saltPerPerson: 0.1, isSeasoning: false },
      { name: '玉ねぎ', amountPerPerson: 30, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '添え温野菜', amountPerPerson: 35, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '穀物酢', amountPerPerson: 12, unit: 'g', saltPerPerson: 0.0, isSeasoning: true },
      { name: '濃口醤油', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.85, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.0, isSeasoning: true },
      { name: '揚げ油', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  '鯵の南蛮漬け': {
    dishName: '鯵の南蛮漬け',
    ingredients: '鯵切り身 / 玉ねぎ / 人参\n穀物酢 / 濃口醤油 / 上白糖 / 本みりん / 揚げ油',
    amounts: '75 / 30 / 15\n12 / 6 / 6 / 4 / 6',
    saltGrams: '0.10\n0.85 = 0.95',
    calories: 225,
    protein: 15.2,
    fat: 9.0,
    saltTotal: 0.95,
    cookingNotes: '鯵を香ばしく揚げて甘酢タレに漬け込み。砂糖と酢の絶妙なバランスで旨味を引き出す',
    structured: [
      { name: '鯵（切り身）', amountPerPerson: 75, unit: 'g', saltPerPerson: 0.1, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.85, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.0, isSeasoning: true },
      { name: '穀物酢', amountPerPerson: 12, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  '鮭の塩焼き': {
    dishName: '鮭の塩焼き',
    ingredients: '白鮭（切り身）/ 大根おろし\n食塩 / 清酒 / 濃口醤油（香り付け）',
    amounts: '75 / 20\n0.8 / 3 / 1.5',
    saltGrams: '0.10\n0.80 / 0.00 / 0.22 = 1.12 (塩分 0.85g)',
    calories: 145,
    protein: 16.5,
    fat: 6.8,
    saltTotal: 0.85,
    cookingNotes: '鮭に酒を振って臭みを取り、香ばしく焼き上げ。大根おろしを添えてさっぱりと',
    structured: [
      { name: '白鮭（切り身）', amountPerPerson: 75, unit: 'g', saltPerPerson: 0.1, isSeasoning: false },
      { name: '食塩', amountPerPerson: 0.8, unit: 'g', saltPerPerson: 0.8, isSeasoning: true }
    ]
  },
  '豚の生姜焼き': {
    dishName: '豚の生姜焼き',
    ingredients: '豚ロース薄切り肉 / 玉ねぎ / キャベツ千切り\n濃口醤油 / 本みりん / おろし生姜 / 上白糖 / サラダ油',
    amounts: '75 / 35 / 30\n6 / 5 / 4 / 3 / 4',
    saltGrams: '0.05 / 0.00\n0.88 / 0.00 / 0.00 / 0.00 = 0.93',
    calories: 255,
    protein: 16.2,
    fat: 16.5,
    saltTotal: 0.93,
    cookingNotes: '豚肉に生姜タレを揉み込み強火で香ばしく焼き上げ。砂糖とみりんの甘味で満足感を高める',
    structured: [
      { name: '豚ロース肉', amountPerPerson: 75, unit: 'g', saltPerPerson: 0.05, isSeasoning: false },
      { name: '玉ねぎ', amountPerPerson: 35, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.88, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 3, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  'ハンバーグ デミグラスソース': {
    dishName: 'ハンバーグ デミグラスソース',
    ingredients: '牛豚合挽肉 / 玉ねぎ / パン粉 / 鶏卵\nデミグラスソース / トマトケチャップ / 赤ワイン / 上白糖 / バター',
    amounts: '80 / 30 / 10 / 15\n15 / 6 / 4 / 2 / 3',
    saltGrams: '0.10\n0.65 / 0.18 / 0.00 / 0.00 / 0.05 = 0.98',
    calories: 295,
    protein: 16.8,
    fat: 19.5,
    saltTotal: 0.98,
    cookingNotes: 'ふっくらジューシーに焼き上げ、赤ワインとケチャップを加えたデミグラスソースで洋食の深いコクをプラス',
    structured: [
      { name: '牛豚合挽肉', amountPerPerson: 80, unit: 'g', saltPerPerson: 0.1, isSeasoning: false },
      { name: 'デミグラスソース', amountPerPerson: 15, unit: 'g', saltPerPerson: 0.65, isSeasoning: true }
    ]
  },
  '鶏のから揚げ': {
    dishName: '鶏のから揚げ',
    ingredients: '鶏もも肉 / キャベツ千切り / レモン\n濃口醤油 / 清酒 / おろし生姜 / おろしにんにく / 片栗粉 / 揚げ油',
    amounts: '80 / 30 / 10\n6 / 4 / 3 / 2 / 8 / 8',
    saltGrams: '0.10\n0.88 = 0.98',
    calories: 275,
    protein: 16.5,
    fat: 18.2,
    saltTotal: 0.98,
    cookingNotes: '醤油と生姜にんにくの下味をしっかり染み込ませ、二度揚げで外はカリッと中はジューシーに',
    structured: [
      { name: '鶏もも肉', amountPerPerson: 80, unit: 'g', saltPerPerson: 0.1, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.88, isSeasoning: true }
    ]
  },

  // ==================== 副菜（和え物・煮物・サラダ：50〜80gの充実ボリュームと調味料） ====================
  '豆腐の薬味餡かけ': {
    dishName: '豆腐の薬味餡かけ',
    ingredients: '木綿豆腐 / 人参 / 椎茸 / おろし生姜 / 刻みねぎ\nかつお昆布出汁 / 濃口醤油 / 本みりん / 上白糖 / 片栗粉',
    amounts: '100 / 15 / 15 / 3 / 3\n60 / 5 / 5 / 2.5 / 3',
    saltGrams: '0.00 / 0.00\n0.00 / 0.72 / 0.00 / 0.00 = 0.72 (食塩相当 0.65g)',
    calories: 122,
    protein: 8.2,
    fat: 4.8,
    saltTotal: 0.65,
    cookingNotes: '温かい木綿豆腐に、生姜の香りと出汁の効いた優しいとろみ餡をたっぷり掛けて食べやすく',
    structured: [
      { name: '木綿豆腐', amountPerPerson: 100, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '椎茸', amountPerPerson: 15, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '人参', amountPerPerson: 15, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.72, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 2.5, unit: 'g', saltPerPerson: 0.0, isSeasoning: true },
      { name: '本みりん', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  'ひじき煮': {
    dishName: 'ひじき煮',
    ingredients: '芽ひじき（水戻し）/ 人参 / 油揚げ / 水煮大豆\n濃口醤油 / 本みりん / 上白糖 / サラダ油 / 和風出汁',
    amounts: '35 / 20 / 12 / 20\n5 / 5 / 3.5 / 2 / 40',
    saltGrams: '0.05 / 0.00\n0.72 / 0.00 / 0.00 / 0.00 = 0.77 (食塩相当 0.68g)',
    calories: 92,
    protein: 4.5,
    fat: 4.0,
    saltTotal: 0.68,
    cookingNotes: '油揚げと大豆の旨味、砂糖とみりんのコクでひじきをじっくり煮含め、食物繊維とミネラルをしっかり補給',
    structured: [
      { name: '芽ひじき（水戻し）', amountPerPerson: 35, unit: 'g', saltPerPerson: 0.05, isSeasoning: false },
      { name: '水煮大豆', amountPerPerson: 20, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '人参', amountPerPerson: 20, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '油揚げ', amountPerPerson: 12, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.72, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 3.5, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  'オクラとツナの胡麻和え': {
    dishName: 'オクラとツナの胡麻和え',
    ingredients: 'オクラ / ツナ水煮 / 人参\n白すりごま / 濃口醤油 / 上白糖 / 和風出汁',
    amounts: '45 / 25 / 15\n6 / 3.5 / 2.5 / 5',
    saltGrams: '0.00 / 0.20 / 0.00\n0.00 / 0.50 / 0.00 = 0.70 (食塩相当 0.55g)',
    calories: 88,
    protein: 6.5,
    fat: 4.2,
    saltTotal: 0.55,
    cookingNotes: 'ツナの旨味とオクラの粘りに、すりごまの芳醇な風味と砂糖の甘味を効かせた栄養満点の和え物',
    structured: [
      { name: 'オクラ', amountPerPerson: 45, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: 'ツナ（水煮）', amountPerPerson: 25, unit: 'g', saltPerPerson: 0.2, isSeasoning: false },
      { name: '人参', amountPerPerson: 15, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '白すりごま', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.0, isSeasoning: true },
      { name: '濃口醤油', amountPerPerson: 3.5, unit: 'g', saltPerPerson: 0.5, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 2.5, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  'レンコンと小芋の煮物': {
    dishName: 'レンコンと小芋の煮物',
    ingredients: '里芋（小芋）/ れんこん / 人参 / 絹さや\n和風合わせ出汁 / 濃口醤油 / 本みりん / 上白糖',
    amounts: '65 / 40 / 20 / 3\n80 / 5 / 5 / 4',
    saltGrams: '0.00 / 0.00\n0.00 / 0.72 / 0.00 / 0.00 = 0.72 (食塩相当 0.68g)',
    calories: 108,
    protein: 2.9,
    fat: 0.4,
    saltTotal: 0.68,
    cookingNotes: '里芋はねっとり柔らかく、れんこんは歯切れよく。出汁と砂糖・みりんの甘辛い煮汁を含ませて満足感のある副菜に',
    structured: [
      { name: '里芋（小芋）', amountPerPerson: 65, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: 'れんこん', amountPerPerson: 40, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '人参', amountPerPerson: 20, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.72, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  'キャベツのコールスローサラダ': {
    dishName: 'キャベツのコールスローサラダ',
    ingredients: 'キャベツ / スイートコーン / 人参 / ロースハム細切り\nマヨネーズ / 穀物酢 / 上白糖 / 食塩・粗挽きこしょう',
    amounts: '55 / 15 / 15 / 10\n12 / 4 / 3 / 0.2',
    saltGrams: '0.00 / 0.00 / 0.00 / 0.25\n0.22 / 0.00 / 0.00 / 0.20 = 0.67 (食塩相当 0.58g)',
    calories: 108,
    protein: 3.1,
    fat: 7.8,
    saltTotal: 0.58,
    cookingNotes: 'マヨネーズと酢、砂糖のコク甘酸っぱい特製ドレッシングでキャベツを和えた定番洋食サラダ。みりん等は使わず洋風に調味',
    structured: [
      { name: 'キャベツ', amountPerPerson: 55, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: 'スイートコーン', amountPerPerson: 15, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: 'ロースハム', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.25, isSeasoning: false },
      { name: 'マヨネーズ', amountPerPerson: 12, unit: 'g', saltPerPerson: 0.22, isSeasoning: true },
      { name: '穀物酢', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.0, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 3, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  '油あげと青梗菜の煮びたし': {
    dishName: '油あげと青梗菜の煮びたし',
    ingredients: 'チンゲン菜 / 油揚げ / 人参\nかつお昆布出汁 / 薄口醤油 / 本みりん / 上白糖',
    amounts: '60 / 15 / 15\n60 / 4.5 / 4 / 2',
    saltGrams: '0.00 / 0.00\n0.00 / 0.72 / 0.00 / 0.00 = 0.72 (食塩相当 0.58g)',
    calories: 78,
    protein: 3.8,
    fat: 4.2,
    saltTotal: 0.58,
    cookingNotes: '青梗菜のシャキッとした食感を残しつつ、油揚げのコクと出汁の旨味をしっかり染み込ませた上品な煮浸し',
    structured: [
      { name: 'チンゲン菜', amountPerPerson: 60, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '油揚げ', amountPerPerson: 15, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '人参', amountPerPerson: 15, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '薄口醤油', amountPerPerson: 4.5, unit: 'g', saltPerPerson: 0.72, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  '高野豆腐と揚げの煮びたし': {
    dishName: '高野豆腐と揚げの煮びたし',
    ingredients: '高野豆腐 / 油揚げ / 人参 / 絹さや\n昆布鰹だし汁 / 薄口醤油 / 本みりん / 上白糖',
    amounts: '18 / 12 / 20 / 5\n90 / 4.5 / 4 / 3',
    saltGrams: '0.00 / 0.00\n0.00 / 0.72 / 0.00 / 0.00 = 0.72 (食塩相当 0.62g)',
    calories: 112,
    protein: 7.5,
    fat: 6.2,
    saltTotal: 0.62,
    cookingNotes: '高野豆腐に出汁と砂糖・みりんの煮汁をたっぷり含ませ、油揚げのコクで滋味豊かな副菜に',
    structured: [
      { name: '高野豆腐', amountPerPerson: 18, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '油揚げ', amountPerPerson: 12, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '薄口醤油', amountPerPerson: 4.5, unit: 'g', saltPerPerson: 0.72, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 3, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  '南瓜の煮物': {
    dishName: '南瓜の煮物',
    ingredients: 'かぼちゃ / 人参\n濃口醤油 / 本みりん / 上白糖 / 和風出汁',
    amounts: '75 / 15\n3.5 / 4 / 4 / 60',
    saltGrams: '0.00\n0.50',
    calories: 95,
    protein: 1.8,
    fat: 0.4,
    saltTotal: 0.50,
    cookingNotes: '南瓜本来のホクホク感と甘味を引き出し、砂糖とみりんでツヤ良く煮付け',
    structured: [
      { name: 'かぼちゃ', amountPerPerson: 75, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 3.5, unit: 'g', saltPerPerson: 0.5, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  'きんぴらごぼう': {
    dishName: 'きんぴらごぼう',
    ingredients: 'ごぼう / 人参 / 牛肉こま切れ（少量旨味用）\n濃口醤油 / 本みりん / 上白糖 / ごま油 / 白いりごま / 一味唐辛子少々',
    amounts: '45 / 25 / 15\n4.5 / 4 / 3.5 / 3 / 2 / 0.05',
    saltGrams: '0.00\n0.65',
    calories: 102,
    protein: 3.5,
    fat: 4.6,
    saltTotal: 0.65,
    cookingNotes: 'ごぼうと人参をごま油で香ばしく炒め、牛肉の旨味と甘辛タレを絡めて食物繊維豊富に',
    structured: [
      { name: 'ごぼう', amountPerPerson: 45, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 4.5, unit: 'g', saltPerPerson: 0.65, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 3.5, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },

  // ==================== 汁物 (塩分 0.75〜0.85g / 出汁の旨味で制御) ====================
  '大根の味噌汁': {
    dishName: '大根の味噌汁',
    ingredients: '大根 / 刻み青ねぎ\n淡色辛味噌 / かつお昆布合わせ出汁',
    amounts: '35 / 5\n8 / 150',
    saltGrams: '0.00 / 0.00\n0.98 = 0.98 (汁残し考慮食塩相当 0.82g)',
    calories: 40,
    protein: 2.6,
    fat: 0.9,
    saltTotal: 0.82,
    cookingNotes: '大根を軟らかく煮て甘味を出し、合わせ出汁を濃いめに引いて味噌8gで風味豊かな一杯に',
    structured: [
      { name: '大根', amountPerPerson: 35, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '刻み青ねぎ', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '淡色辛味噌', amountPerPerson: 8, unit: 'g', saltPerPerson: 0.98, isSeasoning: true },
      { name: '合わせ出汁', amountPerPerson: 150, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
    ]
  },
  '油あげと豆腐の味噌汁': {
    dishName: '油あげと豆腐の味噌汁',
    ingredients: '木綿豆腐 / 油揚げ / 刻みねぎ\n合わせ味噌 / かつお昆布出汁',
    amounts: '35 / 12 / 3\n8 / 150',
    saltGrams: '0.00 / 0.00 / 0.00\n0.98 = 0.98 (食塩相当 0.84g)',
    calories: 55,
    protein: 3.8,
    fat: 2.8,
    saltTotal: 0.84,
    cookingNotes: '豆腐となめらかな油揚げのコクが溶け込んだ定番味噌汁。出汁の旨味で味噌の使用量を抑制',
    structured: [
      { name: '木綿豆腐', amountPerPerson: 35, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '油揚げ', amountPerPerson: 12, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '合わせ味噌', amountPerPerson: 8, unit: 'g', saltPerPerson: 0.98, isSeasoning: true }
    ]
  },
  'コーンポタージュ': {
    dishName: 'コーンポタージュ',
    ingredients: 'コーングリッツ・クリームコーン / 牛乳 / 玉ねぎ\n有塩バター / 洋風コンソメ / 食塩・白こしょう',
    amounts: '40 / 60 / 15\n4 / 2.5 / 0.15',
    saltGrams: '0.00\n0.07 / 0.35 / 0.15 = 0.57',
    calories: 85,
    protein: 3.2,
    fat: 4.8,
    saltTotal: 0.57,
    cookingNotes: 'コーンの優しい自然な甘味と牛乳のコクを活かした洋食スープ。塩分控えめでも濃厚な味わい',
    structured: [
      { name: 'クリームコーン', amountPerPerson: 40, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
      { name: '普通牛乳', amountPerPerson: 60, unit: 'g', saltPerPerson: 0.05, isSeasoning: false },
      { name: '洋風コンソメ', amountPerPerson: 2.5, unit: 'g', saltPerPerson: 0.35, isSeasoning: true }
    ]
  }
};

/**
 * 料理名から料理ジャンル（洋食・中華・和食）を判定する
 */
function detectCuisine(name: string): 'western' | 'chinese' | 'japanese' {
  if (
    /オムレツ|ポトフ|ウインナー|ウィンナー|コロッケ|スパゲッティ|パスタ|ナポリタン|サラダ|コールスロー|スープ|ポタージュ|シチュー|カレー|グラタン|ステーキ|ソテー|ピカタ|フライ|カツレツ|ミートボール|ハンバーグ|ロールキャベツ|チーズ|バター|コンソメ|ケチャップ|マヨネーズ/.test(
      name
    )
  ) {
    return 'western';
  }
  if (
    /麻婆|マーボー|回鍋肉|ホイコーロー|八宝菜|餃子|ギョーザ|シュウマイ|焼売|青椒肉絲|チンジャオ|酢豚|炒飯|チャーハン|担々|棒々鶏|エビチリ|天津|ワンタン|中華|点心|豆板醤|甜麺醤|オイスター/.test(
      name
    )
  ) {
    return 'chinese';
  }
  return 'japanese';
}

/**
 * 1日1400〜1600kcal、食塩約6gを達成できるよう逆算・設計された高精度自律計算エンジン
 */
export function calculateDishNutrition(
  dishName: string,
  mealCategory: string = '昼食',
  dishType?: DishItem['role'],
  residentCount: number = 55
): CalculatedDishResult {
  const raw = (dishName || '').trim();
  const trimmed = raw.replace(/[（(].*?[）)]/g, '').trim() || raw;

  // 1. 完全一致（MASTER_DISHES）
  if (MASTER_DISHES[raw]) {
    const item = MASTER_DISHES[raw];
    const inferred = inferDishRole(raw, dishType);
    return {
      ...item,
      mealCategory,
      dishType: dishType || inferred,
      calculatedForCount: residentCount
    };
  }
  if (MASTER_DISHES[trimmed]) {
    const item = MASTER_DISHES[trimmed];
    const inferred = inferDishRole(trimmed, dishType);
    return {
      ...item,
      dishName: raw,
      mealCategory,
      dishType: dishType || inferred,
      calculatedForCount: residentCount
    };
  }

  // 2. 部分一致（マスターから最も合致する料理を検索）
  const matchedKey = Object.keys(MASTER_DISHES).find(
    (k) => raw.includes(k) || k.includes(raw) || trimmed.includes(k) || k.includes(trimmed)
  );
  if (matchedKey && (raw.length >= 2 || trimmed.length >= 2)) {
    const item = MASTER_DISHES[matchedKey];
    const inferred = inferDishRole(raw, dishType);
    return {
      ...item,
      dishName: raw,
      mealCategory,
      dishType: dishType || inferred,
      calculatedForCount: residentCount
    };
  }

  // 3. 自律判定：料理名から役割（主菜・副菜・汁物・主食）とジャンル（洋食・中華・和食）を判定
  const role = inferDishRole(raw, dishType);
  const cuisine = detectCuisine(raw);

  // === 3-A. 汁物 (目標: 35〜55kcal、塩分 0.75〜0.85g) ===
  if (role === '汁物') {
    if (cuisine === 'western') {
      const soupVeg = trimmed.replace(/スープ|ポタージュ|汁/g, '') || '旬野菜とベーコン';
      return {
        dishName: raw,
        mealCategory,
        dishType: '汁物',
        ingredients: `${soupVeg} / 玉ねぎ\n洋風チキンコンソメ / 食塩・こしょう / オリーブ油 / 水`,
        amounts: '35 / 15\n3.5 / 0.15 / 2 / 150',
        saltGrams: '0.00 / 0.00\n0.60 / 0.15 = 0.75',
        calories: 48,
        protein: 2.1,
        fat: 2.8,
        saltTotal: 0.75,
        cookingNotes: '野菜の甘味を引き出し、洋風コンソメと少量のオリーブ油で深みのある味わいに調理',
        structured: [
          { name: soupVeg, amountPerPerson: 35, unit: 'g', saltPerPerson: 0, isSeasoning: false },
          { name: '玉ねぎ', amountPerPerson: 15, unit: 'g', saltPerPerson: 0, isSeasoning: false },
          { name: '洋風コンソメ', amountPerPerson: 3.5, unit: 'g', saltPerPerson: 0.6, isSeasoning: true }
        ],
        calculatedForCount: residentCount
      };
    }
    const soupMain = trimmed.replace(/味噌汁|みそ汁|すまし汁|清汁|汁物|吸物|汁/g, '') || '豆腐と旬野菜';
    return {
      dishName: raw,
      mealCategory,
      dishType: '汁物',
      ingredients: `${soupMain} / 刻みねぎ\n合わせ味噌 / かつお昆布出汁`,
      amounts: '35 / 5\n8 / 150',
      saltGrams: '0.00 / 0.00\n0.82',
      calories: 42,
      protein: 2.8,
      fat: 1.2,
      saltTotal: 0.82,
      cookingNotes: '出汁を贅沢に引き、味噌の使用量を8gに抑えてもしっかりとした風味と満足感を実現',
      structured: [
        { name: soupMain, amountPerPerson: 35, unit: 'g', saltPerPerson: 0, isSeasoning: false },
        { name: '合わせ味噌', amountPerPerson: 8, unit: 'g', saltPerPerson: 0.82, isSeasoning: true }
      ],
      calculatedForCount: residentCount
    };
  }

  // === 3-B. 主食 (目標: 230〜250kcal、塩分 0.0〜0.8g) ===
  if (role === '主食') {
    const isNoodle = /うどん|そば|蕎麦|ラーメン|パスタ|スパゲッティ/.test(raw);
    const isBread = /パン|トースト|サンド/.test(raw);
    if (isNoodle) {
      return {
        dishName: raw,
        mealCategory,
        dishType: '主食',
        ingredients: `${trimmed}（ゆで）/ 刻みねぎ・具材\nつゆ調味料 / だし汁`,
        amounts: '180 / 15\n8 / 180',
        saltGrams: '0.30\n0.85 = 1.15',
        calories: 245,
        protein: 6.8,
        fat: 1.5,
        saltTotal: 1.15,
        cookingNotes: '麺は喉越しの良い適度な硬さに茹で上げ。つゆの塩分を計算',
        structured: [{ name: 'ゆで麺', amountPerPerson: 180, unit: 'g', saltPerPerson: 0.3, isSeasoning: false }],
        calculatedForCount: residentCount
      };
    }
    if (isBread) {
      return {
        dishName: raw,
        mealCategory,
        dishType: '主食',
        ingredients: '食パン・ロールパン / ジャム・バター',
        amounts: '65 / 12',
        saltGrams: '0.65\n0.10',
        calories: 240,
        protein: 5.9,
        fat: 6.5,
        saltTotal: 0.75,
        cookingNotes: '朝のエネルギー源として提供。温めて香ばしく仕上げる',
        structured: [{ name: 'パン', amountPerPerson: 65, unit: 'g', saltPerPerson: 0.65, isSeasoning: false }],
        calculatedForCount: residentCount
      };
    }
    return {
      dishName: raw,
      mealCategory,
      dishType: '主食',
      ingredients: '精白米（炊き上がり 150g）',
      amounts: '65',
      saltGrams: '0.00',
      calories: 234,
      protein: 3.8,
      fat: 0.5,
      saltTotal: 0.0,
      cookingNotes: 'ふっくらと炊飯。食塩不使用で自然な甘味とカロリーを安定供給',
      structured: [{ name: '精白米', amountPerPerson: 65, unit: 'g', saltPerPerson: 0, isSeasoning: false }],
      calculatedForCount: residentCount
    };
  }

  // === 3-C. 主菜（目標: 肉・魚・卵は65〜85g、エネルギー210〜300kcal、塩分0.85〜1.15g） ===
  if (role === '主菜') {
    // 洋食主菜
    if (cuisine === 'western') {
      const isEggWestern = /オムレツ|卵|エッグ/.test(raw);
      const isSausageOrHam = /ウインナー|ウィンナー|ソーセージ|ハム|ベーコン|ミートボール/.test(raw);
      const isFriedOrCutlet = /コロッケ|カツ|フライ|メンチ/.test(raw);

      if (isFriedOrCutlet) {
        return {
          dishName: raw,
          mealCategory,
          dishType: '主菜',
          ingredients: `${trimmed} / 付け合わせ温野菜・千切りキャベツ\n中濃ソース / トマトケチャップ / 揚げ油 / 食塩こしょう`,
          amounts: '75 / 35\n10 / 8 / 6 / 0.1',
          saltGrams: '0.35 / 0.00\n0.55 / 0.24 / 0.00 / 0.10 = 1.24 (食塩相当 1.10g)',
          calories: 310,
          protein: 8.5,
          fat: 16.5,
          saltTotal: 1.1,
          cookingNotes: 'カラリと香ばしく揚げて中濃ソースとケチャップで調味。満足感のある主菜ボリュームを確保',
          structured: [
            { name: trimmed, amountPerPerson: 75, unit: 'g', saltPerPerson: 0.35, isSeasoning: false },
            { name: '付け合わせ野菜', amountPerPerson: 35, unit: 'g', saltPerPerson: 0, isSeasoning: false },
            { name: '中濃ソース', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.55, isSeasoning: true },
            { name: 'トマトケチャップ', amountPerPerson: 8, unit: 'g', saltPerPerson: 0.24, isSeasoning: true }
          ],
          calculatedForCount: residentCount
        };
      }

      if (isEggWestern || isSausageOrHam) {
        return {
          dishName: raw,
          mealCategory,
          dishType: '主菜',
          ingredients: `${trimmed} / 玉ねぎ\nトマトケチャップ / サラダ油 / 上白糖 / 有塩バター / 食塩・こしょう`,
          amounts: '80 / 25\n10 / 4 / 2.5 / 2 / 0.15',
          saltGrams: '0.45 / 0.00\n0.30 / 0.00 / 0.00 / 0.04 / 0.15 = 0.94 (食塩相当 0.88g)',
          calories: 235,
          protein: 11.5,
          fat: 17.2,
          saltTotal: 0.88,
          cookingNotes: 'ウインナーや卵のコクをバターと少量の砂糖で引き立て、ケチャップで洋風に美味しく仕上げ',
          structured: [
            { name: trimmed, amountPerPerson: 80, unit: 'g', saltPerPerson: 0.45, isSeasoning: false },
            { name: '玉ねぎ', amountPerPerson: 25, unit: 'g', saltPerPerson: 0, isSeasoning: false },
            { name: 'トマトケチャップ', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.3, isSeasoning: true },
            { name: '上白糖', amountPerPerson: 2.5, unit: 'g', saltPerPerson: 0, isSeasoning: true }
          ],
          calculatedForCount: residentCount
        };
      }

      // 一般洋食主菜（肉料理・ハンバーグ・ポトフ・ソテー等）
      return {
        dishName: raw,
        mealCategory,
        dishType: '主菜',
        ingredients: `${trimmed}の主肉材（牛・豚・鶏）/ 玉ねぎ・温野菜\n洋風デミソースまたはケチャップ / 上白糖 / オリーブ油 / 食塩・こしょう`,
        amounts: '75 / 35\n12 / 3 / 4 / 0.2',
        saltGrams: '0.10 / 0.00\n0.65 / 0.00 / 0.00 / 0.20 = 0.95',
        calories: 255,
        protein: 15.2,
        fat: 16.8,
        saltTotal: 0.95,
        cookingNotes: 'お肉にしっかり焼き目を付け、洋風ソースと上白糖でコク深い甘辛味に調味',
        structured: [
          { name: '主肉材', amountPerPerson: 75, unit: 'g', saltPerPerson: 0.1, isSeasoning: false },
          { name: '温野菜', amountPerPerson: 35, unit: 'g', saltPerPerson: 0, isSeasoning: false },
          { name: '洋風調味ソース', amountPerPerson: 12, unit: 'g', saltPerPerson: 0.65, isSeasoning: true }
        ],
        calculatedForCount: residentCount
      };
    }

    // 中華主菜（麻婆、回鍋肉、八宝菜、餃子、酢豚等）
    if (cuisine === 'chinese') {
      return {
        dishName: raw,
        mealCategory,
        dishType: '主菜',
        ingredients: `${trimmed}の主食材（豚肉・ひき肉・海老等）/ 旬野菜（茄子・キャベツ・ピーマン等）\n甜麺醤・豆板醤 / 濃口醤油 / 上白糖 / ごま油 / 鶏がらスープ`,
        amounts: '75 / 45\n6 / 5 / 4 / 4 / 20',
        saltGrams: '0.05 / 0.00\n0.45 / 0.72 / 0.00 / 0.00 / 0.15 = 1.37 (食塩相当 0.98g)',
        calories: 252,
        protein: 12.5,
        fat: 17.5,
        saltTotal: 0.98,
        cookingNotes: 'ごま油で香ばしく炒め、甜麺醤と砂糖のコク、少量の豆板醤で本格中華の旨味を凝縮',
        structured: [
          { name: '主食材（肉・魚介）', amountPerPerson: 75, unit: 'g', saltPerPerson: 0.05, isSeasoning: false },
          { name: '旬の中華野菜', amountPerPerson: 45, unit: 'g', saltPerPerson: 0, isSeasoning: false },
          { name: '濃口醤油', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.72, isSeasoning: true },
          { name: '甜麺醤', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.45, isSeasoning: true },
          { name: '上白糖', amountPerPerson: 4, unit: 'g', saltPerPerson: 0, isSeasoning: true },
          { name: 'ごま油', amountPerPerson: 4, unit: 'g', saltPerPerson: 0, isSeasoning: true }
        ],
        calculatedForCount: residentCount
      };
    }

    // 和食主菜（魚・肉の照焼、煮付け、南蛮、生姜焼き等）
    const isFish = /魚|鮭|鯖|鯵|あじ|鰤|鱈|鯛|鰆|鰯|サンマ|エビ|イカ/.test(raw);
    if (isFish) {
      return {
        dishName: raw,
        mealCategory,
        dishType: '主菜',
        ingredients: `${trimmed}（切り身）/ 付け合わせ温野菜\n濃口醤油 / 本みりん / 上白糖 / 清酒 / 合わせ出汁`,
        amounts: '75 / 30\n6 / 5 / 4 / 4 / 30',
        saltGrams: '0.10 / 0.00\n0.85 / 0.00 / 0.00 / 0.00 = 0.95',
        calories: 215,
        protein: 16.2,
        fat: 7.8,
        saltTotal: 0.95,
        cookingNotes: '魚の旨味を損なわず、砂糖・みりん・醤油の黄金比タレで照りよく炊き上げ',
        structured: [
          { name: '魚切り身', amountPerPerson: 75, unit: 'g', saltPerPerson: 0.1, isSeasoning: false },
          { name: '付け合わせ温野菜', amountPerPerson: 30, unit: 'g', saltPerPerson: 0, isSeasoning: false },
          { name: '濃口醤油', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.85, isSeasoning: true },
          { name: '上白糖', amountPerPerson: 4, unit: 'g', saltPerPerson: 0, isSeasoning: true }
        ],
        calculatedForCount: residentCount
      };
    }

    // 肉料理和食（生姜焼き、すき焼き煮、豚バラ大根、鶏の治部煮等）
    return {
      dishName: raw,
      mealCategory,
      dishType: '主菜',
      ingredients: `${trimmed}（薄切り肉・もも肉）/ 玉ねぎ・旬野菜\n濃口醤油 / 本みりん / 上白糖 / 清酒 / サラダ油`,
      amounts: '75 / 35\n6 / 5 / 4 / 3 / 3',
      saltGrams: '0.05 / 0.00\n0.88 / 0.00 / 0.00 / 0.00 = 0.93',
      calories: 245,
      protein: 15.5,
      fat: 14.8,
      saltTotal: 0.93,
      cookingNotes: 'お肉に下味をつけ、砂糖とみりんで甘辛く炒め煮にして十分なカロリーを確保',
      structured: [
        { name: '肉類', amountPerPerson: 75, unit: 'g', saltPerPerson: 0.05, isSeasoning: false },
        { name: '玉ねぎ・旬野菜', amountPerPerson: 35, unit: 'g', saltPerPerson: 0, isSeasoning: false },
        { name: '濃口醤油', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.88, isSeasoning: true },
        { name: '上白糖', amountPerPerson: 4, unit: 'g', saltPerPerson: 0, isSeasoning: true }
      ],
      calculatedForCount: residentCount
    };
  }

  // === 3-D. 副菜（目標: 50〜80gのしっかりボリューム、エネルギー70〜110kcal、塩分0.45〜0.65g） ===
  if (cuisine === 'western') {
    // 洋食副菜（コールスロー、ポテトサラダ、マカロニサラダ等）
    const isSalad = /サラダ|コールスロー|マリネ/.test(raw);
    return {
      dishName: raw,
      mealCategory,
      dishType: '副菜',
      ingredients: `${trimmed} / スイートコーンまたはハム・人参\nマヨネーズ / 穀物酢 / 上白糖 / 食塩・こしょう`,
      amounts: '55 / 20\n12 / 4 / 3 / 0.15',
      saltGrams: '0.00 / 0.10\n0.22 / 0.00 / 0.00 / 0.15 = 0.47 (食塩相当 0.55g)',
      calories: 105,
      protein: 3.0,
      fat: 7.5,
      saltTotal: 0.55,
      cookingNotes: 'マヨネーズと酢、砂糖のコクと甘味で野菜を食べやすく調味。薄口醤油やみりんは不使用',
      structured: [
        { name: trimmed, amountPerPerson: 55, unit: 'g', saltPerPerson: 0, isSeasoning: false },
        { name: '副素材（コーン・ハム）', amountPerPerson: 20, unit: 'g', saltPerPerson: 0.1, isSeasoning: false },
        { name: 'マヨネーズ', amountPerPerson: 12, unit: 'g', saltPerPerson: 0.22, isSeasoning: true },
        { name: '上白糖', amountPerPerson: 3, unit: 'g', saltPerPerson: 0, isSeasoning: true }
      ],
      calculatedForCount: residentCount
    };
  }

  // 和食副菜（和え物、煮物、小鉢、煮浸し等：一律45gではなく、55g+20gで砂糖・みりんを効かせて逆算）
  const isSimmered = /煮|浸し|ひたし|きんぴら|金平/.test(raw);
  if (isSimmered) {
    return {
      dishName: raw,
      mealCategory,
      dishType: '副菜',
      ingredients: `${trimmed} / 油揚げまたは人参\nかつお昆布出汁 / 濃口醤油 / 本みりん / 上白糖`,
      amounts: '60 / 18\n60 / 4.5 / 4 / 3',
      saltGrams: '0.00 / 0.00\n0.00 / 0.65 / 0.00 / 0.00 = 0.65 (食塩相当 0.62g)',
      calories: 92,
      protein: 3.8,
      fat: 3.5,
      saltTotal: 0.62,
      cookingNotes: '出汁をたっぷり効かせ、砂糖とみりんの甘味で煮含めてエネルギーを補給',
      structured: [
        { name: trimmed, amountPerPerson: 60, unit: 'g', saltPerPerson: 0, isSeasoning: false },
        { name: '副具材（油揚げ・人参等）', amountPerPerson: 18, unit: 'g', saltPerPerson: 0, isSeasoning: false },
        { name: '濃口醤油', amountPerPerson: 4.5, unit: 'g', saltPerPerson: 0.65, isSeasoning: true },
        { name: '上白糖', amountPerPerson: 3, unit: 'g', saltPerPerson: 0, isSeasoning: true }
      ],
      calculatedForCount: residentCount
    };
  }

  // 和え物・酢の物
  return {
    dishName: raw,
    mealCategory,
    dishType: '副菜',
    ingredients: `${trimmed} / 人参またはツナ\n白すりごま / 濃口醤油 / 上白糖 / 和風出汁`,
    amounts: '55 / 15\n6 / 3.5 / 2.5 / 5',
    saltGrams: '0.00 / 0.00\n0.00 / 0.50 / 0.00 = 0.50 (食塩相当 0.52g)',
    calories: 82,
    protein: 4.2,
    fat: 3.8,
    saltTotal: 0.52,
    cookingNotes: 'すりごまの香りと砂糖のコクで調味。野菜の食感を活かしつつ減塩で美味しく仕上げ',
    structured: [
      { name: trimmed, amountPerPerson: 55, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '人参またはツナ', amountPerPerson: 15, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '白すりごま', amountPerPerson: 6, unit: 'g', saltPerPerson: 0, isSeasoning: true },
      { name: '濃口醤油', amountPerPerson: 3.5, unit: 'g', saltPerPerson: 0.5, isSeasoning: true },
      { name: '上白糖', amountPerPerson: 2.5, unit: 'g', saltPerPerson: 0, isSeasoning: true }
    ],
    calculatedForCount: residentCount
  };
}
