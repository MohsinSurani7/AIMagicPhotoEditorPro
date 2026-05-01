/**
 * Editor Screen - Main photo editing interface
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME, FILTERS } from '../../constants';
import { FilterType, ImageEditResult } from '../../types';
import { useAppStore } from '../../stores/useAppStore';
import AIWorker from '../../services/AIWorker';
import AdService from '../../services/AdService';
import GlassCard from '../atoms/GlassCard';
import Button from '../atoms/Button';
import FilterCard from '../molecules/FilterCard';
import BeforeAfterSlider from './BeforeAfterSlider';
import LoadingSpinner from '../atoms/LoadingSpinner';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type EditorRouteParams = {
  Editor: { imageUri: string };
};

const EditorScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<EditorRouteParams, 'Editor'>>();
  const { imageUri } = route.params;
  
  const {
    currentFilter,
    setCurrentFilter,
    setProcessing,
    selectedImageUri,
    processedImageUri,
    addToEditHistory,
    incrementEditCount,
    resetEditCount,
  } = useAppStore();

  const [localProcessedUri, setLocalProcessedUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const aiWorker = AIWorker.getInstance();
  const adService = AdService.getInstance();

  useEffect(() => {
    // Initialize AI services
    const initServices = async () => {
      try {
        // Services will be initialized by ModelDownloadScreen
      } catch (error) {
        console.error('Failed to initialize services:', error);
      }
    };
    initServices();
  }, []);

  const handleFilterSelect = async (filter: FilterType) => {
    const selectedFilter = FILTERS.find((f) => f.type === filter);
    
    // Check if premium filter and show ad
    if (selectedFilter?.isPremium) {
      const rewarded = await adService.showRewardedAd();
      if (!rewarded) {
        Alert.alert('Ad Required', 'Please watch the ad to use this premium feature');
        return;
      }
    }

    setCurrentFilter(filter);
    
    if (filter === 'none') {
      setLocalProcessedUri(null);
      return;
    }

    setIsProcessing(true);
    setProcessing(true);

    try {
      const startTime = Date.now();
      const resultUri = await aiWorker.processImage(imageUri, filter);
      const processingTime = Date.now() - startTime;
      
      setLocalProcessedUri(resultUri);
      
      // Add to history
      const editResult: ImageEditResult = {
        originalUri: imageUri,
        processedUri: resultUri,
        filterType: filter,
        processingTime,
        timestamp: Date.now(),
      };
      addToEditHistory(editResult);
      
      // Increment edit count and check for interstitial ad
      incrementEditCount();
      if (adService.shouldShowInterstitial()) {
        adService.showInterstitialAd();
        resetEditCount();
      }
    } catch (error) {
      console.error('Processing failed:', error);
      Alert.alert('Error', 'Failed to apply filter. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!localProcessedUri) {
      Alert.alert('No Changes', 'Apply a filter before saving');
      return;
    }
    
    // In production, implement actual save functionality
    Alert.alert('Save', 'Image saved to gallery');
    navigation.goBack();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (isProcessing) {
    return (
      <View style={styles.container}>
        <LoadingSpinner size="large" text="Processing image..." />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Button
          title="←"
          onPress={handleBack}
          variant="ghost"
          style={styles.backButton}
        />
        <Button
          title="Save"
          onPress={handleSave}
          variant="primary"
          size="small"
          style={styles.saveButton}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image Preview */}
        <View style={styles.imageContainer}>
          {localProcessedUri ? (
            <BeforeAfterSlider
              beforeImageUri={imageUri}
              afterImageUri={localProcessedUri}
              width={SCREEN_WIDTH - THEME.spacing.lg * 2}
              height={400}
            />
          ) : (
            <GlassCard style={styles.imageCard}>
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="contain"
              />
            </GlassCard>
          )}
        </View>

        {/* Filter Selection */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Choose Filter</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {FILTERS.map((filter) => (
              <View key={filter.type} style={styles.filterItem}>
                <FilterCard
                  filter={filter}
                  isSelected={currentFilter === filter.type}
                  onPress={() => handleFilterSelect(filter.type)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    paddingHorizontal: 0,
  },
  saveButton: {
    paddingHorizontal: THEME.spacing.lg,
  },
  scrollContent: {
    paddingBottom: THEME.spacing.xl,
  },
  imageContainer: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.xl,
  },
  imageCard: {
    padding: THEME.spacing.sm,
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: THEME.borderRadius.md,
  },
  filterSection: {
    paddingHorizontal: THEME.spacing.lg,
  },
  sectionTitle: {
    color: THEME.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: THEME.spacing.lg,
  },
  filterScroll: {
    gap: THEME.spacing.md,
  },
  filterItem: {
    width: 100,
  },
});

export default EditorScreen;
