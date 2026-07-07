import React from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Text } from '../../ui/Text';
import { useTheme } from '../../../hooks/use-theme';
import { Spacing } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useSmokeStore } from '../../../store/smokeStore';
import * as Haptics from 'expo-haptics';

export interface HistoryItemRecord {
  id: string;
  timestamp: number;
}

export interface HistoryItemProps {
  record: HistoryItemRecord;
  isLast?: boolean; // Optional: to hide the line for the last item if needed
}

export const HistoryItem: React.FC<HistoryItemProps> = React.memo(({ record, isLast }) => {
  const { colors } = useTheme();
  const deleteLog = useSmokeStore(state => state.deleteLog);

  // Use a cleaner, lowercase time string (e.g. "5:46 pm") to save horizontal space and look more premium
  const timeString = new Date(record.timestamp).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
  }).toLowerCase();

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to permanently delete this log?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteLog(record.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete log.');
            }
          }
        }
      ]
    );
  };

  return (
    <Pressable 
      onLongPress={handleLongPress}
      delayLongPress={500}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.7 }
      ]}
    >
      
      {/* Background vertical line for the timeline */}
      {!isLast && <View style={[styles.verticalLine, { backgroundColor: colors.border }]} />}
      
      <View style={styles.timeContainer}>
        <Text variant="subtitle" color={colors.textPrimary} style={styles.timeText} numberOfLines={1} adjustsFontSizeToFit>
          {timeString}
        </Text>
      </View>

      <View style={styles.dotContainer}>
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
      </View>

      <View style={[styles.contentContainer, { backgroundColor: colors.surface }]}>
        <Ionicons name="flame" size={16} color={colors.primary} style={{ marginRight: 8 }} />
        <View style={{ justifyContent: 'center' }}>
          <Text variant="body" color={colors.textPrimary} style={{ fontWeight: '500' }}>
            Smoke Logged
          </Text>
        </View>
      </View>
      
    </Pressable>
  );
});

HistoryItem.displayName = 'HistoryItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    position: 'relative',
    minHeight: 64,
  },
  verticalLine: {
    position: 'absolute',
    left: 89, // 80 (timeContainer width) + 10 (half of dotContainer width) - 1 (half of line width)
    top: 32, // Start from middle of current item
    bottom: -Spacing.md, // Go to the next item
    width: 2,
    opacity: 0.5,
    zIndex: 0,
  },
  timeContainer: {
    width: 80, // Increased width to prevent wrapping (like "5:46 P M")
    alignItems: 'flex-end',
    paddingRight: Spacing.md,
  },
  timeText: {
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.5,
  },
  dotContainer: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Keep above the line
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
  },
});
