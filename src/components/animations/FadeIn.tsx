import React, { useEffect, useState } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';
import { AnimationDurations } from '../../theme';

export interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * A subtle, performance-friendly FadeIn animation wrapper.
 */
export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  delay = 0, 
  duration = AnimationDurations.normal,
  style 
}) => {
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [opacity, duration, delay]);

  return (
    <Animated.View style={[{ opacity }, style]}>
      {children}
    </Animated.View>
  );
};
