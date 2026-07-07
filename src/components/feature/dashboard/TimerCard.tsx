import React from 'react';
import { StyleSheet } from 'react-native';
import { Card } from '../../ui/Card';
import { Text } from '../../ui/Text';
import { useTheme } from '../../../hooks/use-theme';
import { Spacing } from '../../../theme';
import { LoadingIndicator } from '../../ui/LoadingIndicator';

export interface TimerCardProps {
  /** Whether the component is fetching its data */
  isLoading?: boolean;
  /** Whether no tracking history exists */
  isEmpty?: boolean;
  /** Formatted string of time since last event */
  timeSinceLast?: string;
  /** Subtitle to display under the timer */
  subtitle?: string;
}

/**
 * Feature component representing the primary hero timer on the Dashboard.
 * Remains a pure presentation component with absolutely zero timing logic.
 */
export const TimerCard: React.FC<TimerCardProps> = React.memo(({
  isLoading,
  isEmpty,
  timeSinceLast,
  subtitle = 'Since last smoke',
}) => {
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <Card variant="elevation" style={styles.container}>
        <LoadingIndicator size="small" />
      </Card>
    );
  }

  if (isEmpty || !timeSinceLast) {
    return (
      <Card variant="elevation" style={styles.container}>
        <Text variant="headline" align="center">
          Ready to start?
        </Text>
        <Text variant="body" color={colors.textSecondary} align="center" style={styles.subtitle}>
          Log your first smoke to begin tracking.
        </Text>
      </Card>
    );
  }

  return (
    <Card 
      variant="elevation" 
      style={styles.container}
      accessible={true}
      accessibilityRole="timer"
      // Prevent screen readers from relentlessly reading the automated ticks
      accessibilityLiveRegion="none" 
      accessibilityLabel={`Time since last smoke: ${timeSinceLast}`}
    >
      <Text 
        variant="display" 
        align="center" 
        importantForAccessibility="no-hide-descendants"
      >
        {timeSinceLast}
      </Text>
      <Text 
        variant="body" 
        color={colors.textSecondary} 
        align="center" 
        style={styles.subtitle} 
        importantForAccessibility="no-hide-descendants"
      >
        {subtitle}
      </Text>
    </Card>
  );
});

TimerCard.displayName = 'TimerCard';

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing['3xl'],
    marginHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: Spacing.sm,
  },
});
