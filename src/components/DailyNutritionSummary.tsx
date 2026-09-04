import React from 'react';
import { Calendar, CheckCircle2, AlertTriangle } from 'lucide-react';
import { DayMenu, DayMenuDateInfo } from '../types';
import { calculateDayTotals, getDayOfWeek } from '../utils/nutrition';

interface Props {
  day: DayMenu;
  onUpdateDateInfo: (dateInfo: DayMenuDateInfo) => void;
  maxDailySaltTarget?: number;
  compact?: boolean;
}

export const DailyNutritionSummary: React.FC<Props> = ({
  day,
  onUpdateDateInfo,
  maxDailySaltTarget = 6.5,
  compact = false
}) => {
  const totals = calculateDayTotals(day, maxDailySaltTarget);

  const handleMonthChange = (newMonthStr: string) => {
    const month = parseInt(newMonthStr, 10);
    if (!isNaN(month) && month >= 1 && month <= 12) {
      const dayOfWeek = getDayOfWeek(day.dateInfo.year, month, day.dateInfo.day);
      onUpdateDateInfo({
        ...day.dateInfo,
        month,
        dayOfWeek
      });
    }
  };

  const handleDayChange = (newDayStr: string) => {
    const d = parseInt(newDayStr, 10);
    if (!isNaN(d) && d >= 1 && d <= 31) {
      const dayOfWeek = getDayOfWeek(day.dateInfo.year, day.dateInfo.month, d);
      onUpdateDateInfo({
        ...day.dateInfo,
        day: d,
        dayOfWeek
      });
    }
  };

  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const [y, m, d] = e.target.value.split('-').map(Number);
    if (y && m && d) {
      const dayOfWeek = getDayOfWeek(y, m, d);
      onUpdateDateInfo({
        year: y,
        month: m,
        day: d,
        dayOfWeek
      });
    }
  };

  const formattedIsoDate = `${day.dateInfo.year}-${String(day.dateInfo.month).padStart(2, '0')}-${String(day.dateInfo.day).padStart(2, '0')}`;

  return (
    <div className={compact ? 'mb-2' : 'mb-3'}>
      {/* Top Header Bar: Date input with automatic Japanese day of the week */}
      <div
        className={`bg-[#2e4c43] text-white rounded-t-md flex flex-wrap items-center justify-between gap-2 shadow-xs ${
          compact ? 'px-3 py-1.5' : 'px-4 py-2'
        }`}
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
          <div className="flex items-center gap-1 font-bold text-xs sm:text-sm">
            <input
              type="number"
              min="1"
              max="12"
              value={day.dateInfo.month}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="w-10 text-center bg-white/10 hover:bg-white/20 border border-white/40 focus:border-white rounded px-1 py-0.5 text-white font-bold focus:outline-none"
              aria-label="月"
            />
            <span>月</span>

            <input
              type="number"
              min="1"
              max="31"
              value={day.dateInfo.day}
              onChange={(e) => handleDayChange(e.target.value)}
              className="w-10 text-center bg-white/10 hover:bg-white/20 border border-white/40 focus:border-white rounded px-1 py-0.5 text-white font-bold focus:outline-none"
              aria-label="日"
            />
            <span>日</span>

            <span className="bg-emerald-800/90 text-emerald-100 px-1.5 py-0.5 rounded text-xs font-bold border border-emerald-500/50 ml-0.5">
              （{day.dateInfo.dayOfWeek}曜日）
            </span>

            {/* Hidden native datepicker trigger for calendar convenience */}
            <input
              type="date"
              value={formattedIsoDate}
              onChange={handleNativeDateChange}
              className="w-5 h-5 opacity-40 hover:opacity-100 cursor-pointer bg-transparent border-0 text-transparent p-0 -ml-1"
              title="カレンダーから日付を選択"
            />
          </div>
        </div>

        {/* Salt Status Badge (6.5g standard) */}
        <div className="flex items-center gap-2 text-xs">
          {totals.isWithinDailyLimit ? (
            <span className="inline-flex items-center gap-1 bg-emerald-700/90 text-emerald-100 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-500/40">
              <CheckCircle2 className="w-3 h-3 text-emerald-200" />
              1日食塩基準（6.5g以下）達成
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-rose-800 text-rose-100 px-2 py-0.5 rounded text-[11px] font-bold border border-rose-600">
              <AlertTriangle className="w-3 h-3 text-rose-300" />
              1日食塩基準（6.5g）超過注意
            </span>
          )}
        </div>
      </div>

      {/* 1日合計栄養価（目安）Row */}
      <div
        className={`bg-[#f2f5f3] border-x border-b border-stone-300 flex flex-wrap items-center justify-between gap-y-1 text-stone-800 text-xs font-bold shadow-2xs ${
          compact ? 'px-3 py-1.5' : 'px-4 py-2'
        }`}
      >
        <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-5 gap-y-0.5">
          <span className="text-stone-700 font-bold whitespace-nowrap">【1日合計栄養価（目安）】</span>

          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="text-stone-600 text-[11px] font-medium">エネルギー:</span>
            <span className="text-stone-950 font-bold">{totals.calories.toLocaleString()}</span>
            <span className="text-stone-600 text-[11px]">kcal</span>
          </div>

          <span className="text-stone-300 hidden sm:inline">/</span>

          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="text-stone-600 text-[11px] font-medium">タンパク質:</span>
            <span className="text-stone-950 font-bold">{totals.protein.toFixed(1)}</span>
            <span className="text-stone-600 text-[11px]">g</span>
          </div>

          <span className="text-stone-300 hidden sm:inline">/</span>

          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="text-stone-600 text-[11px] font-medium">脂質:</span>
            <span className="text-stone-950 font-bold">{totals.fat.toFixed(1)}</span>
            <span className="text-stone-600 text-[11px]">g</span>
          </div>

          <span className="text-stone-300 hidden sm:inline">/</span>

          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="text-stone-600 text-[11px] font-medium">食塩相当量:</span>
            <span
              className={`text-xs sm:text-sm font-extrabold ${
                totals.isWithinDailyLimit ? 'text-[#b93822]' : 'text-rose-700'
              }`}
            >
              {totals.saltTotal.toFixed(2)}
            </span>
            <span className="text-stone-600 text-[11px]">g</span>
            <span className="text-[10px] text-stone-500 font-normal ml-0.5">
              （基準 6.5g以下）
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
