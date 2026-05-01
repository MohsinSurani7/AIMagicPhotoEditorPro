/**
 * TFLite Service (Stub - TFLite not available)
 */

class TFLiteService {
  private static instance: TFLiteService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): TFLiteService {
    if (!TFLiteService.instance) {
      TFLiteService.instance = new TFLiteService();
    }
    return TFLiteService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    this.isInitialized = true;
    console.log('TFLite stub initialized');
  }

  async applyStyleTransfer(
    imageUri: string,
    style: 'cyberpunk' | 'anime' | 'sketch'
  ): Promise<string> {
    // Stub implementation - returns original image
    return imageUri;
  }

  async upscaleImage(imageUri: string, scale: 2 | 4): Promise<string> {
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

export default TFLiteService;
