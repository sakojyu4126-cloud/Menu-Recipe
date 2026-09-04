import React, { useState, useMemo } from 'react';
import { X, Printer, FileDown, Check } from 'lucide-react';
import { FacilityInfo, SavedMenuRecord } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  records: SavedMenuRecord[];
  facilityInfo: FacilityInfo;
}

export const SavedListPrintModal: React.FC<Props> = ({
  isOpen,
  onClose,
  records,
  facilityInfo
}) => {
  const [printScope, setPrintScope] = useState<'all' | 'recent10'>('all');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const targetRecords = useMemo(() => {
    if (printScope === 'recent10') {
      return records.slice(0, 10);
    }
    return records;
  }, [records, printScope]);

  if (!isOpen) return null;

  const generatePrintableHtml = () => {
    const isLandscape = orientation === 'landscape';
    const pageSize = isLandscape ? 'A4 landscape' : 'A4 portrait';
    const pageMargin = isLandscape ? '6mm 8mm' : '8mm 10mm';
    const baseFontSize = '8.5pt';
    const cellPadding = '3px 5px';

    const rowsHtml = targetRecords
      .map((rec) => {
        const isSafeSalt = rec.totals.saltTotal <= 6.5;
        const bSummary = rec.meals.breakfast.items
          .filter((i) => i.dishName)
          .map((i) => i.dishName)
          .join('・');
        const lSummary = rec.meals.lunch.items
          .filter((i) => i.dishName)
          .map((i) => i.dishName)
          .join('・');
        const dSummary = rec.meals.dinner.items
          .filter((i) => i.dishName)
          .map((i) => i.dishName)
          .join('・');

        return `
          <tr style="border-bottom: 1px solid #000; page-break-inside: avoid;">
            <td style="border: 1px solid #000; padding: ${cellPadding}; font-weight: bold; width: 110px; vertical-align: top; white-space: nowrap;">
              <div>${rec.dateDisplay}</div>
              <div style="font-size: 0.85em; font-weight: normal; color: #333;">${rec.year}年 / ${rec.residentCount}名</div>
            </td>
            <td style="border: 1px solid #000; padding: ${cellPadding}; vertical-align: top; line-height: 1.25;">
              <div style="margin-bottom: 1.5px;"><strong>[朝]</strong> ${bSummary || '—'}</div>
              <div style="margin-bottom: 1.5px;"><strong>[昼]</strong> ${lSummary || '—'}</div>
              <div><strong>[夕]</strong> ${dSummary || '—'}</div>
            </td>
            <td style="border: 1px solid #000; padding: ${cellPadding}; text-align: center; width: 85px; vertical-align: middle; font-family: monospace; font-weight: bold;">
              <div>${rec.totals.saltTotal.toFixed(2)} g</div>
              <div style="font-size: 0.8em; font-weight: normal; ${isSafeSalt ? '' : 'text-decoration: underline;'}">
                ${isSafeSalt ? '(6.5g以下)' : '(超過)'}
              </div>
            </td>
            <td style="border: 1px solid #000; padding: ${cellPadding}; text-align: center; width: 75px; vertical-align: middle; font-family: monospace; font-weight: bold;">
              ${rec.totals.calories} kcal
            </td>
          </tr>
        `;
      })
      .join('');

    return `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <title>${facilityInfo.titlePrefix} - 登録済献立一覧表</title>
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
            line-height: 1.2;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .sheet-header {
            border-bottom: 1.5px solid #000;
            padding-bottom: 4px;
            margin-bottom: 6px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .facility-name {
            font-size: 15px;
            font-weight: bold;
            letter-spacing: 0.05em;
          }
          .meta-info {
            font-size: ${baseFontSize};
            font-weight: bold;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            border: 1.5px solid #000;
            font-size: ${baseFontSize};
          }
          th {
            border: 1px solid #000;
            padding: 4px 5px;
            background: #fff;
            text-align: center;
            font-weight: bold;
          }
          tr {
            page-break-inside: avoid;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="sheet-header">
          <div>
            <span class="facility-name">${facilityInfo.titlePrefix} - 登録済献立一覧表</span>
            <span style="font-size: ${baseFontSize}; margin-left: 8px;">(${facilityInfo.yearEra}年 ${facilityInfo.month}月度)</span>
          </div>
          <div class="meta-info">
            <span>入居者数: ${facilityInfo.residentCount}名</span>
            <span style="margin-left: 10px;">基準食塩量: 6.5g以下</span>
            <span style="margin-left: 10px;">（全 ${targetRecords.length} 件）</span>
          </div>
        </div>

        <table>
          <thead>
            <tr style="border-bottom: 1.5px solid #000;">
              <th style="width: 110px;">献立日付</th>
              <th>献立内容（朝・昼・夕の主菜・副菜）</th>
              <th style="width: 85px;">1日食塩量</th>
              <th style="width: 75px;">エネルギー</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

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

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-stone-800 text-white">
              <Printer className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                登録済献立一覧表の印刷・PDF保存
              </h3>
              <p className="text-xs text-stone-500">
                {facilityInfo.titlePrefix} / 一覧リストのA4出力プレビュー
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
          {/* Layout Orientation */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              用紙向きの選択
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrientation('portrait')}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  orientation === 'portrait'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold ring-1 ring-emerald-700 shadow-xs'
                    : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">【A4縦向き】</span>
                  {orientation === 'portrait' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                </div>
                <div className="text-[11px] text-stone-500 mt-1 font-normal">
                  標準的な縦型レイアウト。多くの日数を一覧出力するのに適しています。
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOrientation('landscape')}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  orientation === 'landscape'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold ring-1 ring-emerald-700 shadow-xs'
                    : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">【A4横向き】</span>
                  {orientation === 'landscape' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                </div>
                <div className="text-[11px] text-stone-500 mt-1 font-normal">
                  横幅を広く使い、朝・昼・夕のメニュー名をゆったり1行で確認できます。
                </div>
              </button>
            </div>
          </div>

          {/* Scope Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              印刷対象の範囲
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPrintScope('all')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  printScope === 'all'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-700'
                    : 'border-stone-300 bg-white text-stone-700'
                }`}
              >
                登録済みのすべて（全 {records.length} 件）
              </button>
              {records.length > 10 && (
                <button
                  type="button"
                  onClick={() => setPrintScope('recent10')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    printScope === 'recent10'
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-700'
                      : 'border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  直近の10件のみ
                </button>
              )}
            </div>
          </div>

          {/* Quick Preview Outline */}
          <div className="border border-stone-200 rounded-lg p-3 bg-stone-50 text-[11px] space-y-1.5">
            <div className="font-bold text-stone-800 flex items-center justify-between">
              <span>一覧表プレビュー（{targetRecords.length}件）</span>
              <span className="text-stone-500 font-normal">※「登録日時」列は非表示・完全モノクロ</span>
            </div>
            <div className="space-y-1 max-h-44 overflow-y-auto">
              {targetRecords.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between bg-white border border-stone-200 px-2.5 py-1 rounded"
                >
                  <span className="font-bold text-stone-800 whitespace-nowrap mr-2">
                    {r.dateDisplay}
                  </span>
                  <span className="text-stone-600 truncate flex-1 text-[10px]">
                    [朝]{r.meals.breakfast.items[0]?.dishName} / [昼]{r.meals.lunch.items[0]?.dishName} / [夕]{r.meals.dinner.items[0]?.dishName}
                  </span>
                  <span className="font-mono text-stone-800 font-bold whitespace-nowrap ml-2">
                    塩分: {r.totals.saltTotal.toFixed(2)}g
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PDF Guide */}
          <div className="border border-amber-200 bg-amber-50/80 p-2.5 rounded-lg text-amber-950 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <FileDown className="w-3.5 h-3.5 text-amber-700" />
              <span>一覧表のPDF保存:</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              印刷画面の送信先で<strong>「PDFに保存」</strong>を選択すると、一覧表がすっきりとA4に収まったPDFファイルとして保存できます。
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleOpenPrintWindow}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2e4c43] hover:bg-[#243d36] text-white text-sm font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-200" />
              <span>この一覧表を印刷 / PDF保存する（{targetRecords.length}件）</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
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
