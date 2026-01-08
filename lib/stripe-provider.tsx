import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Stripe provider placeholder (native implementation pending)
// TODO: Add @stripe/stripe-react-native for native platforms
const StripeProviderNative: any = null;

// Stripe publishable key - replace with your actual key
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE';

export type SubscriptionTier = 'free' | 'trial' | 'premium_monthly' | 'premium_annual' | 'ultimate_monthly' | 'ultimate_annual' | 'lifetime';

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt?: Date;
  isTrial?: boolean;
  trialStartDate?: Date;
  trialDaysRemaining?: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year' | 'lifetime';
  features: string[];
  stripePriceId: string;
  popular?: boolean;
  trialDays?: number;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    stripePriceId: '',
    features: [
      'Delta, Theta, Alpha waves',
      '5 preset combinations',
      'Basic white noise',
      '15-minute session limit',
      '5-minute binaural beats',
      '5-minute isochronic tones',
      'Community support',
    ],
  },
  {
    id: 'premium_monthly',
    name: 'Premium',
    price: 9.99,
    interval: 'month',
    stripePriceId: 'price_premium_monthly',
    trialDays: 10,
    popular: true,
    features: [
      '10-day free trial',
      'All Free features',
      'Beta & Gamma waves',
      'Unlimited binaural beats',
      'Unlimited isochronic tones',
      'All noise colors',
      'OM chanting',
      'Unlimited sessions',
      'Unlimited presets',
      'Background playback',
      'Bluetooth audio routing',
      'No ads',
      'Priority support',
    ],
  },
  {
    id: 'premium_annual',
    name: 'Premium Annual',
    price: 79.99,
    interval: 'year',
    stripePriceId: 'price_premium_annual',
    trialDays: 10,
    features: [
      '10-day free trial',
      'All Premium features',
      'Save 33% ($6.66/month)',
      'Annual billing',
    ],
  },
  {
    id: 'ultimate_monthly',
    name: 'Ultimate',
    price: 19.99,
    interval: 'month',
    stripePriceId: 'price_ultimate_monthly',
    trialDays: 10,
    features: [
      '10-day free trial',
      'All Premium features',
      'Guided astral projection',
      'Vibrational stage techniques',
      'Advanced meditation library',
      'Security camera integration',
      'Motion detection',
      'Recording & playback',
      'Bluetooth management',
      'Advanced analytics',
      'API access',
      'Dedicated support',
    ],
  },
  {
    id: 'ultimate_annual',
    name: 'Ultimate Annual',
    price: 149.99,
    interval: 'year',
    stripePriceId: 'price_ultimate_annual',
    trialDays: 10,
    features: [
      '10-day free trial',
      'All Ultimate features',
      'Save 37% ($12.50/month)',
      'Annual billing',
    ],
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: 49.99,
    interval: 'lifetime',
    stripePriceId: 'price_lifetime',
    features: [
      'All Premium features',
      'Pay once, own forever',
      'Lifetime updates',
      'Priority support',
      'Best value!',
    ],
  },
];

export interface InAppPurchase {
  id: string;
  name: string;
  price: number;
  description: string;
  stripePriceId: string;
  features: string[];
  category?: 'sound' | 'meditation' | 'astrology' | 'addon';
}

export const IN_APP_PURCHASES: InAppPurchase[] = [
  // Sound Packs
  {
    id: 'gamma_pack',
    name: 'Gamma Wave Pack',
    price: 2.99,
    stripePriceId: 'price_gamma_pack',
    description: 'Unlock Gamma frequencies for peak performance',
    features: ['Gamma waves (30-100 Hz)', 'Focus & concentration', 'Peak performance'],
    category: 'sound',
  },
  {
    id: 'isochronic',
    name: 'Isochronic Tones',
    price: 3.99,
    stripePriceId: 'price_isochronic',
    description: 'Advanced brainwave entrainment',
    features: ['Full isochronic generator', 'All frequencies', 'Custom patterns'],
    category: 'sound',
  },
  {
    id: 'om_chanting',
    name: 'OM Chanting',
    price: 4.99,
    stripePriceId: 'price_om_chanting',
    description: 'Sacred OM with harmonics and cave reverb',
    features: ['136.1 Hz Cosmic OM', 'Harmonics', 'Cave reverb effect'],
    category: 'sound',
  },
  {
    id: 'noise_pack',
    name: 'Noise Color Pack',
    price: 2.99,
    stripePriceId: 'price_noise_pack',
    description: 'Pink, brown, purple, and blue noise',
    features: ['Pink noise', 'Brown noise', 'Purple noise', 'Blue noise'],
    category: 'sound',
  },
  {
    id: 'preset_bundle',
    name: 'Preset Bundle',
    price: 1.99,
    stripePriceId: 'price_preset_bundle',
    description: '20 expert-curated healing presets',
    features: ['20 presets', 'Expert-curated', 'Instant access'],
    category: 'sound',
  },
  
  // Meditation & Guidance
  {
    id: 'astral_projection_guide',
    name: 'Astral Projection Meditation Pack',
    price: 9.99,
    stripePriceId: 'price_astral_projection',
    description: 'Complete guided meditations for astral projection',
    features: ['10 guided meditations', 'Vibrational stage techniques', 'Step-by-step instructions', 'Beginner to advanced'],
    category: 'meditation',
  },
  {
    id: 'vibrational_techniques',
    name: 'Vibrational Stage Techniques',
    price: 6.99,
    stripePriceId: 'price_vibrational_techniques',
    description: 'Master the vibrational stage for OBE',
    features: ['Rope technique', 'Roll-out method', 'Visualization exercises', 'Progress tracking'],
    category: 'meditation',
  },
  
  // Astrological Features
  {
    id: 'human_design',
    name: 'Human Design Chart',
    price: 4.99,
    stripePriceId: 'price_human_design',
    description: 'Your complete Human Design chart as background banner',
    features: ['Personalized chart', 'Custom banner', 'Type & strategy', 'One-time purchase'],
    category: 'astrology',
  },
  {
    id: 'natal_chart',
    name: 'Natal Chart',
    price: 4.99,
    stripePriceId: 'price_natal_chart',
    description: 'Your birth chart as a beautiful background banner',
    features: ['Full natal chart', 'Custom banner', 'Planet positions', 'One-time purchase'],
    category: 'astrology',
  },
  {
    id: 'zodiac_sign',
    name: 'Zodiac Sign Banner',
    price: 2.99,
    stripePriceId: 'price_zodiac_sign',
    description: 'Your zodiac sign as animated background',
    features: ['12 zodiac signs', 'Animated banner', 'Custom colors', 'One-time purchase'],
    category: 'astrology',
  },
  {
    id: 'chinese_zodiac',
    name: 'Chinese Zodiac Banner',
    price: 2.99,
    stripePriceId: 'price_chinese_zodiac',
    description: 'Your Chinese zodiac animal as background',
    features: ['12 zodiac animals', 'Animated banner', 'Traditional art', 'One-time purchase'],
    category: 'astrology',
  },
  
  // Add-ons
  {
    id: 'security_addon',
    name: 'Security Add-on',
    price: 9.99,
    stripePriceId: 'price_security_addon',
    description: 'Home security camera integration',
    features: ['Camera monitoring', 'Motion detection', 'Recording'],
    category: 'addon',
  },
  {
    id: 'remove_ads',
    name: 'Remove Ads',
    price: 4.99,
    stripePriceId: 'price_remove_ads',
    description: 'Permanent ad removal',
    features: ['No ads forever', 'Clean interface', 'Better experience'],
    category: 'addon',
  },
];

interface StripeContextType {
  subscription: SubscriptionStatus;
  purchasedItems: string[];
  hasFeature: (feature: string) => boolean;
  subscribe: (planId: string) => Promise<boolean>;
  purchase: (itemId: string) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  startFreeTrial: () => Promise<boolean>;
  getTrialDaysRemaining: () => number;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export function StripeProviderWrapper({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    tier: 'free',
    isActive: false,
  });
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  useEffect(() => {
    loadSubscriptionStatus();
    loadPurchasedItems();
    checkTrialExpiration();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      const saved = await AsyncStorage.getItem('subscription_status');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSubscription({
          ...parsed,
          expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : undefined,
          trialStartDate: parsed.trialStartDate ? new Date(parsed.trialStartDate) : undefined,
        });
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    }
  };

  const loadPurchasedItems = async () => {
    try {
      const saved = await AsyncStorage.getItem('purchased_items');
      if (saved) {
        setPurchasedItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load purchases:', error);
    }
  };

  const checkTrialExpiration = async () => {
    const saved = await AsyncStorage.getItem('subscription_status');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.isTrial && parsed.trialStartDate) {
        const trialStart = new Date(parsed.trialStartDate);
        const now = new Date();
        const daysPassed = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysPassed >= 10) {
          // Trial expired, revert to free
          const newSubscription: SubscriptionStatus = {
            tier: 'free',
            isActive: false,
          };
          await AsyncStorage.setItem('subscription_status', JSON.stringify(newSubscription));
          setSubscription(newSubscription);
        } else {
          // Update days remaining
          setSubscription({
            ...parsed,
            trialDaysRemaining: 10 - daysPassed,
            trialStartDate: trialStart,
          });
        }
      }
    }
  };

  const getTrialDaysRemaining = (): number => {
    if (!subscription.isTrial || !subscription.trialStartDate) return 0;
    
    const now = new Date();
    const daysPassed = Math.floor((now.getTime() - subscription.trialStartDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 10 - daysPassed);
  };

  const startFreeTrial = async (): Promise<boolean> => {
    try {
      const newSubscription: SubscriptionStatus = {
        tier: 'trial',
        isActive: true,
        isTrial: true,
        trialStartDate: new Date(),
        trialDaysRemaining: 10,
      };

      await AsyncStorage.setItem('subscription_status', JSON.stringify(newSubscription));
      setSubscription(newSubscription);
      return true;
    } catch (error) {
      console.error('Failed to start trial:', error);
      return false;
    }
  };

  const hasFeature = (feature: string): boolean => {
    // Free tier features
    const freeFeatures = ['delta', 'theta', 'alpha', 'white_noise', 'basic_presets'];
    
    // Premium tier features (includes trial)
    const premiumFeatures = [
      ...freeFeatures,
      'beta',
      'gamma',
      'isochronic',
      'om_chanting',
      'all_noise_colors',
      'unlimited_sessions',
      'unlimited_presets',
      'background_playback',
      'bluetooth',
      'no_ads',
    ];
    
    // Ultimate tier features
    const ultimateFeatures = [
      ...premiumFeatures,
      'astral_projection',
      'vibrational_techniques',
      'advanced_meditations',
      'security_cameras',
      'bluetooth_management',
      'advanced_analytics',
      'api_access',
    ];

    // Check subscription tier
    if (subscription.tier === 'ultimate_monthly' || subscription.tier === 'ultimate_annual') {
      return ultimateFeatures.includes(feature);
    }
    
    if (subscription.tier === 'premium_monthly' || subscription.tier === 'premium_annual' || subscription.tier === 'lifetime' || subscription.tier === 'trial') {
      return premiumFeatures.includes(feature);
    }

    // Check individual purchases
    if (purchasedItems.includes('gamma_pack') && feature === 'gamma') return true;
    if (purchasedItems.includes('isochronic') && feature === 'isochronic') return true;
    if (purchasedItems.includes('om_chanting') && feature === 'om_chanting') return true;
    if (purchasedItems.includes('noise_pack') && feature === 'all_noise_colors') return true;
    if (purchasedItems.includes('astral_projection_guide') && feature === 'astral_projection') return true;
    if (purchasedItems.includes('vibrational_techniques') && feature === 'vibrational_techniques') return true;
    if (purchasedItems.includes('security_addon') && feature === 'security_cameras') return true;
    if (purchasedItems.includes('remove_ads') && feature === 'no_ads') return true;

    // Astrological features
    if (purchasedItems.includes('human_design') && feature === 'human_design') return true;
    if (purchasedItems.includes('natal_chart') && feature === 'natal_chart') return true;
    if (purchasedItems.includes('zodiac_sign') && feature === 'zodiac_sign') return true;
    if (purchasedItems.includes('chinese_zodiac') && feature === 'chinese_zodiac') return true;

    // Default to free tier
    return freeFeatures.includes(feature);
  };

  const subscribe = async (planId: string): Promise<boolean> => {
    try {
      // TODO: Implement actual Stripe payment flow
      // For now, simulate successful subscription
      const plan = PRICING_PLANS.find(p => p.id === planId);
      const newSubscription: SubscriptionStatus = {
        tier: planId as SubscriptionTier,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isTrial: plan?.trialDays ? true : false,
        trialStartDate: plan?.trialDays ? new Date() : undefined,
        trialDaysRemaining: plan?.trialDays || 0,
      };

      await AsyncStorage.setItem('subscription_status', JSON.stringify(newSubscription));
      setSubscription(newSubscription);
      return true;
    } catch (error) {
      console.error('Subscription failed:', error);
      return false;
    }
  };

  const purchase = async (itemId: string): Promise<boolean> => {
    try {
      // TODO: Implement actual Stripe payment flow
      // For now, simulate successful purchase
      const updated = [...purchasedItems, itemId];
      await AsyncStorage.setItem('purchased_items', JSON.stringify(updated));
      setPurchasedItems(updated);
      return true;
    } catch (error) {
      console.error('Purchase failed:', error);
      return false;
    }
  };

  const cancelSubscription = async (): Promise<boolean> => {
    try {
      // TODO: Implement actual Stripe cancellation
      const newSubscription: SubscriptionStatus = {
        tier: 'free',
        isActive: false,
      };

      await AsyncStorage.setItem('subscription_status', JSON.stringify(newSubscription));
      setSubscription(newSubscription);
      return true;
    } catch (error) {
      console.error('Cancellation failed:', error);
      return false;
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      // TODO: Implement actual restore from Stripe
      await loadSubscriptionStatus();
      await loadPurchasedItems();
      return true;
    } catch (error) {
      console.error('Restore failed:', error);
      return false;
    }
  };

  const contextValue = {
    subscription,
    purchasedItems,
    hasFeature,
    subscribe,
    purchase,
    cancelSubscription,
    restorePurchases,
    startFreeTrial,
    getTrialDaysRemaining,
  };

  // Stripe native wrapper not available yet
  // TODO: Wrap with StripeProviderNative when package is added
  return (
    <StripeContext.Provider value={contextValue}>
      {children}
    </StripeContext.Provider>
  );
}

export function useStripe() {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within StripeProviderWrapper');
  }
  return context;
}
