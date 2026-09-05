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

// 高齢者施設（70〜90代・1日塩分6.5g以下基準厳守）の定番料理マスターデータ
export const MASTER_DISHES: Record<string, Omit<CalculatedDishResult, 'mealCategory' | 'dishType'>> = {
  // 主食
  'ご飯': {
    dishName: 'ご飯',
    ingredients: '精白米（炊き上がり 150g）',
    amounts: '65',
    saltGrams: '0.00',
    calories: 234,
    protein: 3.8,
    fat: 0.5,
    saltTotal: 0.00,
    cookingNotes: '高齢者の咀嚼・嚥下に配慮し、加水量1.5倍でふっくら軟らかめに炊飯',
    structured: [{ name: '精白米', amountPerPerson: 65, unit: 'g', saltPerPerson: 0.00, isSeasoning: false }]
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
    cookingNotes: '高齢者の咀嚼・嚥下に配慮し、加水量1.5倍でふっくら軟らかめに炊飯',
    structured: [{ name: '精白米', amountPerPerson: 65, unit: 'g', saltPerPerson: 0.00, isSeasoning: false }]
  },
  '軟飯': {
    dishName: '軟飯',
    ingredients: '精白米（炊き上がり 160g）',
    amounts: '55',
    saltGrams: '0.00',
    calories: 198,
    protein: 3.2,
    fat: 0.4,
    saltTotal: 0.00,
    cookingNotes: '米1に対して水2の割合で柔らかく炊飯。むせ込みを予防',
    structured: [{ name: '精白米', amountPerPerson: 55, unit: 'g', saltPerPerson: 0.00, isSeasoning: false }]
  },
  '全粥': {
    dishName: '全粥',
    ingredients: '精白米（全粥 200g）',
    amounts: '40',
    saltGrams: '0.00',
    calories: 142,
    protein: 2.4,
    fat: 0.3,
    saltTotal: 0.00,
    cookingNotes: '米1に対して水5の全粥。粒立ちを残しつつ滑らかに調理',
    structured: [{ name: '精白米', amountPerPerson: 40, unit: 'g', saltPerPerson: 0.00, isSeasoning: false }]
  },
  '食パン': {
    dishName: '食パン',
    ingredients: '食パン（6枚切り 1枚）/ イチゴジャム',
    amounts: '60 / 12',
    saltGrams: '0.66\n0.00',
    calories: 188,
    protein: 5.6,
    fat: 2.6,
    saltTotal: 0.66,
    cookingNotes: '耳を切り落とすか軽くトーストし、ジャムで喉越しよく提供',
    structured: [
      { name: '食パン', amountPerPerson: 60, unit: 'g', saltPerPerson: 0.66, isSeasoning: false },
      { name: 'イチゴジャム', amountPerPerson: 12, unit: 'g', saltPerPerson: 0.00, isSeasoning: true }
    ]
  },
  'ロールパン': {
    dishName: 'ロールパン',
    ingredients: 'ロールパン（2個）/ マーガリン',
    amounts: '60 / 5',
    saltGrams: '0.55\n0.07',
    calories: 225,
    protein: 5.8,
    fat: 7.2,
    saltTotal: 0.62,
    cookingNotes: '温めてふんわり仕上げ、嚥下しやすいよう一口大に切り分け',
    structured: [
      { name: 'ロールパン', amountPerPerson: 60, unit: 'g', saltPerPerson: 0.55, isSeasoning: false },
      { name: '低塩マーガリン', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.07, isSeasoning: true }
    ]
  },

  // 卵・加工肉・朝食定番（ユーザーご指定の重要料理）
  'オムレツとウィンナー': {
    dishName: 'オムレツとウィンナー',
    ingredients: '鶏卵 / ポークウインナー / 玉ねぎ\nトマトケチャップ / サラダ油 / こしょう',
    amounts: '50 / 20 / 20\n5 / 3 / 0.02',
    saltGrams: '0.00 / 0.38\n0.16',
    calories: 198,
    protein: 8.9,
    fat: 15.6,
    saltTotal: 0.54,
    cookingNotes: '卵は牛乳を少し加えてふんわり蒸し焼き。ウインナーは切り込みを入れて食べやすく。ケチャップはスプーン計量で減塩を徹底',
    structured: [
      { name: '鶏卵', amountPerPerson: 50, unit: 'g', saltPerPerson: 0.00, isSeasoning: false },
      { name: 'ポークウインナー', amountPerPerson: 20, unit: 'g', saltPerPerson: 0.38, isSeasoning: false },
      { name: '玉ねぎ', amountPerPerson: 20, unit: 'g', saltPerPerson: 0.00, isSeasoning: false },
      { name: 'トマトケチャップ', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.16, isSeasoning: true },
      { name: 'サラダ油', amountPerPerson: 3, unit: 'g', saltPerPerson: 0.00, isSeasoning: true }
    ]
  },
  'オムレツとウインナー': {
    dishName: 'オムレツとウインナー',
    ingredients: '鶏卵 / ポークウインナー / 玉ねぎ\nトマトケチャップ / サラダ油 / こしょう',
    amounts: '50 / 20 / 20\n5 / 3 / 0.02',
    saltGrams: '0.00 / 0.38\n0.16',
    calories: 198,
    protein: 8.9,
    fat: 15.6,
    saltTotal: 0.54,
    cookingNotes: '卵は牛乳を少し加えてふんわり蒸し焼き。ウインナーは切り込みを入れて食べやすく。ケチャップはスプーン計量で減塩を徹底',
    structured: [
      { name: '鶏卵', amountPerPerson: 50, unit: 'g', saltPerPerson: 0.00, isSeasoning: false },
      { name: 'ポークウインナー', amountPerPerson: 20, unit: 'g', saltPerPerson: 0.38, isSeasoning: false },
      { name: '玉ねぎ', amountPerPerson: 20, unit: 'g', saltPerPerson: 0.00, isSeasoning: false },
      { name: 'トマトケチャップ', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.16, isSeasoning: true },
      { name: 'サラダ油', amountPerPerson: 3, unit: 'g', saltPerPerson: 0.00, isSeasoning: true }
    ]
  },
  '出汁巻き卵': {
    dishName: '出汁巻き卵',
    ingredients: '鶏卵 / かつお昆布だし汁\n薄口醤油 / みりん / サラダ油',
    amounts: '50 / 20\n2 / 2 / 2',
    saltGrams: '0.00\n0.32',
    calories: 115,
    protein: 6.8,
    fat: 8.5,
    saltTotal: 0.32,
    cookingNotes: '出汁を贅沢に効かせて塩分を0.3g前後に抑制。しっとり柔らかく喉越し良く仕上げる',
    structured: [
      { name: '鶏卵', amountPerPerson: 50, unit: 'g', saltPerPerson: 0.00, isSeasoning: false },
      { name: 'かつお昆布だし汁', amountPerPerson: 20, unit: 'g', saltPerPerson: 0.00, isSeasoning: false },
      { name: '薄口醤油', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.32, isSeasoning: true },
      { name: 'みりん', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.00, isSeasoning: true }
    ]
  },
  'スクランブルエッグ': {
    dishName: 'スクランブルエッグ',
    ingredients: '鶏卵 / 牛乳\n有塩バター / 塩 / こしょう',
    amounts: '50 / 10\n4 / 0.15 / 0.01',
    saltGrams: '0.00\n0.07 + 0.15 = 0.22',
    calories: 128,
    protein: 6.9,
    fat: 10.2,
    saltTotal: 0.22,
    cookingNotes: '弱火で半熟状に優しく加熱。牛乳でクリーミーにし塩分を低く抑える',
    structured: [
      { name: '鶏卵', amountPerPerson: 50, unit: 'g', saltPerPerson: 0.00, isSeasoning: false },
      { name: '普通牛乳', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.00, isSeasoning: false },
      { name: '有塩バター', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.07, isSeasoning: true },
      { name: '塩', amountPerPerson: 0.15, unit: 'g', saltPerPerson: 0.15, isSeasoning: true }
    ]
  },

  // 副菜（ユーザーご指定の重要料理）
  '高野豆腐と揚げの煮びたし': {
    dishName: '高野豆腐と揚げの煮びたし',
    ingredients: '高野豆腐 / 油揚げ / 人参 / 絹さや\n薄口醤油 / みりん / 昆布だし汁',
    amounts: '15 / 10 / 15 / 5\n3 / 3 / 80',
    saltGrams: '0.00\n0.48',
    calories: 92,
    protein: 6.8,
    fat: 5.2,
    saltTotal: 0.48,
    cookingNotes: '高野豆腐は一口大に含め煮にし出汁をたっぷり含ませパサつき防止。油揚げは油抜きして塩分・脂質をカット',
    structured: [
      { name: '高野豆腐', amountPerPerson: 15, unit: 'g', saltPerPerson: 0.00, isSeasoning: false },
      { name: '油揚げ', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.00, isSeasoning: false },
      { name: '人参', amountPerPerson: 15, unit: 'g', saltPerPerson: 0.00, isSeasoning: false },
      { name: '薄口醤油', amountPerPerson: 3, unit: 'g', saltPerPerson: 0.48, isSeasoning: true },
      { name: '昆布だし汁', amountPerPerson: 80, unit: 'g', saltPerPerson: 0.00, isSeasoning: true }
    ]
  },
  '高野豆腐と揚げの煮浸し': {
    dishName: '高野豆腐と揚げの煮浸し',
    ingredients: '高野豆腐 / 油揚げ / 人参 / 絹さや\n薄口醤油 / みりん / 昆布だし汁',
    amounts: '15 / 10 / 15 / 5\n3 / 3 / 80',
    saltGrams: '0.00\n0.48',
    calories: 92,
    protein: 6.8,
    fat: 5.2,
    saltTotal: 0.48,
    cookingNotes: '高野豆腐は一口大に含め煮にし出汁をたっぷり含ませパサつき防止。油揚げは油抜きして塩分・脂質をカット',
    structured: [
      { name: '高野豆腐', amountPerPerson: 15, unit: 'g', saltPerPerson: 0.00, isSeasoning: false },
      { name: '油揚げ', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.00, isSeasoning: false },
      { name: '人参', amountPerPerson: 15, unit: 'g', saltPerPerson: 0.00, isSeasoning: false },
      { name: '薄口醤油', amountPerPerson: 3, unit: 'g', saltPerPerson: 0.48, isSeasoning: true },
      { name: '昆布だし汁', amountPerPerson: 80, unit: 'g', saltPerPerson: 0.00, isSeasoning: true }
    ]
  },

  // 魚料理（主菜）
  '鮭の塩焼き': {
    dishName: '鮭の塩焼き',
    ingredients: '白鮭（甘塩・生換算）\n薄口醤油（仕上げ風味付け）',
    amounts: '60\n1',
    saltGrams: '0.60\n0.16',
    calories: 110,
    protein: 13.5,
    fat: 4.8,
    saltTotal: 0.76,
    cookingNotes: '塩分を抑えた甘口鮭を使用、醤油はスプレー噴霧で表面に香り付けして減塩',
    structured: [
      { name: '白鮭', amountPerPerson: 60, unit: 'g', saltPerPerson: 0.60, isSeasoning: false },
      { name: '薄口醤油', amountPerPerson: 1, unit: 'g', saltPerPerson: 0.16, isSeasoning: true }
    ]
  },
  '鯖のみそ煮': {
    dishName: '鯖のみそ煮',
    ingredients: 'サバ（生切り身）/ 生姜\n赤味噌 / 濃口醤油 / みりん / 砂糖 / 酒',
    amounts: '70 / 2\n5 / 2 / 4 / 3 / 5',
    saltGrams: '0.00\n0.62 / 0.29',
    calories: 198,
    protein: 15.2,
    fat: 12.1,
    saltTotal: 0.91,
    cookingNotes: '皮目に隠し包丁を入れて食べやすく。生姜風味を際立たせ味噌・醤油の使用量を削減',
    structured: [
      { name: 'サバ切り身', amountPerPerson: 70, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '生姜', amountPerPerson: 2, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '赤味噌', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.62, isSeasoning: true },
      { name: '濃口醤油', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.29, isSeasoning: true }
    ]
  },
  '鯖の味噌煮': {
    dishName: '鯖の味噌煮',
    ingredients: 'サバ（生切り身）/ 生姜\n赤味噌 / 濃口醤油 / みりん / 砂糖 / 酒',
    amounts: '70 / 2\n5 / 2 / 4 / 3 / 5',
    saltGrams: '0.00\n0.62 / 0.29',
    calories: 198,
    protein: 15.2,
    fat: 12.1,
    saltTotal: 0.91,
    cookingNotes: '皮目に隠し包丁を入れて食べやすく。生姜風味を際立たせ味噌・醤油の使用量を削減',
    structured: [
      { name: 'サバ切り身', amountPerPerson: 70, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '生姜', amountPerPerson: 2, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '赤味噌', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.62, isSeasoning: true },
      { name: '濃口醤油', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.29, isSeasoning: true }
    ]
  },
  '鰆の西京焼き': {
    dishName: '鰆の西京焼き',
    ingredients: 'サワラ（切り身）\n西京白味噌 / みりん / 清酒',
    amounts: '70\n10 / 3 / 3',
    saltGrams: '0.00\n0.65',
    calories: 158,
    protein: 14.8,
    fat: 6.9,
    saltTotal: 0.65,
    cookingNotes: '甘口の西京味噌を使い塩分を抑制。焦げないよう遠火でふっくら焼き上げる',
    structured: [
      { name: 'サワラ切り身', amountPerPerson: 70, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '西京白味噌', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.65, isSeasoning: true }
    ]
  },
  '赤魚の煮付け': {
    dishName: '赤魚の煮付け',
    ingredients: '赤魚（切り身）/ 生姜\n濃口醤油 / みりん / 砂糖 / だし汁',
    amounts: '70 / 2\n4 / 4 / 2 / 40',
    saltGrams: '0.00\n0.58',
    calories: 124,
    protein: 13.6,
    fat: 2.8,
    saltTotal: 0.58,
    cookingNotes: '落とし蓋をして煮汁を回し、短時間で味を含ませて身を固くしないよう配慮',
    structured: [
      { name: '赤魚切り身', amountPerPerson: 70, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.58, isSeasoning: true }
    ]
  },
  '白身魚のフライ': {
    dishName: '白身魚のフライ',
    ingredients: 'タラ（切り身）/ 小麦粉 / 鶏卵 / パン粉\nノンオイルタルタルソース / 揚げ油',
    amounts: '60 / 5 / 5 / 8\n10 / 8',
    saltGrams: '0.15\n0.35',
    calories: 185,
    protein: 12.8,
    fat: 9.4,
    saltTotal: 0.50,
    cookingNotes: 'きめ細かいパン粉で油切れ良く。低塩タルタルソースでコクと酸味をプラス',
    structured: [
      { name: 'マダラ切り身', amountPerPerson: 60, unit: 'g', saltPerPerson: 0.15, isSeasoning: false },
      { name: 'ノンオイルタルタル', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.35, isSeasoning: true }
    ]
  },

  // 肉料理（主菜）
  '豚の生姜焼き': {
    dishName: '豚の生姜焼き',
    ingredients: '豚もも薄切り肉 / 玉ねぎ / おろし生姜\n濃口醤油 / みりん / 料理酒 / サラダ油',
    amounts: '60 / 30 / 3\n5 / 4 / 3 / 2',
    saltGrams: '0.00\n0.72',
    calories: 178,
    protein: 13.8,
    fat: 8.9,
    saltTotal: 0.72,
    cookingNotes: '脂身の少ない豚もも肉を一口大にカット。生姜と玉ねぎの甘みで醤油量を控えて減塩',
    structured: [
      { name: '豚もも肉薄切り', amountPerPerson: 60, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '玉ねぎ', amountPerPerson: 30, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.72, isSeasoning: true }
    ]
  },
  '豚生姜焼き': {
    dishName: '豚生姜焼き',
    ingredients: '豚もも薄切り肉 / 玉ねぎ / おろし生姜\n濃口醤油 / みりん / 料理酒 / サラダ油',
    amounts: '60 / 30 / 3\n5 / 4 / 3 / 2',
    saltGrams: '0.00\n0.72',
    calories: 178,
    protein: 13.8,
    fat: 8.9,
    saltTotal: 0.72,
    cookingNotes: '脂身の少ない豚もも肉を一口大にカット。生姜と玉ねぎの甘みで醤油量を控えて減塩',
    structured: [
      { name: '豚もも肉薄切り', amountPerPerson: 60, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '玉ねぎ', amountPerPerson: 30, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.72, isSeasoning: true }
    ]
  },
  'ハンバーグ': {
    dishName: 'ハンバーグ',
    ingredients: '合挽き肉 / 玉ねぎ / パン粉 / 鶏卵 / 牛乳\n和風おろしポン酢（減塩）/ サラダ油',
    amounts: '60 / 25 / 6 / 6 / 8\n10 / 2',
    saltGrams: '0.12\n0.60',
    calories: 195,
    protein: 12.4,
    fat: 11.8,
    saltTotal: 0.72,
    cookingNotes: '豆腐または牛乳を含ませたパン粉でふんわり柔らかく捏ねる。和風おろしでさっぱり減塩',
    structured: [
      { name: '牛豚合挽肉', amountPerPerson: 60, unit: 'g', saltPerPerson: 0.12, isSeasoning: false },
      { name: '玉ねぎ', amountPerPerson: 25, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '減塩和風ポン酢', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.60, isSeasoning: true }
    ]
  },
  '鶏の唐揚げ': {
    dishName: '鶏の唐揚げ',
    ingredients: '鶏もも肉（皮なし一口大）/ おろし生姜 / にんにく\n濃口醤油 / 清酒 / 片栗粉 / 揚げ油',
    amounts: '70 / 2 / 1\n4 / 3 / 8 / 6',
    saltGrams: '0.00\n0.58',
    calories: 175,
    protein: 15.1,
    fat: 8.6,
    saltTotal: 0.58,
    cookingNotes: '皮を除いて脂質を抑え、生姜風味を効かせて下味の醤油を最小限に。柔らかく二度揚げ',
    structured: [
      { name: '鶏もも肉（皮なし）', amountPerPerson: 70, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.58, isSeasoning: true }
    ]
  },
  '肉じゃが': {
    dishName: '肉じゃが',
    ingredients: '豚こま肉 / じゃがいも / 人参 / 玉ねぎ / しらたき\n濃口醤油 / みりん / 砂糖 / 出汁',
    amounts: '40 / 70 / 20 / 30 / 15\n5 / 4 / 3 / 60',
    saltGrams: '0.00\n0.72',
    calories: 185,
    protein: 8.5,
    fat: 5.4,
    saltTotal: 0.72,
    cookingNotes: 'じゃがいもは面取りして崩れを防ぎ、出汁でじっくり含め煮。しらたきは短くカット',
    structured: [
      { name: '豚こま肉', amountPerPerson: 40, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: 'じゃがいも', amountPerPerson: 70, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.72, isSeasoning: true }
    ]
  },

  // 汁物
  '豆腐とわかめの味噌汁': {
    dishName: '豆腐とわかめの味噌汁',
    ingredients: '木綿豆腐 / カットわかめ / 青ねぎ\n淡色辛味噌 / 合わせ出汁',
    amounts: '25 / 1 / 3\n6 / 150',
    saltGrams: '0.00\n0.74',
    calories: 32,
    protein: 2.3,
    fat: 0.8,
    saltTotal: 0.74,
    cookingNotes: '鰹と昆布の一番だしを濃いめに引き、味噌を6gに抑えて減塩と風味を両立',
    structured: [
      { name: '木綿豆腐', amountPerPerson: 25, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: 'カットわかめ', amountPerPerson: 1, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '淡色辛味噌', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.74, isSeasoning: true },
      { name: '合わせ出汁', amountPerPerson: 150, unit: 'g', saltPerPerson: 0, isSeasoning: true }
    ]
  },
  '玉ねぎと麩の味噌汁': {
    dishName: '玉ねぎと麩の味噌汁',
    ingredients: '玉ねぎ / 焼き麩 / 長ねぎ\n淡色辛味噌 / 昆布かつおだし汁',
    amounts: '20 / 2 / 5\n6 / 150',
    saltGrams: '0.00\n0.74',
    calories: 34,
    protein: 2.1,
    fat: 0.6,
    saltTotal: 0.74,
    cookingNotes: '出汁を濃いめに引いて旨味を引き出し、味噌使用量を6gに抑えて減塩',
    structured: [
      { name: '玉ねぎ', amountPerPerson: 20, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '焼き麩', amountPerPerson: 2, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '長ねぎ', amountPerPerson: 5, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '淡色辛味噌', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.74, isSeasoning: true },
      { name: '合わせ出汁', amountPerPerson: 150, unit: 'g', saltPerPerson: 0, isSeasoning: true }
    ]
  },
  '豚汁': {
    dishName: '豚汁',
    ingredients: '豚バラ肉 / 大根 / 人参 / こんにゃく / ごぼう / 青ねぎ\n信州味噌 / 合わせだし汁',
    amounts: '20 / 25 / 15 / 15 / 10 / 3\n7 / 150',
    saltGrams: '0.00\n0.85',
    calories: 78,
    protein: 4.8,
    fat: 4.2,
    saltTotal: 0.85,
    cookingNotes: '根菜類は薄切りにして軟らかく加熱。豚肉の旨味を活かし味噌量をコントロール',
    structured: [
      { name: '豚肉薄切り', amountPerPerson: 20, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '大根・人参', amountPerPerson: 40, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '信州味噌', amountPerPerson: 7, unit: 'g', saltPerPerson: 0.85, isSeasoning: true }
    ]
  },
  '清汁（すましじる）': {
    dishName: '清汁（すましじる）',
    ingredients: '小松菜 / えのきたけ\n薄口醤油 / 塩 / 高純度だし汁',
    amounts: '15 / 10\n2 / 0.3 / 150',
    saltGrams: '0.00\n0.32 + 0.30 = 0.62',
    calories: 18,
    protein: 1.1,
    fat: 0.2,
    saltTotal: 0.62,
    cookingNotes: '一番だしを贅沢に用い塩分0.6gに抑制。小松菜は小口切り、えのきは短寸カットで喉越し良く',
    structured: [
      { name: '小松菜', amountPerPerson: 15, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: 'えのきたけ', amountPerPerson: 10, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '薄口醤油', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.32, isSeasoning: true },
      { name: '塩', amountPerPerson: 0.3, unit: 'g', saltPerPerson: 0.30, isSeasoning: true },
      { name: '高純度一番だし汁', amountPerPerson: 150, unit: 'g', saltPerPerson: 0, isSeasoning: true }
    ]
  },

  // 定番小鉢・副菜
  'ほうれん草のおひたし': {
    dishName: 'ほうれん草のおひたし',
    ingredients: 'ほうれん草 / 人参\n薄口醤油 / かつお昆布だし汁 / かつお節',
    amounts: '45 / 10\n2 / 20 / 0.5',
    saltGrams: '0.00\n0.32',
    calories: 25,
    protein: 1.8,
    fat: 0.3,
    saltTotal: 0.32,
    cookingNotes: '出汁割り醤油で全体に味を行き渡らせ、直接醤油をかけるよりも大幅に減塩',
    structured: [
      { name: 'ほうれん草', amountPerPerson: 45, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '薄口醤油', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.32, isSeasoning: true }
    ]
  },
  'ほうれん草の胡麻和え': {
    dishName: 'ほうれん草の胡麻和え',
    ingredients: 'ほうれん草 / 人参\nすり白ごま / 濃口醤油 / 砂糖',
    amounts: '45 / 10\n4 / 2.5 / 2',
    saltGrams: '0.00\n0.36',
    calories: 48,
    protein: 2.2,
    fat: 2.4,
    saltTotal: 0.36,
    cookingNotes: '炒りたてのすりごまの芳醇な香りで減塩を補正。野菜は水気をよく絞り水っぽさを防止',
    structured: [
      { name: 'ほうれん草', amountPerPerson: 45, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: 'すり白ごま', amountPerPerson: 4, unit: 'g', saltPerPerson: 0, isSeasoning: true },
      { name: '濃口醤油', amountPerPerson: 2.5, unit: 'g', saltPerPerson: 0.36, isSeasoning: true }
    ]
  },
  'キャベツの和え物': {
    dishName: 'キャベツの和え物',
    ingredients: 'キャベツ / 人参\nポン酢しょうゆ（減塩）/ 煎りごま',
    amounts: '40 / 10\n4 / 1',
    saltGrams: '0.00\n0.24',
    calories: 32,
    protein: 1.2,
    fat: 0.8,
    saltTotal: 0.24,
    cookingNotes: '蒸し煮で繊維を軟らかく加熱。柑橘の酸味と胡麻の香ばしさを効かせて塩分を低減',
    structured: [
      { name: 'キャベツ', amountPerPerson: 40, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '人参', amountPerPerson: 10, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '減塩ポン酢', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.24, isSeasoning: true },
      { name: '煎りごま', amountPerPerson: 1, unit: 'g', saltPerPerson: 0.00, isSeasoning: true }
    ]
  },
  'ひじきの煮物': {
    dishName: 'ひじきの煮物',
    ingredients: '乾燥ひじき / 人参 / 油揚げ / 大豆水煮\n濃口醤油 / みりん / 砂糖 / 出汁',
    amounts: '4 / 15 / 8 / 15\n3 / 3 / 2 / 50',
    saltGrams: '0.00\n0.43',
    calories: 62,
    protein: 3.4,
    fat: 2.1,
    saltTotal: 0.43,
    cookingNotes: 'ひじきは軟らかく戻し、大豆は指で潰れる程度まで煮含める。鉄分・食物繊維補給',
    structured: [
      { name: '乾燥ひじき', amountPerPerson: 4, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '大豆水煮', amountPerPerson: 15, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 3, unit: 'g', saltPerPerson: 0.43, isSeasoning: true }
    ]
  },
  '切り干し大根の煮物': {
    dishName: '切り干し大根の煮物',
    ingredients: '切り干し大根 / 人参 / 油揚げ\n濃口醤油 / みりん / 砂糖 / 出汁',
    amounts: '10 / 15 / 8\n3 / 3 / 2 / 60',
    saltGrams: '0.00\n0.43',
    calories: 55,
    protein: 2.2,
    fat: 1.6,
    saltTotal: 0.43,
    cookingNotes: '切り干し大根は短くカットし出汁をたっぷり吸わせてジューシーに仕上げる',
    structured: [
      { name: '切り干し大根', amountPerPerson: 10, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 3, unit: 'g', saltPerPerson: 0.43, isSeasoning: true }
    ]
  },
  '南瓜の煮物': {
    dishName: '南瓜の煮物',
    ingredients: 'かぼちゃ\n濃口醤油 / みりん / 砂糖 / だし汁',
    amounts: '70\n2.5 / 3 / 3 / 50',
    saltGrams: '0.00\n0.36',
    calories: 72,
    protein: 1.5,
    fat: 0.3,
    saltTotal: 0.36,
    cookingNotes: '皮を所々剥いて軟らかく煮付け、面取りして煮崩れを防止。南瓜自身の甘みを活用',
    structured: [
      { name: 'かぼちゃ', amountPerPerson: 70, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '濃口醤油', amountPerPerson: 2.5, unit: 'g', saltPerPerson: 0.36, isSeasoning: true }
    ]
  },
  'きゅうりとタコの酢の物': {
    dishName: 'きゅうりとタコの酢の物',
    ingredients: 'きゅうり / ワカメ / 茹でタコ\n穀物酢 / 砂糖 / 塩 / 薄口醤油',
    amounts: '40 / 1 / 15\n6 / 3 / 0.2 / 1',
    saltGrams: '0.00\n0.20 + 0.16 = 0.36',
    calories: 42,
    protein: 3.2,
    fat: 0.3,
    saltTotal: 0.36,
    cookingNotes: '酢の酸味と香りを効かせて塩分を抑制。タコは極薄切りにし噛みやすさを徹底担保',
    structured: [
      { name: 'きゅうり（薄切り塩揉み絞り）', amountPerPerson: 40, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '乾燥ワカメ', amountPerPerson: 1, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '茹でタコ（極薄そぎ切り）', amountPerPerson: 15, unit: 'g', saltPerPerson: 0, isSeasoning: false },
      { name: '薄口醤油', amountPerPerson: 1, unit: 'g', saltPerPerson: 0.16, isSeasoning: true }
    ]
  }
};

/**
 * 任意の料理名から、高齢者施設向け（70-90代、1日塩分6.5g以下基準厳守）の栄養価・食材配合を自律計算するエンジン
 */
export function calculateDishNutrition(
  dishName: string,
  mealCategory: string = '昼食',
  dishType?: DishItem['role'],
  residentCount: number = 55
): CalculatedDishResult {
  const trimmed = (dishName || '').trim();

  // 1. 完全一致
  if (MASTER_DISHES[trimmed]) {
    const item = MASTER_DISHES[trimmed];
    return {
      ...item,
      mealCategory,
      dishType: dishType || (trimmed.includes('飯') || trimmed.includes('パン') ? '主食' : trimmed.includes('汁') ? '汁物' : '主菜'),
      calculatedForCount: residentCount
    };
  }

  // 2. 部分一致（マスターから近しいものを検索）
  const matchedKey = Object.keys(MASTER_DISHES).find(k => trimmed.includes(k) || k.includes(trimmed));
  if (matchedKey && trimmed.length >= 2) {
    const item = MASTER_DISHES[matchedKey];
    return {
      ...item,
      dishName: trimmed,
      mealCategory,
      dishType: dishType || item.dishName.includes('飯') ? '主食' : item.dishName.includes('汁') ? '汁物' : '主菜',
      calculatedForCount: residentCount
    };
  }

  // 3. 料理名からカテゴリーや主食材を自動判定して精密動的計算
  const isSoup = trimmed.includes('汁') || trimmed.includes('スープ') || trimmed.includes('吸') || dishType === '汁物';
  const isStaple = trimmed.includes('飯') || trimmed.includes('米') || trimmed.includes('パン') || trimmed.includes('うどん') || trimmed.includes('そば') || trimmed.includes('麺') || trimmed.includes('粥') || dishType === '主食';
  const isFish = trimmed.includes('魚') || trimmed.includes('鮭') || trimmed.includes('鯖') || trimmed.includes('鱈') || trimmed.includes('鯛') || trimmed.includes('鰆') || trimmed.includes('鰈') || trimmed.includes('アジ') || trimmed.includes('サンマ') || trimmed.includes('エビ') || trimmed.includes('イカ') || trimmed.includes('シーフード');
  const isMeat = trimmed.includes('肉') || trimmed.includes('豚') || trimmed.includes('鶏') || trimmed.includes('牛') || trimmed.includes('バーグ') || trimmed.includes('カツ') || trimmed.includes('ウインナー') || trimmed.includes('ハム') || trimmed.includes('唐揚げ') || trimmed.includes('ステーキ');
  const isEgg = trimmed.includes('卵') || trimmed.includes('玉子') || trimmed.includes('オムレツ') || trimmed.includes('エッグ');
  const isTofu = trimmed.includes('豆腐') || trimmed.includes('納豆') || trimmed.includes('厚揚げ') || trimmed.includes('油揚げ');
  const isSide = trimmed.includes('和え') || trimmed.includes('サラダ') || trimmed.includes('酢') || trimmed.includes('煮物') || trimmed.includes('浸し') || trimmed.includes('金平') || trimmed.includes('きんぴら') || trimmed.includes('ナムル') || trimmed.includes('小鉢') || dishType === '副菜';

  const assignedRole: DishItem['role'] = dishType || (isStaple ? '主食' : isSoup ? '汁物' : isSide ? '副菜' : '主菜');

  if (isSoup) {
    const mainVeg = trimmed.replace(/味噌汁|みそ汁|すまし汁|清汁|スープ|汁物|吸物/g, '') || '豆腐と旬野菜';
    return {
      dishName: trimmed,
      mealCategory,
      dishType: '汁物',
      ingredients: `${mainVeg} / 刻み青ねぎ\n淡色辛味噌 / かつお昆布合わせ出汁`,
      amounts: '30 / 3\n6 / 150',
      saltGrams: '0.00\n0.74',
      calories: 34,
      protein: 2.2,
      fat: 0.8,
      saltTotal: 0.74,
      cookingNotes: '昆布と鰹節の一番だしを濃いめに引き、味噌を6gに抑えて塩分0.7g台に制御',
      structured: [
        { name: mainVeg, amountPerPerson: 30, unit: 'g', saltPerPerson: 0, isSeasoning: false },
        { name: '刻み青ねぎ', amountPerPerson: 3, unit: 'g', saltPerPerson: 0, isSeasoning: false },
        { name: '淡色辛味噌', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.74, isSeasoning: true },
        { name: '合わせ出汁', amountPerPerson: 150, unit: 'g', saltPerPerson: 0, isSeasoning: true }
      ],
      calculatedForCount: residentCount
    };
  }

  if (isStaple) {
    const isNoodle = trimmed.includes('うどん') || trimmed.includes('そば') || trimmed.includes('麺');
    if (isNoodle) {
      return {
        dishName: trimmed,
        mealCategory,
        dishType: '主食',
        ingredients: `${trimmed}（ゆで）/ 刻みねぎ\n薄口醤油 / みりん / 出汁`,
        amounts: '180 / 5\n8 / 6 / 200',
        saltGrams: '0.30\n0.95',
        calories: 220,
        protein: 5.8,
        fat: 1.1,
        saltTotal: 1.25,
        cookingNotes: '麺は短めにカットし喉詰めを防止。つゆは飲まない想定で塩分を考慮',
        structured: [
          { name: 'ゆで麺', amountPerPerson: 180, unit: 'g', saltPerPerson: 0.3, isSeasoning: false },
          { name: '薄口醤油', amountPerPerson: 8, unit: 'g', saltPerPerson: 0.95, isSeasoning: true }
        ],
        calculatedForCount: residentCount
      };
    }
    return {
      dishName: trimmed,
      mealCategory,
      dishType: '主食',
      ingredients: '精白米（軟らかめ炊飯 150g）',
      amounts: '65',
      saltGrams: '0.00',
      calories: 234,
      protein: 3.8,
      fat: 0.5,
      saltTotal: 0.00,
      cookingNotes: '米の甘みを活かし軟らかめに炊飯。食塩不使用',
      structured: [{ name: '精白米', amountPerPerson: 65, unit: 'g', saltPerPerson: 0, isSeasoning: false }],
      calculatedForCount: residentCount
    };
  }

  if (assignedRole === '副菜' || isSide) {
    return {
      dishName: trimmed,
      mealCategory,
      dishType: '副菜',
      ingredients: `${trimmed.replace(/和え|煮|浸し|サラダ|炒め/g, '') || '旬の温野菜'} / 人参\n薄口醤油 / みりん / だし汁`,
      amounts: '45 / 10\n2.5 / 2 / 30',
      saltGrams: '0.00\n0.38',
      calories: 42,
      protein: 1.8,
      fat: 0.9,
      saltTotal: 0.38,
      cookingNotes: '出汁を効かせて薄味で調理。野菜は繊維を断つように切り軟らかく加熱',
      structured: [
        { name: '旬の温野菜', amountPerPerson: 45, unit: 'g', saltPerPerson: 0, isSeasoning: false },
        { name: '人参', amountPerPerson: 10, unit: 'g', saltPerPerson: 0, isSeasoning: false },
        { name: '薄口醤油', amountPerPerson: 2.5, unit: 'g', saltPerPerson: 0.38, isSeasoning: true }
      ],
      calculatedForCount: residentCount
    };
  }

  // 主菜 (魚・肉・卵・豆腐等)
  if (isFish) {
    return {
      dishName: trimmed,
      mealCategory,
      dishType: '主菜',
      ingredients: `${trimmed.replace(/焼き|煮|蒸し|揚げ|フライ/g, '') || '白身魚'}（切り身）/ 付け合わせ野菜\n薄口醤油 / みりん / 酒`,
      amounts: '70 / 15\n4 / 3 / 3',
      saltGrams: '0.10\n0.60',
      calories: 135,
      protein: 14.5,
      fat: 4.2,
      saltTotal: 0.70,
      cookingNotes: '骨抜き魚を使用し安全性を担保。生姜や柚子の風味を効かせて減塩調理',
      structured: [
        { name: '魚切り身（骨なし）', amountPerPerson: 70, unit: 'g', saltPerPerson: 0.1, isSeasoning: false },
        { name: '調味醤油', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.6, isSeasoning: true }
      ],
      calculatedForCount: residentCount
    };
  }

  if (isMeat) {
    return {
      dishName: trimmed,
      mealCategory,
      dishType: '主菜',
      ingredients: `${trimmed.replace(/焼き|煮|炒め|唐揚げ|カツ/g, '') || '豚・鶏肉'} / 玉ねぎ\n濃口醤油 / みりん / 植物油`,
      amounts: '65 / 25\n4.5 / 3 / 2',
      saltGrams: '0.05\n0.68',
      calories: 185,
      protein: 13.9,
      fat: 9.8,
      saltTotal: 0.73,
      cookingNotes: '一口大にカットし筋切りを実施。玉ねぎの自然な甘みで塩分を0.7g前後に抑制',
      structured: [
        { name: '肉類', amountPerPerson: 65, unit: 'g', saltPerPerson: 0.05, isSeasoning: false },
        { name: '玉ねぎ', amountPerPerson: 25, unit: 'g', saltPerPerson: 0, isSeasoning: false },
        { name: '調味醤油', amountPerPerson: 4.5, unit: 'g', saltPerPerson: 0.68, isSeasoning: true }
      ],
      calculatedForCount: residentCount
    };
  }

  if (isEgg) {
    return {
      dishName: trimmed,
      mealCategory,
      dishType: '主菜',
      ingredients: '鶏卵 / 玉ねぎ\nトマトケチャップ / サラダ油 / 牛乳',
      amounts: '50 / 20\n5 / 3 / 10',
      saltGrams: '0.00\n0.20',
      calories: 145,
      protein: 7.5,
      fat: 9.8,
      saltTotal: 0.35,
      cookingNotes: '牛乳を加えてふんわりしっとり加熱。塩分0.3g台にコントロール',
      structured: [
        { name: '鶏卵', amountPerPerson: 50, unit: 'g', saltPerPerson: 0, isSeasoning: false },
        { name: 'ケチャップ', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.2, isSeasoning: true }
      ],
      calculatedForCount: residentCount
    };
  }

  // 一般的な主菜デフォルト
  return {
    dishName: trimmed,
    mealCategory,
    dishType: '主菜',
    ingredients: `${trimmed}の主食材 / 付け合わせ野菜\n調味だれ（減塩仕立て）/ 出汁`,
    amounts: '70 / 20\n5 / 20',
    saltGrams: '0.05\n0.65',
    calories: 160,
    protein: 12.0,
    fat: 7.5,
    saltTotal: 0.70,
    cookingNotes: '高齢者の咀嚼・嚥下に合わせ柔らかく調製。1日の塩分6.5g以下基準に準拠（1品0.7g）',
    structured: [
      { name: '主食材', amountPerPerson: 70, unit: 'g', saltPerPerson: 0.05, isSeasoning: false },
      { name: '調味料', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.65, isSeasoning: true }
    ],
    calculatedForCount: residentCount
  };
}
