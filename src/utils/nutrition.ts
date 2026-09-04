import { DayMenu, MealData, DishItem, StructuredIngredient } from '../types';

export const JAPANESE_DAYS = ['日', '月', '火', '水', '木', '金', '土'] as const;

export function getDayOfWeek(year: number, month: number, day: number): string {
  try {
    const d = new Date(year, month - 1, day);
    if (isNaN(d.getTime())) return '月';
    return JAPANESE_DAYS[d.getDay()] || '月';
  } catch {
    return '月';
  }
}

export function calculateMealTotals(meal: MealData) {
  let calories = 0;
  let protein = 0;
  let fat = 0;
  let saltTotal = 0;

  for (const item of meal.items) {
    calories += Number(item.calories) || 0;
    protein += Number(item.protein) || 0;
    fat += Number(item.fat) || 0;
    saltTotal += Number(item.saltTotal) || 0;
  }

  return {
    calories: Math.round(calories * 10) / 10,
    protein: Math.round(protein * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    saltTotal: Math.round(saltTotal * 100) / 100,
    isWithinLimit: saltTotal <= meal.maxTargetSalt
  };
}

export function calculateDayTotals(day: DayMenu, targetLimit: number = 6.5) {
  const b = calculateMealTotals(day.meals.breakfast);
  const l = calculateMealTotals(day.meals.lunch);
  const d = calculateMealTotals(day.meals.dinner);

  const calories = Math.round(b.calories + l.calories + d.calories);
  const protein = Math.round((b.protein + l.protein + d.protein) * 10) / 10;
  const fat = Math.round((b.fat + l.fat + d.fat) * 10) / 10;
  const saltTotal = Math.round((b.saltTotal + l.saltTotal + d.saltTotal) * 100) / 100;

  return {
    calories,
    protein,
    fat,
    saltTotal,
    isWithinDailyLimit: saltTotal <= targetLimit,
    targetLimit
  };
}

export function createBlankDayMenu(
  year: number = new Date().getFullYear(),
  month: number = new Date().getMonth() + 1,
  day: number = new Date().getDate()
): DayMenu {
  const dayOfWeek = getDayOfWeek(year, month, day);

  return {
    id: `menu-${Date.now()}`,
    dateInfo: {
      year,
      month,
      day,
      dayOfWeek
    },
    meals: {
      breakfast: {
        id: 'breakfast',
        name: '朝食',
        maxTargetSalt: 1.8,
        items: [
          {
            id: `b-${Date.now()}-1`,
            role: '主食',
            dishName: '',
            ingredients: '',
            amounts: '',
            saltGrams: '',
            calories: 0,
            protein: 0,
            fat: 0,
            saltTotal: 0
          },
          {
            id: `b-${Date.now()}-2`,
            role: '副菜',
            dishName: '',
            ingredients: '',
            amounts: '',
            saltGrams: '',
            calories: 0,
            protein: 0,
            fat: 0,
            saltTotal: 0
          },
          {
            id: `b-${Date.now()}-3`,
            role: '副菜',
            dishName: '',
            ingredients: '',
            amounts: '',
            saltGrams: '',
            calories: 0,
            protein: 0,
            fat: 0,
            saltTotal: 0
          },
          {
            id: `b-${Date.now()}-4`,
            role: '汁物',
            dishName: '',
            ingredients: '',
            amounts: '',
            saltGrams: '',
            calories: 0,
            protein: 0,
            fat: 0,
            saltTotal: 0
          }
        ]
      },
      lunch: {
        id: 'lunch',
        name: '昼食',
        maxTargetSalt: 2.5,
        items: [
          {
            id: `l-${Date.now()}-1`,
            role: '主食',
            dishName: '',
            ingredients: '',
            amounts: '',
            saltGrams: '',
            calories: 0,
            protein: 0,
            fat: 0,
            saltTotal: 0
          },
          {
            id: `l-${Date.now()}-2`,
            role: '副菜',
            dishName: '',
            ingredients: '',
            amounts: '',
            saltGrams: '',
            calories: 0,
            protein: 0,
            fat: 0,
            saltTotal: 0
          },
          {
            id: `l-${Date.now()}-3`,
            role: '副菜',
            dishName: '',
            ingredients: '',
            amounts: '',
            saltGrams: '',
            calories: 0,
            protein: 0,
            fat: 0,
            saltTotal: 0
          }
        ]
      },
      dinner: {
        id: 'dinner',
        name: '夕食',
        maxTargetSalt: 2.2,
        items: [
          {
            id: `d-${Date.now()}-1`,
            role: '主食',
            dishName: '',
            ingredients: '',
            amounts: '',
            saltGrams: '',
            calories: 0,
            protein: 0,
            fat: 0,
            saltTotal: 0
          },
          {
            id: `d-${Date.now()}-2`,
            role: '副菜',
            dishName: '',
            ingredients: '',
            amounts: '',
            saltGrams: '',
            calories: 0,
            protein: 0,
            fat: 0,
            saltTotal: 0
          },
          {
            id: `d-${Date.now()}-3`,
            role: '副菜',
            dishName: '',
            ingredients: '',
            amounts: '',
            saltGrams: '',
            calories: 0,
            protein: 0,
            fat: 0,
            saltTotal: 0
          }
        ]
      }
    }
  };
}

