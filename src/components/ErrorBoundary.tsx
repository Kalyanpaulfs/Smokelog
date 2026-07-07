import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { reportError } from '../utils/errors';
import { Colors, Spacing } from '../theme';
import { EmptyState } from './ui/EmptyState';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    reportError(error, `ErrorBoundary: ${errorInfo.componentStack}`);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <EmptyState
            iconName="alert-triangle"
            title="Oops! Something went wrong."
            description={this.state.error?.message || 'An unexpected error occurred.'}
            action={{
              label: 'Try Again',
              onPress: this.handleReset,
              variant: 'primary',
            }}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.light.background, // Fallback color for class component
  },
});
