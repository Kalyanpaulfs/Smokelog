import { SmokeLog } from './models';
import { ClockService } from './ClockService';

export interface Insights {
  totalLogged: number;
  todaysTotal: number;
  longestInterval: number; // in milliseconds
  averageInterval: number; // in milliseconds
  dailyAverage: number;
  daysTracked: number;
  last7DaysTrend: number[]; // Array of exactly 7 integers representing count per day, oldest to newest
}

export interface HistorySectionData {
  title: string;
  data: SmokeLog[];
}

/**
 * Pure functional domain service that extracts insights and grouped data
 * from the SmokeLog arrays without mutating storage.
 */
export const AnalyticsService = {
  /**
   * Calculates high-level metrics.
   * Time complexity: O(N) where N is number of logs.
   * Assumes logs array is sorted newest first.
   */
  calculateInsights: (logs: SmokeLog[]): Insights => {
    const totalLogged = logs.length;
    if (totalLogged === 0) {
      return { 
        totalLogged: 0, 
        todaysTotal: 0, 
        longestInterval: 0, 
        averageInterval: 0, 
        dailyAverage: 0, 
        daysTracked: 0,
        last7DaysTrend: [0, 0, 0, 0, 0, 0, 0] 
      };
    }

    const now = ClockService.now();
    const todayStart = new Date(now).setHours(0, 0, 0, 0);
    
    let todaysTotal = 0;
    let longestInterval = 0;
    let totalIntervals = 0;

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      
      // Calculate today's total
      if (log.timestamp >= todayStart) {
        todaysTotal++;
      }

      // Calculate intervals between logged events
      if (i < logs.length - 1) {
        const previousLog = logs[i + 1]; // next in array is chronologically previous
        const interval = log.timestamp - previousLog.timestamp;
        
        if (interval > 0) {
          totalIntervals += interval;
          if (interval > longestInterval) {
            longestInterval = interval;
          }
        }
      }
    }

    // Include the active, running interval from the latest log until now
    const currentInterval = now - logs[0].timestamp;
    if (currentInterval > longestInterval) {
      longestInterval = currentInterval;
    }

    // Average requires at least 2 logs to have an interval
    const averageInterval = totalLogged > 1 ? totalIntervals / (totalLogged - 1) : 0;

    // Calculate daily average
    const firstLog = logs[logs.length - 1];
    const msPerDay = 24 * 60 * 60 * 1000;
    const elapsedMsSinceFirstLog = now - firstLog.timestamp;
    const daysSinceFirstLog = Math.max(1, Math.ceil(elapsedMsSinceFirstLog / msPerDay));
    const dailyAverage = Math.round((totalLogged / daysSinceFirstLog) * 10) / 10; // Round to 1 decimal place

    // Calculate 7-day trend (0 is 6 days ago, 6 is today)
    const msPerDayValue = 24 * 60 * 60 * 1000;
    const last7DaysTrend = [0, 0, 0, 0, 0, 0, 0];
    
    logs.forEach((log) => {
      const msAgo = now - log.timestamp;
      const daysAgo = Math.floor(msAgo / msPerDayValue);
      if (daysAgo >= 0 && daysAgo < 7) {
        // Index 6 is today (daysAgo = 0). Index 0 is 6 days ago (daysAgo = 6).
        last7DaysTrend[6 - daysAgo]++;
      }
    });

    return {
      totalLogged,
      todaysTotal,
      longestInterval,
      averageInterval,
      dailyAverage,
      daysTracked: daysSinceFirstLog,
      last7DaysTrend,
    };
  },

  /**
   * Groups a chronological array into distinct time buckets.
   */
  groupHistory: (logs: SmokeLog[]): HistorySectionData[] => {
    if (logs.length === 0) return [];

    const now = ClockService.now();
    const todayStart = new Date(now).setHours(0, 0, 0, 0);
    const msPerDay = 24 * 60 * 60 * 1000;
    const yesterdayStart = todayStart - msPerDay;
    const thisWeekStart = todayStart - (msPerDay * 6);

    const groups: { [key: string]: SmokeLog[] } = {
      'Today': [],
      'Yesterday': [],
      'This Week': [],
      'Earlier': [],
    };

    logs.forEach((log) => {
      if (log.timestamp >= todayStart) {
        groups['Today'].push(log);
      } else if (log.timestamp >= yesterdayStart) {
        groups['Yesterday'].push(log);
      } else if (log.timestamp >= thisWeekStart) {
        groups['This Week'].push(log);
      } else {
        groups['Earlier'].push(log);
      }
    });

    // Strip empty sections for clean UI rendering
    return [
      { title: 'Today', data: groups['Today'] },
      { title: 'Yesterday', data: groups['Yesterday'] },
      { title: 'This Week', data: groups['This Week'] },
      { title: 'Earlier', data: groups['Earlier'] },
    ].filter(section => section.data.length > 0);
  },
};
