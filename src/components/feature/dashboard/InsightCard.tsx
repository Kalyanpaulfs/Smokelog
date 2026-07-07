import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Card } from '../../ui/Card';
import { Text } from '../../ui/Text';
import { Icon, IconName } from '../../ui/Icon';
import { useTheme } from '../../../hooks/use-theme';
import { Spacing, ThemeColors } from '../../../theme';
import { LoadingIndicator } from '../../ui/LoadingIndicator';

export interface InsightCardProps {
  /** Whether the component is processing data */
  isLoading?: boolean;
  /** Whether no tracking history exists */
  isEmpty?: boolean;
  /** Icon to display */
  icon?: IconName;
  /** Color of the icon */
  iconColor?: keyof ThemeColors;
  /** Primary insight title */
  title?: string;
  /** Insight description */
  description?: string;
  /** Custom container style */
  style?: ViewStyle;
}

/**
 * Feature component representing a quick insight based on logged data.
 */
export const InsightCard: React.FC<InsightCardProps> = React.memo(({
  isLoading,
  isEmpty,
  icon = 'activity',
  iconColor = 'primary',
  title = 'No insights yet',
  description = 'Log your first activity to generate personalized insights.',
  style,
}) => {
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <Card variant="outlined" style={[styles.container, style]}>
        <LoadingIndicator size="small" />
      </Card>
    );
  }

  return (
    <Card variant="outlined" style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Icon name={isEmpty ? 'inbox' : icon} size="md" color={isEmpty ? 'textSecondary' : iconColor} />
      </View>
      <View style={styles.content}>
        <Text variant="body" style={styles.title}>{isEmpty ? 'No insights yet' : title}</Text>
        <Text variant="caption" color={colors.textSecondary}>
          {isEmpty ? 'Log your first activity to generate personalized insights.' : description}
        </Text>
      </View>
    </Card>
  );
});

InsightCard.displayName = 'InsightCard';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
});
