/**
 * Error Boundary Component
 * Catches JavaScript errors in child component tree
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { THEME } from '../../constants';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>⚠️</Text>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              An unexpected error occurred. Please try again.
            </Text>
            {__DEV__ && this.state.error && (
              <Text style={styles.errorDetails}>
                {this.state.error.toString()}
              </Text>
            )}
            <Button
              title="Try Again"
              onPress={this.handleReset}
              style={styles.button}
            />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  emoji: {
    fontSize: 64,
    marginBottom: THEME.spacing.lg,
  },
  title: {
    color: THEME.colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: THEME.spacing.md,
    textAlign: 'center',
  },
  message: {
    color: THEME.colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: THEME.spacing.xl,
    lineHeight: 24,
  },
  errorDetails: {
    color: THEME.colors.error,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  button: {
    minWidth: 200,
  },
});

export default ErrorBoundary;
