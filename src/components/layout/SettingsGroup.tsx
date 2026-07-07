import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Text } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { useTheme } from '../../hooks/use-theme';
import { Spacing, BorderRadius, ThemeColors, Opacity } from '../../theme';
import { SectionHeader } from './SectionHeader';

export interface SettingsRowProps {
  /** The primary label for this setting */
  title: string;
  /** Optional descriptive text below the title */
  subtitle?: string;
  /** Optional icon to display on the left */
  icon?: IconName;
  /** Custom icon color (defaults to textSecondary) */
  iconColor?: keyof ThemeColors;
  /** Current value of the setting to display on the right */
  value?: string;
  /** Action to perform on press. If undefined, row is non-interactive. */
  onPress?: () => void;
  /** If true, the text will be colored danger red (for destructive actions) */
  isDestructive?: boolean;
  /** Whether to show a chevron pointing right to indicate navigation */
  showChevron?: boolean;
}

export interface SettingsGroupProps {
  /** Section title rendered above the group */
  title?: string;
  /** Array of settings rows to render */
  items: SettingsRowProps[];
  /** Custom container style */
  style?: ViewStyle;
}

/**
 * A reusable iOS/Android style grouped settings layout.
 */
export const SettingsGroup: React.FC<SettingsGroupProps> = React.memo(({ title, items, style }) => {
  const { colors } = useTheme();

  return (
    <View style={style}>
      {title && <SectionHeader title={title} />}
      <View style={[styles.groupContainer, { backgroundColor: colors.surface }]}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <Pressable
              key={item.title}
              onPress={item.onPress}
              disabled={!item.onPress}
              accessibilityRole={item.onPress ? 'button' : 'none'}
              style={({ pressed }) => [
                styles.row,
                !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
                pressed && item.onPress && { opacity: Opacity.active },
              ]}
            >
              {item.icon && (
                <View style={[
                  styles.iconWrapper, 
                  { backgroundColor: item.isDestructive ? colors.danger + '15' : colors.primary + '15' }
                ]}>
                  <Icon 
                    name={item.icon} 
                    size="sm" 
                    color={item.isDestructive ? 'danger' : 'primary'} 
                  />
                </View>
              )}
              
              <View style={styles.contentContainer}>
                <Text 
                  variant="body" 
                  color={item.isDestructive ? colors.danger : colors.textPrimary}
                  style={{ fontWeight: '500' }}
                >
                  {item.title}
                </Text>
                {item.subtitle && (
                  <Text variant="caption" color={colors.textSecondary} style={styles.subtitle}>
                    {item.subtitle}
                  </Text>
                )}
              </View>

              {item.value && (
                <Text variant="body" color={colors.textSecondary} style={styles.value}>
                  {item.value}
                </Text>
              )}

              {item.showChevron && (
                <View style={styles.chevronContainer}>
                  <Icon name="chevron-right" size="sm" color="textSecondary" />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});

SettingsGroup.displayName = 'SettingsGroup';

const styles = StyleSheet.create({
  groupContainer: {
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    minHeight: 64,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  contentContainer: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
  },
  value: {
    marginLeft: Spacing.md,
    marginRight: Spacing.xs,
  },
  chevronContainer: {
    marginLeft: Spacing.xs,
    opacity: 0.5,
  }
});
