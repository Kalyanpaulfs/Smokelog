export const APP_NAME = 'Smokelog';

export const StorageKeys = {
  APP_SETTINGS: '@smokelog_settings',
  USER_DATA: '@smokelog_user_data',
  AUTH_TOKEN: '@smokelog_auth_token',
  SMOKE_LOGS: '@smokelog_logs_v1',
};

export const DefaultSettings = {
  theme: 'system', // 'light' | 'dark' | 'system'
  notificationsEnabled: true,
};

export const TimeConstants = {
  ONE_SECOND_MS: 1000,
  ONE_MINUTE_MS: 60 * 1000,
  ONE_HOUR_MS: 60 * 60 * 1000,
  ONE_DAY_MS: 24 * 60 * 60 * 1000,
};
