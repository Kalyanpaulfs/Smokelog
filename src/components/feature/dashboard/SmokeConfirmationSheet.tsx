import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, View, TouchableWithoutFeedback, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../../ui/Text';
import { Button } from '../../ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/use-theme';
import { Spacing, BorderRadius, Shadows, AnimationDurations } from '../../../theme';
import { MotivationService } from '../../../domain/MotivationService';

export interface SmokeConfirmationSheetProps {
  /** Controls visibility of the sheet */
  isVisible: boolean;
  /** Action called when the user confirms their intent */
  onConfirm: () => void;
  /** Action called when the user taps cancel or the backdrop */
  onCancel: () => void;
  /** Whether the confirmation is currently processing */
  isLoading?: boolean;
}

/**
 * A reusable bottom sheet component that introduces intentional friction before logging.
 * It contains purely UI logic and zero business/domain logic.
 */
export const SmokeConfirmationSheet: React.FC<SmokeConfirmationSheetProps> = React.memo(({
  isVisible,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  const { colors } = useTheme();

  // Fetch a new random motivation dynamically whenever the sheet becomes visible
  const motivation = React.useMemo(() => {
    if (!isVisible) return null;
    return MotivationService.getRandomMotivation();
  }, [isVisible]);
  
  // Ref-less animation using state initializer to satisfy React strict mode safely
  const [slideAnim] = useState(() => new Animated.Value(0));
  const [fadeAnim] = useState(() => new Animated.Value(0));

  // Determine if we should render at all based on animation lifecycle
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: AnimationDurations.normal,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: AnimationDurations.normal,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: AnimationDurations.normal,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: AnimationDurations.normal,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setShouldRender(false);
        }
      });
    }
  }, [isVisible, slideAnim, fadeAnim]);

  if (!shouldRender) return null;

  return (
    <Modal visible={shouldRender} transparent animationType="none" onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel} disabled={isLoading}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim, backgroundColor: colors.overlay }]} />
      </TouchableWithoutFeedback>
      
      <Animated.View 
        style={[
          styles.sheetContainer,
          { backgroundColor: colors.surface },
          {
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [300, 0],
              })
            }]
          }
        ]}
      >
        <View style={[styles.indicator, { backgroundColor: colors.border }]} />
        
        <View style={styles.iconContainer}>
          <View style={[styles.iconBox, { backgroundColor: colors.surfaceHighlight }]}>
            <Ionicons name="leaf-outline" size={32} color={colors.primary} />
          </View>
        </View>

        <Text variant="overline" align="center" style={styles.title}>
          {motivation ? motivation.category.toUpperCase() : 'TAKE A BREATH'}
        </Text>
        
        <Text variant="title" color={colors.textPrimary} align="center" style={styles.description}>
          {motivation ? `"${motivation.content}"` : '"Are you sure you want to log another right now?"'}
        </Text>

        <View style={styles.actions}>
          <Button 
            variant="secondary" 
            label="Cancel" 
            onPress={onCancel}
            disabled={isLoading}
            style={styles.button}
          />
          <Button 
            variant="primary" 
            label="Log It" 
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onConfirm();
            }}
            isLoading={isLoading}
            style={styles.button}
          />
        </View>
      </Animated.View>
    </Modal>
  );
});

SmokeConfirmationSheet.displayName = 'SmokeConfirmationSheet';

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg, // Reduced from xl
    paddingBottom: Spacing['2xl'], // Reduced safe area padding
    ...Shadows.md,
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg, // Reduced from xl
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md, // Reduced from lg
  },
  iconBox: {
    width: 56, // Slightly smaller icon box
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: Spacing.sm, // Reduced from md
  },
  description: {
    marginBottom: Spacing.xl, // Reduced from 3xl (64 -> 32)
    paddingHorizontal: Spacing.md,
    fontStyle: 'italic',
    lineHeight: 28, // Slightly tighter line height
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  button: {
    flex: 1,
  },
});
