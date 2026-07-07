import React from 'react';
import { StyleSheet, ViewStyle, View } from 'react-native';
import { Button } from '../../ui/Button';
import { Spacing } from '../../../theme';

export interface LogSmokeButtonProps {
  /** Whether the component is processing an action */
  isLoading?: boolean;
  /** Whether the user has never logged before */
  isEmpty?: boolean;
  /** Overrides the disabled state manually */
  disabled?: boolean;
  /** Action executed on press */
  onPress: () => void;
  /** Custom container style */
  style?: ViewStyle;
}

/**
 * Feature component representing the primary CTA for logging events.
 */
export const LogSmokeButton: React.FC<LogSmokeButtonProps> = React.memo(({
  isLoading,
  isEmpty,
  disabled,
  onPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Button
        variant="primary"
        label={isEmpty ? "Log First Smoke" : "Log Smoke"}
        onPress={onPress}
        disabled={disabled || isLoading}
        isLoading={isLoading}
        style={styles.button}
      />
    </View>
  );
});

LogSmokeButton.displayName = 'LogSmokeButton';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.xl,
  },
  button: {
    minHeight: 56,
  },
});
