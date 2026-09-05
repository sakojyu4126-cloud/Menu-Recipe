import React from 'react';
import { Users, Printer, FileText, ListOrdered, Save, RotateCcw } from 'lucide-react';
import { FacilityInfo } from '../types';

interface Props {
  facilityInfo: FacilityInfo;
  onUpdateFacilityInfo: (updated: Partial<FacilityInfo>) => void;
  activeTab: 'edit' | 'list';
  onChangeTab: (tab: 'edit' | 'list') => void;
  savedCount: number;
  onOpenPrintModal: () => void;
  onOpenSaveData: () => void;
  onOpenRestoreData: () => void;
}

export const MenuHeader: React.FC<Props> = ({
  facilityInfo,
  onUpdateFacilityInfo,
  activeTab,
  onChangeTab,
  savedCount,
  onOpenPrintModal,
  onOpenSaveData,
  onOpenRestoreData
}) => {
  return (
    <header className="bg-white border-b border-stone-300 shadow-2xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Main Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Title & Month/Year */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-stone-900">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-serif">
              桃の郷 京都東山 献立表
            </h1>

            <div className="flex items-center gap-1 bg-stone-50 px-2 py-1 rounded-md border border-stone-300 text-sm font-semibold">
              <input
                type="text"
                value={facilityInfo.month}
                onChange={(e) => onUpdateFacilityInfo({ month: e.target.value })}
                className="w-10 text-center font-bold text-stone-900 bg-white border border-stone-300 rounded px-1 py-0.5 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                aria-label="月度"
              />
              <span className="text-stone-700">月度 /</span>
              <input
                type="text"
                value={facilityInfo.yearEra}
                onChange={(e) => onUpdateFacilityInfo({ yearEra: e.target.value })}
                className="w-20 text-center font-bold text-stone-900 bg-white border border-stone-300 rounded px-1 py-0.5 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                aria-label="令和年度"
              />
              <span className="text-stone-700">年</span>
            </div>
          </div>

          {/* Right Controls: Resident Count + Print/PDF Button */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Resident Count Box (分量自動連動機能は保持、ラベルテキストは削除) */}
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-stone-800 font-medium text-xs sm:text-sm">
                <Users className="w-4 h-4 text-stone-600" />
                <span>入居者数:</span>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => onUpdateFacilityInfo({ residentCount: Math.max(1, facilityInfo.residentCount - 1) })}
                  className="w-6 h-7 flex items-center justify-center bg-white border border-stone-300 rounded-l text-stone-800 font-bold hover:bg-stone-100 transition-colors"
                  title="1名減らす"
                >
                  -
                </button>
                <input
                  id="resident-count-input"
                  type="number"
                  min="1"
                  max="500"
                  value={facilityInfo.residentCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val > 0) {
                      onUpdateFacilityInfo({ residentCount: val });
                    }
                  }}
                  className="w-12 text-center font-bold text-sm text-stone-900 bg-white border-y border-stone-300 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => onUpdateFacilityInfo({ residentCount: facilityInfo.residentCount + 1 })}
                  className="w-6 h-7 flex items-center justify-center bg-white border border-stone-300 rounded-r text-stone-800 font-bold hover:bg-stone-100 transition-colors"
                  title="1名増やす"
                >
                  +
                </button>
                <span className="ml-1.5 text-stone-900 font-bold text-xs sm:text-sm">名</span>
              </div>
            </div>

            {/* データ保存 (Backup Export) */}
            <button
              type="button"
              onClick={onOpenSaveData}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 shadow-2xs transition-colors cursor-pointer"
              title="編集中の献立・登録一覧・施設設定をまとめてPCファイルおよびブラウザにバックアップ保存します"
            >
              <Save className="w-3.5 h-3.5 text-emerald-700" />
              <span>データ保存</span>
            </button>

            {/* データ復元 (Backup Restore) */}
            <button
              type="button"
              onClick={onOpenRestoreData}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-900 shadow-2xs transition-colors cursor-pointer"
              title="保存したバックアップファイル（.json）や直近バックアップから献立データを復元します"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-700" />
              <span>データ復元</span>
            </button>

            {/* Print & PDF Button */}
            <button
              type="button"
              onClick={onOpenPrintModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border border-stone-300 bg-stone-800 hover:bg-stone-900 text-white shadow-2xs transition-colors cursor-pointer"
              title={activeTab === 'list' ? '登録済献立一覧表を印刷またはPDF保存' : '献立表（A4集約）を印刷またはPDF保存'}
            >
              <Printer className="w-3.5 h-3.5 text-stone-300" />
              <span>{activeTab === 'list' ? '一覧表の印刷・PDF保存' : '印刷・PDF保存'}</span>
            </button>
          </div>
        </div>

        {/* View Switch Tabs: ①毎日の献立登録 / ②登録済献立一覧表 */}
        <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeTab('edit')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'edit'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>① 毎日の献立登録</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('list')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'list'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>② 登録済献立一覧表</span>
            {savedCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'list' ? 'bg-emerald-800 text-white' : 'bg-stone-300 text-stone-800'
              }`}>
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
