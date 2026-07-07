import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '../../ui/Card';
import { Text } from '../../ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/use-theme';
import { Spacing, BorderRadius } from '../../../theme';
import { AnalyticsService } from '../../../domain/AnalyticsService';
import { SmokeLog } from '../../../domain/models';
import { formatElapsedTime } from '../../../utils/time';
import { useAppStore } from '../../../store';

export interface InsightGridProps {
  logs: SmokeLog[];
  isEmpty?: boolean;
}

export const InsightGrid: React.FC<InsightGridProps> = React.memo(({ logs, isEmpty }) => {
  const { colors } = useTheme();
  const costPerCigarette = useAppStore(state => state.costPerCigarette);

  const insights = useMemo(() => AnalyticsService.calculateInsights(logs), [logs]);

  if (isEmpty) return null;

  return (
    <View style={styles.container}>
      
      {/* Unified Metrics Card */}
      <View style={[styles.unifiedCard, { backgroundColor: colors.surface }]}>
        <View style={styles.row}>
          <View style={styles.metricCell}>
            <View style={styles.valueRow}>
              <Text variant="headline" color={colors.textPrimary} style={styles.value}>
                {insights.daysTracked}
              </Text>
            </View>
            <View style={styles.labelRow}>
              <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} style={styles.iconOffset} />
              <Text variant="caption" color={colors.textSecondary} style={styles.label}>
                Days Tracked
              </Text>
            </View>
          </View>
          
          <View style={[styles.verticalDivider, { backgroundColor: colors.border }]} />
          
          <View style={styles.metricCell}>
            <View style={styles.valueRow}>
              <Text variant="headline" color={colors.textPrimary} style={styles.value}>
                {insights.totalLogged}
              </Text>
            </View>
            <View style={styles.labelRow}>
              <Ionicons name="stats-chart-outline" size={12} color={colors.textSecondary} style={styles.iconOffset} />
              <Text variant="caption" color={colors.textSecondary} style={styles.label}>
                Total Logged
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.horizontalDivider, { backgroundColor: colors.border }]} />

        <View style={styles.row}>
          <View style={styles.metricCell}>
            <View style={styles.valueRow}>
              <Text variant="headline" color={colors.textPrimary} style={styles.value}>
                {insights.averageInterval > 0 ? formatElapsedTime(insights.averageInterval) : 'N/A'}
              </Text>
            </View>
            <View style={styles.labelRow}>
              <Ionicons name="time-outline" size={12} color={colors.textSecondary} style={styles.iconOffset} />
              <Text variant="caption" color={colors.textSecondary} style={styles.label}>
                Avg Interval
              </Text>
            </View>
          </View>
          
          <View style={[styles.verticalDivider, { backgroundColor: colors.border }]} />
          
          <View style={styles.metricCell}>
            <View style={styles.valueRow}>
              <Text variant="headline" color={colors.textPrimary} style={styles.value}>
                {insights.longestInterval > 0 ? formatElapsedTime(insights.longestInterval) : 'N/A'}
              </Text>
            </View>
            <View style={styles.labelRow}>
              <Ionicons name="trophy-outline" size={12} color={colors.textSecondary} style={styles.iconOffset} />
              <Text variant="caption" color={colors.textSecondary} style={styles.label}>
                Longest Run
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Financial Impact Card */}
      {costPerCigarette > 0 && (
        <View style={[styles.financialCard, { backgroundColor: colors.surface }]}>
          <View style={styles.financialHeader}>
            <Ionicons name="flame" size={16} color={colors.danger} style={styles.iconOffset} />
            <Text variant="caption" color={colors.danger} style={styles.label}>
              Money Smoked Away
            </Text>
          </View>
          
          <View style={styles.financialValueContainer}>
            <Text variant="display" color={colors.danger} style={styles.financialCurrency}>₹</Text>
            <Text variant="display" color={colors.danger} style={styles.financialValue}>
              {(insights.totalLogged * costPerCigarette).toFixed(2)}
            </Text>
          </View>
          
          <Text variant="body" color={colors.textSecondary} align="center" style={styles.financialSubtitle}>
            Total money burned on {insights.totalLogged} cigarettes.
          </Text>
        </View>
      )}

      {/* Trend Chart */}
      <View style={[styles.trendCard, { backgroundColor: colors.surface }]}>
        <View style={styles.labelRow}>
          <Ionicons name="bar-chart-outline" size={12} color={colors.textSecondary} style={styles.iconOffset} />
          <Text variant="caption" color={colors.textSecondary} style={styles.label}>
            7-DAY TREND
          </Text>
        </View>
        <View style={styles.trendContainer}>
          {insights.last7DaysTrend.map((count, index) => {
            const maxCount = Math.max(...insights.last7DaysTrend, 1);
            const heightPercent = Math.max((count / maxCount) * 100, 10);
            const isToday = index === 6;

            const date = new Date();
            date.setDate(date.getDate() - (6 - index));
            const dayLabel = date.toLocaleDateString('en-US', { weekday: 'narrow' });

            return (
              <View key={index} style={styles.barWrapper}>
                <Text variant="caption" style={[styles.chartText, { color: colors.textSecondary }]}>
                  {count > 0 ? count : ''}
                </Text>
                <View 
                  style={[
                    styles.bar,
                    { 
                      height: `${heightPercent}%`,
                      backgroundColor: isToday ? colors.primary : colors.border
                    }
                  ]} 
                />
                <Text variant="caption" style={[styles.chartText, { color: isToday ? colors.primary : colors.textSecondary }]}>
                  {dayLabel}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
});

InsightGrid.displayName = 'InsightGrid';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
  },
  unifiedCard: {
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center', // Now that all children share the same variants, they perfectly align
  },
  metricCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  valueRow: {
    height: 32, // Fixed height to ensure perfect vertical alignment across rows
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    height: '60%',
  },
  horizontalDivider: {
    height: 1,
    width: '100%',
    marginVertical: Spacing.xs,
  },
  value: {
    lineHeight: 32,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  iconOffset: {
    marginRight: 4,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  trendCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  trendContainer: {
    flexDirection: 'row',
    height: 100,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Spacing.md,
  },
  barWrapper: {
    width: 24,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 8,
    borderRadius: 4,
    marginVertical: 4,
  },
  chartText: {
    fontSize: 10,
    lineHeight: 12,
  },
  financialCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  financialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  financialValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  financialCurrency: {
    marginTop: 6,
    marginRight: 4,
    fontSize: 24,
  },
  financialValue: {
    fontSize: 48,
    lineHeight: 56,
  },
  financialSubtitle: {
    opacity: 0.8,
  }
});
