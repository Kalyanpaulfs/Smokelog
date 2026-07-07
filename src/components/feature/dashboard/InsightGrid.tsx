import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '../../ui/Card';
import { Text } from '../../ui/Text';
import { useTheme } from '../../../hooks/use-theme';
import { Spacing } from '../../../theme';
import { AnalyticsService } from '../../../domain/AnalyticsService';
import { SmokeLog } from '../../../domain/models';
import { formatElapsedTime } from '../../../utils/time';

export interface InsightGridProps {
  logs: SmokeLog[];
  isEmpty?: boolean;
}

/**
 * Replaces the monolithic InsightCard. Renders derived insights in a clean 2x2 grid.
 */
export const InsightGrid: React.FC<InsightGridProps> = React.memo(({ logs, isEmpty }) => {
  const { colors } = useTheme();

  // Fast pure computation memoized explicitly by the logs array reference
  const insights = useMemo(() => AnalyticsService.calculateInsights(logs), [logs]);

  if (isEmpty) return null;

  return (
    <View style={styles.gridContainer}>
      <Card variant="elevation" style={styles.gridItem}>
        <Text variant="caption" color={colors.textSecondary}>Today&apos;s Total</Text>
        <Text variant="headline" style={styles.value}>{insights.todaysTotal}</Text>
      </Card>
      
      <Card variant="elevation" style={styles.gridItem}>
        <Text variant="caption" color={colors.textSecondary}>Total Logged</Text>
        <Text variant="headline" style={styles.value}>{insights.totalLogged}</Text>
      </Card>
      
      <Card variant="elevation" style={styles.gridItem}>
        <Text variant="caption" color={colors.textSecondary}>Avg Interval</Text>
        <Text variant="headline" style={styles.value}>
          {insights.averageInterval > 0 ? formatElapsedTime(insights.averageInterval) : 'N/A'}
        </Text>
      </Card>
      
      <Card variant="elevation" style={styles.gridItem}>
        <Text variant="caption" color={colors.textSecondary}>Longest Run</Text>
        <Text variant="headline" style={styles.value}>
          {insights.longestInterval > 0 ? formatElapsedTime(insights.longestInterval) : 'N/A'}
        </Text>
      </Card>
    </View>
  );
});

InsightGrid.displayName = 'InsightGrid';

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xl,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '46%', // Ensures a 2-column layout accounting for margins
    marginHorizontal: Spacing.xs,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  value: {
    marginTop: Spacing.xs,
  }
});
