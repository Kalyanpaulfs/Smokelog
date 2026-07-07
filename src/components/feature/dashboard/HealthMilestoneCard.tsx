import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../../ui/Text';
import { useTheme } from '../../../hooks/use-theme';
import { Spacing, BorderRadius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { MilestoneService } from '../../../domain/MilestoneService';
import { formatElapsedTime } from '../../../utils/time';

export interface HealthMilestoneCardProps {
  elapsedMilliseconds: number;
  isEmpty?: boolean;
}

export const HealthMilestoneCard: React.FC<HealthMilestoneCardProps> = React.memo(({
  elapsedMilliseconds,
  isEmpty,
}) => {
  const { colors } = useTheme();

  const { currentMilestone, nextMilestone, remainingTime } = useMemo(
    () => MilestoneService.calculateMilestoneProgress(elapsedMilliseconds),
    [elapsedMilliseconds]
  );

  if (isEmpty) return null;

  return (
    <View style={styles.container} accessible={true}>
      <Text variant="headline" style={styles.title}>Health Journey</Text>
      
      <View style={styles.timelineContainer}>
        {/* Vertical connecting line */}
        <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />

        {/* Achieved Milestone */}
        {currentMilestone && (
          <View style={styles.timelineNode}>
            <View style={[styles.iconWrapper, { backgroundColor: colors.success, shadowColor: colors.success }]}>
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </View>
            <View style={styles.nodeContent}>
              <Text variant="caption" color={colors.textSecondary} style={styles.nodeLabel}>
                Achieved
              </Text>
              <Text variant="body" color={colors.textPrimary}>
                {currentMilestone.label}
              </Text>
            </View>
          </View>
        )}

        {/* Next Locked Milestone */}
        {nextMilestone ? (
          <View style={[styles.timelineNode, { marginTop: Spacing.xl }]}>
            <View style={[styles.iconWrapper, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="lock-closed" size={14} color={colors.textSecondary} />
            </View>
            <View style={styles.nodeContent}>
              <Text variant="caption" color={colors.textSecondary} style={styles.nodeLabel}>
                Unlocks in {formatElapsedTime(remainingTime)}
              </Text>
              <Text variant="body" style={styles.description}>
                {nextMilestone.description}
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.timelineNode, { marginTop: Spacing.xl }]}>
            <View style={[styles.iconWrapper, { backgroundColor: colors.success }]}>
              <Ionicons name="star" size={14} color="#FFFFFF" />
            </View>
            <View style={styles.nodeContent}>
              <Text variant="body" color={colors.success}>
                You have reached all early milestones!
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
});

HealthMilestoneCard.displayName = 'HealthMilestoneCard';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.xl,
  },
  timelineContainer: {
    position: 'relative',
    paddingLeft: 8,
  },
  timelineLine: {
    position: 'absolute',
    left: 23, // Center of the 32px icon + 8px padding
    top: 32,
    bottom: 32,
    width: 2,
    opacity: 0.5,
  },
  timelineNode: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    zIndex: 1, // Stay above the line
    elevation: 2,
  },
  nodeContent: {
    flex: 1,
    paddingTop: 4, // Align text with center of icon
  },
  nodeLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  description: {
    lineHeight: 20,
  },
});
