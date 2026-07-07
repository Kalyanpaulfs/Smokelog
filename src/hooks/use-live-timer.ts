import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { TimerEngine } from '../domain/TimerEngine';
import { ClockService } from '../domain/ClockService';

export interface LiveTimerResult {
  elapsedMilliseconds: number;
  isRunning: boolean;
  hasLog: boolean;
}

/**
 * A bridge hook between the React lifecycle and the pure TimerEngine.
 * Implements Timing Precision Sync, AppState Lifecycle suspends, and prevents drift.
 */
export function useLiveTimer(timestamp?: number | null): LiveTimerResult {
  const [elapsed, setElapsed] = useState<number>(TimerEngine.calculateElapsed(timestamp));
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  // Refs to cleanly obliterate intervals across renders and lifecycles
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  
  const hasLog = timestamp !== undefined && timestamp !== null;

  useEffect(() => {
    // 1. Teardown function to instantly halt execution and save battery
    const clearTimers = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
    };

    // 2. Startup function with Timing Precision Requirement
    const startTimers = () => {
      clearTimers(); // Ensure absolutely no duplicates exist
      
      if (!hasLog) {
        setElapsed(0);
        return;
      }
      
      // Immediate accurate sync upon start
      setElapsed(TimerEngine.calculateElapsed(timestamp));
      setIsRunning(true);

      // Boundary Sync: calculate exact ms until the real-world clock ticks to the next second
      const now = ClockService.now();
      const msUntilNextSecond = 1000 - (now % 1000);

      timeoutRef.current = setTimeout(() => {
        // Sync once explicitly on the boundary
        setElapsed(TimerEngine.calculateElapsed(timestamp));
        
        // Lock into the 1000ms cadence precisely on the boundary
        intervalRef.current = setInterval(() => {
          setElapsed(TimerEngine.calculateElapsed(timestamp));
        }, 1000);
      }, msUntilNextSecond);
    };

    // 3. AppState listener to explicitly manage backgrounding vs foregrounding
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && appStateRef.current !== 'active') {
        // App returned to foreground -> Recalculate accurately and resume ticks
        if (hasLog) startTimers();
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App suspended or inactive -> Stop intervals entirely for battery optimization
        clearTimers();
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Initial Start check
    if (appStateRef.current === 'active' && hasLog) {
      startTimers();
    } else {
      clearTimers(); // If log was removed or app is backgrounded, halt immediately
    }

    // Cleanup strictly bounds the hook to the unmount lifecycle
    return () => {
      subscription.remove();
      clearTimers();
    };
  }, [timestamp, hasLog]); // Exclusively re-run if the target timestamp changes

  return {
    elapsedMilliseconds: elapsed,
    isRunning,
    hasLog,
  };
}
