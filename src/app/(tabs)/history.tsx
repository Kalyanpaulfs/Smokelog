import React, { useMemo } from 'react';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { HistoryList } from '../../components/feature/history/HistoryList';
import { useSmokeStore } from '../../store/smokeStore';
import { AnalyticsService } from '../../domain/AnalyticsService';

export default function HistoryScreen() {
  const { logs, displayLimit, loadMoreHistory } = useSmokeStore();
  const isLoading = false; // Phase 6 operates synchronously from memory

  const displayLogs = useMemo(() => logs.slice(0, displayLimit), [logs, displayLimit]);

  // Strictly memoize grouping by tracking the sliced logs array reference itself
  const groupedSections = useMemo(() => AnalyticsService.groupHistory(displayLogs), [displayLogs]);

  return (
    <ScreenContainer 
      withSafeArea={false}
      header={
        <ScreenHeader 
          title="History" 
          subtitle="A complete timeline of your habit" 
        />
      }
    >
      <FadeIn delay={100} style={{ flex: 1 }}>
        <HistoryList 
          sections={groupedSections} 
          isLoading={isLoading}
          onEndReached={loadMoreHistory}
        />
      </FadeIn>
    </ScreenContainer>
  );
}
