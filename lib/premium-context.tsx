/**
 * Premium Context
 * Manages free vs premium feature access
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREMIUM_KEY = '@harmonia_premium_status';

interface PremiumFeatures {
  // Sound features
  fullFrequencyRange: boolean;
  allNoiseColors: boolean;
  unlimitedPresets: boolean;
  unlimitedSessionDuration: boolean;
  isochronicTones: boolean;
  fullOmChanting: boolean;
  ambientAmplifier: boolean;
  
  // Security features
  securityCameras: boolean;
  maxCameras: number;
  recording: boolean;
  motionDetection: boolean;
  
  // Connectivity
  bluetoothRouting: boolean;
  
  // Quality
  highQualityAudio: boolean;
  
  // Social
  cloudSync: boolean;
  presetSharing: boolean;
  
  // Experience
  noAds: boolean;
  prioritySupport: boolean;
}

const FREE_FEATURES: PremiumFeatures = {
  fullFrequencyRange: false,
  allNoiseColors: false,
  unlimitedPresets: false,
  unlimitedSessionDuration: false,
  isochronicTones: false,
  fullOmChanting: false,
  ambientAmplifier: false,
  securityCameras: false,
  maxCameras: 0,
  recording: false,
  motionDetection: false,
  bluetoothRouting: false,
  highQualityAudio: false,
  cloudSync: false,
  presetSharing: false,
  noAds: false,
  prioritySupport: false,
};

const PREMIUM_FEATURES: PremiumFeatures = {
  fullFrequencyRange: true,
  allNoiseColors: true,
  unlimitedPresets: true,
  unlimitedSessionDuration: true,
  isochronicTones: true,
  fullOmChanting: true,
  ambientAmplifier: true,
  securityCameras: true,
  maxCameras: 8,
  recording: true,
  motionDetection: true,
  bluetoothRouting: true,
  highQualityAudio: true,
  cloudSync: true,
  presetSharing: true,
  noAds: true,
  prioritySupport: true,
};

// Free version limits
export const FREE_LIMITS = {
  maxPresets: 3,
  maxSessionMinutes: 15,
  maxBinauralFreq: 12, // Up to alpha only
  noiseTypes: ['white', 'pink'] as string[],
  omOctaves: 1, // Only mid octave
};

interface PremiumContextType {
  isPremium: boolean;
  features: PremiumFeatures;
  setPremium: (status: boolean) => void;
  checkFeature: (feature: keyof PremiumFeatures) => boolean;
  getLimit: (limit: keyof typeof FREE_LIMITS) => number | string[];
}

const PremiumContext = createContext<PremiumContextType | null>(null);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [features, setFeatures] = useState<PremiumFeatures>(FREE_FEATURES);

  // Load premium status on mount
  useEffect(() => {
    loadPremiumStatus();
  }, []);

  // Update features when premium status changes
  useEffect(() => {
    setFeatures(isPremium ? PREMIUM_FEATURES : FREE_FEATURES);
  }, [isPremium]);

  const loadPremiumStatus = async () => {
    try {
      const status = await AsyncStorage.getItem(PREMIUM_KEY);
      if (status === 'true') {
        setIsPremium(true);
      }
    } catch (error) {
      console.error('Error loading premium status:', error);
    }
  };

  const setPremium = useCallback(async (status: boolean) => {
    try {
      await AsyncStorage.setItem(PREMIUM_KEY, status.toString());
      setIsPremium(status);
    } catch (error) {
      console.error('Error saving premium status:', error);
    }
  }, []);

  const checkFeature = useCallback((feature: keyof PremiumFeatures): boolean => {
    return features[feature] as boolean;
  }, [features]);

  const getLimit = useCallback((limit: keyof typeof FREE_LIMITS) => {
    if (isPremium) {
      // Return unlimited values for premium
      switch (limit) {
        case 'maxPresets':
          return Infinity;
        case 'maxSessionMinutes':
          return Infinity;
        case 'maxBinauralFreq':
          return 100; // Full gamma range
        case 'noiseTypes':
          return ['white', 'pink', 'brown', 'purple', 'blue'];
        case 'omOctaves':
          return 3;
        default:
          return FREE_LIMITS[limit];
      }
    }
    return FREE_LIMITS[limit];
  }, [isPremium]);

  return (
    <PremiumContext.Provider value={{ isPremium, features, setPremium, checkFeature, getLimit }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}

// Premium feature descriptions for upgrade screen
export const PREMIUM_FEATURE_LIST = [
  {
    icon: 'waveform',
    title: 'Full Frequency Range',
    description: 'Access all brainwave states from 0.5 Hz Delta to 100 Hz Gamma',
    free: 'Limited to Alpha (12 Hz)',
  },
  {
    icon: 'speaker.wave.3.fill',
    title: 'All Noise Colors',
    description: 'White, Pink, Brown, Purple, and Blue noise generators',
    free: 'White and Pink only',
  },
  {
    icon: 'dial.min.fill',
    title: 'Isochronic Tones',
    description: 'Powerful brainwave entrainment without headphones',
    free: 'Not available',
  },
  {
    icon: 'leaf.fill',
    title: 'Full OM Chanting',
    description: 'All octave layers with deep cave reverb',
    free: 'Single octave only',
  },
  {
    icon: 'timer',
    title: 'Unlimited Sessions',
    description: 'No time limits on your healing sessions',
    free: '15 minutes max',
  },
  {
    icon: 'bookmark.fill',
    title: 'Unlimited Presets',
    description: 'Save as many custom presets as you want',
    free: '3 presets max',
  },
  {
    icon: 'video.fill',
    title: 'Security Cameras',
    description: 'Monitor up to 8 cameras with recording',
    free: 'Not available',
  },
  {
    icon: 'bluetooth',
    title: 'Bluetooth Routing',
    description: 'Route audio to any Bluetooth device',
    free: 'Not available',
  },
  {
    icon: 'antenna.radiowaves.left.and.right',
    title: 'Ambient Amplifier',
    description: 'Enhance and amplify surrounding sounds',
    free: 'Not available',
  },
  {
    icon: 'sparkle',
    title: 'No Ads',
    description: 'Enjoy an ad-free experience',
    free: 'Ads displayed',
  },
];
