import React, { useState } from 'react';
import { SectionList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { HistoryItem } from './HistoryItem';
import { EmptyHistoryState } from './EmptyHistoryState';
import { SectionHeader } from '../../layout/SectionHeader';
import { Spacing } from '../../../theme';
import { HistorySectionData } from '../../../domain/AnalyticsService';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/use-theme';

export interface HistoryListProps {
  /** Array of grouped history records to display */
  sections: HistorySectionData[];
  /** Whether the list is fetching data */
  isLoading?: boolean;
  /** Callback triggered when user scrolls to the bottom */
  onEndReached?: () => void;
}

/**
 * Structural layout for rendering a chronologically grouped list of history items.
 * Implements smart collapsing to keep the UI clean.
 */
export const HistoryList: React.FC<HistoryListProps> = ({ sections, isLoading, onEndReached }) => {
  const { colors } = useTheme();

  // Smart default: Only 'Today' is expanded. Everything older is minimized.
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    'Yesterday': true,
    'This Week': true,
    'Earlier': true,
  });

  const toggleSection = (title: string) => {
    setCollapsed(prev => ({ ...prev, [title]: !prev[title] }));
  };
  
  if (!isLoading && sections.length === 0) {
    return <EmptyHistoryState />;
  }

  // Empty the data array for collapsed sections so SectionList hides the items
  const displaySections = sections.map(section => ({
    ...section,
    data: collapsed[section.title] ? [] : section.data
  }));

  return (
    <SectionList
      sections={displaySections}
      keyExtractor={(item) => item.id}
      renderItem={({ item, section, index }) => (
        <HistoryItem 
          record={item} 
          isLast={index === section.data.length - 1} 
        />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <TouchableOpacity 
          activeOpacity={0.7} 
          onPress={() => toggleSection(title)}
          style={styles.headerContainer}
        >
          <SectionHeader 
            title={title} 
            action={
              <Ionicons 
                name={collapsed[title] ? "chevron-down" : "chevron-up"} 
                size={18} 
                color={colors.textSecondary} 
              />
            }
          />
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false} // Preferred for iOS cleanliness on grouped standard lists
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['3xl'] + Spacing.xl, // Safe padding for bottom tabs
  },
  headerContainer: {
    // Rely on SectionHeader's built in margins, just wrapping it to make the whole row clickable
  }
});
