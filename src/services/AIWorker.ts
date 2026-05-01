/**
 * Background Thread Worker for AI Processing
 * Runs heavy AI operations on a separate thread to keep UI responsive
 */

import { Platform } from 'react-native';
import MediaPipeService from './MediaPipeService';
import TFLiteService from './TFLiteService';
import { FilterType } from '../types';

interface WorkerTask {
  id: string;
  type: FilterType;
  imageUri: string;
  resolve: (result: string) => void;
  reject: (error: Error) => void;
}

class AIWorker {
  private static instance: AIWorker;
  private taskQueue: WorkerTask[] = [];
  private isProcessing = false;
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

  /**
   * Process an image with the specified filter
   * Runs on background thread using setTimeout to unblock UI
   */
  async processImage(imageUri: string, filterType: FilterType): Promise<string> {
    return new Promise((resolve, reject) => {
      const task: WorkerTask = {
        id: `${Date.now()}-${Math.random()}`,
        type: filterType,
        imageUri,
        resolve,
        reject,
      };

      this.taskQueue.push(task);
      this.processQueue();
    });
  }

  /**
   * Process the task queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.taskQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const task = this.taskQueue.shift();

    if (!task) {
      this.isProcessing = false;
      return;
    }

    try {
      // Use setTimeout to run on next tick, allowing UI to render
      const result = await new Promise<string>((resolve, reject) => {
        setTimeout(async () => {
          try {
            const processedUri = await this.executeTask(task);
            resolve(processedUri);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });

      task.resolve(result);
    } catch (error) {
      task.reject(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      this.isProcessing = false;
      // Process next task
      this.processQueue();
    }
  }

  /**
   * Execute a single task
   */
  private async executeTask(task: WorkerTask): Promise<string> {
    const startTime = Date.now();

    switch (task.type) {
      case 'remove-background':
        return await this.mediaPipeService.removeBackground(task.imageUri);

      case 'cyberpunk':
      case 'anime':
      case 'sketch':
        return await this.tfliteService.applyStyleTransfer(
          task.imageUri,
          task.type as 'cyberpunk' | 'anime' | 'sketch'
        );

      case 'upscale-2x':
        return await this.tfliteService.upscaleImage(task.imageUri, 2);

      case 'upscale-4x':
        return await this.tfliteService.upscaleImage(task.imageUri, 4);

      case 'none':
      default:
        return task.imageUri;
    }
  }

  /**
   * Cancel a specific task
   */
  cancelTask(taskId: string): boolean {
    const index = this.taskQueue.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      const task = this.taskQueue.splice(index, 1)[0];
      task.reject(new Error('Task cancelled'));
      return true;
    }
    return false;
  }

  /**
   * Clear all pending tasks
   */
  clearQueue(): void {
    this.taskQueue.forEach((task) => {
      task.reject(new Error('Queue cleared'));
    });
    this.taskQueue = [];
    this.isProcessing = false;
  }

  /**
   * Get the current queue length
   */
  getQueueLength(): number {
    return this.taskQueue.length;
  }
}

export default AIWorker;
