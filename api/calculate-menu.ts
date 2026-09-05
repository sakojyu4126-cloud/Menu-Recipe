import { GoogleGenAI } from '@google/genai';
import { calculateDishNutrition } from '../src/utils/dishNutritionEngine';

export default async function handler(req: any, res: any) {
  // CORS / OPTIONS support
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
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

  // Try Gemini AI if API Key is configured in Vercel environment variables
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 15) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `あなたは高齢者施設（サービス付き高齢者向け住宅・70〜90代入居者）専門の管理栄養士です。
料理名: 「${trimmed}」（区分: ${mealCategory}、分類: ${dishType}）について、
高齢者の咀嚼・嚥下機能、消化吸収、そして施設目標「1日食塩摂取量6.5g以下」（1品あたり主菜0.5〜0.8g、副菜0.2〜0.4g、汁物0.6〜0.7g）を厳守した食品構成と栄養価を算定してください。

重要指示：
1. 「監査」という単語は絶対に使用しないでください。
2. 70〜90代の高齢者が安全に食べられるよう、食材のカット法や出汁の活用、軟らかく仕上げる減塩調理のポイントを含めてください。
3. 1人分の使用量(g)と調味料(g)、食塩相当量(g)を計算してください。

以下のJSON形式のみで返答してください：
{
  "dishName": "${trimmed}",
  "ingredients": "食材1 / 食材2\\n調味料1 / 調味料2",
  "amounts": "食材1g / 食材2g\\n調味料1g / 調味料2g",
  "saltGrams": "0.00\\n0.35 / 0.15 = 0.50",
  "calories": 120,
  "protein": 8.5,
  "fat": 3.2,
  "saltTotal": 0.50,
  "cookingNotes": "減塩・消化・食べやすさのための調理メモ（※監査の文字は禁止）",
  "structured": [
    { "name": "食材1", "amountPerPerson": 50, "unit": "g", "saltPerPerson": 0, "isSeasoning": false },
    { "name": "調味料1", "amountPerPerson": 3, "unit": "g", "saltPerPerson": 0.35, "isSeasoning": true }
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
        dishType,
        ingredients: parsed.ingredients || '食材',
        amounts: parsed.amounts || '50',
        saltGrams: parsed.saltGrams || '0.50',
        calories: Number(parsed.calories) || 120,
        protein: Number(parsed.protein) || 6.5,
        fat: Number(parsed.fat) || 3.0,
        saltTotal: Number(parsed.saltTotal) || 0.6,
        cookingNotes: (parsed.cookingNotes || '出汁を効かせ薄味で柔らかく調理').replace(/監査/g, '栄養管理'),
        structured: Array.isArray(parsed.structured) ? parsed.structured : [
          { name: trimmed, amountPerPerson: 60, unit: 'g', saltPerPerson: 0.5, isSeasoning: false }
        ],
        calculatedForCount: currentResidentCount
      });
    } catch (err) {
      console.warn('Gemini API call failed in serverless function, falling back to autonomous nutrition engine:', err);
    }
  }

  // Graceful autonomous fallback
  const calculated = calculateDishNutrition(trimmed, mealCategory, dishType, currentResidentCount);
  return res.status(200).json(calculated);
}
