import { ClockService } from './ClockService';

/**
 * Pure domain service for calculating accurate elapsed time.
 * Enforces calculation strictly via absolute deltas, bypassing any manual interval accumulation.
 */
export const TimerEngine = {
  /**
   * Returns elapsed time in milliseconds since the provided timestamp.
   * If timestamp is undefined/null, returns 0.
   */
  calculateElapsed: (timestamp?: number | null): number => {
    if (!timestamp) return 0;
    const now = ClockService.now();
    
    // Prevent mathematical errors if clock is suddenly rolled back
    return Math.max(0, now - timestamp);
  },
};
