/**
 * Loading Spinner Component
 */

import React from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { THEME } from '../../constants';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = THEME.colors.primary,
  text,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: THEME.spacing.md,
  },
  text: {
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.md,
    fontSize: 14,
  },
});

export default LoadingSpinner;
