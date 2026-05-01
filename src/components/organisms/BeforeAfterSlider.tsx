/**
 * Before/After Slider Component using Skia
 */

import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
  Canvas,
  Image,
  useImage,
  Group,
  ClipRect,
  mix,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from '@shopify/react-native-skia';
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
  const beforeImage = useImage(beforeImageUri);
  const afterImage = useImage(afterImageUri);
  const progress = useSharedValue(0.5);

  const derivedProgress = useDerivedValue(() => {
    return withTiming(progress.value, { duration: 0 });
  });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newProgress = event.x / width;
      progress.value = Math.max(0, Math.min(1, newProgress));
    });

  if (!beforeImage || !afterImage) {
    return (
      <View style={[styles.container, { width, height }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading images...</Text>
        </View>
      </View>
    );
  }

  const clipWidth = mix(derivedProgress, 0, width);

  return (
    <View style={[styles.container, { width, height }]}>
      <GestureDetector gesture={panGesture}>
        <Canvas style={[styles.canvas, { width, height }]}>
          {/* After Image (Background) */}
          <Image
            image={afterImage}
            x={0}
            y={0}
            width={width}
            height={height}
            fit="cover"
          />

          {/* Before Image (Foreground with Clip) */}
          <Group clip={<ClipRect x={0} y={0} width={clipWidth} height={height} />}>
            <Image
              image={beforeImage}
              x={0}
              y={0}
              width={width}
              height={height}
              fit="cover"
            />
          </Group>
        </Canvas>
      </GestureDetector>

      {/* Slider Handle */}
      <View
        style={[
          styles.handle,
          { left: derivedProgress.value * width - 20 },
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
  canvas: {
    backgroundColor: THEME.colors.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: THEME.colors.textSecondary,
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
