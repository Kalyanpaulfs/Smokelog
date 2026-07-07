import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SettingsGroup } from '../../components/layout/SettingsGroup';
import { useAppStore, ThemeMode } from '../../store';
import { Spacing } from '../../theme';
import { FadeIn } from '../../components/animations/FadeIn';

export default function SettingsScreen() {
  const { themeMode, setThemeMode } = useAppStore();

  const handleThemeChange = () => {
    // Basic cycle for now: system -> light -> dark -> system
    const nextMode: Record<ThemeMode, ThemeMode> = {
      system: 'light',
      light: 'dark',
      dark: 'system',
    };
    setThemeMode(nextMode[themeMode]);
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <ScreenContainer scrollable withSafeArea={false}>
      <ScreenHeader title="Settings" />
      
      <FadeIn delay={100} style={styles.content}>
        <SettingsGroup
          title="Appearance"
          items={[
            {
              title: 'Theme',
              subtitle: 'System, Light, or Dark',
              icon: 'moon',
              value: capitalize(themeMode),
              onPress: handleThemeChange,
            },
          ]}
          style={styles.group}
        />

        <SettingsGroup
          title="Notifications"
          items={[
            {
              title: 'Daily Reminders',
              subtitle: 'Get notified to log your activity',
              icon: 'bell',
              value: 'Off',
              onPress: () => {}, // Disabled until logic phase
            },
          ]}
          style={styles.group}
        />

        <SettingsGroup
          title="Data Management"
          items={[
            {
              title: 'Export Data',
              subtitle: 'Save your history as CSV',
              icon: 'download',
              onPress: () => {}, // Disabled until logic phase
            },
          ]}
          style={styles.group}
        />

        <SettingsGroup
          title="About Smokelog"
          items={[
            {
              title: 'Version',
              value: '1.0.0 (Phase 3)',
              icon: 'info',
            },
            {
              title: 'Technology Stack',
              subtitle: 'React Native, Expo Router, Zustand, MMKV',
              icon: 'code',
            },
            {
              title: 'Privacy Notice',
              subtitle: 'All data is stored purely locally on your device.',
              icon: 'shield',
            },
            {
              title: 'Developer',
              value: 'Senior Staff Engineer',
              icon: 'user',
            },
          ]}
          style={styles.group}
        />

        <SettingsGroup
          title="Danger Zone"
          items={[
            {
              title: 'Reset All Data',
              subtitle: 'Permanently delete all tracking history',
              icon: 'trash-2',
              isDestructive: true,
              onPress: () => {}, // Disabled until logic phase
            },
          ]}
          style={styles.dangerGroup}
        />
        
        {/* Bottom spacing for scrolling past the tab bar nicely */}
        <View style={styles.bottomSpacer} />
      </FadeIn>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: Spacing.sm,
  },
  group: {
    marginBottom: Spacing.lg,
  },
  dangerGroup: {
    marginBottom: Spacing.lg,
    marginTop: Spacing.xl,
  },
  bottomSpacer: {
    height: Spacing['3xl'],
  }
});
