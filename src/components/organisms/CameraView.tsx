/**
 * Camera Component using react-native-vision-camera
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
} from 'react-native';
import { Camera, useCameraDevices, useCameraPermission } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../../constants';
import GlassCard from '../atoms/GlassCard';
import Button from '../atoms/Button';

const CameraView: React.FC = () => {
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const { hasPermission, requestPermission } = useCameraPermission();
  const navigation = useNavigation();
  const [isActive, setIsActive] = useState(true);

  const device = devices.back;

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().then((granted) => {
        if (!granted) {
          Alert.alert(
            'Permission Required',
            'Camera permission is needed to take photos',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        }
      });
    }
  }, [hasPermission, requestPermission, navigation]);

  const takePhoto = async () => {
    if (!camera.current) return;

    try {
      const photo = await camera.current.takePhoto();
      // Navigate to editor with the photo
      // @ts-ignore
      navigation.navigate('Editor', { imageUri: `file://${photo.path}` });
    } catch (error) {
      console.error('Failed to take photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required
        </Text>
        <Button
          title="Grant Permission"
          onPress={requestPermission}
          style={styles.permissionButton}
        />
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>No camera device available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={isActive}
        photo={true}
        orientation="portrait"
      />

      {/* Top Controls */}
      <View style={styles.topControls}>
        <GlassCard style={styles.closeButton}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </GlassCard>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <GlassCard style={styles.captureContainer}>
          <TouchableOpacity
            onPress={takePhoto}
            style={styles.captureButton}
            activeOpacity={0.7}
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>
        </GlassCard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  camera: {
    flex: 1,
  },
  topControls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 0,
    right: 0,
    paddingHorizontal: THEME.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: THEME.colors.text,
    fontSize: 24,
    fontWeight: '600',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureContainer: {
    padding: THEME.spacing.lg,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: THEME.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.primary,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
    padding: THEME.spacing.xl,
  },
  permissionText: {
    color: THEME.colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
  },
  permissionButton: {
    minWidth: 200,
  },
});

export default CameraView;
