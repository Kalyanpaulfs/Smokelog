import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * A centralized, typed, asynchronous wrapper around AsyncStorage.
 * Ensures consistent error handling and silent failures for privacy/security.
 */
export const StorageService = {
  setItem: async (key: string, value: string): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch {
      // Fail silently to prevent PII leakage
      return false;
    }
  },

  getString: async (key: string): Promise<string | undefined> => {
    try {
      const val = await AsyncStorage.getItem(key);
      return val !== null ? val : undefined;
    } catch {
      return undefined;
    }
  },

  getNumber: async (key: string): Promise<number | undefined> => {
    try {
      const val = await AsyncStorage.getItem(key);
      if (val !== null) {
        const parsed = Number(val);
        if (!isNaN(parsed)) return parsed;
      }
      return undefined;
    } catch {
      return undefined;
    }
  },

  getBoolean: async (key: string): Promise<boolean | undefined> => {
    try {
      const val = await AsyncStorage.getItem(key);
      if (val !== null) {
        return val === 'true';
      }
      return undefined;
    } catch {
      return undefined;
    }
  },

  setObject: async <T>(key: string, value: T): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  getObject: async <T>(key: string): Promise<T | null> => {
    try {
      const jsonStr = await AsyncStorage.getItem(key);
      if (jsonStr) {
        return JSON.parse(jsonStr) as T;
      }
      return null;
    } catch {
      return null;
    }
  },

  removeItem: async (key: string): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch {
      // Silently fail
      return false;
    }
  },

  clearAll: async (): Promise<boolean> => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch {
      // Silently fail
      return false;
    }
  },
};
