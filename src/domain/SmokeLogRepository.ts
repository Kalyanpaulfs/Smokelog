import { SmokeLog } from './models';

/**
 * Interface defining the persistence contract for Smoke Logs.
 * Keeps business logic entirely decoupled from implementation details like MMKV.
 */
export interface SmokeLogRepository {
  /**
   * Retrieves all saved smoke logs from storage.
   * If storage is empty or corrupted, it must return an empty array gracefully.
   */
  getLogs(): Promise<SmokeLog[]>;
  
  /**
   * Persists a single smoke log to storage.
   * Throws a StorageError if the operation fails.
   * @param log The log to save.
   */
  saveLog(log: SmokeLog): Promise<void>;
}
