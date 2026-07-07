import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Card } from '../../ui/Card';
import { Text } from '../../ui/Text';
import { useTheme } from '../../../hooks/use-theme';
import { Spacing } from '../../../theme';
import { MotivationService } from '../../../domain/MotivationService';

export interface MotivationCardProps {
  /** The timestamp of the user's very first log to anchor the deterministic rotation */
  firstLogTimestamp?: number;
  /** Whether no tracking history exists */
  isEmpty?: boolean;
}

/**
 * Feature component rendering deterministic, guilt-free motivation.
 */
export const MotivationCard: React.FC<MotivationCardProps> = React.memo(({ 
  firstLogTimestamp,
  isEmpty 
}) => {
  const { colors } = useTheme();

  // Deterministically fetch the active motivation, memoized to the first timestamp
  const motivation = useMemo(
    () => MotivationService.getMotivation(firstLogTimestamp),
    [firstLogTimestamp]
  );

  if (isEmpty || !motivation) return null;

  return (
    <Card variant="outlined" style={styles.container}>
      <Text variant="caption" color={colors.primary} style={styles.category}>
        {motivation.category.toUpperCase()}
      </Text>
      <Text variant="body" align="center" style={styles.content}>
        &quot;{motivation.content}&quot;
      </Text>
    </Card>
  );
});

MotivationCard.displayName = 'MotivationCard';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  category: {
    marginBottom: Spacing.sm,
    letterSpacing: 1,
  },
  content: {
    lineHeight: 24,
    fontStyle: 'italic',
  }
});
