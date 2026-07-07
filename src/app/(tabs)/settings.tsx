import React, { useState } from 'react';
import { View, StyleSheet, Alert, Pressable } from 'react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SettingsGroup } from '../../components/layout/SettingsGroup';
import { PromptModal } from '../../components/ui/PromptModal';
import { ThemeMode, useAppStore } from '../../store';
import { useTheme } from '../../hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '../../theme';
import { FadeIn } from '../../components/animations/FadeIn';
import { BackupService } from '../../domain/BackupService';
import { useSmokeStore } from '../../store/smokeStore';

export default function SettingsScreen() {
  const { themeMode, setThemeMode, notificationsEnabled, toggleNotifications, costPerCigarette, setCostPerCigarette } = useAppStore();
  const clearAllData = useSmokeStore(state => state.clearAllData);
  const { isDark, colors } = useTheme();

  const [isPromptVisible, setPromptVisible] = useState(false);

  const handleThemeChange = () => {
    // Toggle between light and dark
    setThemeMode(isDark ? 'light' : 'dark');
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const handleExport = async () => {
    const success = await BackupService.exportData();
    if (!success) {
      Alert.alert('Export Failed', 'Could not save your backup file.');
    }
  };

  const handleImport = async () => {
    const { success, message } = await BackupService.importData();
    Alert.alert(success ? 'Success' : 'Import Failed', message);
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to permanently delete all tracking history? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Everything', 
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('Success', 'All data has been reset.');
          }
        }
      ]
    );
  };

  const handleSaveCost = (value: string) => {
    // Parse the value carefully
    let cost = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(cost)) cost = 0;
    
    setCostPerCigarette(cost);
    setPromptVisible(false);
  };

  return (
    <ScreenContainer scrollable withSafeArea={false}>
      <ScreenHeader 
        title="Settings" 
        rightElement={
          <Pressable 
            onPress={handleThemeChange} 
            hitSlop={8}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons 
              name={isDark ? 'sunny' : 'moon'} 
              size={24} 
              color={isDark ? colors.warning : colors.textSecondary} 
            />
          </Pressable>
        }
      />
      
      <FadeIn delay={100} style={styles.content}>
        <SettingsGroup
          title="Financials"
          items={[
            {
              title: 'Cost per Cigarette',
              subtitle: 'Used to calculate money smoked away',
              icon: 'dollar-sign',
              value: costPerCigarette > 0 ? `₹${costPerCigarette.toFixed(2)}` : 'Not Set',
              showChevron: true,
              onPress: () => setPromptVisible(true),
            },
          ]}
          style={styles.group}
        />

        <SettingsGroup
          title="Notifications"
          items={[
            {
              title: 'Achievement Alerts',
              subtitle: 'Get notified when you unlock a milestone',
              icon: 'award',
              value: notificationsEnabled ? 'On' : 'Off',
              showChevron: true,
              onPress: toggleNotifications,
            },
          ]}
          style={styles.group}
        />

        <SettingsGroup
          title="Data Management"
          items={[
            {
              title: 'Backup Data',
              subtitle: 'Save your history as a JSON file',
              icon: 'download',
              showChevron: true,
              onPress: handleExport,
            },
            {
              title: 'Restore Data',
              subtitle: 'Load history from a previous backup',
              icon: 'upload',
              showChevron: true,
              onPress: handleImport,
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
              onPress: handleResetData,
            },
          ]}
          style={styles.dangerGroup}
        />
        
        {/* Bottom spacing for scrolling past the tab bar nicely */}
        <View style={styles.bottomSpacer} />
      </FadeIn>

      <PromptModal
        isVisible={isPromptVisible}
        title="Cost per Cigarette"
        message="Enter the exact cost of a single cigarette to calculate your total money wasted over time."
        placeholder="e.g. 0.50"
        defaultValue={costPerCigarette > 0 ? costPerCigarette.toString() : ''}
        keyboardType="decimal-pad"
        onConfirm={handleSaveCost}
        onCancel={() => setPromptVisible(false)}
      />
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
