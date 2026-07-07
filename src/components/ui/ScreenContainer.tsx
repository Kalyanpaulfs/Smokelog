import React from 'react';
import { 
  View, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet, 
  ViewStyle 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/use-theme';

export interface ScreenContainerProps {
  /** The content of the screen */
  children: React.ReactNode;
  /** Whether the screen should be scrollable */
  scrollable?: boolean;
  /** Whether the content should be vertically and horizontally centered */
  centered?: boolean;
  /** Whether to wrap the screen in a SafeAreaView to avoid notches/bezels */
  withSafeArea?: boolean;
  /** Whether the screen should shift up when the keyboard opens */
  keyboardAware?: boolean;
  /** Custom styles for the outer container */
  style?: ViewStyle;
  /** Custom styles for the inner content container */
  contentContainerStyle?: ViewStyle;
}

/**
 * A highly composable Screen layout component.
 * Handles safe areas, scrolling, keyboard avoiding, and centering through a clean API.
 */
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  centered = false,
  withSafeArea = true,
  keyboardAware = false,
  style,
  contentContainerStyle,
}) => {
  const { colors } = useTheme();

  const Container = withSafeArea ? SafeAreaView : View;
  
  const baseStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
  };

  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  let content = children;

  if (scrollable) {
    content = (
      <ScrollView
        contentContainerStyle={[
          centered && styles.centered,
          contentContainerStyle
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {content}
      </ScrollView>
    );
  } else {
    content = (
      <View style={[
        { flex: 1 }, 
        centered && styles.centered, 
        contentContainerStyle
      ]}>
        {content}
      </View>
    );
  }

  if (keyboardAware) {
    content = (
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={keyboardBehavior}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return (
    <Container style={[baseStyle, style]}>
      {content}
    </Container>
  );
};

const styles = StyleSheet.create({
  centered: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
