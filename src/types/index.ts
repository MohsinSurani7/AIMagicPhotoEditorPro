/**
 * Core type definitions for AI Magic Photo Editor
 */

export type AIModelType = 'selfie-segmentation' | 'style-transfer' | 'esrgan-upscale';

export type FilterType = 
  | 'none'
  | 'cyberpunk'
  | 'anime'
  | 'sketch'
  | 'remove-background'
  | 'upscale-2x'
  | 'upscale-4x';

export interface DownloadProgress {
  modelType: AIModelType;
  progress: number; // 0-100
  totalBytes: number;
  downloadedBytes: number;
  isDownloading: boolean;
  isComplete: boolean;
  error?: string;
}

export interface AIModelConfig {
  type: AIModelType;
  fileName: string;
  downloadUrl: string;
  fileSize: number;
  version: string;
}

export interface ImageEditResult {
  originalUri: string;
  processedUri: string;
  filterType: FilterType;
  processingTime: number;
  timestamp: number;
}

export interface CameraFrame {
  uri: string;
  width: number;
  height: number;
  timestamp: number;
}

export interface AdConfig {
  appOpenAdUnitId: string;
  rewardedAdUnitId: string;
  interstitialAdUnitId: string;
  isTestMode: boolean;
}

export interface AppState {
  isModelsDownloaded: boolean;
  downloadProgress: Record<AIModelType, DownloadProgress>;
  currentFilter: FilterType;
  selectedImageUri: string | null;
  processedImageUri: string | null;
  isProcessing: boolean;
  editHistory: ImageEditResult[];
  adsConfig: AdConfig;
  editCount: number; // For interstitial ad frequency
}
