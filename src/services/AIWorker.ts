/**
 * AI Worker (Stub - No background thread processing)
 */

import MediaPipeService from './MediaPipeService';
import TFLiteService from './TFLiteService';
import { FilterType } from '../types';

class AIWorker {
  private static instance: AIWorker;
  private mediaPipeService: MediaPipeService;
  private tfliteService: TFLiteService;

  private constructor() {
    this.mediaPipeService = MediaPipeService.getInstance();
    this.tfliteService = TFLiteService.getInstance();
  }

  static getInstance(): AIWorker {
    if (!AIWorker.instance) {
      AIWorker.instance = new AIWorker();
    }
    return AIWorker.instance;
  }

  async processImage(imageUri: string, filterType: FilterType): Promise<string> {
    // Stub - returns original image
    return imageUri;
  }

  cancelTask(taskId: string): boolean {
    return false;
  }

  clearQueue(): void {
    // Stub - does nothing
  }

  getQueueLength(): number {
    return 0;
  }
}

export default AIWorker;
