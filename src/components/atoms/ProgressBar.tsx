/**
 * Progress Bar Component
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { THEME } from '../../constants';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  style?: ViewStyle;
  color?: string;
  backgroundColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  style,
  color = THEME.colors.primary,
  backgroundColor = THEME.colors.surfaceVariant,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View style={[styles.container, { height, backgroundColor }, style]}>
      <View
        style={[
          styles.progress,
          {
            width: `${clampedProgress}%`,
            height,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: THEME.borderRadius.full,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: THEME.borderRadius.full,
  },
});

export default ProgressBar;
