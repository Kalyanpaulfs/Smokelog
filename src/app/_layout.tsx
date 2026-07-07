import React, { useEffect, useState } from 'react';
import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { ErrorBoundary } from '../components/ErrorBoundary';
import * as SplashScreen from 'expo-splash-screen';
import { useAppStore } from '../store';
import { useSmokeStore } from '../store/smokeStore';
import { useTheme } from '../hooks/use-theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrateSettings = useAppStore(state => state.hydrateAsync);
  const hydrateSmoke = useSmokeStore(state => state.hydrateAsync);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const { isDark } = useTheme();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      await hydrateSettings();
      await hydrateSmoke();
      if (isMounted) setIsHydrated(true);
    })();
    return () => { isMounted = false; };
  }, [hydrateSettings, hydrateSmoke]);

  useEffect(() => {
    if (isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [isHydrated]);

  if (!isHydrated) {
    return null; // Return nothing until store is hydrated and splash is hidden
  }

  return (
    <ErrorBoundary>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
