import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, ViewStyle, View, Animated, PanResponder, LayoutChangeEvent } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../../hooks/use-theme';
import { Spacing, BorderRadius, Shadows } from '../../../theme';
import { Text } from '../../ui/Text';
import { LoadingIndicator } from '../../ui/LoadingIndicator';
import { Ionicons } from '@expo/vector-icons';

export interface LogSmokeButtonProps {
  isLoading?: boolean;
  isEmpty?: boolean;
  disabled?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const THUMB_SIZE = 56;
const THUMB_PADDING = 4;

export const LogSmokeButton: React.FC<LogSmokeButtonProps> = React.memo(({
  isLoading,
  isEmpty,
  disabled,
  onPress,
  style,
}) => {
  const { colors } = useTheme();
  const [trackWidth, setTrackWidth] = useState(0);
  const maxTranslateRef = useRef(0);
  const pan = useRef(new Animated.Value(0)).current;
  const isTriggered = useRef(false);

  const maxTranslate = Math.max(0, trackWidth - THUMB_SIZE - (THUMB_PADDING * 2));

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setTrackWidth(width);
    maxTranslateRef.current = Math.max(0, width - THUMB_SIZE - (THUMB_PADDING * 2));
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !(disabled || isLoading),
      onMoveShouldSetPanResponder: () => !(disabled || isLoading),
      onPanResponderGrant: () => {
        isTriggered.current = false;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
      onPanResponderMove: (e, gestureState) => {
        const currentMax = maxTranslateRef.current;
        if (isTriggered.current || currentMax <= 0) return;
        
        // Constrain movement within bounds
        const newX = Math.max(0, Math.min(gestureState.dx, currentMax));
        pan.setValue(newX);

        // Haptic feedback as it slides
        if (newX > 0 && newX < currentMax && newX % 50 < 2) {
           Haptics.selectionAsync();
        }

        // Trigger action if reached end
        if (newX >= currentMax * 0.95 && !isTriggered.current) {
          isTriggered.current = true;
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onPress();
          
          // Snap back
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 10,
          }).start();
        }
      },
      onPanResponderRelease: () => {
        if (!isTriggered.current) {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 10,
          }).start();
        }
      },
    })
  ).current;

  // Text fades out as you slide
  const textOpacity = pan.interpolate({
    inputRange: [0, maxTranslate / 2, maxTranslate],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const isActive = !(disabled || isLoading);

  return (
    <View style={[styles.container, style]}>
      <View 
        style={[
          styles.track, 
          { backgroundColor: isActive ? colors.surfaceHighlight : colors.surface },
          !isActive && { opacity: 0.6 }
        ]}
        onLayout={handleLayout}
      >
        <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
          <Text variant="button" color={colors.textSecondary}>
            {isLoading ? 'Processing...' : (isEmpty ? 'Slide to Log First Smoke' : 'Slide to Log Smoke')}
          </Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.thumb,
            { backgroundColor: colors.primary },
            { transform: [{ translateX: pan }] }
          ]}
          {...(isActive ? panResponder.panHandlers : {})}
        >
          {isLoading ? (
            <LoadingIndicator size="small" />
          ) : (
            <Ionicons name="arrow-forward" size={24} color={colors.background} />
          )}
        </Animated.View>
      </View>
    </View>
  );
});

LogSmokeButton.displayName = 'LogSmokeButton';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.xl,
  },
  track: {
    height: THUMB_SIZE + (THUMB_PADDING * 2),
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    padding: THUMB_PADDING,
    ...Shadows.sm,
  },
  textContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    ...Shadows.md,
  },
});
