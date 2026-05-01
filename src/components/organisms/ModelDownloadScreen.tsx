/**
 * Model Download Screen
 * Shows download progress for AI models on first launch
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../../constants';
import { AIModelType, DownloadProgress } from '../../types';
import { useAppStore } from '../../stores/useAppStore';
import AssetDownloader from '../../services/AssetDownloader';
import ProgressBar from '../atoms/ProgressBar';
import GlassCard from '../atoms/GlassCard';
import Button from '../atoms/Button';
import LoadingSpinner from '../atoms/LoadingSpinner';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ModelDownloadScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isModelsDownloaded, downloadProgress, setModelsDownloaded } = useAppStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentModel, setCurrentModel] = useState<AIModelType | null>(null);

  useEffect(() => {
    if (isModelsDownloaded) {
      // @ts-ignore
      navigation.replace('Home');
    }
  }, [isModelsDownloaded, navigation]);

  const startDownload = async () => {
    setIsDownloading(true);
    const downloader = AssetDownloader.getInstance();

    try {
      await downloader.downloadAllModels((modelType, progress) => {
        setCurrentModel(modelType);
      });
      setModelsDownloaded(true);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
      setCurrentModel(null);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getModelName = (type: AIModelType): string => {
    switch (type) {
      case 'selfie-segmentation':
        return 'Background Removal';
      case 'style-transfer':
        return 'Style Transfer';
      case 'esrgan-upscale':
        return 'Image Upscaler';
      default:
        return type;
    }
  };

  if (isDownloading) {
    const progress = currentModel ? downloadProgress[currentModel] : null;
    
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <LoadingSpinner
            size="large"
            text={`Downloading ${getModelName(currentModel || 'selfie-segmentation')}...`}
          />
          {progress && (
            <GlassCard style={styles.progressCard}>
              <Text style={styles.progressTitle}>
                {getModelName(progress.modelType)}
              </Text>
              <ProgressBar
                progress={progress.progress}
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {formatBytes(progress.downloadedBytes)} / {formatBytes(progress.totalBytes)}
              </Text>
            </GlassCard>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Download AI Models</Text>
          <Text style={styles.subtitle}>
            Download required AI models to enable advanced photo editing features.
            This is a one-time download (~120MB).
          </Text>
        </View>

        <View style={styles.modelsList}>
          {Object.entries(downloadProgress).map(([key, progress]) => (
            <GlassCard key={key} style={styles.modelCard}>
              <View style={styles.modelHeader}>
                <Text style={styles.modelName}>
                  {getModelName(key as AIModelType)}
                </Text>
                <Text style={styles.modelSize}>
                  {formatBytes(progress.totalBytes)}
                </Text>
              </View>
              <ProgressBar
                progress={progress.isComplete ? 100 : 0}
                style={styles.progressBar}
              />
              {progress.error && (
                <Text style={styles.errorText}>{progress.error}</Text>
              )}
            </GlassCard>
          ))}
        </View>

        <Button
          title="Start Download"
          onPress={startDownload}
          style={styles.downloadButton}
          size="large"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xl,
  },
  scrollContent: {
    padding: THEME.spacing.xl,
    paddingTop: SCREEN_WIDTH * 0.2,
  },
  header: {
    marginBottom: THEME.spacing.xl,
  },
  title: {
    color: THEME.colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: THEME.spacing.md,
  },
  subtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  modelsList: {
    marginBottom: THEME.spacing.xl,
    gap: THEME.spacing.md,
  },
  modelCard: {
    padding: THEME.spacing.lg,
  },
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  modelName: {
    color: THEME.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  modelSize: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
  },
  progressBar: {
    marginTop: THEME.spacing.sm,
  },
  progressCard: {
    width: '100%',
    marginTop: THEME.spacing.lg,
  },
  progressTitle: {
    color: THEME.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: THEME.spacing.md,
  },
  progressText: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
    marginTop: THEME.spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    color: THEME.colors.error,
    fontSize: 14,
    marginTop: THEME.spacing.sm,
  },
  downloadButton: {
    marginTop: THEME.spacing.lg,
  },
});

export default ModelDownloadScreen;
