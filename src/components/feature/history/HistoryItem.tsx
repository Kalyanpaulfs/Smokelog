import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '../../ui/Card';
import { Text } from '../../ui/Text';
import { Icon } from '../../ui/Icon';
import { useTheme } from '../../../hooks/use-theme';
import { Spacing } from '../../../theme';

export interface HistoryItemRecord {
  id: string;
  timestamp: number;
  // Future fields will be added here
}

export interface HistoryItemProps {
  record: HistoryItemRecord;
}

/**
 * Structural layout for a single history record.
 */
export const HistoryItem: React.FC<HistoryItemProps> = React.memo(({ record }) => {
  const { colors } = useTheme();

  return (
    <Card variant="filled" style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="clock" size="sm" color="textSecondary" />
      </View>
      <View style={styles.content}>
        <Text variant="body">Logged Activity</Text>
        <Text variant="caption" color={colors.textSecondary}>
          {new Date(record.timestamp).toLocaleString()}
        </Text>
      </View>
    </Card>
  );
});

HistoryItem.displayName = 'HistoryItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
});
