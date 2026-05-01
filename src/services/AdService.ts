/**
 * AdMob Ad Service
 * Handles App Open, Rewarded, and Interstitial ads
 */

import mobileAds, {
  MaxAdContentRating,
  RewardedAd,
  RewardedAdEventType,
  InterstitialAd,
  AdEventType,
  AppOpenAd,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import { useAppStore } from '../stores/useAppStore';

class AdService {
  private static instance: AdService;
  private appOpenAd: AppOpenAd | null = null;
  private rewardedAd: RewardedAd | null = null;
  private interstitialAd: InterstitialAd | null = null;
  private isRewardedAdLoaded = false;
  private isInterstitialAdLoaded = false;
  private rewardedAdCallback: ((rewarded: boolean) => void) | null = null;

  private constructor() {}

  static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }

  /**
   * Initialize AdMob SDK
   */
  async initialize(): Promise<void> {
    try {
      await mobileAds().setRequestConfiguration({
        // Configure for test mode during development
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
      });

      await mobileAds().initialize();
      console.log('AdMob initialized successfully');
      
      // Preload ads
      this.loadAppOpenAd();
      this.loadRewardedAd();
      this.loadInterstitialAd();
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  }

  /**
   * Load App Open Ad
   */
  private loadAppOpenAd(): void {
    const { adsConfig } = useAppStore.getState();
    
    this.appOpenAd = AppOpenAd.createForAdRequest(adsConfig.appOpenAdUnitId, {
      requestNonPersonalizedAdsOnly: true,
      keywords: ['photography', 'editing', 'ai'],
    });

    this.appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log('App Open Ad loaded');
    });

    this.appOpenAd.load();
  }

  /**
   * Show App Open Ad
   */
  showAppOpenAd(): void {
    if (this.appOpenAd?.loaded) {
      this.appOpenAd.show();
    }
    // Reload for next time
    this.loadAppOpenAd();
  }

  /**
   * Load Rewarded Ad
   */
  private loadRewardedAd(): void {
    const { adsConfig } = useAppStore.getState();
    
    this.rewardedAd = RewardedAd.createForAdRequest(adsConfig.rewardedAdUnitId, {
      requestNonPersonalizedAdsOnly: true,
      keywords: ['photography', 'editing', 'ai'],
    });

    this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      this.isRewardedAdLoaded = true;
      console.log('Rewarded Ad loaded');
    });

    this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log('User earned reward:', reward);
      this.rewardedAdCallback?.(true);
      this.rewardedAdCallback = null;
    });

    this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      this.isRewardedAdLoaded = false;
      // Reload for next time
      this.loadRewardedAd();
      if (this.rewardedAdCallback) {
        this.rewardedAdCallback(false);
        this.rewardedAdCallback = null;
      }
    });

    this.rewardedAd.load();
  }

  /**
   * Show Rewarded Ad
   * Returns true if user watched the full ad and earned reward
   */
  async showRewardedAd(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.isRewardedAdLoaded || !this.rewardedAd) {
        console.log('Rewarded ad not loaded, allowing action without ad');
        resolve(true);
        return;
      }

      this.rewardedAdCallback = resolve;
      this.rewardedAd?.show();
    });
  }

  /**
   * Load Interstitial Ad
   */
  private loadInterstitialAd(): void {
    const { adsConfig } = useAppStore.getState();
    
    this.interstitialAd = InterstitialAd.createForAdRequest(
      adsConfig.interstitialAdUnitId,
      {
        requestNonPersonalizedAdsOnly: true,
        keywords: ['photography', 'editing', 'ai'],
      }
    );

    this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      this.isInterstitialAdLoaded = true;
      console.log('Interstitial Ad loaded');
    });

    this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      this.isInterstitialAdLoaded = false;
      // Reload for next time
      this.loadInterstitialAd();
    });

    this.interstitialAd.load();
  }

  /**
   * Show Interstitial Ad
   */
  showInterstitialAd(): void {
    if (this.isInterstitialAdLoaded && this.interstitialAd) {
      this.interstitialAd.show();
    }
  }

  /**
   * Check if interstitial should be shown based on edit count
   */
  shouldShowInterstitial(): boolean {
    const { editCount } = useAppStore.getState();
    const { INTERSTITIAL_AD_FREQUENCY } = require('../constants');
    return editCount > 0 && editCount % INTERSTITIAL_AD_FREQUENCY === 0;
  }
}

export default AdService;
