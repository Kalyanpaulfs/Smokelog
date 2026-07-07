import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../ui/Text';
import { useTheme } from '../../hooks/use-theme';
import { Spacing } from '../../theme';

export interface ScreenHeaderProps {
  /** The primary title of the screen */
  title: string;
  /** Optional secondary text below the title */
  subtitle?: string;
  /** Optional element to render on the right side */
  rightElement?: React.ReactNode;
  /** Custom container style */
  style?: ViewStyle;
}

/**
 * A standardized Screen Header component that safely avoids the top notch.
 * Renders the primary screen title and integrates with the active theme.
 */
export const ScreenHeader: React.FC<ScreenHeaderProps> = React.memo(({
  title,
  subtitle,
  rightElement,
  style,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container, 
      { 
        paddingTop: Math.max(insets.top + Spacing.sm, Spacing.xl),
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
      },
      style
    ]}>
      <View style={styles.textContainer}>
        <Text variant="headline" style={styles.title}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="body" color={colors.textSecondary}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement && (
        <View style={styles.rightContainer}>
          {rightElement}
        </View>
      )}
    </View>
  );
});

ScreenHeader.displayName = 'ScreenHeader';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 2,
  },
  rightContainer: {
    marginLeft: Spacing.md,
  },
});
