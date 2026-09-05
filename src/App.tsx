import React, { useState, useEffect } from 'react';
import { MenuHeader } from './components/MenuHeader';
import { DailyNutritionSummary } from './components/DailyNutritionSummary';
import { MenuMatrixTable } from './components/MenuMatrixTable';
import { SavedMenuList } from './components/SavedMenuList';
import { PrintModal } from './components/PrintModal';
import { SavedListPrintModal } from './components/SavedListPrintModal';
import { DishEditModal } from './components/DishEditModal';
import { DataBackupModal } from './components/DataBackupModal';
import { initialDays } from './data/initialMenu';
import { DayMenu, FacilityInfo, MealData, DishItem, SavedMenuRecord, DayMenuDateInfo } from './types';
import { createBlankDayMenu, calculateDayTotals, getDayOfWeek } from './utils/nutrition';
import { AppBackupData } from './utils/dataBackup';
import { RotateCcw, Save, CheckCircle2, Layers } from 'lucide-react';

const STORAGE_KEY_SAVED_RECORDS = 'momonosato_saved_records_v3';
const STORAGE_KEY_SHEET_DAYS = 'momonosato_sheet_days_v3';
const STORAGE_KEY_FACILITY = 'momonosato_facility_info_v3';
const STORAGE_KEY_SHEET_MODE = 'momonosato_sheet_mode_v3';

export default function App() {
  const [facilityInfo, setFacilityInfo] = useState<FacilityInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FACILITY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      titlePrefix: '桃の郷 京都東山 献立表',
      month: '9',
      yearEra: '令和8',
      residentCount: 57,
      maxDailySaltTarget: 6.5
    };
  });

  // Sheet mode: 2 days by default per user request ("せめてこの1シートに２～３日分...少なくとも2日分ははいるような気がします")
  const [sheetMode, setSheetMode] = useState<1 | 2 | 3>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SHEET_MODE);
      if (saved === '1' || saved === '2' || saved === '3') return Number(saved) as 1 | 2 | 3;
    } catch (e) {
      console.error(e);
    }
    return 2;
  });

  // Current days displayed on this single sheet (1, 2, or 3 days)
  const [sheetDays, setSheetDays] = useState<DayMenu[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SHEET_DAYS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    // Default to 2 days initialized from initialDays
    return initialDays.slice(0, 2);
  });

  // Saved records list
  const [savedRecords, setSavedRecords] = useState<SavedMenuRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED_RECORDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Seed with initial day 1, day 2, day 3 for immediate usability
    return initialDays.map((d, index) => {
      const totals = calculateDayTotals(d, 6.5);
      return {
        id: `rec-seed-${index + 1}`,
        dateKey: `${d.dateInfo.year}-${String(d.dateInfo.month).padStart(2, '0')}-${String(d.dateInfo.day).padStart(2, '0')}`,
        year: d.dateInfo.year,
        month: d.dateInfo.month,
        day: d.dateInfo.day,
        dayOfWeek: d.dateInfo.dayOfWeek,
        dateDisplay: `${d.dateInfo.month}月${d.dateInfo.day}日（${d.dateInfo.dayOfWeek}）`,
        residentCount: 57,
        meals: d.meals,
        totals: {
          calories: totals.calories,
          protein: totals.protein,
          fat: totals.fat,
          saltTotal: totals.saltTotal
        },
        savedAt: `2026/09/0${index + 4} 08:30`
      };
    });
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'list'>('edit');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isSavedListPrintModalOpen, setIsSavedListPrintModalOpen] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const [backupModal, setBackupModal] = useState<{
    isOpen: boolean;
    defaultTab: 'save' | 'restore';
  }>({
    isOpen: false,
    defaultTab: 'save'
  });

  const [dishEditModal, setDishEditModal] = useState<{
    isOpen: boolean;
    dayIndex: number;
    dish: DishItem | null;
    mealId: 'breakfast' | 'lunch' | 'dinner';
  }>({
    isOpen: false,
    dayIndex: 0,
    dish: null,
    mealId: 'lunch'
  });

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FACILITY, JSON.stringify(facilityInfo));
    } catch (e) {
      console.error(e);
    }
  }, [facilityInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SHEET_MODE, sheetMode.toString());
    } catch (e) {
      console.error(e);
    }
  }, [sheetMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SHEET_DAYS, JSON.stringify(sheetDays));
    } catch (e) {
      console.error(e);
    }
  }, [sheetDays]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_RECORDS, JSON.stringify(savedRecords));
    } catch (e) {
      console.error(e);
    }
  }, [savedRecords]);

  // Adjust sheet days array length when sheetMode changes
  const handleSetSheetMode = (newMode: 1 | 2 | 3) => {
    setSheetMode(newMode);
    setSheetDays((prev) => {
      if (prev.length === newMode) return prev;
      if (prev.length < newMode) {
        // Expand
        const expanded = [...prev];
        while (expanded.length < newMode) {
          const lastDay = expanded[expanded.length - 1];
          const nextDayNum = lastDay ? lastDay.dateInfo.day + 1 : 4;
          const nextMonth = lastDay ? lastDay.dateInfo.month : 9;
          const nextYear = lastDay ? lastDay.dateInfo.year : 2026;

          // Check if initialDays has a matching day template
          const existingInitial = initialDays[expanded.length];
          if (existingInitial) {
            expanded.push(JSON.parse(JSON.stringify(existingInitial)));
          } else {
            expanded.push(createBlankDayMenu(nextYear, nextMonth, nextDayNum <= 31 ? nextDayNum : 1));
          }
        }
        return expanded;
      } else {
        // Trim
        return prev.slice(0, newMode);
      }
    });
  };

  const handleUpdateFacilityInfo = (updated: Partial<FacilityInfo>) => {
    setFacilityInfo((prev) => ({ ...prev, ...updated }));
  };

  // Update date of a specific day on the sheet
  const handleUpdateDayDateInfo = (dayIndex: number, dateInfo: DayMenuDateInfo) => {
    setSheetDays((prev) => {
      const next = [...prev];
      if (!next[dayIndex]) return prev;

      next[dayIndex] = {
        ...next[dayIndex],
        dateInfo
      };

      // If updating Day 1, optionally auto-adjust subsequent days sequentially
      if (dayIndex === 0 && prev.length > 1) {
        for (let i = 1; i < prev.length; i++) {
          const followDayNum = dateInfo.day + i;
          const followDayOfWeek = getDayOfWeek(dateInfo.year, dateInfo.month, followDayNum);
          next[i] = {
            ...next[i],
            dateInfo: {
              year: dateInfo.year,
              month: dateInfo.month,
              day: followDayNum <= 31 ? followDayNum : 1,
              dayOfWeek: followDayOfWeek
            }
          };
        }
      }

      return next;
    });
  };

  // Update meal of a specific day
  const handleUpdateMeal = (
    dayIndex: number,
    mealId: 'breakfast' | 'lunch' | 'dinner',
    updatedMeal: MealData
  ) => {
    setSheetDays((prev) => {
      const next = [...prev];
      if (!next[dayIndex]) return prev;
      next[dayIndex] = {
        ...next[dayIndex],
        meals: {
          ...next[dayIndex].meals,
          [mealId]: updatedMeal
        }
      };
      return next;
    });
  };

  // Open Dish Edit Modal
  const handleOpenDishEdit = (
    dayIndex: number,
    dish: DishItem,
    mealId: 'breakfast' | 'lunch' | 'dinner'
  ) => {
    setDishEditModal({
      isOpen: true,
      dayIndex,
      dish,
      mealId
    });
  };

  const handleSaveModalDish = (updatedDish: DishItem, mealId: 'breakfast' | 'lunch' | 'dinner') => {
    const targetDay = sheetDays[dishEditModal.dayIndex];
    if (!targetDay) return;
    const meal = targetDay.meals[mealId];
    const updatedItems = meal.items.map((i) => (i.id === updatedDish.id ? updatedDish : i));
    handleUpdateMeal(dishEditModal.dayIndex, mealId, { ...meal, items: updatedItems });
  };

  // Action: Clear entire current sheet to blank
  const handleClearSheetToBlank = () => {
    const daysCount = sheetDays.length;
    if (confirm(`現在シートに表示されている${daysCount}日分の献立をクリアして、白紙（新規入力）にしますか？`)) {
      setSheetDays((prev) =>
        prev.map((d, idx) => {
          const baseDay = prev[0]?.dateInfo.day || 1;
          const dayNum = baseDay + idx;
          return createBlankDayMenu(
            d.dateInfo.year,
            d.dateInfo.month,
            dayNum <= 31 ? dayNum : 1
          );
        })
      );
    }
  };

  // Action: Save all days on current sheet to Saved List
  const handleSaveSheetAndClear = () => {
    const now = new Date();
    const timestampStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRecords: SavedMenuRecord[] = sheetDays.map((dayItem) => {
      const totals = calculateDayTotals(dayItem, facilityInfo.maxDailySaltTarget);
      const dateKey = `${dayItem.dateInfo.year}-${String(dayItem.dateInfo.month).padStart(2, '0')}-${String(dayItem.dateInfo.day).padStart(2, '0')}`;

      return {
        id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        dateKey,
        year: dayItem.dateInfo.year,
        month: dayItem.dateInfo.month,
        day: dayItem.dateInfo.day,
        dayOfWeek: dayItem.dateInfo.dayOfWeek,
        dateDisplay: `${dayItem.dateInfo.month}月${dayItem.dateInfo.day}日（${dayItem.dateInfo.dayOfWeek}）`,
        residentCount: facilityInfo.residentCount,
        meals: JSON.parse(JSON.stringify(dayItem.meals)),
        totals: {
          calories: totals.calories,
          protein: totals.protein,
          fat: totals.fat,
          saltTotal: totals.saltTotal
        },
        savedAt: timestampStr
      };
    });

    // Update saved records (replace existing matching dates or prepend)
    setSavedRecords((prev) => {
      const keysToAdd = new Set(newRecords.map((r) => `${r.year}-${r.month}-${r.day}`));
      const remaining = prev.filter((r) => !keysToAdd.has(`${r.year}-${r.month}-${r.day}`));
      return [...newRecords, ...remaining];
    });

    // Advance sheet days to the next upcoming days
    const lastDay = sheetDays[sheetDays.length - 1];
    const startNextDay = lastDay ? lastDay.dateInfo.day + 1 : 1;
    const nextBlankSheet: DayMenu[] = Array.from({ length: sheetMode }).map((_, i) => {
      const targetDay = startNextDay + i;
      return createBlankDayMenu(
        lastDay ? lastDay.dateInfo.year : 2026,
        lastDay ? lastDay.dateInfo.month : 9,
        targetDay <= 31 ? targetDay : (targetDay % 31) || 1
      );
    });
    setSheetDays(nextBlankSheet);

    const datesLabel = newRecords.map((r) => r.dateDisplay).join('・');
    setSaveToast(`${datesLabel}（${newRecords.length}日分）の献立を登録・保存しました。次の新規入力シートを用意しました。`);
    setTimeout(() => {
      setSaveToast(null);
    }, 4500);
  };

  // Action: Load record from Saved List into Editor
  const handleSelectRecordFromList = (record: SavedMenuRecord) => {
    const loadedDay: DayMenu = {
      id: `day-loaded-${record.id}`,
      dateInfo: {
        year: record.year,
        month: record.month,
        day: record.day,
        dayOfWeek: record.dayOfWeek
      },
      meals: JSON.parse(JSON.stringify(record.meals))
    };

    // Find if the next day exists in saved records to fill 2-day sheet
    const nextRecord = savedRecords.find(
      (r) => r.year === record.year && r.month === record.month && r.day === record.day + 1
    );

    let nextDayLoaded: DayMenu;
    if (nextRecord) {
      nextDayLoaded = {
        id: `day-loaded-${nextRecord.id}`,
        dateInfo: {
          year: nextRecord.year,
          month: nextRecord.month,
          day: nextRecord.day,
          dayOfWeek: nextRecord.dayOfWeek
        },
        meals: JSON.parse(JSON.stringify(nextRecord.meals))
      };
    } else {
      nextDayLoaded = createBlankDayMenu(record.year, record.month, record.day + 1);
    }

    if (sheetMode === 1) {
      setSheetDays([loadedDay]);
    } else if (sheetMode === 2) {
      setSheetDays([loadedDay, nextDayLoaded]);
    } else {
      // 3 days
      const thirdRecord = savedRecords.find(
        (r) => r.year === record.year && r.month === record.month && r.day === record.day + 2
      );
      const thirdDayLoaded: DayMenu = thirdRecord
        ? {
            id: `day-loaded-${thirdRecord.id}`,
            dateInfo: {
              year: thirdRecord.year,
              month: thirdRecord.month,
              day: thirdRecord.day,
              dayOfWeek: thirdRecord.dayOfWeek
            },
            meals: JSON.parse(JSON.stringify(thirdRecord.meals))
          }
        : createBlankDayMenu(record.year, record.month, record.day + 2);

      setSheetDays([loadedDay, nextDayLoaded, thirdDayLoaded]);
    }

    setActiveTab('edit');
  };

  const handleDeleteRecord = (id: string) => {
    setSavedRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleBatchPrint = (records: SavedMenuRecord[]) => {
    const loadedDays: DayMenu[] = records.map((r) => ({
      id: `day-batch-${r.id}`,
      dateInfo: {
        year: r.year,
        month: r.month,
        day: r.day,
        dayOfWeek: r.dayOfWeek
      },
      meals: JSON.parse(JSON.stringify(r.meals))
    }));
    setSheetDays(loadedDays);
    setSheetMode(Math.min(3, Math.max(1, loadedDays.length)) as 1 | 2 | 3);
    setIsPrintModalOpen(true);
  };

  // Restore entire application state from backup
  const handleRestoreData = (backup: AppBackupData) => {
    if (backup.facilityInfo) {
      setFacilityInfo(backup.facilityInfo);
    }
    if (backup.sheetMode) {
      setSheetMode(backup.sheetMode);
    }
    if (Array.isArray(backup.sheetDays) && backup.sheetDays.length > 0) {
      setSheetDays(backup.sheetDays);
    }
    if (Array.isArray(backup.savedRecords)) {
      setSavedRecords(backup.savedRecords);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-800 font-sans pb-16 print:bg-white print:pb-0">
      {/* Top Header */}
      <MenuHeader
        facilityInfo={facilityInfo}
        onUpdateFacilityInfo={handleUpdateFacilityInfo}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        savedCount={savedRecords.length}
        onOpenPrintModal={() => {
          if (activeTab === 'list') {
            setIsSavedListPrintModalOpen(true);
          } else {
            setIsPrintModalOpen(true);
          }
        }}
        onOpenSaveData={() => setBackupModal({ isOpen: true, defaultTab: 'save' })}
        onOpenRestoreData={() => setBackupModal({ isOpen: true, defaultTab: 'restore' })}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3">
        {/* Save confirmation toast notification */}
        {saveToast && (
          <div className="mb-3 p-2.5 bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* View 1: 毎日の献立登録 (1シートに2〜3日分を表示・省スペース化) */}
        {activeTab === 'edit' && (
          <div className="space-y-4">
            {/* Sheet Display Mode Selector (1シートに2〜3日分の集約切替) */}
            <div className="bg-white border border-stone-300 rounded-lg p-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-2 print:hidden">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-stone-900">この1シートに表示する日数:</span>
                <div className="inline-flex rounded-md shadow-2xs bg-stone-100 border border-stone-300 p-0.5">
                  <button
                    type="button"
                    onClick={() => handleSetSheetMode(2)}
                    className={`px-3 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                      sheetMode === 2
                        ? 'bg-[#2e4c43] text-white shadow-xs'
                        : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    ★ 2日分表示（推奨・A4省スペース）
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetSheetMode(3)}
                    className={`px-3 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                      sheetMode === 3
                        ? 'bg-[#2e4c43] text-white shadow-xs'
                        : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    3日分表示（超省スペース）
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetSheetMode(1)}
                    className={`px-3 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                      sheetMode === 1
                        ? 'bg-[#2e4c43] text-white shadow-xs'
                        : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    1日分表示
                  </button>
                </div>
              </div>
            </div>

            {/* Days on this Sheet */}
            <div className="space-y-6">
              {sheetDays.map((dayItem, dayIndex) => (
                <section
                  key={dayItem.id || dayIndex}
                  className={`bg-white/80 p-2.5 sm:p-3 rounded-xl border border-stone-300 shadow-xs ${
                    dayIndex > 0 ? 'border-t-4 border-t-[#2e4c43]' : ''
                  }`}
                >
                  {/* Daily Nutrition Summary Header (Date input + 6.5g Salt Target) */}
                  <DailyNutritionSummary
                    day={dayItem}
                    compact={true}
                    onUpdateDateInfo={(dateInfo) => handleUpdateDayDateInfo(dayIndex, dateInfo)}
                    maxDailySaltTarget={facilityInfo.maxDailySaltTarget}
                  />

                  {/* Compact Matrix Tables for 朝食, 昼食, 夕食 */}
                  <div className="space-y-1.5">
                    <MenuMatrixTable
                      meal={dayItem.meals.breakfast}
                      facilityInfo={facilityInfo}
                      compact={true}
                      showFacilityTotals={false}
                      onUpdateMeal={(updated) => handleUpdateMeal(dayIndex, 'breakfast', updated)}
                      onOpenDishEditModal={(dish) => handleOpenDishEdit(dayIndex, dish, 'breakfast')}
                    />

                    <MenuMatrixTable
                      meal={dayItem.meals.lunch}
                      facilityInfo={facilityInfo}
                      compact={true}
                      showFacilityTotals={false}
                      onUpdateMeal={(updated) => handleUpdateMeal(dayIndex, 'lunch', updated)}
                      onOpenDishEditModal={(dish) => handleOpenDishEdit(dayIndex, dish, 'lunch')}
                    />

                    <MenuMatrixTable
                      meal={dayItem.meals.dinner}
                      facilityInfo={facilityInfo}
                      compact={true}
                      showFacilityTotals={false}
                      onUpdateMeal={(updated) => handleUpdateMeal(dayIndex, 'dinner', updated)}
                      onOpenDishEditModal={(dish) => handleOpenDishEdit(dayIndex, dish, 'dinner')}
                    />
                  </div>
                </section>
              ))}
            </div>

            {/* Bottom Action Buttons (Matching user's attached design) */}
            <div className="mt-4 pt-3 border-t border-stone-300 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div className="text-xs text-stone-600 font-medium">
                現在のシート（{sheetDays.length}日分）: {sheetDays.map((d) => `${d.dateInfo.month}/${d.dateInfo.day}`).join('、')}
              </div>

              <div className="flex items-center gap-3">
                {/* Red Button: 入力内容をクリア（新規） */}
                <button
                  type="button"
                  onClick={handleClearSheetToBlank}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#b93822] hover:bg-[#a12f1c] active:bg-[#8a2615] text-white font-bold rounded-md shadow-xs transition-colors text-sm sm:text-base cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>入力内容をクリア（新規）</span>
                </button>

                {/* Green Button: このメニューを登録・保存 */}
                <button
                  type="button"
                  onClick={handleSaveSheetAndClear}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#2e7d32] hover:bg-[#256629] active:bg-[#1b4d1f] text-white font-bold rounded-md shadow-xs transition-colors text-sm sm:text-base cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>このメニューを登録・保存（{sheetDays.length}日分）</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View 2: 登録済献立一覧表 */}
        {activeTab === 'list' && (
          <SavedMenuList
            savedRecords={savedRecords}
            onSelectRecord={handleSelectRecordFromList}
            onDeleteRecord={handleDeleteRecord}
            onNavigateToNew={() => setActiveTab('edit')}
            onBatchPrint={handleBatchPrint}
          />
        )}
      </main>

      {/* Print & PDF Modal (Passes all days on current sheet + savedRecords for 2-3 days on 1 sheet A4 output) */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        days={sheetDays}
        facilityInfo={facilityInfo}
        savedRecords={savedRecords}
      />

      {/* Saved List Print / PDF Modal */}
      <SavedListPrintModal
        isOpen={isSavedListPrintModalOpen}
        onClose={() => setIsSavedListPrintModalOpen(false)}
        records={savedRecords}
        facilityInfo={facilityInfo}
      />

      {/* Dish Detailed Edit Modal */}
      <DishEditModal
        isOpen={dishEditModal.isOpen}
        onClose={() => setDishEditModal((prev) => ({ ...prev, isOpen: false }))}
        dish={dishEditModal.dish}
        mealId={dishEditModal.mealId}
        mealName={
          dishEditModal.mealId === 'breakfast'
            ? '朝食'
            : dishEditModal.mealId === 'lunch'
            ? '昼食'
            : '夕食'
        }
        facilityInfo={facilityInfo}
        onSave={handleSaveModalDish}
      />

      {/* Data Backup & Restore Modal */}
      <DataBackupModal
        isOpen={backupModal.isOpen}
        onClose={() => setBackupModal((prev) => ({ ...prev, isOpen: false }))}
        facilityInfo={facilityInfo}
        sheetMode={sheetMode}
        sheetDays={sheetDays}
        savedRecords={savedRecords}
        onRestoreData={handleRestoreData}
        onNotifyToast={(msg) => {
          setSaveToast(msg);
          setTimeout(() => setSaveToast(null), 4500);
        }}
        defaultActionTab={backupModal.defaultTab}
      />
    </div>
  );
}
