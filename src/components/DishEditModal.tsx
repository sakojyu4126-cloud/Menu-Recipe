import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Flame, HeartPulse, Scale, ShieldAlert } from 'lucide-react';
import { DishItem, FacilityInfo } from '../types';

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

  useEffect(() => {
    if (dish) {
      setFormData({ ...dish });
    }
  }, [dish]);

  if (!isOpen || !dish) return null;

  const handleAiRecalculate = async () => {
    if (!formData.dishName?.trim()) return;

    setIsAiCalculating(true);
    try {
      const res = await fetch('/api/calculate-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dishName: formData.dishName.trim(),
          mealCategory: mealName,
          dishType: formData.role || '主菜',
          currentResidentCount: facilityInfo.residentCount
        })
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();

      setFormData(prev => ({
        ...prev,
        ingredients: data.ingredients,
        amounts: data.amounts,
        saltGrams: data.saltGrams,
        calories: data.calories,
        protein: data.protein,
        fat: data.fat,
        saltTotal: data.saltTotal,
        cookingNotes: data.cookingNotes,
        structured: data.structured
      }));
    } catch (e) {
      console.error(e);
      alert('自動計算でエラーが発生しました。手動で入力内容を調整できます。');
    } finally {
      setIsAiCalculating(false);
    }
  };

  const handleSave = () => {
    if (!formData.dishName?.trim()) {
      alert('料理名を入力してください');
      return;
    }

    const updated: DishItem = {
      ...dish,
      role: formData.role || dish.role,
      dishName: formData.dishName.trim(),
      ingredients: formData.ingredients || '',
      amounts: formData.amounts || '',
      saltGrams: formData.saltGrams || '0.00',
      calories: Number(formData.calories) || 0,
      protein: Number(formData.protein) || 0,
      fat: Number(formData.fat) || 0,
      saltTotal: Number(formData.saltTotal) || 0,
      cookingNotes: formData.cookingNotes || '',
      structured: formData.structured || dish.structured
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
              <label className="block text-xs font-bold text-stone-700 mb-1">
                使用量(g) 1人分
              </label>
              <textarea
                rows={4}
                value={formData.amounts ?? ''}
                onChange={(e) => setFormData({ ...formData, amounts: e.target.value })}
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
            <label className="block text-xs font-bold text-stone-700 mb-1">
              食塩量(g)の内訳詳細
            </label>
            <input
              type="text"
              value={formData.saltGrams ?? ''}
              onChange={(e) => setFormData({ ...formData, saltGrams: e.target.value })}
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
