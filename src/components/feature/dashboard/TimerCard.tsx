import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { Card } from '../../ui/Card';
import { Text } from '../../ui/Text';
import { useTheme } from '../../../hooks/use-theme';
import { Spacing } from '../../../theme';
import { LoadingIndicator } from '../../ui/LoadingIndicator';
import Svg, { Circle } from 'react-native-svg';

export interface TimerCardProps {
  isLoading?: boolean;
  isEmpty?: boolean;
  timeSinceLast?: string;
  subtitle?: string;
  progress?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const RING_SIZE = 240;
const STROKE_WIDTH = 12;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const TimerCard: React.FC<TimerCardProps> = React.memo(({
  isLoading,
  isEmpty,
  timeSinceLast,
  subtitle = 'Since last smoke',
  progress = 0,
}) => {
  const { colors } = useTheme();
  
  // Animate the progress so it fills smoothly rather than snapping instantly
  const animatedProgress = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [progress, animatedProgress]);

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [CIRCUMFERENCE, 0],
    extrapolate: 'clamp',
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingIndicator size="large" />
      </View>
    );
  }

  if (isEmpty || !timeSinceLast) {
    return (
      <View style={styles.container}>
        <Text variant="headline" align="center">Ready to start?</Text>
        <Text variant="body" color={colors.textSecondary} align="center" style={styles.subtitle}>
          Log your first smoke to begin tracking.
        </Text>
      </View>
    );
  }

  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityRole="timer"
      accessibilityLiveRegion="none" 
      accessibilityLabel={`Time since last smoke: ${timeSinceLast}`}
    >
      <View style={styles.ringWrapper}>
        <Svg width={RING_SIZE} height={RING_SIZE} style={styles.svg}>
          {/* Background Track */}
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke={colors.surfaceHighlight}
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
          />
          {/* Glowing Fill */}
          <AnimatedCircle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke={colors.primary}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={strokeDashoffset}
            fill="transparent"
            rotation="-90"
            originX={RING_SIZE / 2}
            originY={RING_SIZE / 2}
          />
        </Svg>

        <View style={styles.textContainer}>
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
        </View>
      </View>
    </View>
  );
});

TimerCard.displayName = 'TimerCard';

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringWrapper: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: Spacing.xs,
  },
});
