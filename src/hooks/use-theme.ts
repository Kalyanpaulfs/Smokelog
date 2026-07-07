import { useColorScheme as useRNColorScheme } from 'react-native';
import { Colors } from '../theme';
import { useAppStore } from '../store';

export function useTheme() {
  const systemScheme = useRNColorScheme() === 'dark' ? 'dark' : 'light';
  const storedThemeMode = useAppStore((state) => state.themeMode);
  
  const activeScheme = storedThemeMode === 'system' ? systemScheme : storedThemeMode;

  return {
    colors: Colors[activeScheme],
    isDark: activeScheme === 'dark',
    activeScheme,
  };
}
