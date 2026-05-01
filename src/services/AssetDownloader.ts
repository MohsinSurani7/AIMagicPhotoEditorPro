/**
 * Asset Downloader Service
 * Handles downloading AI models from remote URLs with progress tracking
 */

import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { AIModelConfig, AIModelType, DownloadProgress } from '../types';
import { AI_MODELS } from '../constants';
import { useAppStore } from '../stores/useAppStore';

class AssetDownloader {
  private static instance: AssetDownloader;
  private downloadTasks: Map<AIModelType, RNFS.DownloadResult> = new Map();

  private constructor() {}

  static getInstance(): AssetDownloader {
    if (!AssetDownloader.instance) {
      AssetDownloader.instance = new AssetDownloader();
    }
    return AssetDownloader.instance;
  }

  /**
   * Get the local storage path for models
   */
  private getModelPath(fileName: string): string {
    const documentDir = Platform.OS === 'ios' 
      ? RNFS.MainBundlePath 
      : RNFS.ExternalStorageDirectoryPath;
    const modelsDir = `${documentDir}/models`;
    
    // Ensure models directory exists
    if (!RNFS.exists(modelsDir)) {
      RNFS.mkdir(modelsDir);
    }
    
    return `${modelsDir}/${fileName}`;
  }

  /**
   * Check if a model is already downloaded
   */
  async isModelDownloaded(modelType: AIModelType): Promise<boolean> {
    const config = AI_MODELS[modelType];
    const modelPath = this.getModelPath(config.fileName);
    
    try {
      return await RNFS.exists(modelPath);
    } catch (error) {
      console.error(`Error checking model ${modelType}:`, error);
      return false;
    }
  }

  /**
   * Download a model with progress tracking
   */
  async downloadModel(
    modelType: AIModelType,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<string> {
    const config = AI_MODELS[modelType];
    const modelPath = this.getModelPath(config.fileName);

    // Check if already downloaded
    if (await this.isModelDownloaded(modelType)) {
      console.log(`Model ${modelType} already downloaded`);
      return modelPath;
    }

    // Initialize progress
    const initialProgress: DownloadProgress = {
      modelType,
      progress: 0,
      totalBytes: config.fileSize,
      downloadedBytes: 0,
      isDownloading: true,
      isComplete: false,
    };
    
    useAppStore.getState().setDownloadProgress(modelType, initialProgress);
    onProgress?.(initialProgress);

    try {
      const downloadResult = await RNFS.downloadFile({
        fromUrl: config.downloadUrl,
        toFile: modelPath,
        progress: (res) => {
          const progress: DownloadProgress = {
            modelType,
            progress: (res.bytesWritten / res.contentLength) * 100,
            totalBytes: res.contentLength,
            downloadedBytes: res.bytesWritten,
            isDownloading: true,
            isComplete: false,
          };
          
          useAppStore.getState().setDownloadProgress(modelType, progress);
          onProgress?.(progress);
        },
        progressDivider: 10,
      }).promise;

      if (downloadResult.statusCode === 200) {
        const completeProgress: DownloadProgress = {
          modelType,
          progress: 100,
          totalBytes: config.fileSize,
          downloadedBytes: config.fileSize,
          isDownloading: false,
          isComplete: true,
        };
        
        useAppStore.getState().setDownloadProgress(modelType, completeProgress);
        onProgress?.(completeProgress);
        
        console.log(`Model ${modelType} downloaded successfully`);
        return modelPath;
      } else {
        throw new Error(`Download failed with status: ${downloadResult.statusCode}`);
      }
    } catch (error) {
      const errorProgress: DownloadProgress = {
        modelType,
        progress: 0,
        totalBytes: config.fileSize,
        downloadedBytes: 0,
        isDownloading: false,
        isComplete: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      
      useAppStore.getState().setDownloadProgress(modelType, errorProgress);
      onProgress?.(errorProgress);
      throw error;
    }
  }

  /**
   * Download all required models
   */
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

  /**
   * Cancel a download
   */
  async cancelDownload(modelType: AIModelType): Promise<void> {
    const task = this.downloadTasks.get(modelType);
    if (task) {
      RNFS.stopDownload(task.jobId);
      this.downloadTasks.delete(modelType);
      
      const progress: DownloadProgress = {
        modelType,
        progress: 0,
        totalBytes: 0,
        downloadedBytes: 0,
        isDownloading: false,
        isComplete: false,
      };
      
      useAppStore.getState().setDownloadProgress(modelType, progress);
    }
  }

  /**
   * Get the local path for a model
   */
  getModelLocalPath(modelType: AIModelType): string {
    const config = AI_MODELS[modelType];
    return this.getModelPath(config.fileName);
  }
}

export default AssetDownloader;
