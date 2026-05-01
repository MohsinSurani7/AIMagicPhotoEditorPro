/**
 * Camera Component (Stub - Camera not available without vision-camera)
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../../constants';
import GlassCard from '../atoms/GlassCard';
import Button from '../atoms/Button';

const CameraView: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>Camera not available</Text>
        <Text style={styles.placeholderSubtext}>
          Camera functionality requires react-native-vision-camera
        </Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
    padding: THEME.spacing.xl,
  },
  placeholderText: {
    color: THEME.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: THEME.spacing.md,
  },
  placeholderSubtext: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: THEME.spacing.xl,
  },
  backButton: {
    minWidth: 200,
  },
});

export default CameraView;
