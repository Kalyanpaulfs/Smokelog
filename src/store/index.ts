import { create } from 'zustand';
import { StorageService } from '../storage';
import { StorageKeys } from '../constants';
import { NotificationService } from '../domain/NotificationService';

export type ThemeMode = 'light' | 'dark' | 'system';

interface AppState {
  isInitialized: boolean;
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  costPerCigarette: number;
  setInitialized: (value: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setCostPerCigarette: (cost: number) => Promise<void>;
  toggleNotifications: () => Promise<void>;
  hydrateAsync: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  isInitialized: false,
  themeMode: 'system',
  notificationsEnabled: false,
  costPerCigarette: 0,
  setInitialized: (value: boolean) => set({ isInitialized: value }),
  setThemeMode: async (mode: ThemeMode) => {
    await StorageService.setItem(StorageKeys.APP_SETTINGS, JSON.stringify({ 
      theme: mode, 
      notifications: get().notificationsEnabled,
      costPerCigarette: get().costPerCigarette
    }));
    set({ themeMode: mode });
  },
  setCostPerCigarette: async (cost: number) => {
    await StorageService.setItem(StorageKeys.APP_SETTINGS, JSON.stringify({ 
      theme: get().themeMode, 
      notifications: get().notificationsEnabled,
      costPerCigarette: cost
    }));
    set({ costPerCigarette: cost });
  },
  toggleNotifications: async () => {
    const currentState = get().notificationsEnabled;
    const newState = !currentState;
    
    if (newState) {
      // Trying to enable
      const granted = await NotificationService.requestPermissionsAsync();
      if (!granted) {
        // User denied, we cannot enable them
        return;
      }
    } else {
      // Trying to disable - cancel any scheduled ones immediately
      await NotificationService.cancelAllScheduledNotificationsAsync();
    }

    // Persist
    await StorageService.setItem(StorageKeys.APP_SETTINGS, JSON.stringify({ 
      theme: get().themeMode, 
      notifications: newState,
      costPerCigarette: get().costPerCigarette
    }));
    
    set({ notificationsEnabled: newState });
  },
  hydrateAsync: async () => {
    const settingsStr = await StorageService.getString(StorageKeys.APP_SETTINGS);
    if (settingsStr) {
      try {
        const settings = JSON.parse(settingsStr);
        if (settings.theme) {
          set({ themeMode: settings.theme });
        }
        if (settings.notifications !== undefined) {
          set({ notificationsEnabled: settings.notifications });
        }
        if (settings.costPerCigarette !== undefined) {
          set({ costPerCigarette: settings.costPerCigarette });
        }
      } catch {
        // Silently swallow parse errors for privacy/security
      }
    }
  },
}));
