export interface StructuredIngredient {
  name: string;
  amountPerPerson: number; // in grams
  unit: string;
  saltPerPerson: number; // in grams
  isSeasoning: boolean;
}

export interface DishItem {
  id: string;
  role: '主食' | '主菜' | '副菜' | '汁物' | '追加料理' | 'デザート・その他';
  dishName: string;
  ingredients: string; // Formatted text as shown in image
  amounts: string; // e.g., "60\n1"
  saltGrams: string; // e.g., "0.60\n0.16"
  calories: number; // kcal
  protein: number; // g
  fat: number; // g
  saltTotal: number; // g
  cookingNotes?: string;
  structured?: StructuredIngredient[];
}

export interface MealData {
  id: 'breakfast' | 'lunch' | 'dinner';
  name: '朝食' | '昼食' | '夕食';
  targetSaltNote?: string;
  maxTargetSalt: number; // e.g. 1.8, 2.5, 2.2
  items: DishItem[];
}

export interface DayMenuDateInfo {
  year: number; // e.g. 2026
  month: number; // e.g. 9
  day: number; // e.g. 4
  dayOfWeek: string; // e.g. "金"
}

export interface DayMenu {
  id: string;
  dateInfo: DayMenuDateInfo;
  meals: {
    breakfast: MealData;
    lunch: MealData;
    dinner: MealData;
  };
}

export interface SavedMenuRecord {
  id: string;
  dateKey: string; // "2026-09-04"
  dateDisplay: string; // "9月4日（金）"
  year: number;
  month: number;
  day: number;
  dayOfWeek: string;
  residentCount: number;
  meals: DayMenu['meals'];
  totals: {
    calories: number;
    protein: number;
    fat: number;
    saltTotal: number;
  };
  savedAt: string;
}

export interface FacilityInfo {
  titlePrefix: string; // "桃の郷 京都東山 献立表"
  month: string; // "9"
  yearEra: string; // "令和8"
  residentCount: number; // 57
  maxDailySaltTarget: number; // 6.5
}

