import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '../../ui/Card';
import { Text } from '../../ui/Text';
import { useTheme } from '../../../hooks/use-theme';
import { Spacing, BorderRadius } from '../../../theme';
import { MilestoneService } from '../../../domain/MilestoneService';
import { formatElapsedTime } from '../../../utils/time';

export interface HealthMilestoneCardProps {
  /** The raw ticking integer passed directly from the TimerContainer owner */
  elapsedMilliseconds: number;
  /** Whether the user has zero logs */
  isEmpty?: boolean;
}

/**
 * Renders the user's progress through deterministic health milestones.
 * Receives the ticking elapsed time via props to avoid duplicate hook logic.
 */
export const HealthMilestoneCard: React.FC<HealthMilestoneCardProps> = React.memo(({
  elapsedMilliseconds,
  isEmpty,
}) => {
  const { colors } = useTheme();

  // Fast pure computation that derives completely from the ticking integer
  const { currentMilestone, nextMilestone, progress, remainingTime } = useMemo(
    () => MilestoneService.calculateMilestoneProgress(elapsedMilliseconds),
    [elapsedMilliseconds]
  );

  if (isEmpty) return null;

  return (
    <Card variant="outlined" style={styles.container} accessible={true}>
      <Text variant="headline" style={styles.title}>Health Journey</Text>
      
      {currentMilestone && (
        <Text variant="body" style={styles.current}>
          Achieved: <Text style={{ color: colors.primary }}>{currentMilestone.label}</Text>
        </Text>
      )}

      {nextMilestone ? (
        <View style={styles.nextContainer} accessibilityLabel={`Next milestone: ${nextMilestone.label} in ${formatElapsedTime(remainingTime)}`}>
          <View style={styles.nextHeader}>
            <Text variant="caption" color={colors.textSecondary}>Next: {nextMilestone.label}</Text>
            <Text variant="caption" color={colors.textSecondary} importantForAccessibility="no">{formatElapsedTime(remainingTime)}</Text>
          </View>
          
          <View style={[styles.progressBarBg, { backgroundColor: colors.border }]} importantForAccessibility="no">
            <View 
              style={[
                styles.progressBarFill, 
                { backgroundColor: colors.primary, width: `${progress}%` }
              ]} 
            />
          </View>
        </View>
      ) : (
        <Text variant="body" color={colors.success} style={styles.complete}>
          You have reached all early milestones!
        </Text>
      )}
    </Card>
  );
});

HealthMilestoneCard.displayName = 'HealthMilestoneCard';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.md,
  },
  current: {
    marginBottom: Spacing.lg,
  },
  nextContainer: {
    marginTop: Spacing.xs,
  },
  nextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  progressBarBg: {
    height: 8,
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: BorderRadius.round,
  },
  complete: {
    marginTop: Spacing.md,
  }
});
