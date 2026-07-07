import { create } from 'zustand';
import { SmokeLog } from '../domain/models';
import { SmokeLogService } from '../domain/SmokeLogService';
import { AsyncStorageSmokeLogRepository } from '../infrastructure/AsyncStorageSmokeLogRepository';
import { ClockService } from '../domain/ClockService';
import { NotificationService } from '../domain/NotificationService';
import { StorageService } from '../storage';

interface SmokeState {
  /** All recorded smoke logs, sorted newest first */
  logs: SmokeLog[];
  /** The most recent smoke log for quick access (e.g. timers) */
  latestLog: SmokeLog | null;
  /** Timestamp of the last time the store's data was modified or hydrated */
  lastUpdatedAt: number | null;
  /** Number of logs to currently display (pagination) */
  displayLimit: number;
  
  // Actions
  /** Idempotently loads the latest data from persistence into memory */
  hydrateAsync: () => Promise<void>;
  /** Initiates the domain flow to log a new smoke event */
  logSmoke: () => Promise<void>;
  /** Increases the display limit to show more history */
  loadMoreHistory: () => void;
  /** Clears all tracking data and resets the state completely */
  clearAllData: () => Promise<void>;
  /** Deletes a specific log by ID */
  deleteLog: (id: string) => Promise<void>;
}

// Instantiate the domain dependencies
const repository = new AsyncStorageSmokeLogRepository();
const smokeService = new SmokeLogService(repository);

export const useSmokeStore = create<SmokeState>((set) => ({
  logs: [],
  latestLog: null,
  lastUpdatedAt: null,
  displayLimit: 100,

  hydrateAsync: async () => {
    // Hydration must be idempotent. It strictly pulls from the local persistence source of truth.
    const logs = await smokeService.getLogs();
    set({
      logs,
      latestLog: logs.length > 0 ? logs[0] : null,
      lastUpdatedAt: ClockService.now(),
    });
  },

  logSmoke: async () => {
    // 1. Service handles domain validations and sync persistence first.
    // 2. If validation or storage fails, an explicit error is thrown, and Zustand is NEVER updated.
    const newLog = await smokeService.logSmoke();

    // 3. Update Zustand memory only after successful persistence.
    set((state) => ({
      logs: [newLog, ...state.logs],
      latestLog: newLog,
      lastUpdatedAt: ClockService.now(),
    }));

    // 4. Schedule local achievement push notifications in the background
    // Fire and forget - we don't want to block the UI if this fails
    NotificationService.scheduleMilestonesAsync(newLog.timestamp).catch(console.error);
  },

  loadMoreHistory: () => {
    set((state) => ({
      displayLimit: state.displayLimit + 50
    }));
  },

  clearAllData: async () => {
    // 1. Clear physical storage
    await StorageService.clearAll();
    // 2. Cancel any pending milestone notifications
    await NotificationService.cancelAllScheduledNotificationsAsync();
    // 3. Reset memory state
    set({
      logs: [],
      latestLog: null,
      lastUpdatedAt: ClockService.now(),
      displayLimit: 100,
    });
  },

  deleteLog: async (id: string) => {
    // 1. Delete from storage via service
    await smokeService.deleteLog(id);

    // 2. Update memory state
    set((state) => {
      const newLogs = state.logs.filter(log => log.id !== id);
      const newLatest = newLogs.length > 0 ? newLogs[0] : null;
      
      // 3. Reschedule notifications based on the *new* latest log
      if (newLatest) {
        NotificationService.scheduleMilestonesAsync(newLatest.timestamp).catch(console.error);
      } else {
        NotificationService.cancelAllScheduledNotificationsAsync().catch(console.error);
      }

      return {
        logs: newLogs,
        latestLog: newLatest,
        lastUpdatedAt: ClockService.now(),
      };
    });
  }
}));
