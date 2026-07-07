import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Card } from '../../ui/Card';
import { Text } from '../../ui/Text';
import { useTheme } from '../../../hooks/use-theme';
import { Spacing } from '../../../theme';
import { LoadingIndicator } from '../../ui/LoadingIndicator';
import { Icon } from '../../ui/Icon';

export interface ProgressCardProps {
  /** Whether the component is processing data */
  isLoading?: boolean;
  /** Whether no tracking history exists */
  isEmpty?: boolean;
  /** Number of smokes logged today */
  smokedToday?: number;
  /** Daily average */
  average?: number;
  /** Custom container style */
  style?: ViewStyle;
}

/**
 * Feature component representing today's progress vs average.
 */
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
      <Card variant="filled" style={[styles.container, style]}>
        <LoadingIndicator size="small" />
      </Card>
    );
  }

  if (isEmpty) {
    return (
      <Card variant="filled" style={[styles.container, style]}>
        <View style={styles.emptyContainer}>
          <Icon name="bar-chart-2" size="xl" color="textSecondary" />
          <Text variant="body" color={colors.textSecondary} align="center" style={styles.emptyText}>
            Progress metrics will appear here once you log your first activity.
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card variant="filled" style={[styles.container, style]}>
      <View style={styles.row}>
        <View style={styles.metricContainer}>
          <Text variant="caption" color={colors.textSecondary}>Today</Text>
          <Text variant="headline" style={styles.value}>{smokedToday}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.metricContainer}>
          <Text variant="caption" color={colors.textSecondary}>Average</Text>
          <Text variant="headline" style={styles.value}>{average}</Text>
        </View>
      </View>
    </Card>
  );
});

ProgressCard.displayName = 'ProgressCard';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricContainer: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    marginTop: Spacing.xs,
  },
  divider: {
    width: 1,
    height: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  emptyText: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xl,
  }
});
