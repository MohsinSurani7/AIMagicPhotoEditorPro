/**
 * Home Screen - Main landing screen
 */

import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'react-native-image-picker';
import { THEME } from '../../constants';
import { useAppStore } from '../../stores/useAppStore';
import AdService from '../../services/AdService';
import GlassCard from '../atoms/GlassCard';
import Button from '../atoms/Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isModelsDownloaded, editHistory } = useAppStore();

  useEffect(() => {
    // Initialize AdMob and show app open ad
    const initAds = async () => {
      const adService = AdService.getInstance();
      await adService.initialize();
      adService.showAppOpenAd();
    };
    initAds();
  }, []);

  const handleCameraPress = () => {
    // @ts-ignore
    navigation.navigate('Camera');
  };

  const handleGalleryPress = async () => {
    const options = {
      mediaType: 'photo' as const,
      quality: 1,
      selectionLimit: 1,
    };

    try {
      const result = await ImagePicker.launchImageLibrary(options);
      
      if (result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;
        // @ts-ignore
        navigation.navigate('Editor', { imageUri: uri });
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  const handleHistoryPress = (item: any) => {
    // @ts-ignore
    navigation.navigate('Editor', { imageUri: item.originalUri });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AI Magic Photo Editor</Text>
        <Text style={styles.subtitle}>Transform your photos with AI</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={handleCameraPress}
            style={styles.actionCard}
            activeOpacity={0.8}
          >
            <GlassCard style={styles.actionGlass}>
              <View style={styles.actionIcon}>
                <Text style={styles.iconEmoji}>📷</Text>
              </View>
              <Text style={styles.actionTitle}>Take Photo</Text>
              <Text style={styles.actionSubtitle}>Capture with camera</Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGalleryPress}
            style={styles.actionCard}
            activeOpacity={0.8}
          >
            <GlassCard style={styles.actionGlass}>
              <View style={styles.actionIcon}>
                <Text style={styles.iconEmoji}>🖼️</Text>
              </View>
              <Text style={styles.actionTitle}>From Gallery</Text>
              <Text style={styles.actionSubtitle}>Pick from library</Text>
            </GlassCard>
          </TouchableOpacity>
        </View>

        {/* Recent Edits */}
        {editHistory.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Recent Edits</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.historyScroll}
            >
              {editHistory.slice(0, 10).map((item, index) => (
                <TouchableOpacity
                  key={`${item.timestamp}-${index}`}
                  onPress={() => handleHistoryPress(item)}
                  style={styles.historyItem}
                  activeOpacity={0.8}
                >
                  <GlassCard style={styles.historyCard}>
                    <Image
                      source={{ uri: item.processedUri }}
                      style={styles.historyImage}
                      resizeMode="cover"
                    />
                  </GlassCard>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>AI Features</Text>
          <View style={styles.featuresGrid}>
            <GlassCard style={styles.featureCard}>
              <Text style={styles.featureIcon}>✂️</Text>
              <Text style={styles.featureTitle}>Remove BG</Text>
              <Text style={styles.featureDesc}>Background removal</Text>
            </GlassCard>
            <GlassCard style={styles.featureCard}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureTitle}>Cyberpunk</Text>
              <Text style={styles.featureDesc}>Neon style transfer</Text>
            </GlassCard>
            <GlassCard style={styles.featureCard}>
              <Text style={styles.featureIcon}>✨</Text>
              <Text style={styles.featureTitle}>Anime</Text>
              <Text style={styles.featureDesc}>Anime style filter</Text>
            </GlassCard>
            <GlassCard style={styles.featureCard}>
              <Text style={styles.featureIcon}>🔍</Text>
              <Text style={styles.featureTitle}>Upscale</Text>
              <Text style={styles.featureDesc}>Enhance resolution</Text>
            </GlassCard>
          </View>
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
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.xl,
  },
  title: {
    color: THEME.colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: THEME.spacing.xs,
  },
  subtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: THEME.spacing.xl,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.xl,
    gap: THEME.spacing.md,
  },
  actionCard: {
    flex: 1,
  },
  actionGlass: {
    padding: THEME.spacing.lg,
    alignItems: 'center',
    minHeight: 160,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  iconEmoji: {
    fontSize: 32,
  },
  actionTitle: {
    color: THEME.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: THEME.spacing.xs,
  },
  actionSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  historySection: {
    marginBottom: THEME.spacing.xl,
  },
  sectionTitle: {
    color: THEME.colors.text,
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  historyScroll: {
    paddingHorizontal: THEME.spacing.lg,
    gap: THEME.spacing.md,
  },
  historyItem: {
    width: 120,
  },
  historyCard: {
    padding: THEME.spacing.sm,
  },
  historyImage: {
    width: 100,
    height: 100,
    borderRadius: THEME.borderRadius.md,
  },
  featuresSection: {
    paddingHorizontal: THEME.spacing.lg,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.md,
  },
  featureCard: {
    width: (SCREEN_WIDTH - THEME.spacing.lg * 2 - THEME.spacing.md) / 2,
    padding: THEME.spacing.lg,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: THEME.spacing.sm,
  },
  featureTitle: {
    color: THEME.colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: THEME.spacing.xs,
  },
  featureDesc: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default HomeScreen;
