/**
 * Filter Card Component
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { THEME } from '../../constants';
import { FilterType } from '../../types';

interface FilterCardProps {
  filter: {
    type: FilterType;
    name: string;
    icon: string;
    isPremium: boolean;
  };
  isSelected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const FilterCard: React.FC<FilterCardProps> = ({
  filter,
  isSelected,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, isSelected && styles.selectedContainer, style]}
    >
      <LinearGradient
        colors={isSelected ? [THEME.colors.primary, THEME.colors.secondary] : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
        style={[styles.gradient, isSelected && styles.selectedGradient]}
      >
        <View style={styles.content}>
          <Text style={[styles.icon, isSelected && styles.selectedIcon]}>
            {filter.icon === 'image' && '📷'}
            {filter.icon === 'user' && '✂️'}
            {filter.icon === 'zap' && '⚡'}
            {filter.icon === 'star' && '✨'}
            {filter.icon === 'edit' && '✏️'}
            {filter.icon === 'maximize' && '🔍'}
            {filter.icon === 'maximize-2' && '🔎'}
          </Text>
          <Text style={[styles.name, isSelected && styles.selectedName]}>
            {filter.name}
          </Text>
          {filter.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>PRO</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedContainer: {
    borderColor: THEME.colors.primary,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    padding: THEME.spacing.md,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedGradient: {
    padding: THEME.spacing.md,
  },
  content: {
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  icon: {
    fontSize: 28,
  },
  selectedIcon: {
    fontSize: 32,
  },
  name: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  selectedName: {
    color: THEME.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  premiumBadge: {
    backgroundColor: THEME.colors.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  premiumText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default FilterCard;
