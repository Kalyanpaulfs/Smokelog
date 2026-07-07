import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { Spacing } from '../../theme';
import { Text } from './Text';
import { Icon, IconName } from './Icon';
import { Button, ButtonProps } from './Button';

export interface EmptyStateProps {
  /** The Feather icon to display */
  iconName?: IconName;
  /** The primary heading text */
  title: string;
  /** The secondary descriptive text */
  description?: string;
  /** Optional call to action button */
  action?: {
    label: string;
    onPress: () => void;
    variant?: ButtonProps['variant'];
  };
  /** Custom container style */
  style?: ViewStyle;
}

/**
 * A professional Empty State component suitable for a premium health app.
 * Uses centralized Typography and Icon components.
 */
export const EmptyState: React.FC<EmptyStateProps> = React.memo(({
  iconName = 'inbox',
  title,
  description,
  action,
  style
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.surfaceHighlight }]}>
        <Icon name={iconName} size="xl" color="secondary" />
      </View>
      <Text variant="title" align="center" style={styles.title}>
        {title}
      </Text>
      {description && (
        <Text variant="body" color={colors.textSecondary} align="center" style={styles.description}>
          {description}
        </Text>
      )}
      {action && (
        <Button 
          variant={action.variant || 'secondary'} 
          label={action.label} 
          onPress={action.onPress} 
          style={styles.action}
        />
      )}
    </View>
  );
});

EmptyState.displayName = 'EmptyState';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  description: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  action: {
    minWidth: 160,
  }
});
