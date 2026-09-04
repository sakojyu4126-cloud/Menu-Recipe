import React, { useState } from 'react';
import { Search, Calendar, Edit3, Trash2, CheckCircle2, AlertTriangle, ArrowRight, Printer } from 'lucide-react';
import { SavedMenuRecord } from '../types';

interface Props {
  savedRecords: SavedMenuRecord[];
  onSelectRecord: (record: SavedMenuRecord) => void;
  onDeleteRecord: (id: string) => void;
  onNavigateToNew: () => void;
  onBatchPrint?: (records: SavedMenuRecord[]) => void;
}

export const SavedMenuList: React.FC<Props> = ({
  savedRecords,
  onSelectRecord,
  onDeleteRecord,
  onNavigateToNew,
  onBatchPrint
}) => {
  const [searchYear, setSearchYear] = useState<string>('');
  const [searchMonth, setSearchMonth] = useState<string>('');
  const [searchDay, setSearchDay] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredRecords = savedRecords.filter((record) => {
    if (searchYear && record.year.toString() !== searchYear) return false;
    if (searchMonth && record.month.toString() !== searchMonth) return false;
    if (searchDay && record.day.toString() !== searchDay) return false;

    if (keyword.trim()) {
      const q = keyword.trim().toLowerCase();
      const allDishes = [
        ...record.meals.breakfast.items.map((i) => i.dishName),
        ...record.meals.lunch.items.map((i) => i.dishName),
        ...record.meals.dinner.items.map((i) => i.dishName)
      ]
        .join(' ')
        .toLowerCase();

      if (!allDishes.includes(q) && !record.dateDisplay.toLowerCase().includes(q)) {
        return false;
      }
    }

    return true;
  });

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.slice(0, 3).map((r) => r.id));
    }
  };

  const handleTriggerBatchPrint = () => {
    if (!onBatchPrint) return;
    const selected = savedRecords.filter((r) => selectedIds.includes(r.id));
    if (selected.length === 0) return;
    onBatchPrint(selected);
  };

  return (
    <div className="space-y-3">
      {/* Search and Filters Header */}
      <div className="bg-white border border-stone-300 rounded-xl p-3.5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2.5">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>登録済献立の検索・呼び出し</span>
            </h3>
            <p className="text-xs text-stone-500">
              過去に登録・保存した献立メニューを呼び出して表示・修正や、複数日まとめて1枚への印刷ができます。
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToNew}
            className="flex items-center gap-1 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors self-start md:self-auto cursor-pointer"
          >
            <span>＋ 新しい献立を入力する</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 items-center text-xs">
          {/* Year Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">年</label>
            <input
              type="number"
              placeholder="指定なし（例: 2026）"
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Month Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">月</label>
            <select
              value={searchMonth}
              onChange={(e) => setSearchMonth(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="">すべての月</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m.toString()}>
                  {m}月
                </option>
              ))}
            </select>
          </div>

          {/* Day Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">日</label>
            <select
              value={searchDay}
              onChange={(e) => setSearchDay(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="">すべての日</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d.toString()}>
                  {d}日
                </option>
              ))}
            </select>
          </div>

          {/* Keyword Search */}
          <div className="col-span-2 sm:col-span-1 md:col-span-2">
            <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
              料理名・食材検索
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="例: 鮭、肉じゃが、味噌汁..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded pl-7 pr-2.5 py-1 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2 top-2" />
            </div>
          </div>
        </div>

        {/* Reset Search */}
        {(searchYear || searchMonth || searchDay || keyword) && (
          <div className="mt-2 text-right">
            <button
              type="button"
              onClick={() => {
                setSearchYear('');
                setSearchMonth('');
                setSearchDay('');
                setKeyword('');
              }}
              className="text-[11px] text-stone-500 hover:text-stone-800 underline cursor-pointer"
            >
              検索条件をリセット
            </button>
          </div>
        )}
      </div>

      {/* Multi-Select Batch Print Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-[#2e4c43] text-white px-3.5 py-2 rounded-lg shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="font-bold flex items-center gap-2">
            <span>【選択中: {selectedIds.length}日分】</span>
            <span className="text-emerald-200 text-[11px] font-normal">
              1枚のA4シートに省スペースでまとめて印刷・PDF保存できます
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded text-white text-[11px] transition-colors cursor-pointer"
            >
              選択解除
            </button>
            <button
              type="button"
              onClick={handleTriggerBatchPrint}
              className="flex items-center gap-1.5 px-3 py-1 bg-white text-[#2e4c43] font-bold rounded shadow-xs hover:bg-emerald-50 transition-colors text-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>選択した{selectedIds.length}日分を1枚に印刷・PDF保存</span>
            </button>
          </div>
        </div>
      )}

      {/* Records Table / List */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-xl p-8 text-center space-y-3">
          <p className="text-stone-600 text-sm">
            {savedRecords.length === 0
              ? 'まだ登録済みの献立がありません。「毎日の献立登録」からメニューを入力し、「このメニューを登録・保存」を押してください。'
              : '検索条件に一致する登録済献立が見つかりませんでした。'}
          </p>
          {savedRecords.length === 0 && (
            <button
              type="button"
              onClick={onNavigateToNew}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <span>新規献立を入力する</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-stone-300 rounded-xl overflow-hidden shadow-2xs">
          <div className="px-3.5 py-2 bg-stone-100 border-b border-stone-300 flex flex-wrap items-center justify-between text-xs font-bold text-stone-700 gap-2">
            <div className="flex items-center gap-2">
              <span>登録済献立一覧（全 {filteredRecords.length} 件）</span>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] text-emerald-800 hover:underline font-normal cursor-pointer"
              >
                {selectedIds.length === filteredRecords.length ? '全選択を解除' : '最大3日分を選択'}
              </button>
            </div>
            <span className="text-[11px] text-stone-500 font-normal">
              ※チェックを入れて「まとめて1枚印刷」または右端の「表示/修正」で献立表に読み込み
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-5xl mx-auto text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-700 font-bold border-b border-stone-300">
                  <th className="py-2 px-2.5 w-10 text-center">選択</th>
                  <th className="py-2 px-2.5 w-32">献立日付</th>
                  <th className="py-2 px-2.5 w-[360px] sm:w-[420px]">献立内容（朝・昼・夕の主菜・副菜）</th>
                  <th className="py-2 px-2.5 w-28 text-center">1日食塩量</th>
                  <th className="py-2 px-2.5 w-24 text-center">エネルギー</th>
                  <th className="py-2 px-2.5 w-28 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredRecords.map((rec) => {
                  const isSafeSalt = rec.totals.saltTotal <= 6.5;
                  const isChecked = selectedIds.includes(rec.id);
                  const bSummary = rec.meals.breakfast.items
                    .filter((i) => i.dishName)
                    .map((i) => i.dishName)
                    .slice(0, 2)
                    .join('・');
                  const lSummary = rec.meals.lunch.items
                    .filter((i) => i.dishName)
                    .map((i) => i.dishName)
                    .slice(0, 2)
                    .join('・');
                  const dSummary = rec.meals.dinner.items
                    .filter((i) => i.dishName)
                    .map((i) => i.dishName)
                    .slice(0, 2)
                    .join('・');

                  return (
                    <tr
                      key={rec.id}
                      className={`hover:bg-amber-50/40 transition-colors ${
                        isChecked ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2 px-2 text-center align-top">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(rec.id)}
                          className="w-4 h-4 rounded text-[#2e4c43] focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>

                      {/* Date */}
                      <td className="py-2 px-2.5 align-top font-bold text-stone-900 whitespace-nowrap">
                        <div className="text-sm">{rec.dateDisplay}</div>
                        <div className="text-[11px] text-stone-500 font-normal">
                          {rec.year}年 / {rec.residentCount}名分
                        </div>
                      </td>

                      {/* Summary */}
                      <td className="py-2 px-2.5 align-top text-stone-700 space-y-0.5 leading-snug w-[360px] sm:w-[420px]">
                        <div>
                          <span className="font-semibold text-stone-900">[朝] </span>
                          <span>{bSummary || '—'}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-stone-900">[昼] </span>
                          <span>{lSummary || '—'}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-stone-900">[夕] </span>
                          <span>{dSummary || '—'}</span>
                        </div>
                      </td>

                      {/* Salt */}
                      <td className="py-2 px-2.5 align-top text-center">
                        <div className="font-mono font-bold text-sm text-stone-900">
                          {rec.totals.saltTotal.toFixed(2)} g
                        </div>
                        <div className="mt-0.5">
                          {isSafeSalt ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              基準クリア
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              6.5g超過
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Calories */}
                      <td className="py-2 px-2.5 align-top text-center font-mono text-stone-800 font-semibold">
                        {rec.totals.calories} kcal
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-2.5 align-top text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectRecord(rec)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded text-[11px] shadow-2xs transition-colors cursor-pointer"
                            title="この献立を読み込んで修正・表示"
                          >
                            <Edit3 className="w-3 h-3 text-stone-300" />
                            <span>表示/修正</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`${rec.dateDisplay}の献立データを削除してもよろしいですか？`)) {
                                onDeleteRecord(rec.id);
                              }
                            }}
                            className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="削除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
