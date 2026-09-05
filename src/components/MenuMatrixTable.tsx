import React, { useState } from 'react';
import { Sparkles, Trash2, Edit3, Check, X, ArrowUp, ArrowDown } from 'lucide-react';
import { MealData, DishItem, FacilityInfo } from '../types';
import { calculateMealTotals } from '../utils/nutrition';
import {
  calculateDishNutrition,
  inferDishRole,
  recalculateNutritionFromAmounts,
  extractSaltTotal
} from '../utils/dishNutritionEngine';

interface Props {
  meal: MealData;
  facilityInfo: FacilityInfo;
  showFacilityTotals?: boolean;
  compact?: boolean;
  onUpdateMeal: (updated: MealData) => void;
  onOpenDishEditModal: (dish: DishItem, mealId: 'breakfast' | 'lunch' | 'dinner') => void;
}

export const MenuMatrixTable: React.FC<Props> = ({
  meal,
  facilityInfo,
  compact = true,
  onUpdateMeal,
  onOpenDishEditModal
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingAiId, setLoadingAiId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<DishItem>>({});
  // 食塩量計算式の詳細展開状態（false/未設定: 最小限表示、true: 全表示）
  const [expandedSaltIds, setExpandedSaltIds] = useState<Record<string, boolean>>({});

  const totals = calculateMealTotals(meal);

  // 食塩計算式が複数行や詳細式を持っているか判定
  const hasDetailedSaltFormula = (saltGrams?: string) => {
    if (!saltGrams) return false;
    const trimmed = saltGrams.trim();
    return trimmed.includes('\n') || trimmed.includes('=') || trimmed.length > 12;
  };

  // 最小限表示（使用食材・調味料の行幅に合わせて可能な範囲で表示）
  const formatCompactSalt = (dish: DishItem) => {
    const text = (dish.saltGrams ?? '').trim();
    if (!text || text === '-') {
      return dish.saltTotal > 0 ? `${dish.saltTotal.toFixed(2)}g` : '-';
    }

    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

    // 1行だけで短い場合はそのまま表示
    if (lines.length <= 1 && text.length <= 12) {
      return text;
    }

    // 複数行の場合: 使用食材・調味料の行幅に合わせて2行程度に収める
    if (lines.length > 1) {
      const firstLine = lines[0];
      const lastLine = lines[lines.length - 1];

      let lastSummary = lastLine;
      if (lastLine.includes('=')) {
        const eqParts = lastLine.split('=');
        lastSummary = '=' + eqParts[eqParts.length - 1].trim();
      }
      return `${firstLine}\n${lastSummary}`;
    }

    // 1行で = 等を含む長い式の場合、合計部分をすっきり表示
    if (text.includes('=')) {
      const eqParts = text.split('=');
      return '=' + eqParts[eqParts.length - 1].trim();
    }

    if (dish.saltTotal > 0) {
      return `${dish.saltTotal.toFixed(2)}g`;
    }

    return text;
  };

  const toggleSaltExpand = (dishId: string) => {
    setExpandedSaltIds((prev) => ({
      ...prev,
      [dishId]: !prev[dishId]
    }));
  };

  // 全料理の食塩詳細の一括トグル
  const isAllSaltExpanded =
    meal.items.length > 0 && meal.items.every((item) => !!expandedSaltIds[item.id]);

  const toggleAllSaltExpand = () => {
    if (isAllSaltExpanded) {
      setExpandedSaltIds({});
    } else {
      const nextState: Record<string, boolean> = {};
      meal.items.forEach((item) => {
        nextState[item.id] = true;
      });
      setExpandedSaltIds(nextState);
    }
  };

  const handleStartEdit = (dish: DishItem) => {
    setEditingId(dish.id);
    setEditForm({ ...dish });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = (id: string) => {
    const targetItem = meal.items.find((i) => i.id === id);
    const newName = (editForm.dishName ?? targetItem?.dishName ?? '').trim();
    if (!newName) {
      alert('料理名を入力してください');
      return;
    }

    const targetRole = inferDishRole(newName, editForm.role || targetItem?.role);
    const newAmounts = (editForm.amounts ?? targetItem?.amounts ?? '').trim();
    const oldAmounts = (targetItem?.amounts ?? '').trim();

    // 分量が変更された場合、カロリー・塩分・タンパク質・脂質を自動スケール同期
    let finalCalories = Number(editForm.calories) || targetItem?.calories || 0;
    let finalSalt = Number(editForm.saltTotal) || targetItem?.saltTotal || 0;
    let finalProtein = Number(editForm.protein) || targetItem?.protein || 0;
    let finalFat = Number(editForm.fat) || targetItem?.fat || 0;
    let finalSaltGrams = editForm.saltGrams ?? targetItem?.saltGrams ?? '0.00';

    if (newAmounts && newAmounts !== oldAmounts) {
      const scaled = recalculateNutritionFromAmounts(newAmounts, editForm, oldAmounts);
      if (scaled.isScaled) {
        finalCalories = scaled.calories;
        finalSalt = scaled.saltTotal;
        finalProtein = scaled.protein;
        finalFat = scaled.fat;
        finalSaltGrams = scaled.saltGrams;
      }
    }

    let autoCalcData: any = null;
    const currentIng = editForm.ingredients ?? targetItem?.ingredients ?? '';

    // もし料理名が入力されていて、食材やカロリーが未入力(0)または料理名が変更された場合は自動で栄養価と調味料を算定
    if (newName && (newName !== targetItem?.dishName || !currentIng || currentIng === '未入力' || finalCalories === 0)) {
      autoCalcData = calculateDishNutrition(
        newName,
        meal.name,
        targetRole,
        facilityInfo.residentCount,
        newAmounts
      );
    }

    const updatedItems = meal.items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...editForm,
          role: autoCalcData?.dishType || editForm.role || targetRole,
          dishName: newName,
          ingredients: autoCalcData ? autoCalcData.ingredients : (editForm.ingredients ?? item.ingredients),
          amounts: autoCalcData ? autoCalcData.amounts : (editForm.amounts ?? item.amounts),
          saltGrams: autoCalcData ? autoCalcData.saltGrams : finalSaltGrams,
          calories: autoCalcData ? autoCalcData.calories : finalCalories,
          protein: autoCalcData ? autoCalcData.protein : finalProtein,
          fat: autoCalcData ? autoCalcData.fat : finalFat,
          saltTotal: autoCalcData ? autoCalcData.saltTotal : finalSalt,
          cookingNotes: autoCalcData ? autoCalcData.cookingNotes : (editForm.cookingNotes ?? item.cookingNotes),
          structured: autoCalcData ? autoCalcData.structured : (editForm.structured ?? item.structured)
        } as DishItem;
      }
      return item;
    });

    onUpdateMeal({ ...meal, items: updatedItems });
    setEditingId(null);
    setEditForm({});
  };

  const handleQuickAiRecalculate = async (dish: DishItem) => {
    const targetName = (editingId === dish.id && editForm.dishName ? editForm.dishName : dish.dishName).trim();
    if (!targetName) return;

    const targetRole = inferDishRole(targetName, editForm.role || dish.role);
    const targetAmount = (editingId === dish.id && editForm.amounts ? editForm.amounts : dish.amounts || '').trim();
    const targetIngredients = (editingId === dish.id && editForm.ingredients ? editForm.ingredients : dish.ingredients || '').trim();

    setLoadingAiId(dish.id);
    try {
      let data: any = null;

      // まず Vercel/サーバーの Gemini API エンドポイントを試行（ユーザー指定分量を送信）
      try {
        const res = await fetch('/api/calculate-menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dishName: targetName,
            mealCategory: meal.name,
            dishType: targetRole,
            currentResidentCount: facilityInfo.residentCount,
            amounts: targetAmount,
            ingredients: targetIngredients
          })
        });
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            data = await res.json();
          }
        }
      } catch (networkErr) {
        console.warn('API route call not available, falling back to autonomous nutrition engine:', networkErr);
      }

      // APIが無効・404・エラー時は、給食・栄養基準の自律計算エンジンで即座に高精度算定
      if (!data || !data.ingredients) {
        data = calculateDishNutrition(
          targetName,
          meal.name,
          targetRole,
          facilityInfo.residentCount,
          targetAmount
        );
      }

      const updatedDish: DishItem = {
        ...dish,
        dishName: targetName,
        role: data.dishType || targetRole,
        ingredients: data.ingredients,
        amounts: data.amounts || targetAmount || dish.amounts,
        saltGrams: data.saltGrams,
        calories: Number(data.calories) || 0,
        protein: Number(data.protein) || 0,
        fat: Number(data.fat) || 0,
        saltTotal: Number(data.saltTotal) || 0,
        cookingNotes: data.cookingNotes || dish.cookingNotes,
        structured: data.structured
      };

      if (editingId === dish.id) {
        setEditForm(updatedDish);
      }

      const updatedItems = meal.items.map((item) => (item.id === dish.id ? updatedDish : item));
      onUpdateMeal({ ...meal, items: updatedItems });
    } catch (err) {
      console.error('AI calculation fallback handling:', err);
      // 万一の例外でも自律計算を実行して指定分量で反映
      const safeData = calculateDishNutrition(
        targetName,
        meal.name,
        targetRole,
        facilityInfo.residentCount,
        targetAmount
      );
      const fallbackDish: DishItem = {
        ...dish,
        dishName: targetName,
        role: safeData.dishType || targetRole,
        ingredients: safeData.ingredients,
        amounts: safeData.amounts || targetAmount,
        saltGrams: safeData.saltGrams,
        calories: safeData.calories,
        protein: safeData.protein,
        fat: safeData.fat,
        saltTotal: safeData.saltTotal,
        cookingNotes: safeData.cookingNotes,
        structured: safeData.structured
      };
      if (editingId === dish.id) setEditForm(fallbackDish);
      onUpdateMeal({
        ...meal,
        items: meal.items.map((item) => (item.id === dish.id ? fallbackDish : item))
      });
    } finally {
      setLoadingAiId(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    onUpdateMeal({
      ...meal,
      items: meal.items.filter((item) => item.id !== id)
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newItems = [...meal.items];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    onUpdateMeal({ ...meal, items: newItems });
  };

  const cellPadding = compact ? 'py-1 px-2' : 'py-2 px-3';
  const headerPadding = compact ? 'py-1.5 px-2' : 'py-2 px-3';

  return (
    <div
      className={`bg-white border border-stone-300 rounded-lg shadow-2xs overflow-hidden print:border-black print:shadow-none ${
        compact ? 'mb-2' : 'mb-3'
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#2e4c43] text-white font-bold border-b border-stone-300 print:bg-transparent print:text-black print:border-b-2 print:border-black">
              <th className={`${headerPadding} w-12 text-center border-r border-emerald-900/60 print:border-black font-semibold text-[11px]`}>
                区分
              </th>
              <th className={`${headerPadding} w-44 sm:w-48 border-r border-emerald-900/60 print:border-black font-semibold text-[11px]`}>
                料理名
              </th>
              <th className={`${headerPadding} w-72 sm:w-96 border-r border-emerald-900/60 print:border-black font-semibold text-[11px]`}>
                使用食材・調味料
              </th>
              <th className={`${headerPadding} w-20 text-center border-r border-emerald-900/60 print:border-black font-semibold text-[11px]`}>
                使用量(g)
              </th>
              <th className={`${headerPadding} w-24 text-center border-r border-emerald-900/60 print:border-black font-semibold text-[11px]`}>
                <div className="flex items-center justify-center gap-1">
                  <span>食塩量(g)</span>
                  <button
                    type="button"
                    onClick={toggleAllSaltExpand}
                    className="p-0.5 rounded hover:bg-emerald-800/80 text-emerald-200 hover:text-white transition-colors print:hidden"
                    title={isAllSaltExpanded ? "全行の食塩計算式を最小限に折りたたむ（↑）" : "全行の食塩計算式を全表示する（↓）"}
                  >
                    {isAllSaltExpanded ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                  </button>
                </div>
              </th>
              <th className={`${headerPadding} w-16 text-center print:hidden font-semibold text-[11px]`}>
                操作
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-stone-200 print:divide-black">
            {meal.items.map((dish, index) => {
              const isEditing = editingId === dish.id;
              const isLoadingAi = loadingAiId === dish.id;

              return (
                <tr
                  key={dish.id}
                  className={`hover:bg-amber-50/20 transition-colors ${
                    isEditing ? 'bg-amber-50/50' : ''
                  }`}
                >
                  {/* 区分 */}
                  {index === 0 && (
                    <td
                      rowSpan={meal.items.length}
                      className="py-1 px-1.5 text-center font-bold text-stone-900 border-r border-stone-300 align-middle bg-stone-50/70 print:bg-transparent print:border-black text-xs"
                    >
                      <div className="tracking-wider">
                        {meal.name}
                      </div>
                    </td>
                  )}

                  {/* 料理名 */}
                  <td className={`${cellPadding} border-r border-stone-200 print:border-black align-top`}>
                    {isEditing ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={editForm.dishName ?? ''}
                          onChange={(e) => setEditForm({ ...editForm, dishName: e.target.value })}
                          className="w-full font-bold text-stone-900 bg-white border border-stone-300 rounded px-1.5 py-0.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          placeholder="料理名を入力"
                        />
                        <div className="flex items-center gap-1">
                          <select
                            value={editForm.role ?? dish.role}
                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                            className="text-[10px] bg-white border border-stone-300 rounded px-1 py-0.5"
                          >
                            <option value="主食">主食</option>
                            <option value="主菜">主菜</option>
                            <option value="副菜">副菜</option>
                            <option value="汁物">汁物</option>
                            <option value="追加料理">追加料理</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleQuickAiRecalculate(dish)}
                            disabled={isLoadingAi}
                            className="flex items-center gap-0.5 text-[10px] font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-1.5 py-0.5 rounded shadow-2xs"
                            title="料理名から栄養・食材を自動計算"
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>AI計算</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="group cursor-pointer" onClick={() => handleStartEdit(dish)}>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-stone-900 leading-tight">
                            {dish.dishName || <span className="text-stone-400 font-normal">（料理名を入力）</span>}
                          </span>
                          <span className="text-[9px] text-stone-400 font-normal opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                            編集
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500 font-normal mt-0.5 flex items-center gap-1.5">
                          <span>{dish.calories} kcal</span>
                          <span>塩分 {dish.saltTotal.toFixed(2)}g</span>
                        </div>
                      </div>
                    )}
                  </td>

                  {/* 使用食材・調味料 */}
                  <td className={`${cellPadding} text-stone-800 border-r border-stone-200 print:border-black align-top whitespace-pre-line leading-tight font-sans text-xs`}>
                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={editForm.ingredients ?? ''}
                        onChange={(e) => setEditForm({ ...editForm, ingredients: e.target.value })}
                        className="w-full text-xs bg-white border border-stone-300 rounded px-1.5 py-0.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"
                        placeholder="使用食材 / 調味料の配合詳細"
                      />
                    ) : (
                      <div
                        onClick={() => handleStartEdit(dish)}
                        className="cursor-pointer hover:bg-stone-100/60 p-0.5 rounded"
                        title="クリックして直接手入力・編集"
                      >
                        {dish.ingredients || <span className="text-stone-300">未入力</span>}
                      </div>
                    )}
                  </td>

                  {/* 使用量(g) */}
                  <td className={`${cellPadding} text-stone-800 border-r border-stone-200 print:border-black align-top text-center whitespace-pre-line font-mono font-medium text-xs`}>
                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={editForm.amounts ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const scaled = recalculateNutritionFromAmounts(val, editForm, dish.amounts);
                          if (scaled.isScaled) {
                            setEditForm({
                              ...editForm,
                              amounts: val,
                              calories: scaled.calories,
                              protein: scaled.protein,
                              fat: scaled.fat,
                              saltTotal: scaled.saltTotal,
                              saltGrams: scaled.saltGrams
                            });
                          } else {
                            setEditForm({ ...editForm, amounts: val });
                          }
                        }}
                        className="w-full text-xs text-center bg-white border border-stone-300 rounded px-1 py-0.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        placeholder="60 / 1"
                      />
                    ) : (
                      <div
                        onClick={() => handleStartEdit(dish)}
                        className="cursor-pointer hover:bg-stone-100/60 p-0.5 rounded text-stone-900"
                        title="クリックして直接手入力・編集"
                      >
                        {dish.amounts || <span className="text-stone-300">-</span>}
                      </div>
                    )}
                  </td>

                  {/* 食塩量(g) */}
                  <td className={`${cellPadding} text-stone-800 border-r border-stone-200 print:border-black align-top text-center font-mono font-medium text-xs`}>
                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={editForm.saltGrams ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const calculatedSalt = extractSaltTotal(val);
                          setEditForm({
                            ...editForm,
                            saltGrams: val,
                            saltTotal: calculatedSalt > 0 ? calculatedSalt : editForm.saltTotal
                          });
                        }}
                        className="w-full text-xs text-center bg-white border border-stone-300 rounded px-1 py-0.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-bold text-[#b93822]"
                        placeholder="0.60 / 0.16"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-start">
                        {expandedSaltIds[dish.id] ? (
                          // 詳細全表示モード（「↓」が押されたとき）
                          <div className="w-full flex flex-col items-center">
                            <div className="w-full flex items-center justify-between gap-1 mb-0.5 print:hidden">
                              <span className="text-[9px] text-stone-400 font-sans">全表示</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSaltExpand(dish.id);
                                }}
                                className="p-0.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200/70 rounded transition-colors"
                                title="最小限の表示に折りたたむ（↑）"
                              >
                                <ArrowUp className="w-2.5 h-2.5" />
                              </button>
                            </div>
                            <div
                              onClick={() => handleStartEdit(dish)}
                              className="cursor-pointer hover:bg-stone-100/60 p-0.5 rounded text-stone-900 font-bold whitespace-pre-line text-center text-xs leading-tight w-full"
                              title="クリックして直接手入力・編集"
                            >
                              {dish.saltGrams || <span className="text-stone-300">-</span>}
                            </div>
                          </div>
                        ) : (
                          // 最小限表示モード（「↑」または初期状態：使用食材・調味料行幅に合わせてコンパクトに表示）
                          <div className="w-full flex items-center justify-center gap-1">
                            <div
                              onClick={() => handleStartEdit(dish)}
                              className="cursor-pointer hover:bg-stone-100/60 p-0.5 rounded text-stone-900 font-bold whitespace-pre-line text-center text-xs leading-tight"
                              title="クリックして直接手入力・編集"
                            >
                              {formatCompactSalt(dish)}
                            </div>
                            {hasDetailedSaltFormula(dish.saltGrams) && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSaltExpand(dish.id);
                                }}
                                className="p-0.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/70 rounded transition-colors print:hidden"
                                title="計算式の詳細を全表示する（↓）"
                              >
                                <ArrowDown className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* 操作ボタン */}
                  <td className="py-1 px-1 text-center align-top print:hidden">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(dish.id)}
                          className="p-0.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                          title="保存"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="p-0.5 bg-stone-200 text-stone-700 rounded hover:bg-stone-300 transition-colors"
                          title="キャンセル"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-0.5 text-stone-400">
                        <button
                          type="button"
                          onClick={() => handleQuickAiRecalculate(dish)}
                          disabled={isLoadingAi}
                          className={`p-0.5 rounded hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${
                            isLoadingAi ? 'animate-spin text-emerald-600' : ''
                          }`}
                          title="AIで自動計算"
                        >
                          <Sparkles className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenDishEditModal(dish, meal.id)}
                          className="p-0.5 rounded hover:bg-stone-100 hover:text-stone-700 transition-colors"
                          title="詳細"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(dish.id)}
                          className="p-0.5 rounded hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="削除"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => handleMove(index, 'up')}
                            disabled={index === 0}
                            className="p-0.5 text-stone-400 hover:text-stone-700 disabled:opacity-20"
                            title="上へ"
                          >
                            <ArrowUp className="w-2 h-2" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMove(index, 'down')}
                            disabled={index === meal.items.length - 1}
                            className="p-0.5 text-stone-400 hover:text-stone-700 disabled:opacity-20"
                            title="下へ"
                          >
                            <ArrowDown className="w-2 h-2" />
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {/* Subtotal Row: Single clean line, compact */}
            <tr className="bg-[#f2f5f3] font-bold border-t border-stone-300 print:bg-transparent print:border-black text-stone-800">
              <td className="py-1 px-2 text-center border-r border-stone-300 print:border-black font-bold whitespace-nowrap text-xs">
                {meal.name}計
              </td>
              <td className="py-1 px-2 border-r border-stone-300 print:border-black whitespace-nowrap text-xs">
                <span className="text-stone-600 font-medium text-[11px] mr-1">エネルギー:</span>
                <span className="text-stone-900 font-extrabold text-xs">{totals.calories}</span>
                <span className="text-stone-600 text-[10px] ml-0.5">kcal</span>
              </td>
              <td className="py-1 px-2 border-r border-stone-300 print:border-black text-[11px] text-stone-600">
                タンパク質: {totals.protein}g / 脂質: {totals.fat}g
              </td>
              <td className="py-1 px-2 border-r border-stone-300 print:border-black text-center text-[10px] text-stone-500 whitespace-nowrap">
                食塩計
              </td>
              <td className="py-1 px-2 border-r border-stone-300 print:border-black text-center font-mono text-xs font-extrabold text-[#b93822] whitespace-nowrap">
                {totals.saltTotal.toFixed(2)} g
              </td>
              <td className="print:hidden"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
