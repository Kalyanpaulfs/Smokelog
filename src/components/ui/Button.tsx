import React, { useState, useCallback } from 'react';
import { 
  Pressable, 
  PressableProps, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  Animated 
} from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { Spacing, BorderRadius, Opacity, AnimationDurations } from '../../theme';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends PressableProps {
  /** The text to display inside the button */
  label: string;
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** Optional custom container style */
  style?: ViewStyle;
}

/**
 * A highly reusable Button component with typed variants, native animations,
 * and robust accessibility defaults (minimum 44x44 touch targets).
 */
export const Button = React.memo(({
  label,
  variant = 'primary',
  isLoading = false,
  disabled,
  style,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}: ButtonProps) => {
  const { colors } = useTheme();
  
  // Scale animation for pressed state
  const [scale] = useState(() => new Animated.Value(1));

  const handlePressIn = useCallback((e: any) => {
    Animated.timing(scale, {
      toValue: 0.96,
      duration: AnimationDurations.fast,
      useNativeDriver: true,
    }).start();
    onPressIn?.(e);
  }, [scale, onPressIn]);

  const handlePressOut = useCallback((e: any) => {
    Animated.timing(scale, {
      toValue: 1,
      duration: AnimationDurations.fast,
      useNativeDriver: true,
    }).start();
    onPressOut?.(e);
  }, [scale, onPressOut]);

  const isDisabled = disabled || isLoading;

  const getBackgroundColor = () => {
    if (variant === 'primary') return colors.primary;
    if (variant === 'secondary') return colors.surfaceHighlight;
    if (variant === 'danger') return colors.danger;
    return 'transparent'; // ghost
  };

  const getBorderColor = () => {
    if (variant === 'secondary') return colors.border;
    return 'transparent';
  };

  const getTextColor = () => {
    if (isDisabled) return colors.disabled;
    if (variant === 'primary' || variant === 'danger') return colors.white;
    return colors.textPrimary;
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: isLoading }}
        accessibilityLabel={label}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: variant === 'secondary' ? 1 : 0,
            opacity: isDisabled ? Opacity.disabled : pressed ? Opacity.active : 1,
          },
        ]}
        {...props}
      >
        {isLoading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <Text variant="button" color={getTextColor()} align="center">
            {label}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
});

Button.displayName = 'Button';

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 48, // Accessibility minimum touch target is 44, we use 48 for safety
    minWidth: 48,
  },
});
