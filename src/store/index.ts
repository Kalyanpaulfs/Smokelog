import { create } from 'zustand';
import { StorageService } from '../storage';
import { StorageKeys } from '../constants';

export type ThemeMode = 'light' | 'dark' | 'system';

interface AppState {
  isInitialized: boolean;
  themeMode: ThemeMode;
  setInitialized: (value: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
  hydrateAsync: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  isInitialized: false,
  themeMode: 'system',
  setInitialized: (value: boolean) => set({ isInitialized: value }),
  setThemeMode: async (mode: ThemeMode) => {
    await StorageService.setItem(StorageKeys.APP_SETTINGS, JSON.stringify({ theme: mode }));
    set({ themeMode: mode });
  },
  hydrateAsync: async () => {
    const settingsStr = await StorageService.getString(StorageKeys.APP_SETTINGS);
    if (settingsStr) {
      try {
        const settings = JSON.parse(settingsStr);
        if (settings.theme) {
          set({ themeMode: settings.theme });
        }
      } catch {
        // Silently swallow parse errors for privacy/security
      }
    }
  },
}));
