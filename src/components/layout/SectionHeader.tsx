import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from '../ui/Text';
import { useTheme } from '../../hooks/use-theme';
import { Spacing } from '../../theme';

export interface SectionHeaderProps {
  /** The section title */
  title: string;
  /** Optional action element to render on the right (e.g. "See all" button) */
  action?: React.ReactNode;
  /** Custom container style */
  style?: ViewStyle;
}

/**
 * A consistent sub-header for grouping related content within a screen.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = React.memo(({ title, action, style }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text variant="subtitle" color={colors.textSecondary} style={styles.title}>
        {title.toUpperCase()}
      </Text>
      {action && <View>{action}</View>}
    </View>
  );
});

SectionHeader.displayName = 'SectionHeader';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  title: {
    letterSpacing: 1,
    fontSize: 13,
  },
});
