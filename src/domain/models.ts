export interface SmokeLog {
  /** Unique UUID for the log */
  id: string;
  /** Unix timestamp in milliseconds when the event occurred */
  timestamp: number;
}

export interface UserPreferences {
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface AppMetadata {
  version: string;
  isFirstLaunch: boolean;
}
