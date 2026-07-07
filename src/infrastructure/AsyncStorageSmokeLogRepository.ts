import { SmokeLogRepository } from '../domain/SmokeLogRepository';
import { SmokeLog } from '../domain/models';
import { StorageError } from '../domain/errors';
import { StorageService } from '../storage';
import { StorageKeys } from '../constants';

export class AsyncStorageSmokeLogRepository implements SmokeLogRepository {
  async getLogs(): Promise<SmokeLog[]> {
    try {
      const logsJson = await StorageService.getString(StorageKeys.SMOKE_LOGS);
      if (!logsJson) {
        return [];
      }

      const parsed = JSON.parse(logsJson);
      
      // Strict Storage Schema Validation
      if (!Array.isArray(parsed)) {
        // Storage data is not an array. Recovering with empty array without logging.
        return [];
      }

      // Filter out malformed records to recover gracefully without crashing
      const validLogs = parsed.filter(item => 
        item && 
        typeof item === 'object' && 
        typeof item.id === 'string' && 
        typeof item.timestamp === 'number'
      ) as SmokeLog[];

      if (validLogs.length !== parsed.length) {
        // Storage contained malformed records. They have been stripped without logging.
      }

      return validLogs;
    } catch {
      // Failed to parse logs JSON. Recovering with empty array without logging.
      return []; // Graceful recovery without crashing
    }
  }

  async saveLog(log: SmokeLog): Promise<void> {
    try {
      const currentLogs = await this.getLogs();
      const updatedLogs = [log, ...currentLogs];
      
      const success = await StorageService.setObject(StorageKeys.SMOKE_LOGS, updatedLogs);
      
      if (!success) {
        throw new StorageError('AsyncStorage failed to write object to disk.');
      }
    } catch (error) {
      if (error instanceof StorageError) throw error;
      throw new StorageError(`Failed to save log: ${(error as Error).message}`);
    }
  }
}
