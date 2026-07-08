import { AnalyticsService } from '../AnalyticsService';
import { ClockService } from '../ClockService';
import { SmokeLog } from '../models';

describe('AnalyticsService', () => {
  const MOCK_NOW = new Date('2024-01-10T12:00:00Z').getTime(); // Wed Jan 10 2024
  
  beforeEach(() => {
    jest.spyOn(ClockService, 'now').mockReturnValue(MOCK_NOW);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('calculateInsights', () => {
    it('should return empty state for 0 logs', () => {
      const result = AnalyticsService.calculateInsights([]);
      expect(result).toEqual({
        totalLogged: 0,
        todaysTotal: 0,
        longestInterval: 0,
        averageInterval: 0,
        dailyAverage: 0,
        daysTracked: 0,
        last7DaysTrend: [0, 0, 0, 0, 0, 0, 0]
      });
    });

    it('should calculate insights for a single log correctly', () => {
      // 2 hours ago
      const logTime = MOCK_NOW - (2 * 60 * 60 * 1000); 
      const logs: SmokeLog[] = [{ id: '1', timestamp: logTime }];

      const result = AnalyticsService.calculateInsights(logs);
      expect(result.totalLogged).toBe(1);
      expect(result.todaysTotal).toBe(1);
      expect(result.longestInterval).toBe(2 * 60 * 60 * 1000);
      expect(result.averageInterval).toBe(0); // Cannot average 1 log interval
      expect(result.dailyAverage).toBe(1); 
      expect(result.daysTracked).toBe(1);
      
      // Last 7 days trend should have 1 at the end (today)
      expect(result.last7DaysTrend).toEqual([0, 0, 0, 0, 0, 0, 1]);
    });

    it('should correctly calculate longest interval, averages, and 7-day trend across multiple days', () => {
      const msPerDay = 24 * 60 * 60 * 1000;
      const logs: SmokeLog[] = [
        // Newest first
        { id: '4', timestamp: MOCK_NOW - (2 * 60 * 60 * 1000) }, // Today (2 hrs ago)
        { id: '3', timestamp: MOCK_NOW - (10 * 60 * 60 * 1000) }, // Today (10 hrs ago, interval = 8 hrs)
        { id: '2', timestamp: MOCK_NOW - msPerDay - (5 * 60 * 60 * 1000) }, // Yesterday (interval = 19 hrs)
        { id: '1', timestamp: MOCK_NOW - (3.5 * msPerDay) }, // 3.5 days ago (interval = ~2.5 days)
      ];

      const result = AnalyticsService.calculateInsights(logs);
      
      expect(result.totalLogged).toBe(4);
      expect(result.todaysTotal).toBe(2);
      
      // The longest interval is between log 1 and log 2
      const expectedLongestInterval = logs[2].timestamp - logs[3].timestamp;
      expect(result.longestInterval).toBe(expectedLongestInterval);
      
      // Average interval calculation (sum of intervals / 3)
      const sumIntervals = (logs[0].timestamp - logs[1].timestamp) + 
                           (logs[1].timestamp - logs[2].timestamp) + 
                           (logs[2].timestamp - logs[3].timestamp);
      expect(result.averageInterval).toBe(sumIntervals / 3);
      
      // 4 logs across 4 days (Day 0 to Day 3)
      expect(result.daysTracked).toBe(4);
      expect(result.dailyAverage).toBe(1); // 4 logs / 4 days = 1.0
      
      // Trend: [6 days ago, 5, 4, 3, 2, 1, Today]
      // logs[3] is 3.5 days ago -> index 3
      // logs[2] is 1 day ago (yesterday) -> index 5
      // logs[1], logs[0] are today -> index 6
      expect(result.last7DaysTrend).toEqual([0, 0, 0, 1, 0, 1, 2]);
    });
  });

  describe('groupHistory', () => {
    it('should return empty array for no logs', () => {
      const result = AnalyticsService.groupHistory([]);
      expect(result).toEqual([]);
    });

    it('should accurately group logs into Today, Yesterday, This Week, and Earlier', () => {
      const msPerDay = 24 * 60 * 60 * 1000;
      
      // We must define logs exactly in relative to the mocked "now" start of day
      const todayStart = new Date(MOCK_NOW).setHours(0, 0, 0, 0);
      
      const logToday = { id: '1', timestamp: todayStart + 1000 };
      const logYesterday = { id: '2', timestamp: todayStart - 1000 };
      const logThisWeek = { id: '3', timestamp: todayStart - (3 * msPerDay) };
      const logEarlier = { id: '4', timestamp: todayStart - (10 * msPerDay) };
      
      const logs = [logToday, logYesterday, logThisWeek, logEarlier];

      const result = AnalyticsService.groupHistory(logs);
      
      expect(result.length).toBe(4);
      expect(result[0].title).toBe('Today');
      expect(result[0].data).toEqual([logToday]);
      
      expect(result[1].title).toBe('Yesterday');
      expect(result[1].data).toEqual([logYesterday]);
      
      expect(result[2].title).toBe('This Week');
      expect(result[2].data).toEqual([logThisWeek]);
      
      expect(result[3].title).toBe('Earlier');
      expect(result[3].data).toEqual([logEarlier]);
    });

    it('should omit sections that have no logs', () => {
      const todayStart = new Date(MOCK_NOW).setHours(0, 0, 0, 0);
      const logToday = { id: '1', timestamp: todayStart + 1000 };
      
      const result = AnalyticsService.groupHistory([logToday]);
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('Today');
    });
  });
});
