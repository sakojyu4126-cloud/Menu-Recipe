import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Upload, ShieldCheck, Database, FileText, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { FacilityInfo, DayMenu, SavedMenuRecord } from '../types';
import {
  AppBackupData,
  createBackupPayload,
  exportBackupToFile,
  getInternalBackupSnapshot,
  parseBackupFile
} from '../utils/dataBackup';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  facilityInfo: FacilityInfo;
  sheetMode: 1 | 2 | 3;
  sheetDays: DayMenu[];
  savedRecords: SavedMenuRecord[];
  onRestoreData: (backupData: AppBackupData) => void;
  onNotifyToast: (message: string) => void;
  defaultActionTab?: 'save' | 'restore';
}

export const DataBackupModal: React.FC<Props> = ({
  isOpen,
  onClose,
  facilityInfo,
  sheetMode,
  sheetDays,
  savedRecords,
  onRestoreData,
  onNotifyToast,
  defaultActionTab = 'save'
}) => {
  const [activeTab, setActiveTab] = useState<'save' | 'restore'>('save');
  const [latestSnapshot, setLatestSnapshot] = useState<AppBackupData | null>(null);
  const [selectedFileBackup, setSelectedFileBackup] = useState<AppBackupData | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileError, setFileError] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultActionTab);
      const snapshot = getInternalBackupSnapshot();
      setLatestSnapshot(snapshot);
      setSelectedFileBackup(null);
      setFileName('');
      setFileError(null);
    }
  }, [isOpen, defaultActionTab]);

  if (!isOpen) return null;

  // Execute Export
  const handleExport = () => {
    const payload = createBackupPayload(facilityInfo, sheetMode, sheetDays, savedRecords);
    exportBackupToFile(payload);
    setLatestSnapshot(payload);
    onNotifyToast('データをPCファイルに保存し、ブラウザ内にもバックアップしました！');
  };

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileError(null);
    setIsLoadingFile(true);

    try {
      const backup = await parseBackupFile(file);
      setSelectedFileBackup(backup);
    } catch (err: any) {
      setFileError(err.message || 'ファイルの読み込みに失敗しました。');
      setSelectedFileBackup(null);
    } finally {
      setIsLoadingFile(false);
    }
  };

  // Execute Restore from Snapshot
  const handleRestoreFromSnapshot = () => {
    if (!latestSnapshot) return;
    if (window.confirm('ブラウザに保存されている直近バックアップからデータを復元しますか？\n現在の画面表示と登録データが置き換わります。')) {
      onRestoreData(latestSnapshot);
      onNotifyToast(`直近バックアップ（${latestSnapshot.exportDateDisplay || '保存データ'}）から復元しました！`);
      onClose();
    }
  };

  // Execute Restore from File
  const handleRestoreFromFile = () => {
    if (!selectedFileBackup) return;
    if (window.confirm(`ファイル「${fileName}」からデータを復元しますか？\n現在の画面表示と登録データが置き換わります。`)) {
      onRestoreData(selectedFileBackup);
      onNotifyToast(`ファイル「${fileName}」から正常にデータを復元しました！`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col border border-stone-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                献立データの保存・復元（バックアップ管理）
              </h3>
              <p className="text-xs text-stone-500">
                誤操作やデータ消失に備え、いつでも保存ファイルから復元できます
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector: 保存 or 復元 */}
        <div className="flex border-b border-stone-200 bg-stone-100/60 p-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('save')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'save'
                ? 'bg-white text-emerald-800 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>データ保存（バックアップ作成）</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('restore')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'restore'
                ? 'bg-white text-blue-800 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <Upload className="w-4 h-4 text-blue-700" />
            <span>データ復元（保存データから読込）</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-stone-800 text-xs sm:text-sm">
          {activeTab === 'save' ? (
            <div className="space-y-4">
              {/* Current Data Overview */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3.5 space-y-2">
                <div className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>保存対象の現在のデータ内容:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded border border-stone-200">
                    <span className="text-stone-500 block">編集中の献立日数:</span>
                    <span className="font-bold text-stone-900 text-sm">{sheetDays.length} 日分</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-stone-200">
                    <span className="text-stone-500 block">登録済献立一覧:</span>
                    <span className="font-bold text-stone-900 text-sm">{savedRecords.length} 件</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-stone-200 col-span-2">
                    <span className="text-stone-500 block">施設・月度設定:</span>
                    <span className="font-bold text-stone-900">
                      {facilityInfo.titlePrefix}（{facilityInfo.yearEra}年 {facilityInfo.month}月度 / 入居者 {facilityInfo.residentCount}名）
                    </span>
                  </div>
                </div>
              </div>

              {/* Save Action Box */}
              <div className="border border-emerald-200 bg-emerald-50/60 rounded-xl p-4 text-center space-y-3">
                <p className="text-xs text-stone-700 leading-relaxed">
                  下のボタンを押すと、現在の全データ（編集中の献立・登録一覧・施設設定）が
                  <strong className="text-emerald-900">バックアップファイル（.json）としてPCへダウンロード</strong>され、
                  ブラウザ内部にも最新スナップショットが保存されます。
                </p>
                <button
                  type="button"
                  onClick={handleExport}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2e4c43] hover:bg-[#243d36] text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>今すぐデータ保存（ファイル出力 & 保管）</span>
                </button>
              </div>

              {latestSnapshot && (
                <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>最終ブラウザ保存日時: {latestSnapshot.exportDateDisplay}（登録 {latestSnapshot.summary.savedRecordCount}件）</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs text-stone-600 bg-amber-50 border border-amber-200 p-2.5 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  復元を実行すると、現在の編集画面および登録一覧が、選択した保存データの内容で復元・上書きされます。
                </span>
              </div>

              {/* Method 1: Internal Snapshot (Fast 1-click restore) */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-blue-700" />
                    <span>復元方法①: 直近のブラウザ内バックアップから復元</span>
                  </span>
                </div>

                {latestSnapshot ? (
                  <div className="bg-white p-3 rounded border border-stone-200 space-y-2">
                    <div className="text-xs flex justify-between">
                      <span className="text-stone-500">保存日時:</span>
                      <span className="font-bold text-stone-900">{latestSnapshot.exportDateDisplay}</span>
                    </div>
                    <div className="text-xs flex justify-between">
                      <span className="text-stone-500">データ内容:</span>
                      <span className="font-semibold text-stone-800">
                        登録献立 {latestSnapshot.summary.savedRecordCount}件 / 編集シート {latestSnapshot.summary.sheetDayCount}日分
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRestoreFromSnapshot}
                      className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>この直近バックアップから復元する</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 py-1">
                    ※ ブラウザ内に保存された直近バックアップデータはまだありません。「データ保存」を実行するか、下記ファイルから復元してください。
                  </p>
                )}
              </div>

              {/* Method 2: From downloaded .json file */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50 space-y-2.5">
                <span className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>復元方法②: PCに保存したバックアップファイル（.json）から復元</span>
                </span>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-lg p-4 text-center cursor-pointer bg-white transition-colors"
                >
                  <Upload className="w-6 h-6 text-stone-400 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-stone-700">
                    {fileName ? fileName : 'クリックしてバックアップファイル（.json）を選択'}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    過去に「データ保存」でダウンロードしたファイルを選択してください
                  </p>
                </div>

                {isLoadingFile && (
                  <p className="text-xs text-stone-500 text-center py-1">ファイルを解析中...</p>
                )}

                {fileError && (
                  <p className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded border border-red-200">
                    {fileError}
                  </p>
                )}

                {selectedFileBackup && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>有効なバックアップファイルが読み込まれました</span>
                    </div>
                    <div className="text-xs text-stone-700 space-y-0.5 pl-5">
                      <div>保存日時: <span className="font-bold">{selectedFileBackup.exportDateDisplay || selectedFileBackup.exportedAt}</span></div>
                      <div>登録済献立: <span className="font-bold">{selectedFileBackup.summary?.savedRecordCount ?? selectedFileBackup.savedRecords?.length} 件</span></div>
                      <div>施設名: <span className="font-bold">{selectedFileBackup.facilityInfo?.titlePrefix}</span></div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRestoreFromFile}
                      className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#2e4c43] hover:bg-[#243d36] text-white font-bold text-xs rounded transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>選択したファイルから復元を実行する</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-lg border border-stone-300 text-stone-700 bg-white hover:bg-stone-100 transition-colors cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
