/**
 * MediaPipe Selfie Segmentation Service
 * Handles background removal using MediaPipe Vision API
 */

import { ImageSegmenter, ImageSegmenterOptions, ImageSegmenterResult } from '@mediapipe/tasks-vision';
import { Platform } from 'react-native';
import AssetDownloader from './AssetDownloader';

class MediaPipeService {
  private static instance: MediaPipeService;
  private segmenter: ImageSegmenter | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): MediaPipeService {
    if (!MediaPipeService.instance) {
      MediaPipeService.instance = new MediaPipeService();
    }
    return MediaPipeService.instance;
  }

  /**
   * Initialize the MediaPipe Selfie Segmentation model
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      const assetDownloader = AssetDownloader.getInstance();
      const modelPath = await assetDownloader.downloadModel('selfie-segmentation');

      const options: ImageSegmenterOptions = {
        baseOptions: {
          modelAssetPath: modelPath,
          delegate: Platform.OS === 'ios' ? 'GPU' : 'GPU', // Use GPU for better performance
        },
        outputCategoryMask: true,
        outputConfidenceMasks: false,
      };

      this.segmenter = await ImageSegmenter.createFromOptions(options);
      this.isInitialized = true;
      console.log('MediaPipe Selfie Segmentation initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MediaPipe:', error);
      throw error;
    }
  }

  /**
   * Remove background from an image
   */
  async removeBackground(imageUri: string): Promise<string> {
    if (!this.isInitialized || !this.segmenter) {
      await this.initialize();
    }

    try {
      // Load image and segment
      const result: ImageSegmenterResult = await this.segmenter!.segment(imageUri);
      
      // Process segmentation mask to create transparent background
      // This would typically involve:
      // 1. Getting the segmentation mask
      // 2. Applying it to the original image
      // 3. Setting background pixels to transparent
      
      // For now, return the original URI
      // In production, you'd use Skia or another graphics library to apply the mask
      return imageUri;
    } catch (error) {
      console.error('Background removal failed:', error);
      throw error;
    }
  }

  /**
   * Check if the service is initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.segmenter !== null;
  }

  /**
   * Clean up resources
   */
  async dispose(): Promise<void> {
    if (this.segmenter) {
      await this.segmenter.close();
      this.segmenter = null;
      this.isInitialized = false;
    }
  }
}

export default MediaPipeService;
