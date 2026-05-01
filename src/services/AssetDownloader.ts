/**
 * Asset Downloader Service (Stub - No file system access)
 */

import { AIModelType, DownloadProgress } from '../types';
import { useAppStore } from '../stores/useAppStore';

class AssetDownloader {
  private static instance: AssetDownloader;

  private constructor() {}

  static getInstance(): AssetDownloader {
    if (!AssetDownloader.instance) {
      AssetDownloader.instance = new AssetDownloader();
    }
    return AssetDownloader.instance;
  }

  async isModelDownloaded(modelType: AIModelType): Promise<boolean> {
    // Stub - always returns true
    return true;
  }

  async downloadModel(
    modelType: AIModelType,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<string> {
    // Stub - simulates download
    const completeProgress: DownloadProgress = {
      modelType,
      progress: 100,
      totalBytes: 1000000,
      downloadedBytes: 1000000,
      isDownloading: false,
      isComplete: true,
    };
    
    useAppStore.getState().setDownloadProgress(modelType, completeProgress);
    onProgress?.(completeProgress);
    
    return `/models/${modelType}.tflite`;
  }

  async downloadAllModels(
    onProgress?: (modelType: AIModelType, progress: DownloadProgress) => void
  ): Promise<void> {
    const modelTypes: AIModelType[] = [
      'selfie-segmentation',
      'style-transfer',
      'esrgan-upscale',
    ];

    for (const modelType of modelTypes) {
      await this.downloadModel(modelType, (progress) => {
        onProgress?.(modelType, progress);
      });
    }

    useAppStore.getState().setModelsDownloaded(true);
  }

  async cancelDownload(modelType: AIModelType): Promise<void> {
    // Stub - does nothing
  }

  getModelLocalPath(modelType: AIModelType): string {
    return `/models/${modelType}.tflite`;
  }
}

export default AssetDownloader;
