/**
 * App constants and configuration
 */

import { AIModelConfig, AdConfig, FilterType } from '../types';

export const AI_MODELS: Record<string, AIModelConfig> = {
  'selfie-segmentation': {
    type: 'selfie-segmentation',
    fileName: 'selfie_segmentation.tflite',
    downloadUrl: 'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter_general/float32/1/selfie_segmenter_general.tflite',
    fileSize: 10485760, // ~10MB
    version: '1.0.0',
  },
  'style-transfer': {
    type: 'style-transfer',
    fileName: 'style_transfer.tflite',
    downloadUrl: 'https://tfhub.dev/google/lite-model/magenta/arbitrary-image-stylization-v1-256/fp16/1?lite-format=tflite',
    fileSize: 52428800, // ~50MB
    version: '1.0.0',
  },
  'esrgan-upscale': {
    type: 'esrgan-upscale',
    fileName: 'esrgan.tflite',
    downloadUrl: 'https://github.com/xinntao/ESRGAN/releases/download/v0.1.0/RRDB_ESRGAN_x4.pth',
    fileSize: 67108864, // ~64MB (will need conversion to TFLite)
    version: '1.0.0',
  },
};

export const DEFAULT_ADS_CONFIG: AdConfig = {
  appOpenAdUnitId: 'ca-app-pub-3940256099942544/3419835294', // Test ID
  rewardedAdUnitId: 'ca-app-pub-3940256099942544/5224354917', // Test ID
  interstitialAdUnitId: 'ca-app-pub-3940256099942544/1033173712', // Test ID
  isTestMode: true,
};

export const FILTERS: { type: FilterType; name: string; icon: string; isPremium: boolean }[] = [
  { type: 'none', name: 'Original', icon: 'image', isPremium: false },
  { type: 'remove-background', name: 'Remove BG', icon: 'user', isPremium: true },
  { type: 'cyberpunk', name: 'Cyberpunk', icon: 'zap', isPremium: true },
  { type: 'anime', name: 'Anime', icon: 'star', isPremium: true },
  { type: 'sketch', name: 'Sketch', icon: 'edit', isPremium: true },
  { type: 'upscale-2x', name: 'Upscale 2x', icon: 'maximize', isPremium: true },
  { type: 'upscale-4x', name: 'Upscale 4x', icon: 'maximize-2', isPremium: true },
];

export const THEME = {
  colors: {
    background: '#0a0a0f',
    surface: '#12121a',
    surfaceVariant: '#1a1a24',
    primary: '#6366f1',
    primaryVariant: '#4f46e5',
    secondary: '#8b5cf6',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    border: '#27272a',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    blur: 20,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
};

export const INTERSTITIAL_AD_FREQUENCY = 2; // Show after every 2 edits
