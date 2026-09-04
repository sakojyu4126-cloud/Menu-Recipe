import React, { useState, useMemo } from 'react';
import { X, Printer, FileDown, ExternalLink, Check, Copy, Layers } from 'lucide-react';
import { DayMenu, FacilityInfo, SavedMenuRecord } from '../types';
import { calculateMealTotals, calculateDayTotals } from '../utils/nutrition';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  days: DayMenu[];
  facilityInfo: FacilityInfo;
  savedRecords?: SavedMenuRecord[];
}

export const PrintModal: React.FC<Props> = ({
  isOpen,
  onClose,
  days,
  facilityInfo,
  savedRecords = []
}) => {
  // Mode: '2days' (default recommended), '3days-portrait', '3days-landscape', or '1day'
  const initialMode = days.length === 3 ? '3days-portrait' : days.length === 1 ? '1day' : '2days';
  const [printMode, setPrintMode] = useState<'2days' | '3days-portrait' | '3days-landscape' | '1day'>(initialMode);

  // Prepare the target days for the selected print mode
  const targetDays: DayMenu[] = useMemo(() => {
    if (printMode === '1day') {
      return days.slice(0, 1);
    }
    if (printMode === '2days') {
      if (days.length >= 2) return days.slice(0, 2);
      // If only 1 day is present, look in savedRecords for the next day
      if (days.length === 1 && savedRecords.length > 0) {
        const other = savedRecords.find(
          (r) => !(r.year === days[0].dateInfo.year && r.month === days[0].dateInfo.month && r.day === days[0].dateInfo.day)
        );
        if (other) {
          const loaded: DayMenu = {
            id: `rec-${other.id}`,
            dateInfo: { year: other.year, month: other.month, day: other.day, dayOfWeek: other.dayOfWeek },
            meals: other.meals
          };
          return [days[0], loaded];
        }
      }
      return days;
    }
    // 3 days
    if (days.length >= 3) return days.slice(0, 3);
    return days;
  }, [printMode, days, savedRecords]);

  if (!isOpen) return null;

  const generatePrintableHtml = () => {
    const isLandscape = printMode === '3days-landscape';
    const is3DaysPortrait = printMode === '3days-portrait';
    const is2Days = printMode === '2days';
    const is1Day = printMode === '1day';

    const pageSize = isLandscape ? 'A4 landscape' : 'A4 portrait';
    const pageMargin = isLandscape
      ? '5mm 5mm'
      : is3DaysPortrait
      ? '4mm 4mm'
      : is2Days
      ? '5mm 5mm'
      : '8mm 8mm';

    const baseFontSize = isLandscape
      ? '8pt'
      : is3DaysPortrait
      ? '7pt'
      : is2Days
      ? '8.2pt'
      : '10pt';

    const cellPadding = isLandscape
      ? '1.5px 3px'
      : is3DaysPortrait
      ? '1px 2.5px'
      : is2Days
      ? '1.5px 3.5px'
      : '4px 6px';

    const lineHeight = isLandscape || is3DaysPortrait ? '1.1' : is2Days ? '1.15' : '1.3';

    // Render a single day's tables
    const renderDayContent = (dayItem: DayMenu, dayIndex: number) => {
      const dayTotals = calculateDayTotals(dayItem, facilityInfo.maxDailySaltTarget);
      const dateDisplay = `${dayItem.dateInfo.month}月${dayItem.dateInfo.day}日（${dayItem.dateInfo.dayOfWeek}）`;

      const renderMeal = (meal: typeof dayItem.meals.breakfast) => {
        const mealTotals = calculateMealTotals(meal);
        const rows = meal.items
          .map(
            (item, idx) => `
          <tr style="border-bottom: 1px solid #999;">
            ${
              idx === 0
                ? `<td rowspan="${meal.items.length}" style="border: 1px solid #000; font-weight: bold; text-align: center; vertical-align: middle; width: 42px; font-size: ${baseFontSize};">${meal.name}</td>`
                : ''
            }
            <td style="border: 1px solid #000; padding: ${cellPadding}; font-weight: bold; width: 135px;">
              <span style="font-size: 0.85em; font-weight: normal; color: #444;">[${item.role}]</span>
              <div>${item.dishName || '（未入力）'}</div>
            </td>
            <td style="border: 1px solid #000; padding: ${cellPadding}; width: 220px; white-space: pre-line; line-height: ${lineHeight};">${item.ingredients || '-'}</td>
            <td style="border: 1px solid #000; padding: ${cellPadding}; text-align: right; width: 62px; font-family: monospace; white-space: pre-line;">${item.amounts || '-'}</td>
            <td style="border: 1px solid #000; padding: ${cellPadding}; text-align: right; width: 62px; font-family: monospace; white-space: pre-line; font-weight: bold;">${item.saltGrams || '-'}</td>
          </tr>
        `
          )
          .join('');

        const subtotal = `
          <tr style="border-top: 1.5px solid #000; border-bottom: 1.5px solid #000; font-weight: bold; background: #fff;">
            <td style="border: 1px solid #000; padding: ${cellPadding};">${meal.name}計</td>
            <td style="border: 1px solid #000; padding: ${cellPadding}; font-size: 0.9em; text-align: right;">エネルギー: ${mealTotals.calories} kcal</td>
            <td style="border: 1px solid #000; padding: ${cellPadding}; text-align: right; font-size: 0.85em;">蛋白: ${mealTotals.protein}g / 脂: ${mealTotals.fat}g</td>
            <td style="border: 1px solid #000; padding: ${cellPadding}; text-align: right; font-family: monospace; font-size: 0.95em;">食塩: ${mealTotals.saltTotal.toFixed(2)}g</td>
          </tr>
        `;

        return rows + subtotal;
      };

      return `
        <div class="day-block" style="${
          isLandscape ? 'flex: 1; min-width: 0;' : ''
        } ${dayIndex > 0 && !isLandscape ? 'margin-top: 6px; border-top: 1.5px dashed #000; padding-top: 5px;' : ''}">
          <!-- Day Header Summary Bar -->
          <div style="border: 1px solid #000; padding: 2px 6px; margin-bottom: 3px; display: flex; justify-content: space-between; align-items: center; font-size: ${baseFontSize}; background: #fff;">
            <div>
              <strong style="font-size: 1.1em; letter-spacing: 0.05em;">【${dateDisplay}】</strong>
            </div>
            <div style="font-weight: bold; display: flex; gap: 8px;">
              <span>1日目安: <strong>${dayTotals.calories}</strong> kcal</span>
              <span>蛋白: ${dayTotals.protein.toFixed(1)}g</span>
              <span>脂質: ${dayTotals.fat.toFixed(1)}g</span>
              <span style="text-decoration: underline;">食塩計: <strong>${dayTotals.saltTotal.toFixed(2)}g</strong> (基準6.5g以下)</span>
            </div>
          </div>

          <!-- Menu Table -->
          <table style="width: 100%; max-width: 660px; margin: 0 auto; border-collapse: collapse; border: 1.5px solid #000; font-size: ${baseFontSize};">
            <thead>
              <tr style="border-bottom: 1.5px solid #000; background: #fff;">
                <th style="border: 1px solid #000; padding: ${cellPadding}; width: 42px; text-align: center;">区分</th>
                <th style="border: 1px solid #000; padding: ${cellPadding}; width: 135px; text-align: left;">料理名</th>
                <th style="border: 1px solid #000; padding: ${cellPadding}; width: 220px; text-align: left;">使用食材・調味料の配合</th>
                <th style="border: 1px solid #000; padding: ${cellPadding}; width: 62px; text-align: right;">使用量(g)</th>
                <th style="border: 1px solid #000; padding: ${cellPadding}; width: 62px; text-align: right;">食塩量(g)</th>
              </tr>
            </thead>
            <tbody>
              ${renderMeal(dayItem.meals.breakfast)}
              ${renderMeal(dayItem.meals.lunch)}
              ${renderMeal(dayItem.meals.dinner)}
            </tbody>
          </table>
        </div>
      `;
    };

    return `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <title>${facilityInfo.titlePrefix} - ${targetDays.map(d => `${d.dateInfo.month}/${d.dateInfo.day}`).join('・')}</title>
        <style>
          @page {
            size: ${pageSize};
            margin: ${pageMargin};
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: 'Hiragino Kaku Gothic ProN', 'Meiryo', 'BIZ UDGothic', 'Yu Gothic', sans-serif;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 0;
            font-size: ${baseFontSize};
            line-height: ${lineHeight};
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .sheet-header {
            border-bottom: 1.5px solid #000;
            padding-bottom: 3px;
            margin-bottom: 4px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .facility-name {
            font-size: ${isLandscape || is3DaysPortrait ? '13px' : '15px'};
            font-weight: bold;
            letter-spacing: 0.05em;
          }
          .meta-info {
            font-size: ${baseFontSize};
            font-weight: bold;
          }
          .content-container {
            ${isLandscape ? 'display: flex; gap: 8px;' : 'display: block;'}
          }
          .day-block {
            page-break-inside: avoid;
          }
          table {
            page-break-inside: avoid;
          }
          tr {
            page-break-inside: avoid;
          }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <!-- Top Overall Title -->
        <div class="sheet-header">
          <div>
            <span class="facility-name">${facilityInfo.titlePrefix}</span>
            <span style="font-size: ${baseFontSize}; margin-left: 8px;">(${facilityInfo.yearEra}年 ${facilityInfo.month}月度 献立表)</span>
          </div>
          <div class="meta-info">
            <span>入居者数: ${facilityInfo.residentCount}名</span>
            <span style="margin-left: 8px;">1シート集約印刷（${targetDays.length}日分）</span>
          </div>
        </div>

        <!-- Days Content Container -->
        <div class="content-container">
          ${targetDays.map((d, idx) => renderDayContent(d, idx)).join('')}
        </div>

        <script>
          window.onload = function() {
            window.focus();
            window.print();
          };
        </script>
      </body>
      </html>
    `;
  };

  const handleOpenPrintWindow = () => {
    const htmlContent = generatePrintableHtml();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      alert('ポップアップがブラウザにブロックされました。「ポップアップを許可」して再度お試しください。');
    }
  };

  const handleDirectPrint = () => {
    handleOpenPrintWindow();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-stone-800 text-white">
              <Printer className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                献立表の印刷・PDF保存（1シート集約）
              </h3>
              <p className="text-xs text-stone-500">
                {facilityInfo.titlePrefix} / 1枚のシートに2〜3日分を省スペース集約
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-700 flex-1">
          {/* Layout Mode Selector (User's core request: 2~3 days on 1 sheet!) */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>1枚のA4シートに収める日数の選択</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPrintMode('2days')}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  printMode === '2days'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold ring-1 ring-emerald-700 shadow-xs'
                    : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">【2日分を1枚に集約】</span>
                  {printMode === '2days' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                </div>
                <div className="text-[11px] text-stone-500 mt-1 font-normal">
                  ★推奨・A4縦向き。行高さを最小化し、2日分の詳細を隙間なく1枚に集約。
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPrintMode('3days-portrait')}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  printMode === '3days-portrait'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold ring-1 ring-emerald-700 shadow-xs'
                    : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">【3日分・A4縦極小】</span>
                  {printMode === '3days-portrait' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                </div>
                <div className="text-[11px] text-stone-500 mt-1 font-normal">
                  極小文字・最小余白で3日分をA4縦1枚に限界まで凝縮。
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPrintMode('3days-landscape')}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  printMode === '3days-landscape'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold ring-1 ring-emerald-700 shadow-xs'
                    : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">【3日分・A4横見開き】</span>
                  {printMode === '3days-landscape' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                </div>
                <div className="text-[11px] text-stone-500 mt-1 font-normal">
                  A4横向きで3日分を3列にすっきり配置。見やすく省スペース。
                </div>
              </button>
            </div>
          </div>

          {/* Current Target Summary Banner */}
          <div className="bg-stone-100 p-2.5 rounded-lg border border-stone-300 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-stone-500 font-medium">出力対象の日付:</span>{' '}
              <span className="font-bold text-stone-900">
                {targetDays.map((d) => `${d.dateInfo.month}月${d.dateInfo.day}日（${d.dateInfo.dayOfWeek}）`).join('、')}
              </span>
              <span className="ml-2 text-stone-500">（計 {targetDays.length}日分）</span>
            </div>
            <span className="text-[11px] bg-stone-200 text-stone-800 px-2 py-0.5 rounded font-semibold">
              モノクロ・背景無色・省スペース設計
            </span>
          </div>

          {/* PDF Save Guide */}
          <div className="border border-amber-200 bg-amber-50/80 p-3 rounded-lg text-amber-950 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <FileDown className="w-3.5 h-3.5 text-amber-700" />
              <span>PDFとして保存する方法（膨大な紙・データの削減に効果的）:</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              下のボタンを押すと印刷画面が開きます。
              送信先（プリンター）を<strong>「PDFに保存」</strong>に指定して保存すると、
              <strong>1枚のPDFに{targetDays.length}日分がコンパクトにまとまり</strong>、年数が経ってもファイル数やデータ管理が従来の半分以下に抑えられます。
            </p>
          </div>

          {/* Quick Preview Outline */}
          <div className="border border-stone-200 rounded-lg p-3 bg-stone-50 text-[11px] space-y-1.5">
            <div className="font-bold text-stone-800 flex items-center justify-between">
              <span>シート構成プレビュー</span>
              <span className="text-stone-500 font-normal">
                {printMode === '3days-landscape' ? 'A4横向き・3列並列' : 'A4縦向き・上下連結'}
              </span>
            </div>
            <div className="space-y-1">
              {targetDays.map((d, i) => {
                const tot = calculateDayTotals(d, facilityInfo.maxDailySaltTarget);
                return (
                  <div key={d.id || i} className="flex items-center justify-between bg-white border border-stone-200 px-2.5 py-1 rounded">
                    <span className="font-bold text-stone-800">
                      第{i + 1}日目: {d.dateInfo.month}月{d.dateInfo.day}日（{d.dateInfo.dayOfWeek}）
                    </span>
                    <span className="text-stone-600">
                      朝・昼・夕計: {tot.calories}kcal / 食塩: {tot.saltTotal.toFixed(2)}g (6.5g以下)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleOpenPrintWindow}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2e4c43] hover:bg-[#243d36] text-white text-sm font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-200" />
              <span>この内容で印刷 / PDF保存画面を開く（A4 1枚に集約）</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
