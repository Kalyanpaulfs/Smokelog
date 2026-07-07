import { create } from 'zustand';
import { SmokeLog } from '../domain/models';
import { SmokeLogService } from '../domain/SmokeLogService';
import { AsyncStorageSmokeLogRepository } from '../infrastructure/AsyncStorageSmokeLogRepository';
import { ClockService } from '../domain/ClockService';

interface SmokeState {
  /** All recorded smoke logs, sorted newest first */
  logs: SmokeLog[];
  /** The most recent smoke log for quick access (e.g. timers) */
  latestLog: SmokeLog | null;
  /** Timestamp of the last time the store's data was modified or hydrated */
  lastUpdatedAt: number | null;
  
  // Actions
  /** Idempotently loads the latest data from persistence into memory */
  hydrateAsync: () => Promise<void>;
  /** Initiates the domain flow to log a new smoke event */
  logSmoke: () => Promise<void>;
}

// Instantiate the domain dependencies
const repository = new AsyncStorageSmokeLogRepository();
const smokeService = new SmokeLogService(repository);

export const useSmokeStore = create<SmokeState>((set) => ({
  logs: [],
  latestLog: null,
  lastUpdatedAt: null,

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
  },
}));
