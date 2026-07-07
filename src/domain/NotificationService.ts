import { Alert } from 'react-native';

interface Milestone {
  id: string;
  hours: number;
  title: string;
  body: string;
}

const MILESTONES: Milestone[] = [
  { id: 'm-24h', hours: 24, title: '24 Hours Smoke Free! 🎉', body: 'Great job starting your streak. Keep it up!' },
  { id: 'm-3d', hours: 72, title: '3 Days Smoke Free! 🔥', body: 'You are past the hardest physical cravings.' },
  { id: 'm-1w', hours: 168, title: '1 Week Smoke Free! 🏆', body: 'An amazing milestone. Your body is healing.' },
  { id: 'm-1m', hours: 720, title: '1 Month Smoke Free! 🌟', body: 'You are officially crushing this.' },
];

/**
 * Mocked Notification Service.
 * Expo Go removed push notification support in SDK 53+. 
 * This requires a custom Development Build to work natively.
 */
export const NotificationService = {
  async requestPermissionsAsync(): Promise<boolean> {
    Alert.alert(
      'Expo Go Limitation',
      'Push notifications are not supported in the standard Expo Go app. To use Achievement Alerts, this app must be compiled into a custom Development Build or downloaded from the App Store.'
    );
    return false;
  },

  async hasPermissionsAsync(): Promise<boolean> {
    return false;
  },

  async cancelAllScheduledNotificationsAsync(): Promise<void> {
    // No-op in Expo Go
  },

  async scheduleMilestonesAsync(latestSmokeTimestamp: number): Promise<void> {
    // No-op in Expo Go
  }
};
