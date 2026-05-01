/**
 * MediaPipe Service (Stub - MediaPipe not available)
 */

class MediaPipeService {
  private static instance: MediaPipeService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): MediaPipeService {
    if (!MediaPipeService.instance) {
      MediaPipeService.instance = new MediaPipeService();
    }
    return MediaPipeService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    this.isInitialized = true;
    console.log('MediaPipe stub initialized');
  }

  async removeBackground(imageUri: string): Promise<string> {
    // Stub implementation - returns original image
    return imageUri;
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  async dispose(): Promise<void> {
    this.isInitialized = false;
  }
}

export default MediaPipeService;
