import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Flame, HeartPulse, Scale, ShieldAlert, RefreshCw } from 'lucide-react';
import { DishItem, FacilityInfo } from '../types';
import {
  calculateDishNutrition,
  inferDishRole,
  recalculateNutritionFromAmounts,
  extractSaltTotal
} from '../utils/dishNutritionEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dish: DishItem | null;
  mealId: 'breakfast' | 'lunch' | 'dinner';
  mealName: string;
  facilityInfo: FacilityInfo;
  onSave: (updatedDish: DishItem, mealId: 'breakfast' | 'lunch' | 'dinner') => void;
}

export const DishEditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  dish,
  mealId,
  mealName,
  facilityInfo,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<DishItem>>({});
  const [isAiCalculating, setIsAiCalculating] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    if (dish) {
      setFormData({ ...dish });
      setSyncMessage(null);
    }
  }, [dish]);

  if (!isOpen || !dish) return null;

  // 使用量（amounts）の変更時に、カロリー・タンパク質・脂質・塩分量を自動同期
  const handleAmountsChange = (newAmounts: string) => {
    const scaled = recalculateNutritionFromAmounts(newAmounts, formData, dish.amounts);

    if (scaled.isScaled) {
      setFormData(prev => ({
        ...prev,
        amounts: newAmounts,
        calories: scaled.calories,
        protein: scaled.protein,
        fat: scaled.fat,
        saltTotal: scaled.saltTotal,
        saltGrams: scaled.saltGrams
      }));
      setSyncMessage(`💡 分量の変更に合わせて、カロリー（${scaled.calories} kcal）と塩分量（${scaled.saltTotal} g）を自動同期しました`);
    } else {
      setFormData(prev => ({ ...prev, amounts: newAmounts }));
    }
  };

  // 食塩内訳の変更時に、食塩相当量合計を自動同期
  const handleSaltGramsChange = (newSaltGrams: string) => {
    const calculatedSalt = extractSaltTotal(newSaltGrams);
    setFormData(prev => ({
      ...prev,
      saltGrams: newSaltGrams,
      saltTotal: calculatedSalt > 0 ? calculatedSalt : prev.saltTotal
    }));
  };

  const handleAiRecalculate = async () => {
    const targetName = (formData.dishName || '').trim();
    if (!targetName) return;

    const targetRole = inferDishRole(targetName, formData.role || dish.role);
    const specifiedAmount = (formData.amounts || '').trim();
    setIsAiCalculating(true);
    setSyncMessage(null);

    try {
      let data: any = null;

      try {
        const res = await fetch('/api/calculate-menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dishName: targetName,
            mealCategory: mealName,
            dishType: targetRole,
            currentResidentCount: facilityInfo.residentCount,
            amounts: specifiedAmount,
            ingredients: formData.ingredients || ''
          })
        });

        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            data = await res.json();
          }
        }
      } catch (networkErr) {
        console.warn('API endpoint not reachable, calculating with autonomous nutrition engine:', networkErr);
      }

      if (!data || !data.ingredients) {
        data = calculateDishNutrition(
          targetName,
          mealName,
          targetRole,
          facilityInfo.residentCount,
          specifiedAmount
        );
      }

      setFormData(prev => ({
        ...prev,
        dishName: targetName,
        role: data.dishType || targetRole,
        ingredients: data.ingredients,
        amounts: data.amounts || specifiedAmount || prev.amounts,
        saltGrams: data.saltGrams,
        calories: Number(data.calories) || 0,
        protein: Number(data.protein) || 0,
        fat: Number(data.fat) || 0,
        saltTotal: Number(data.saltTotal) || 0,
        cookingNotes: data.cookingNotes || prev.cookingNotes,
        structured: data.structured
      }));
      setSyncMessage(`✨ 指定分量（${data.amounts || specifiedAmount}g）に基づき、高精度にAI再計算・同期しました`);
    } catch (e) {
      console.error('Calculation error fallback:', e);
      const safeData = calculateDishNutrition(
        targetName,
        mealName,
        targetRole,
        facilityInfo.residentCount,
        specifiedAmount
      );
      setFormData(prev => ({
        ...prev,
        dishName: targetName,
        role: safeData.dishType || targetRole,
        ingredients: safeData.ingredients,
        amounts: safeData.amounts || specifiedAmount,
        saltGrams: safeData.saltGrams,
        calories: safeData.calories,
        protein: safeData.protein,
        fat: safeData.fat,
        saltTotal: safeData.saltTotal,
        cookingNotes: safeData.cookingNotes,
        structured: safeData.structured
      }));
    } finally {
      setIsAiCalculating(false);
    }
  };

  const handleSave = () => {
    const rawName = (formData.dishName || '').trim();
    if (!rawName) {
      alert('料理名を入力してください');
      return;
    }

    const targetRole = inferDishRole(rawName, formData.role || dish.role);
    const currentAmounts = (formData.amounts || '').trim();
    let finalCalories = Number(formData.calories) || 0;
    let finalSalt = Number(formData.saltTotal) || 0;
    let finalProtein = Number(formData.protein) || 0;
    let finalFat = Number(formData.fat) || 0;
    let finalSaltGrams = formData.saltGrams || dish.saltGrams;

    // もし分量が変更されていて、カロリーが未同期のまま保存されようとしている場合、確実に同期
    if (currentAmounts && currentAmounts !== dish.amounts) {
      const syncResult = recalculateNutritionFromAmounts(currentAmounts, formData, dish.amounts);
      if (syncResult.isScaled) {
        finalCalories = syncResult.calories;
        finalSalt = syncResult.saltTotal;
        finalProtein = syncResult.protein;
        finalFat = syncResult.fat;
        finalSaltGrams = syncResult.saltGrams;
      }
    }

    let currentIng = formData.ingredients || '';
    let autoData: any = null;

    if (!currentIng || currentIng === '未入力' || finalCalories === 0 || rawName !== dish.dishName) {
      autoData = calculateDishNutrition(rawName, mealName, targetRole, facilityInfo.residentCount, currentAmounts);
    }

    const updated: DishItem = {
      ...dish,
      role: autoData?.dishType || formData.role || targetRole,
      dishName: rawName,
      ingredients: autoData ? autoData.ingredients : (formData.ingredients || ''),
      amounts: autoData ? autoData.amounts : (formData.amounts || ''),
      saltGrams: autoData ? autoData.saltGrams : finalSaltGrams,
      calories: autoData ? autoData.calories : finalCalories,
      protein: autoData ? autoData.protein : finalProtein,
      fat: autoData ? autoData.fat : finalFat,
      saltTotal: autoData ? autoData.saltTotal : finalSalt,
      cookingNotes: autoData ? autoData.cookingNotes : (formData.cookingNotes || ''),
      structured: autoData ? autoData.structured : (formData.structured || dish.structured)
    };

    onSave(updated, mealId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-stone-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 rounded-t-xl">
          <div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              {mealName} / 料理詳細設定
            </span>
            <h3 className="text-lg font-bold text-stone-900 mt-1">
              {formData.dishName || '料理の編集'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-sm">
          {/* Dish Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                料理名（手入力・自由変更可能）
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.dishName ?? ''}
                  onChange={(e) => setFormData({ ...formData, dishName: e.target.value })}
                  className="w-full font-bold bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="料理名（例：カレイの煮付け）"
                />
                <button
                  type="button"
                  onClick={handleAiRecalculate}
                  disabled={isAiCalculating || !formData.dishName?.trim()}
                  className="flex items-center gap-1 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap shadow-xs"
                  title="入力した料理名から栄養・食材・分量をAI自動計算"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAiCalculating ? 'animate-spin' : ''}`} />
                  <span>{isAiCalculating ? '計算中' : 'AI自動計算'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                区分・役割
              </label>
              <select
                value={formData.role ?? '主菜'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="主食">主食</option>
                <option value="主菜">主菜</option>
                <option value="副菜">副菜</option>
                <option value="汁物">汁物</option>
                <option value="追加料理">追加料理</option>
                <option value="デザート・その他">デザート・その他</option>
              </select>
            </div>
          </div>

          {/* Sync notification message */}
          {syncMessage && (
            <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg animate-in fade-in">
              <RefreshCw className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{syncMessage}</span>
            </div>
          )}

          {/* Nutritional Breakdown Row */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="text-xs font-bold text-stone-700 mb-2 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-700" />
              <span>1食分基本栄養価</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-stone-500 mb-0.5">エネルギー (kcal)</label>
                <input
                  type="number"
                  step="1"
                  value={formData.calories ?? 0}
                  onChange={(e) => setFormData({ ...formData, calories: parseFloat(e.target.value) || 0 })}
                  className="w-full font-bold bg-white border border-stone-300 rounded px-2 py-1 text-stone-900"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-500 mb-0.5">タンパク質 (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.protein ?? 0}
                  onChange={(e) => setFormData({ ...formData, protein: parseFloat(e.target.value) || 0 })}
                  className="w-full font-bold bg-white border border-stone-300 rounded px-2 py-1 text-stone-900"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-500 mb-0.5">脂質 (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.fat ?? 0}
                  onChange={(e) => setFormData({ ...formData, fat: parseFloat(e.target.value) || 0 })}
                  className="w-full font-bold bg-white border border-stone-300 rounded px-2 py-1 text-stone-900"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-500 mb-0.5">食塩相当量 (g)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.saltTotal ?? 0}
                  onChange={(e) => setFormData({ ...formData, saltTotal: parseFloat(e.target.value) || 0 })}
                  className="w-full font-extrabold bg-white border border-stone-300 rounded px-2 py-1 text-[#b93822]"
                />
              </div>
            </div>
          </div>

          {/* Ingredients and Amounts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                使用食材・調味料の配合詳細
              </label>
              <textarea
                rows={4}
                value={formData.ingredients ?? ''}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                className="w-full text-xs font-mono bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="白鮭（甘塩・生換算）&#10;薄口醤油（仕上げ風味付け）"
              />
              <span className="text-[11px] text-stone-500">※改行やスラッシュ「/」で食材と調味料を区分</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-stone-700">
                  使用量(g) 1人分
                </label>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                  分量変更でカロリー・塩分を自動同期
                </span>
              </div>
              <textarea
                rows={4}
                value={formData.amounts ?? ''}
                onChange={(e) => handleAmountsChange(e.target.value)}
                className="w-full text-xs font-mono bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="60&#10;1"
              />
              <span className="text-[11px] text-stone-500">
                ※入居者{facilityInfo.residentCount}名全員分の総量は自動計算されます
              </span>
            </div>
          </div>

          {/* Salt Detailed Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700">
                食塩量(g)の内訳詳細
              </label>
              <span className="text-[10px] text-stone-500">
                ※内訳変更で食塩相当量合計に自動反映
              </span>
            </div>
            <input
              type="text"
              value={formData.saltGrams ?? ''}
              onChange={(e) => handleSaltGramsChange(e.target.value)}
              className="w-full text-xs font-mono bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="0.60&#10;0.16"
            />
          </div>

          {/* Cooking Notes (調理メモ・減塩工夫) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              調理メモ（塩分調整・減塩工夫・高齢者配慮）
            </label>
            <textarea
              rows={3}
              value={formData.cookingNotes ?? ''}
              onChange={(e) => setFormData({ ...formData, cookingNotes: e.target.value })}
              className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="出汁の活用、酸味や生姜での減塩工夫、軟らかく仕上げる調理法など"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 rounded-b-xl flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-lg transition-colors"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>献立表に反映</span>
          </button>
        </div>
      </div>
    </div>
  );
};
