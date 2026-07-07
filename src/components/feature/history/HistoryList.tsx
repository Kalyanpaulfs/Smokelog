import React from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { HistoryItem } from './HistoryItem';
import { EmptyHistoryState } from './EmptyHistoryState';
import { SectionHeader } from '../../layout/SectionHeader';
import { Spacing } from '../../../theme';
import { HistorySectionData } from '../../../domain/AnalyticsService';

export interface HistoryListProps {
  /** Array of grouped history records to display */
  sections: HistorySectionData[];
  /** Whether the list is fetching data */
  isLoading?: boolean;
}

/**
 * Structural layout for rendering a chronologically grouped list of history items.
 */
export const HistoryList: React.FC<HistoryListProps> = ({ sections, isLoading }) => {
  
  if (!isLoading && sections.length === 0) {
    return <EmptyHistoryState />;
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <HistoryItem record={item} />}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.headerContainer}>
          <SectionHeader title={title} />
        </View>
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false} // Preferred for iOS cleanliness on grouped standard lists
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['3xl'] + Spacing.xl, // Safe padding for bottom tabs
  },
  headerContainer: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xs,
  }
});
