import React, { useMemo } from 'react';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { HistoryList } from '../../components/feature/history/HistoryList';
import { useSmokeStore } from '../../store/smokeStore';
import { AnalyticsService } from '../../domain/AnalyticsService';

export default function HistoryScreen() {
  const { logs } = useSmokeStore();
  const isLoading = false; // Phase 6 operates synchronously from memory

  // Strictly memoize grouping by tracking the logs array reference itself
  const groupedSections = useMemo(() => AnalyticsService.groupHistory(logs), [logs]);

  return (
    <ScreenContainer withSafeArea={false}>
      <ScreenHeader 
        title="History" 
        subtitle="Your complete tracking timeline" 
      />
      <HistoryList 
        sections={groupedSections} 
        isLoading={isLoading} 
      />
    </ScreenContainer>
  );
}
