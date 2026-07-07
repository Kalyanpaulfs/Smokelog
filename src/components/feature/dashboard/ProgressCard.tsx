import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from '../../ui/Text';
import { useTheme } from '../../../hooks/use-theme';
import { Spacing, BorderRadius } from '../../../theme';
import { LoadingIndicator } from '../../ui/LoadingIndicator';
import { Ionicons } from '@expo/vector-icons';

export interface ProgressCardProps {
  isLoading?: boolean;
  isEmpty?: boolean;
  smokedToday?: number;
  average?: number;
  style?: ViewStyle;
}

export const ProgressCard: React.FC<ProgressCardProps> = React.memo(({
  isLoading,
  isEmpty,
  smokedToday = 0,
  average = 0,
  style,
}) => {
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <LoadingIndicator size="small" />
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={[styles.container, style, { backgroundColor: colors.surfaceHighlight }]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="bar-chart-outline" size={24} color={colors.textSecondary} />
          <Text variant="caption" color={colors.textSecondary} align="center" style={styles.emptyText}>
            Data will appear once you log your first activity.
          </Text>
        </View>
      </View>
    );
  }

  const isBelow = smokedToday < average && average > 0;
  const isAbove = smokedToday > average && average > 0;
  const trendColor = isBelow ? colors.success : isAbove ? colors.warning : colors.textSecondary;
  const trendIcon = isBelow ? 'trending-down' : isAbove ? 'trending-up' : 'remove';
  const trendText = isBelow ? 'Below Average' : isAbove ? 'Above Average' : 'On Track';

  return (
    <View style={[styles.container, style, { backgroundColor: colors.surface }]}>
      
      <View style={styles.metricBlock}>
        <View style={styles.valueRow}>
          <Ionicons name="flame" size={24} color={colors.primary} style={styles.iconOffset} />
          <Text variant="display" color={colors.textPrimary} style={styles.numberValue}>
            {smokedToday}
          </Text>
        </View>
        <Text variant="caption" color={colors.textSecondary} style={styles.label}>
          Logged Today
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.metricBlock}>
        <View style={styles.valueRow}>
          <Text variant="display" color={colors.textPrimary} style={styles.numberValue}>
            {average}
          </Text>
        </View>
        <Text variant="caption" color={colors.textSecondary} style={styles.label}>
          Daily Average
        </Text>
        {average > 0 && (
          <View style={styles.trendRow}>
            <Ionicons name={trendIcon} size={12} color={trendColor} style={{ marginRight: 4 }} />
            <Text variant="overline" color={trendColor} style={styles.trendText}>
              {trendText}
            </Text>
          </View>
        )}
      </View>

    </View>
  );
});

ProgressCard.displayName = 'ProgressCard';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48, // Fixed height ensures numbers stay perfectly aligned regardless of icons
    marginBottom: Spacing.xs,
  },
  iconOffset: {
    marginRight: 8,
    marginTop: 4, // Slight visual adjustment to align with large text baseline
  },
  numberValue: {
    lineHeight: 48,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  trendText: {
    fontSize: 9,
  },
  divider: {
    width: 1,
    marginHorizontal: Spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    width: '100%',
  },
  emptyText: {
    marginTop: Spacing.sm,
  }
});
