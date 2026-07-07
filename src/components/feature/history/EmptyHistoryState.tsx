import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { EmptyState } from '../../ui/EmptyState';
import { FadeIn } from '../../animations/FadeIn';

export interface EmptyHistoryStateProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * Feature component representing an empty history view.
 */
export const EmptyHistoryState: React.FC<EmptyHistoryStateProps> = ({ style }) => {
  return (
    <FadeIn style={[styles.container, style]}>
      <EmptyState
        iconName="calendar"
        title="No History Yet"
        description="Your history will appear here once you begin logging your activities. Stay consistent!"
      />
    </FadeIn>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
