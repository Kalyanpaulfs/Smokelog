import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { DashboardTimerContainer } from '../../components/feature/dashboard/DashboardTimerContainer';
import { LogSmokeButton } from '../../components/feature/dashboard/LogSmokeButton';
import { ProgressCard } from '../../components/feature/dashboard/ProgressCard';
import { InsightGrid } from '../../components/feature/dashboard/InsightGrid';
import { SmokeConfirmationSheet } from '../../components/feature/dashboard/SmokeConfirmationSheet';
import { FadeIn } from '../../components/animations/FadeIn';
import { Spacing } from '../../theme';
import { useSmokeStore } from '../../store/smokeStore';
import { ValidationError, StorageError } from '../../domain/errors';
import { AnalyticsService } from '../../domain/AnalyticsService';

export default function DashboardScreen() {
  const { logs, latestLog, logSmoke } = useSmokeStore();
  const [isSheetVisible, setSheetVisible] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const isEmpty = logs.length === 0;
  const isLoading = false;
  
  // First log timestamp is the absolute last element in the newest-first sorted array
  const firstLogTimestamp = isEmpty ? undefined : logs[logs.length - 1].timestamp;

  // Memoize the analytics calculations so they only recalculate when logs change
  const insights = useMemo(() => AnalyticsService.calculateInsights(logs), [logs]);

  const handleLogPress = () => {
    setSheetVisible(true);
  };

  const handleConfirmLog = async () => {
    setIsLogging(true);
    try {
      await logSmoke();
      setSheetVisible(false);
    } catch (error) {
      if (error instanceof ValidationError) {
        Alert.alert('Wait a moment', error.message);
      } else if (error instanceof StorageError) {
        Alert.alert('Storage Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <ScreenContainer 
      scrollable 
      withSafeArea={false}
      header={
        <ScreenHeader 
          title="Dashboard" 
          subtitle="Overview of your progress" 
        />
      }
    >
      <FadeIn delay={100} style={styles.content}>
        <View style={styles.topSection}>
          <DashboardTimerContainer 
            timestamp={latestLog?.timestamp} 
            isLoading={isLoading} 
          />
          
          <LogSmokeButton 
            isEmpty={isEmpty} 
            isLoading={isLoading || isLogging}
            onPress={handleLogPress} 
          />
        </View>

        <SectionHeader title="Today's Progress" />
        <ProgressCard 
          isEmpty={isEmpty} 
          isLoading={isLoading} 
          smokedToday={insights.todaysTotal}
          average={insights.dailyAverage}
        />

        <SectionHeader title="Quick Insights" />
        <InsightGrid logs={logs} isEmpty={isEmpty} />
        
        
        {/* Bottom spacer to ensure scrolling clears the tab bar comfortably */}
        <View style={styles.bottomSpacer} />
      </FadeIn>

      <SmokeConfirmationSheet 
        isVisible={isSheetVisible}
        isLoading={isLogging}
        onConfirm={handleConfirmLog}
        onCancel={() => setSheetVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  topSection: {
    marginTop: Spacing.xl,
  },
  bottomSpacer: {
    height: Spacing['3xl'],
  }
});
