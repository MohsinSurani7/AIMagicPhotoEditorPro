/**
 * Glassmorphism Card Component
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { THEME } from '../../constants';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 0.05,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `rgba(255, 255, 255, ${intensity})`,
          borderWidth: 1,
          borderColor: `rgba(255, 255, 255, ${intensity * 2})`,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default GlassCard;
