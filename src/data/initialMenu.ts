import { DayMenu } from '../types';

export const initialDays: DayMenu[] = [
  {
    id: 'day-1',
    dateInfo: { year: 2026, month: 9, day: 4, dayOfWeek: '金' },
    meals: {
      breakfast: {
        id: 'breakfast',
        name: '朝食',
        targetSaltNote: '朝食目標塩分量（1.5〜1.8g）達成',
        maxTargetSalt: 1.8,
        items: [
          {
            id: 'd1-b1',
            role: '主食',
            dishName: '御飯',
            ingredients: '精白米（炊き上がり 150g）',
            amounts: '65',
            saltGrams: '0.00',
            calories: 234,
            protein: 3.8,
            fat: 0.5,
            saltTotal: 0.00,
            cookingNotes: '標準加水量1.5倍（70〜90代の嚥下に合わせて軟らかめ炊飯）',
            structured: [
              { name: '精白米', amountPerPerson: 65, unit: 'g', saltPerPerson: 0.0, isSeasoning: false }
            ]
          },
          {
            id: 'd1-b2',
            role: '主菜',
            dishName: '鮭の塩焼き',
            ingredients: '白鮭（甘塩・生換算）\n薄口醤油（仕上げ風味付け）',
            amounts: '60\n1',
            saltGrams: '0.60\n0.16',
            calories: 110,
            protein: 13.5,
            fat: 4.8,
            saltTotal: 0.76,
            cookingNotes: '塩分を抑えた甘口鮭を使用、醤油はスプレー噴霧で減塩',
            structured: [
              { name: '白鮭（甘塩）', amountPerPerson: 60, unit: 'g', saltPerPerson: 0.60, isSeasoning: false },
              { name: '薄口醤油', amountPerPerson: 1, unit: 'g', saltPerPerson: 0.16, isSeasoning: true }
            ]
          },
          {
            id: 'd1-b3',
            role: '副菜',
            dishName: 'キャベツの和え物',
            ingredients: 'キャベツ / 人参\nポン酢しょうゆ（減塩）/ 煎りごま',
            amounts: '40 / 10\n4 / 1',
            saltGrams: '0.00\n0.24',
            calories: 32,
            protein: 1.2,
            fat: 0.8,
            saltTotal: 0.24,
            cookingNotes: '酸味を効かせて塩分を抑える。蒸し加熱で繊維を柔らかく処理',
            structured: [
              { name: 'キャベツ', amountPerPerson: 40, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '人参', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '減塩ポン酢', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.24, isSeasoning: true },
              { name: '煎りごま', amountPerPerson: 1, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
            ]
          },
          {
            id: 'd1-b4',
            role: '汁物',
            dishName: '玉ねぎと麩の味噌汁',
            ingredients: '玉ねぎ / 焼き麩 / 長ねぎ\n淡色辛味噌 / 昆布かつおだし汁',
            amounts: '20 / 2 / 5\n6 / 150',
            saltGrams: '0.00\n0.74',
            calories: 34,
            protein: 2.1,
            fat: 0.6,
            saltTotal: 0.74,
            cookingNotes: '出汁を濃いめに引き、味噌使用量を6gに調整',
            structured: [
              { name: '玉ねぎ', amountPerPerson: 20, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '焼き麩', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '長ねぎ', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '淡色辛味噌', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.74, isSeasoning: true },
              { name: '昆布かつおだし汁', amountPerPerson: 150, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
            ]
          }
        ]
      },
      lunch: {
        id: 'lunch',
        name: '昼食',
        targetSaltNote: '昼食目標塩分量（2.5g以内）達成',
        maxTargetSalt: 2.5,
        items: [
          {
            id: 'd1-l1',
            role: '主菜',
            dishName: '鯖のみそ煮',
            ingredients: 'サバ（生切り身）/ 生姜\n赤味噌 / 濃口醤油 / みりん / 砂糖 / 酒',
            amounts: '70 / 2\n5 / 2 / 4 / 3 / 5',
            saltGrams: '0.00\n0.62 / 0.29',
            calories: 198,
            protein: 15.2,
            fat: 12.1,
            saltTotal: 0.91,
            cookingNotes: '生姜風味を際立たせ味噌・醤油の使用量を削減。皮目に十字飾り包丁で食べやすく',
            structured: [
              { name: 'サバ生切り身', amountPerPerson: 70, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '生姜', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '赤味噌', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.62, isSeasoning: true },
              { name: '濃口醤油', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.29, isSeasoning: true },
              { name: 'みりん・砂糖・酒', amountPerPerson: 12, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
            ]
          },
          {
            id: 'd1-l2',
            role: '副菜',
            dishName: 'ほうれん草の和え物',
            ingredients: 'ほうれん草 / 人参\n薄口醤油 / だし汁 / 白ごま',
            amounts: '50 / 10\n2 / 5 / 2',
            saltGrams: '0.00\n0.32',
            calories: 38,
            protein: 1.8,
            fat: 1.2,
            saltTotal: 0.32,
            cookingNotes: '割り醤油（だしで割る）による均一な薄味付け',
            structured: [
              { name: 'ほうれん草', amountPerPerson: 50, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '人参', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '薄口醤油', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.32, isSeasoning: true },
              { name: 'だし汁', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.0, isSeasoning: true },
              { name: '白ごま', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
            ]
          },
          {
            id: 'd1-l3',
            role: '副菜',
            dishName: 'かぼちゃの煮物',
            ingredients: 'かぼちゃ\n濃口醤油 / みりん / だし汁',
            amounts: '60\n2 / 3 / 10',
            saltGrams: '0.00\n0.29',
            calories: 65,
            protein: 1.2,
            fat: 0.2,
            saltTotal: 0.29,
            cookingNotes: '素材固有の甘味を活用。面取りして煮崩れを防ぎスプーンでも切れる柔らかさに',
            structured: [
              { name: 'かぼちゃ', amountPerPerson: 60, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '濃口醤油', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.29, isSeasoning: true },
              { name: 'みりん', amountPerPerson: 3, unit: 'g', saltPerPerson: 0.0, isSeasoning: true },
              { name: 'だし汁', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
            ]
          },
          {
            id: 'd1-l4',
            role: '汁物',
            dishName: '豆腐と若布の味噌汁',
            ingredients: '木綿豆腐 / 乾燥わかめ / 長ねぎ\n淡色辛味噌 / だし汁',
            amounts: '30 / 0.5 / 5\n7 / 150',
            saltGrams: '0.00 / 0.08\n0.87',
            calories: 36,
            protein: 2.8,
            fat: 1.1,
            saltTotal: 0.95,
            cookingNotes: 'わかめの塩分（戻し後）考慮済み。豆腐は細かく角切りにして喉ごし良く',
            structured: [
              { name: '木綿豆腐', amountPerPerson: 30, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '乾燥わかめ', amountPerPerson: 0.5, unit: 'g', saltPerPerson: 0.08, isSeasoning: false },
              { name: '長ねぎ', amountPerPerson: 5, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '淡色辛味噌', amountPerPerson: 7, unit: 'g', saltPerPerson: 0.87, isSeasoning: true },
              { name: 'だし汁', amountPerPerson: 150, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
            ]
          }
        ]
      },
      dinner: {
        id: 'dinner',
        name: '夕食',
        targetSaltNote: '夕食目標塩分量（2.2g以内）達成',
        maxTargetSalt: 2.2,
        items: [
          {
            id: 'd1-d1',
            role: '主菜',
            dishName: '豚肉の生姜焼き',
            ingredients: '豚ロース肉 / 玉ねぎ / 生姜\n濃口醤油 / みりん / 酒 / 上白糖 / 料理油',
            amounts: '60 / 30 / 3\n4 / 4 / 3 / 2 / 3',
            saltGrams: '0.00\n0.58',
            calories: 185,
            protein: 13.8,
            fat: 10.5,
            saltTotal: 0.58,
            cookingNotes: 'タウリン・ビタミンB1補給。表面塗布煮詰め法で塩分感向上。筋切り加工で噛みやすく',
            structured: [
              { name: '豚ロース肉', amountPerPerson: 60, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '玉ねぎ', amountPerPerson: 30, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: 'おろし生姜', amountPerPerson: 3, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '濃口醤油', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.58, isSeasoning: true },
              { name: 'みりん・酒・砂糖・油', amountPerPerson: 12, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
            ]
          },
          {
            id: 'd1-d2',
            role: '副菜',
            dishName: '大根とイカの煮物',
            ingredients: '大根 / ロールイカ\n濃口醤油 / 清酒 / 砂糖 / だし汁',
            amounts: '80 / 30\n3 / 4 / 2 / 20',
            saltGrams: '0.00\n0.43',
            calories: 68,
            protein: 5.4,
            fat: 0.3,
            saltTotal: 0.43,
            cookingNotes: 'イカの下味旨味を活用し、塩分控えめ設定。イカは鹿の子格子に切り込み入れ軟化',
            structured: [
              { name: '大根', amountPerPerson: 80, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: 'ロールイカ', amountPerPerson: 30, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '濃口醤油', amountPerPerson: 3, unit: 'g', saltPerPerson: 0.43, isSeasoning: true },
              { name: '清酒・砂糖・だし汁', amountPerPerson: 26, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
            ]
          },
          {
            id: 'd1-d3',
            role: '副菜',
            dishName: 'きゅうりとタコの酢の物',
            ingredients: 'きゅうり / ワカメ / 茹でタコ\n穀物酢 / 砂糖 / 塩 / 薄口醤油',
            amounts: '40 / 1 / 15\n6 / 3 / 0.2 / 1',
            saltGrams: '0.00\n0.20 + 0.16 = 0.36',
            calories: 42,
            protein: 3.2,
            fat: 0.3,
            saltTotal: 0.36,
            cookingNotes: '酢の酸味と香りを効かせて塩分を抑える。タコは薄くそぎ切りにして安全に咀嚼',
            structured: [
              { name: 'きゅうり', amountPerPerson: 40, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '乾燥ワカメ', amountPerPerson: 1, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '茹でタコ', amountPerPerson: 15, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '穀物酢・砂糖', amountPerPerson: 9, unit: 'g', saltPerPerson: 0.0, isSeasoning: true },
              { name: '塩・薄口醤油', amountPerPerson: 1.2, unit: 'g', saltPerPerson: 0.36, isSeasoning: true }
            ]
          },
          {
            id: 'd1-d4',
            role: '汁物',
            dishName: '清汁（すましじる）',
            ingredients: '小松菜 / えのきたけ\n薄口醤油 / 塩 / 高純度だし汁',
            amounts: '15 / 10\n2 / 0.3 / 150',
            saltGrams: '0.00\n0.32 + 0.30 = 0.62',
            calories: 18,
            protein: 1.1,
            fat: 0.2,
            saltTotal: 0.62,
            cookingNotes: '一番だしを贅沢に用い塩分0.6gに抑制。えのきは短寸に切り誤嚥を防止',
            structured: [
              { name: '小松菜', amountPerPerson: 15, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: 'えのきたけ', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.0, isSeasoning: false },
              { name: '薄口醤油・塩', amountPerPerson: 2.3, unit: 'g', saltPerPerson: 0.62, isSeasoning: true },
              { name: '高純度だし汁', amountPerPerson: 150, unit: 'g', saltPerPerson: 0.0, isSeasoning: true }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'day-2',
    dateInfo: { year: 2026, month: 9, day: 5, dayOfWeek: '土' },
    meals: {
      breakfast: {
        id: 'breakfast',
        name: '朝食',
        targetSaltNote: '朝食目標塩分量（1.5〜1.8g）達成',
        maxTargetSalt: 1.8,
        items: [
          {
            id: 'd2-b1',
            role: '主食',
            dishName: '御飯',
            ingredients: '精白米（炊き上がり 150g）',
            amounts: '65',
            saltGrams: '0.00',
            calories: 234,
            protein: 3.8,
            fat: 0.5,
            saltTotal: 0.0,
            cookingNotes: '消化吸収を高めるため浸水時間を長めに設定',
            structured: [{ name: '精白米', amountPerPerson: 65, unit: 'g', saltPerPerson: 0, isSeasoning: false }]
          },
          {
            id: 'd2-b2',
            role: '主菜',
            dishName: '出汁巻き玉子',
            ingredients: '鶏卵 / 合わせ出汁\n薄口醤油 / みりん / 砂糖',
            amounts: '55 / 20\n1.5 / 2 / 1',
            saltGrams: '0.00\n0.24',
            calories: 98,
            protein: 6.8,
            fat: 5.6,
            saltTotal: 0.24,
            cookingNotes: '出汁をたっぷり含ませふんわりジューシーに。咀嚼力が弱い方でも喉越しなめらか',
            structured: [
              { name: '鶏卵', amountPerPerson: 55, unit: 'g', saltPerPerson: 0, isSeasoning: false },
              { name: '合わせ出汁', amountPerPerson: 20, unit: 'g', saltPerPerson: 0, isSeasoning: true },
              { name: '薄口醤油', amountPerPerson: 1.5, unit: 'g', saltPerPerson: 0.24, isSeasoning: true }
            ]
          },
          {
            id: 'd2-b3',
            role: '副菜',
            dishName: '小松菜のおひたし',
            ingredients: '小松菜 / 人参 / しめじ\n減塩だしつゆ / かつお節',
            amounts: '45 / 10 / 10\n4 / 0.5',
            saltGrams: '0.00\n0.34',
            calories: 28,
            protein: 1.6,
            fat: 0.3,
            saltTotal: 0.34,
            cookingNotes: 'かつお節のイノシン酸で旨味を補強し、減塩つゆでも豊かな風味に',
            structured: [
              { name: '小松菜', amountPerPerson: 45, unit: 'g', saltPerPerson: 0, isSeasoning: false },
              { name: '減塩だしつゆ', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.34, isSeasoning: true }
            ]
          },
          {
            id: 'd2-b4',
            role: '汁物',
            dishName: '大根と油揚げの味噌汁',
            ingredients: '大根 / 刻み油揚げ / 青ねぎ\n淡色辛味噌 / だし汁',
            amounts: '25 / 4 / 3\n6 / 150',
            saltGrams: '0.00\n0.74',
            calories: 42,
            protein: 2.3,
            fat: 1.8,
            saltTotal: 0.74,
            cookingNotes: '油揚げは熱湯で油抜きし、カロリーと胃腸への負担を低減',
            structured: [
              { name: '大根', amountPerPerson: 25, unit: 'g', saltPerPerson: 0, isSeasoning: false },
              { name: '油揚げ', amountPerPerson: 4, unit: 'g', saltPerPerson: 0, isSeasoning: false },
              { name: '淡色辛味噌', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.74, isSeasoning: true }
            ]
          }
        ]
      },
      lunch: {
        id: 'lunch',
        name: '昼食',
        targetSaltNote: '昼食目標塩分量（2.5g以内）達成',
        maxTargetSalt: 2.5,
        items: [
          {
            id: 'd2-l1',
            role: '主菜',
            dishName: '鰈（カレイ）のおろし煮',
            ingredients: '白身カレイ切身 / 大根おろし\n濃口醤油 / みりん / 酒 / 生姜汁',
            amounts: '70 / 30\n3 / 4 / 3 / 2',
            saltGrams: '0.00\n0.48',
            calories: 135,
            protein: 14.5,
            fat: 2.1,
            saltTotal: 0.48,
            cookingNotes: '身がほぐれやすく高タンパク低脂質。大根おろしの酵素で消化を助け、絡めることで薄味でも美味',
            structured: [
              { name: '白身カレイ切身', amountPerPerson: 70, unit: 'g', saltPerPerson: 0, isSeasoning: false },
              { name: '大根おろし', amountPerPerson: 30, unit: 'g', saltPerPerson: 0, isSeasoning: false },
              { name: '濃口醤油', amountPerPerson: 3, unit: 'g', saltPerPerson: 0.48, isSeasoning: true }
            ]
          },
          {
            id: 'd2-l2',
            role: '副菜',
            dishName: '里芋と人参のそぼろあんかけ',
            ingredients: '里芋 / 人参 / 鶏ひき肉\n薄口醤油 / みりん / 水溶き片栗粉',
            amounts: '60 / 15 / 15\n2 / 3 / 2',
            saltGrams: '0.00\n0.32',
            calories: 82,
            protein: 3.8,
            fat: 1.5,
            saltTotal: 0.32,
            cookingNotes: 'とろみをつけることで誤嚥を防ぎ、調味料が食材に留まり減塩効果を発揮',
            structured: [
              { name: '里芋', amountPerPerson: 60, unit: 'g', saltPerPerson: 0, isSeasoning: false },
              { name: '鶏ひき肉', amountPerPerson: 15, unit: 'g', saltPerPerson: 0, isSeasoning: false },
              { name: '薄口醤油', amountPerPerson: 2, unit: 'g', saltPerPerson: 0.32, isSeasoning: true }
            ]
          },
          {
            id: 'd2-l3',
            role: '副菜',
            dishName: '白菜とちくわの胡麻和え',
            ingredients: '白菜 / 焼きちくわ\nすりごま / 減塩醤油 / 砂糖',
            amounts: '50 / 10\n2 / 1.5 / 1',
            saltGrams: '0.00 / 0.18\n0.18 = 0.36',
            calories: 45,
            protein: 2.2,
            fat: 1.4,
            saltTotal: 0.36,
            cookingNotes: '白菜は芯の部分をそぎ切りにして加熱し、噛み切りやすく調理',
            structured: [
              { name: '白菜', amountPerPerson: 50, unit: 'g', saltPerPerson: 0, isSeasoning: false },
              { name: '焼きちくわ', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.18, isSeasoning: false },
              { name: '減塩醤油', amountPerPerson: 1.5, unit: 'g', saltPerPerson: 0.18, isSeasoning: true }
            ]
          },
          {
            id: 'd2-l4',
            role: '汁物',
            dishName: 'なめこと三つ葉の赤だし',
            ingredients: 'なめこ / 絹ごし豆腐 / 三つ葉\n赤だし味噌 / 昆布だし',
            amounts: '20 / 25 / 3\n6 / 150',
            saltGrams: '0.00\n0.78',
            calories: 32,
            protein: 2.4,
            fat: 0.8,
            saltTotal: 0.78,
            cookingNotes: 'なめこの自然なとろみで飲み込みやすく、三つ葉の清涼な香りで塩分控えめ',
            structured: [
              { name: 'なめこ', amountPerPerson: 20, unit: 'g', saltPerPerson: 0, isSeasoning: false },
              { name: '絹ごし豆腐', amountPerPerson: 25, unit: 'g', saltPerPerson: 0, isSeasoning: false },
              { name: '赤だし味噌', amountPerPerson: 6, unit: 'g', saltPerPerson: 0.78, isSeasoning: true }
            ]
          }
        ]
      },
      dinner: {
        id: 'dinner',
        name: '夕食',
        targetSaltNote: '夕食目標塩分量（2.2g以内）達成',
        maxTargetSalt: 2.2,
        items: [
          {
            id: 'd2-d1',
            role: '主菜',
            dishName: '柔らか鶏団子の甘酢あん',
            ingredients: '鶏ひき肉 / 絹豆腐 / 玉ねぎ\n黒酢 / 砂糖 / 醤油 / 片栗粉',
            amounts: '45 / 20 / 15\n4 / 3 / 2.5 / 2',
            saltGrams: '0.00\n0.40',
            calories: 165,
            protein: 12.2,
            fat: 7.2,
            saltTotal: 0.40,
            cookingNotes: '鶏肉に豆腐を練り込んで冷めても非常に柔らか。黒酢のまろやかな酸味で減塩',
            structured: [
              { name: '鶏ひき肉', amountPerPerson: 45, unit: 'g', saltPerPerson: 0, isSeasoning: false },
              { name: '絹豆腐', amountPerPerson: 20, unit: 'g', saltPerPerson: 0, isSeasoning: false },
              { name: '黒酢・調味料', amountPerPerson: 10, unit: 'g', saltPerPerson: 0.40, isSeasoning: true }
            ]
          },
          {
            id: 'd2-d2',
            role: '副菜',
            dishName: '茄子とインゲンの揚げ浸し',
            ingredients: '米茄子 / さやいんげん\n割り出汁 / おろし生姜',
            amounts: '60 / 15\n15 / 2',
            saltGrams: '0.00\n0.35',
            calories: 64,
            protein: 1.4,
            fat: 3.2,
            saltTotal: 0.35,
            cookingNotes: '皮を縞目に剥いて柔らかく素揚げ。出汁をしっかり含ませてジューシーに',
            structured: [
              { name: '米茄子', amountPerPerson: 60, unit: 'g', saltPerPerson: 0, isSeasoning: false },
              { name: '割り出汁', amountPerPerson: 15, unit: 'g', saltPerPerson: 0.35, isSeasoning: true }
            ]
          },
          {
            id: 'd2-d3',
            role: '副菜',
            dishName: 'ほうれん草の白和え',
            ingredients: 'ほうれん草 / 人参 / 木綿豆腐\n練り白ごま / 薄口醤油 / 砂糖',
            amounts: '40 / 10 / 25\n2 / 1.5 / 1',
            saltGrams: '0.00\n0.25',
            calories: 58,
            protein: 3.1,
            fat: 2.8,
            saltTotal: 0.25,
            cookingNotes: '裏ごしした豆腐と胡麻のコクで塩味を感じやすく。カルシウム補給にも最適',
            structured: [
              { name: 'ほうれん草', amountPerPerson: 40, unit: 'g', saltPerPerson: 0, isSeasoning: false },
              { name: '木綿豆腐', amountPerPerson: 25, unit: 'g', saltPerPerson: 0, isSeasoning: false },
              { name: '白和え衣調味料', amountPerPerson: 4.5, unit: 'g', saltPerPerson: 0.25, isSeasoning: true }
            ]
          },
          {
            id: 'd2-d4',
            role: '汁物',
            dishName: 'かきたま汁',
            ingredients: '溶き卵 / えのき / わけぎ\n白だし / 薄口醤油 / 片栗粉',
            amounts: '20 / 10 / 2\n3 / 1 / 150',
            saltGrams: '0.00\n0.58',
            calories: 28,
            protein: 2.1,
            fat: 1.1,
            saltTotal: 0.58,
            cookingNotes: '汁にとろみをつけてから卵を回し入れ、ふわふわの羽二重状に仕上げ',
            structured: [
              { name: '鶏卵', amountPerPerson: 20, unit: 'g', saltPerPerson: 0, isSeasoning: false },
              { name: 'だしつゆ', amountPerPerson: 4, unit: 'g', saltPerPerson: 0.58, isSeasoning: true }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'day-3',
    dateInfo: { year: 2026, month: 9, day: 6, dayOfWeek: '日' },
    meals: {
      breakfast: {
        id: 'breakfast',
        name: '朝食',
        targetSaltNote: '朝食目標塩分量達成',
        maxTargetSalt: 1.8,
        items: [
          {
            id: 'd3-b1',
            role: '主食',
            dishName: '御飯',
            ingredients: '精白米（炊き上がり 150g）',
            amounts: '65',
            saltGrams: '0.00',
            calories: 234,
            protein: 3.8,
            fat: 0.5,
            saltTotal: 0.00
          },
          {
            id: 'd3-b2',
            role: '主菜',
            dishName: '鯵（アジ）の塩焼き',
            ingredients: '真鯵切り身\n減塩薄口醤油',
            amounts: '55\n1',
            saltGrams: '0.55\n0.15',
            calories: 108,
            protein: 12.8,
            fat: 4.5,
            saltTotal: 0.70
          },
          {
            id: 'd3-b3',
            role: '副菜',
            dishName: '炒り豆腐',
            ingredients: '木綿豆腐 / 人参 / 干し椎茸\n薄口醤油 / みりん',
            amounts: '40 / 10 / 5\n1.5 / 2',
            saltGrams: '0.00\n0.22',
            calories: 55,
            protein: 3.5,
            fat: 2.2,
            saltTotal: 0.22
          },
          {
            id: 'd3-b4',
            role: '汁物',
            dishName: 'なめこの味噌汁',
            ingredients: 'なめこ / 刻み三つ葉\n淡色辛味噌 / だし汁',
            amounts: '15 / 2\n5 / 150',
            saltGrams: '0.00\n0.68',
            calories: 30,
            protein: 1.8,
            fat: 0.6,
            saltTotal: 0.68
          }
        ]
      },
      lunch: {
        id: 'lunch',
        name: '昼食',
        targetSaltNote: '昼食目標塩分量達成',
        maxTargetSalt: 2.5,
        items: [
          {
            id: 'd3-l1',
            role: '主食',
            dishName: 'ちらし寿司',
            ingredients: '酢飯 / 錦糸卵 / 椎茸煮 / 刻み海苔',
            amounts: '150 / 10 / 15 / 0.5',
            saltGrams: '0.80',
            calories: 270,
            protein: 6.2,
            fat: 2.1,
            saltTotal: 0.80
          },
          {
            id: 'd3-l2',
            role: '主菜',
            dishName: '茶碗蒸し',
            ingredients: '鶏卵 / 鶏ささみ / 銀杏\nだし汁 / 薄口醤油',
            amounts: '30 / 15 / 5\n100 / 2',
            saltGrams: '0.00\n0.42',
            calories: 78,
            protein: 6.5,
            fat: 3.2,
            saltTotal: 0.42
          },
          {
            id: 'd3-l3',
            role: '副菜',
            dishName: '菜の花のお浸し',
            ingredients: '菜の花 / だしつゆ',
            amounts: '45\n3',
            saltGrams: '0.00\n0.22',
            calories: 24,
            protein: 1.5,
            fat: 0.2,
            saltTotal: 0.22
          },
          {
            id: 'd3-l4',
            role: '汁物',
            dishName: '清汁（花麩・柚子）',
            ingredients: '花麩 / 柚子皮\n薄口醤油 / だし汁',
            amounts: '3 / 0.5\n2 / 150',
            saltGrams: '0.00\n0.48',
            calories: 14,
            protein: 0.8,
            fat: 0.1,
            saltTotal: 0.48
          }
        ]
      },
      dinner: {
        id: 'dinner',
        name: '夕食',
        targetSaltNote: '夕食目標塩分量達成',
        maxTargetSalt: 2.2,
        items: [
          {
            id: 'd3-d1',
            role: '主菜',
            dishName: '豚ヒレ肉のやわらか角煮風',
            ingredients: '豚ヒレ肉 / 大根\n濃口醤油 / みりん / 酒 / 砂糖',
            amounts: '60 / 50\n3 / 4 / 3 / 2',
            saltGrams: '0.00\n0.58',
            calories: 168,
            protein: 14.5,
            fat: 4.8,
            saltTotal: 0.58
          },
          {
            id: 'd3-d2',
            role: '副菜',
            dishName: 'かぼちゃの含め煮',
            ingredients: 'かぼちゃ\n薄口醤油 / みりん / だし汁',
            amounts: '60\n2 / 3 / 20',
            saltGrams: '0.00\n0.28',
            calories: 62,
            protein: 1.2,
            fat: 0.2,
            saltTotal: 0.28
          },
          {
            id: 'd3-d3',
            role: '副菜',
            dishName: 'きゅうりと若布の酢の物',
            ingredients: 'きゅうり / 湯通しわかめ\n三杯酢',
            amounts: '40 / 10\n7',
            saltGrams: '0.00\n0.26',
            calories: 28,
            protein: 1.0,
            fat: 0.2,
            saltTotal: 0.26
          },
          {
            id: 'd3-d4',
            role: '汁物',
            dishName: 'けんちん汁',
            ingredients: '大根 / 人参 / ごぼう / 豆腐\n薄口醤油 / ごま油 / だし汁',
            amounts: '20 / 10 / 10 / 15\n2 / 1 / 150',
            saltGrams: '0.00\n0.52',
            calories: 42,
            protein: 2.4,
            fat: 1.8,
            saltTotal: 0.52
          }
        ]
      }
    }
  }
];
