import { GoogleGenAI } from '@google/genai';
import { calculateDishNutrition, inferDishRole } from '../src/utils/dishNutritionEngine';

export default async function handler(req: any, res: any) {
  // CORS / OPTIONS support
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { dishName, mealCategory = '昼食', dishType = '主菜', currentResidentCount = 55 } = req.body || {};

  if (!dishName || typeof dishName !== 'string') {
    return res.status(400).json({ error: '料理名（dishName）が必要です' });
  }

  const trimmed = dishName.trim();
  const effectiveRole = inferDishRole(trimmed, dishType);

  // Try Gemini AI if API Key is configured in environment variables
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 15) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `あなたは給食・食堂献立設計の専門管理栄養士です。
料理名: 「${trimmed}」（区分: ${mealCategory}、分類: ${effectiveRole}）について、
【1日1400〜1600kcal、1日食塩摂取量約6.0g（朝1.8g、昼2.1g、夕2.1g）】を達成できるよう逆算した、本格的で満足感のある食材構成・調味料・栄養価を算定してください。

【厳守事項】：
1. 「監査」という単語は絶対に使用しないでください。
2. 食材の分量は肉・魚・野菜問わず一律45gといった極端に少なすぎる見積もりは厳禁です。
   - 主菜（肉、魚、卵、コロッケ等）：主タンパク質65〜85g、副野菜25〜45g（合計95〜130g）、210〜310kcal、食塩0.85〜1.15g
   - 副菜（和え物、煮物、サラダ等）：野菜・具材50〜75g、副具材15〜25g（合計65〜90g）、70〜110kcal、食塩0.45〜0.65g（砂糖、みりん、ごま、マヨネーズ等でエネルギー補給）
   - 汁物：具材30〜45g、汁150g、35〜55kcal、食塩0.75〜0.85g
3. 洋食料理（オムレツ、ポトフ、コロッケ、コールスロー等）にみりんや薄口醤油を画一的に使用しないでください。
   洋食にはトマトケチャップ、中濃ソース、洋風コンソメ、マヨネーズ、バター、オリーブ油、上白糖、食塩こしょう等、料理に合致した本物の調味料を使用してください。中華には甜麺醤・豆板醤・ごま油等を使用してください。

以下のJSON形式のみで返答してください：
{
  "dishName": "${trimmed}",
  "ingredients": "食材1 / 食材2\\n調味料1 / 調味料2",
  "amounts": "食材1g / 食材2g\\n調味料1g / 調味料2g",
  "saltGrams": "0.00\\n0.45 / 0.30 = 0.75",
  "calories": 230,
  "protein": 12.5,
  "fat": 14.2,
  "saltTotal": 0.85,
  "cookingNotes": "美味しさと栄養バランスを両立させる調理のポイント（※監査の文字は禁止）",
  "structured": [
    { "name": "食材1", "amountPerPerson": 70, "unit": "g", "saltPerPerson": 0, "isSeasoning": false },
    { "name": "調味料1", "amountPerPerson": 6, "unit": "g", "saltPerPerson": 0.45, "isSeasoning": true }
  ]
}`;

      // 4-second timeout protection
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI generation timeout')), 4000)
      );

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const responseText = response.text || '';
      const parsed = JSON.parse(responseText);

      return res.status(200).json({
        dishName: parsed.dishName || trimmed,
        mealCategory,
        dishType: effectiveRole,
        ingredients: parsed.ingredients || '食材',
        amounts: parsed.amounts || '70',
        saltGrams: parsed.saltGrams || '0.60',
        calories: Number(parsed.calories) || (effectiveRole === '主菜' ? 240 : effectiveRole === '副菜' ? 85 : 45),
        protein: Number(parsed.protein) || 10.5,
        fat: Number(parsed.fat) || 8.0,
        saltTotal: Number(parsed.saltTotal) || (effectiveRole === '主菜' ? 0.95 : effectiveRole === '副菜' ? 0.55 : 0.8),
        cookingNotes: (parsed.cookingNotes || '素材の旨味を引き出し適度な味付けで調理').replace(/監査/g, '栄養管理'),
        structured: Array.isArray(parsed.structured)
          ? parsed.structured
          : [{ name: trimmed, amountPerPerson: 70, unit: 'g', saltPerPerson: 0.5, isSeasoning: false }],
        calculatedForCount: currentResidentCount
      });
    } catch (err) {
      console.warn('Gemini API call failed in serverless function, falling back to autonomous nutrition engine:', err);
    }
  }

  // Graceful autonomous fallback
  const calculated = calculateDishNutrition(trimmed, mealCategory, effectiveRole, currentResidentCount);
  return res.status(200).json(calculated);
}
