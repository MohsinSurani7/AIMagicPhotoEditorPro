/**
 * Global application state management using Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, FilterType, ImageEditResult, AIModelType, DownloadProgress } from '../types';
import { THEME, DEFAULT_ADS_CONFIG } from '../constants';

interface AppStore extends AppState {
  // Actions
  setModelsDownloaded: (downloaded: boolean) => void;
  setDownloadProgress: (modelType: AIModelType, progress: DownloadProgress) => void;
  setCurrentFilter: (filter: FilterType) => void;
  setSelectedImageUri: (uri: string | null) => void;
  setProcessedImageUri: (uri: string | null) => void;
  setProcessing: (isProcessing: boolean) => void;
  addToEditHistory: (result: ImageEditResult) => void;
  clearEditHistory: () => void;
  incrementEditCount: () => void;
  resetEditCount: () => void;
  updateAdsConfig: (config: Partial<AppState['adsConfig']>) => void;
}

const initialDownloadProgress: Record<AIModelType, DownloadProgress> = {
  'selfie-segmentation': {
    modelType: 'selfie-segmentation',
    progress: 0,
    totalBytes: 0,
    downloadedBytes: 0,
    isDownloading: false,
    isComplete: false,
  },
  'style-transfer': {
    modelType: 'style-transfer',
    progress: 0,
    totalBytes: 0,
    downloadedBytes: 0,
    isDownloading: false,
    isComplete: false,
  },
  'esrgan-upscale': {
    modelType: 'esrgan-upscale',
    progress: 0,
    totalBytes: 0,
    downloadedBytes: 0,
    isDownloading: false,
    isComplete: false,
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Initial State
      isModelsDownloaded: false,
      downloadProgress: initialDownloadProgress,
      currentFilter: 'none',
      selectedImageUri: null,
      processedImageUri: null,
      isProcessing: false,
      editHistory: [],
      adsConfig: DEFAULT_ADS_CONFIG,
      editCount: 0,

      // Actions
      setModelsDownloaded: (downloaded) => set({ isModelsDownloaded: downloaded }),

      setDownloadProgress: (modelType, progress) =>
        set((state) => ({
          downloadProgress: {
            ...state.downloadProgress,
            [modelType]: progress,
          },
        })),

      setCurrentFilter: (filter) => set({ currentFilter: filter }),

      setSelectedImageUri: (uri) => set({ selectedImageUri: uri }),

      setProcessedImageUri: (uri) => set({ processedImageUri: uri }),

      setProcessing: (isProcessing) => set({ isProcessing }),

      addToEditHistory: (result) =>
        set((state) => ({
          editHistory: [result, ...state.editHistory].slice(0, 50), // Keep last 50 edits
        })),

      clearEditHistory: () => set({ editHistory: [] }),

      incrementEditCount: () => set((state) => ({ editCount: state.editCount + 1 })),

      resetEditCount: () => set({ editCount: 0 }),

      updateAdsConfig: (config) =>
        set((state) => ({
          adsConfig: { ...state.adsConfig, ...config },
        })),
    }),
    {
      name: 'ai-magic-photo-editor-storage',
      partialize: (state) => ({
        isModelsDownloaded: state.isModelsDownloaded,
        editHistory: state.editHistory,
        adsConfig: state.adsConfig,
        editCount: state.editCount,
      }),
    }
  )
);
