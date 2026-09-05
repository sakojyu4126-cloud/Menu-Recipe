import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { calculateDishNutrition, inferDishRole } from './src/utils/dishNutritionEngine';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Route: Calculate nutritional values, food composition, and amounts for any dish
app.post('/api/calculate-menu', async (req, res) => {
  const { dishName, mealCategory = '昼食', dishType = '主菜', currentResidentCount = 57 } = req.body;

  if (!dishName || typeof dishName !== 'string') {
    return res.status(400).json({ error: '料理名（dishName）が必要です' });
  }

  const trimmed = dishName.trim();
  const effectiveRole = inferDishRole(trimmed, dishType);

  // If Gemini API Key is available and not a placeholder, call gemini-3.8-flash with timeout
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
3. 洋食料理（オムレツ、ウインナー、ポトフ、コロッケ、コールスロー等）にみりんや薄口醤油を画一的に使用しないでください。
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

      return res.json({
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
      console.warn('Gemini API call failed or timed out, generating calculated fallback:', err);
    }
  }

  // Heuristic intelligent fallback when API key is not present or offline
  const calculated = calculateDishNutrition(trimmed, mealCategory, effectiveRole, currentResidentCount);
  return res.json(calculated);
});

// API Route: Suggest full day balanced menu
app.post('/api/suggest-day-menu', async (req, res) => {
  const { currentResidentCount = 57, dayNumber = 1 } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `あなたは給食・栄養管理の専門家です。
1日分の献立（朝食、昼食、夕食）を作成してください。
重要条件：
1. 1日合計カロリーは1400〜1600kcal以内、1日合計食塩相当量は約6.0g（朝1.8g、昼2.1g、夕2.1g）。
2. 基本構成：
   - 朝：主食（ご飯またはパン）、主菜（卵・ウインナー等）、副菜、汁物
   - 昼：主食、主菜（肉または魚 70〜80g）、副菜、汁物
   - 夕：主食、主菜（肉または魚 70〜80g）、副菜、汁物
3. 「監査」という単語は絶対に一切使用しないでください。
4. 各料理の食品構成（食材、分量g、調味料、食塩量g、調理メモ）を正確に計算してください。洋食には洋風調味料、和食には和風調味料を使用してください。一律45gなどの極小分量は禁止です。

以下のJSON形式で返答してください：
{
  "dayTitle": "第${dayNumber}日目（献立詳細）",
  "meals": {
    "朝食": [
      { "role": "主食", "dishName": "御飯", "ingredients": "精白米（炊き上がり 150g）", "amounts": "65", "saltGrams": "0.00", "calories": 234, "protein": 3.8, "fat": 0.5, "saltTotal": 0.0, "cookingNotes": "ふっくら炊飯" }
    ],
    "昼食": [],
    "夕食": []
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (e) {
      console.warn('AI full day menu generation fallback:', e);
    }
  }

  // Default day fallback
  return res.json({ status: 'default_available' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', facility: '桃の郷 京都東山', residents: 57 });
});

// Vite middleware in dev or static serving in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`桃の郷 献立管理システム サーバー起動: http://0.0.0.0:${PORT}`);
  });
}

startServer();
