/**
 * Before/After Slider Component using react-native-svg
 */

import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image as RNImage, Text } from 'react-native';
import Svg, { Rect, Defs, ClipPath } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { THEME } from '../../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BeforeAfterSliderProps {
  beforeImageUri: string;
  afterImageUri: string;
  width?: number;
  height?: number;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImageUri,
  afterImageUri,
  width = SCREEN_WIDTH - THEME.spacing.lg * 2,
  height = 400,
}) => {
  const [progress, setProgress] = useState(0.5);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newProgress = event.x / width;
      setProgress(Math.max(0, Math.min(1, newProgress)));
    });

  const clipWidth = progress * width;

  return (
    <View style={[styles.container, { width, height }]}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.imageContainer}>
          {/* After Image (Background) */}
          <RNImage
            source={{ uri: afterImageUri }}
            style={[styles.image, { width, height }]}
            resizeMode="cover"
          />

          {/* Before Image (Foreground with Clip) */}
          <View style={[styles.clipContainer, { width: clipWidth, height }]}>
            <RNImage
              source={{ uri: beforeImageUri }}
              style={[styles.image, { width, height }]}
              resizeMode="cover"
            />
          </View>
        </View>
      </GestureDetector>

      {/* Slider Handle */}
      <View
        style={[
          styles.handle,
          { left: progress * width - 20 },
        ]}
      >
        <View style={styles.handleLine} />
      </View>

      {/* Labels */}
      <View style={styles.labels}>
        <View style={[styles.label, styles.beforeLabel]}>
          <Text style={styles.labelText}>BEFORE</Text>
        </View>
        <View style={[styles.label, styles.afterLabel]}>
          <Text style={styles.labelText}>AFTER</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surface,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  clipContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  handle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleLine: {
    width: 3,
    height: 60,
    backgroundColor: THEME.colors.primary,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  labels: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: THEME.spacing.md,
    pointerEvents: 'none',
  },
  label: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.sm,
  },
  beforeLabel: {
    alignSelf: 'flex-start',
  },
  afterLabel: {
    alignSelf: 'flex-end',
  },
  labelText: {
    color: THEME.colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default BeforeAfterSlider;
