import React, { useState, useCallback } from 'react';
import { 
  View, 
  Pressable, 
  ViewStyle, 
  Animated,
  PressableProps,
  StyleProp
} from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { Spacing, BorderRadius, Opacity, AnimationDurations, Shadows } from '../../theme';

export type CardVariant = 'elevation' | 'outlined' | 'filled';

export interface CardProps extends Omit<PressableProps, 'style'> {
  /** The visual variant of the card */
  variant?: CardVariant;
  /** Content to render inside the card */
  children: React.ReactNode;
  /** Optional custom container style */
  style?: StyleProp<ViewStyle>;
  /** Whether the card should handle press events */
  isPressable?: boolean;
}

/**
 * A reusable Card component with multiple variants.
 * Optionally supports press interactions with subtle scale animations.
 */
export const Card = React.memo(({
  variant = 'elevation',
  children,
  style,
  isPressable = false,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}: CardProps) => {
  const { colors } = useTheme();
  
  const [scale] = useState(() => new Animated.Value(1));

  const handlePressIn = useCallback((e: any) => {
    if (isPressable && !disabled) {
      Animated.timing(scale, {
        toValue: 0.98,
        duration: AnimationDurations.fast,
        useNativeDriver: true,
      }).start();
    }
    onPressIn?.(e);
  }, [isPressable, disabled, scale, onPressIn]);

  const handlePressOut = useCallback((e: any) => {
    if (isPressable && !disabled) {
      Animated.timing(scale, {
        toValue: 1,
        duration: AnimationDurations.fast,
        useNativeDriver: true,
      }).start();
    }
    onPressOut?.(e);
  }, [isPressable, disabled, scale, onPressOut]);

  const getBaseStyle = (): ViewStyle => {
    const base: ViewStyle = {
      backgroundColor: variant === 'filled' ? colors.surfaceHighlight : colors.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      opacity: disabled ? Opacity.disabled : 1,
    };

    if (variant === 'elevation') {
      return {
        ...base,
        ...Shadows.md,
      };
    }
    
    if (variant === 'outlined') {
      return {
        ...base,
        borderWidth: 1,
        borderColor: colors.border,
      };
    }

    return base; // filled
  };

  const content = (
    <View style={[getBaseStyle(), style]}>
      {children}
    </View>
  );

  if (isPressable) {
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          accessibilityRole="button"
          style={({ pressed }) => ({
            opacity: pressed && !disabled ? Opacity.active : 1,
          })}
          {...props}
        >
          {content}
        </Pressable>
      </Animated.View>
    );
  }

  return content;
});

Card.displayName = 'Card';
