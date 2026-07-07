import React from 'react';
import { ActivityIndicator, View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { Spacing } from '../../theme';
import { Text } from './Text';

export interface LoadingIndicatorProps {
  /** Optional message to display below the spinner */
  message?: string;
  /** Size of the spinner */
  size?: 'small' | 'large';
  /** Whether the indicator should take up remaining flex space and center itself */
  centered?: boolean;
  /** Optional custom container style */
  style?: ViewStyle;
}

/**
 * A standard LoadingIndicator matching the design system.
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = React.memo(({
  message,
  size = 'large',
  centered = true,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[centered && styles.centered, style]}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message && (
        <Text variant="caption" color={colors.textSecondary} style={styles.message}>
          {message}
        </Text>
      )}
    </View>
  );
});

LoadingIndicator.displayName = 'LoadingIndicator';

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: Spacing.md,
  },
});
