import { FacilityInfo, DayMenu, SavedMenuRecord } from '../types';

export interface AppBackupData {
  version: '1.0';
  app: 'momonosato_menu_planner';
  exportedAt: string; // ISO string
  exportDateDisplay: string; // e.g., "2026/09/05 15:40"
  facilityInfo: FacilityInfo;
  sheetMode: 1 | 2 | 3;
  sheetDays: DayMenu[];
  savedRecords: SavedMenuRecord[];
  summary: {
    savedRecordCount: number;
    sheetDayCount: number;
    facilityTitle: string;
  };
}

export const BACKUP_SNAPSHOT_STORAGE_KEY = 'momonosato_backup_snapshot_v1';

/**
 * Creates the complete backup object from current app state
 */
export function createBackupPayload(
  facilityInfo: FacilityInfo,
  sheetMode: 1 | 2 | 3,
  sheetDays: DayMenu[],
  savedRecords: SavedMenuRecord[]
): AppBackupData {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const exportDateDisplay = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  return {
    version: '1.0',
    app: 'momonosato_menu_planner',
    exportedAt: now.toISOString(),
    exportDateDisplay,
    facilityInfo: JSON.parse(JSON.stringify(facilityInfo)),
    sheetMode,
    sheetDays: JSON.parse(JSON.stringify(sheetDays)),
    savedRecords: JSON.parse(JSON.stringify(savedRecords)),
    summary: {
      savedRecordCount: savedRecords.length,
      sheetDayCount: sheetDays.length,
      facilityTitle: facilityInfo.titlePrefix || '桃の郷 京都東山 献立表'
    }
  };
}

/**
 * Saves snapshot in browser localStorage and triggers file download (.json)
 */
export function exportBackupToFile(payload: AppBackupData): void {
  // 1. Save in localStorage as latest snapshot
  try {
    localStorage.setItem(BACKUP_SNAPSHOT_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to save snapshot to localStorage:', err);
  }

  // 2. Generate and download JSON file
  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const filename = `献立データバックアップ_${payload.facilityInfo.yearEra || '令和8'}年${payload.facilityInfo.month || '9'}月_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Retrieve the latest internal backup snapshot from localStorage
 */
export function getInternalBackupSnapshot(): AppBackupData | null {
  try {
    const raw = localStorage.getItem(BACKUP_SNAPSHOT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.facilityInfo && Array.isArray(parsed.sheetDays)) {
      return parsed as AppBackupData;
    }
  } catch (err) {
    console.error('Error reading backup snapshot:', err);
  }
  return null;
}

/**
 * Parse and validate a user-selected .json backup file
 */
export function parseBackupFile(file: File): Promise<AppBackupData> {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith('.json')) {
      reject(new Error('バックアップ用JSONファイル（.json）を選択してください。'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        // Validation
        if (!parsed.facilityInfo || !Array.isArray(parsed.sheetDays) || !Array.isArray(parsed.savedRecords)) {
          reject(new Error('バックアップファイルのデータ構造が不正です。正しいバックアップファイルを選択してください。'));
          return;
        }

        resolve(parsed as AppBackupData);
      } catch (err) {
        reject(new Error('ファイルの解析に失敗しました。ファイルが破損していないか確認してください。'));
      }
    };
    reader.onerror = () => {
      reject(new Error('ファイルの読み込み中にエラーが発生しました。'));
    };
    reader.readAsText(file);
  });
}
