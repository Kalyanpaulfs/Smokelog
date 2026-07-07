import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useSmokeStore } from '../store/smokeStore';
import { StorageService } from '../storage';
import { StorageKeys } from '../constants';
import { SmokeLog } from './models';

export const BackupService = {
  /**
   * Exports the entire smoke log database to a JSON file and opens the native share sheet.
   */
  exportData: async (): Promise<boolean> => {
    try {
      const logsJson = await StorageService.getString(StorageKeys.SMOKE_LOGS);
      if (!logsJson) return false;

      const filename = `Smokelog_Backup_${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, logsJson, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Save your Smokelog Backup',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Export failed:', error);
      return false;
    }
  },

  /**
   * Prompts the user to pick a JSON backup file and restores the data.
   */
  importData: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return { success: false, message: 'Import canceled.' };
      }

      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const parsedData = JSON.parse(fileContent);

      if (!Array.isArray(parsedData)) {
        return { success: false, message: 'Invalid backup file format.' };
      }

      // Basic validation
      const isValid = parsedData.every(
        (item) => item.id && item.timestamp && typeof item.timestamp === 'number'
      );

      if (!isValid) {
        return { success: false, message: 'Backup file contains corrupted data.' };
      }

      // Save to persistence
      await StorageService.setObject(StorageKeys.SMOKE_LOGS, parsedData as SmokeLog[]);

      // Hydrate store so UI updates immediately
      await useSmokeStore.getState().hydrateAsync();

      return { success: true, message: 'Data restored successfully!' };
    } catch (error) {
      console.error('Import failed:', error);
      return { success: false, message: 'Failed to import data.' };
    }
  },
};
