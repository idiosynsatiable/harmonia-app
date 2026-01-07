import React, { createContext, useContext, useState, useEffect } from 'react';
import { StripeProvider as StripeProviderNative } from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Stripe publishable key - replace with your actual key
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE';

export type SubscriptionTier = 'free' | 'premium_monthly' | 'premium_annual' | 'ultimate_monthly' | 'ultimate_annual' | 'lifetime';

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt?: Date;
  isTrial?: boolean;
  trialEndsAt?: Date;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year' | 'lifetime';
  features: string[];
  stripePriceId: string;
  popular?: boolean;
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
      '10-minute session limit',
      'Community support',
    ],
  },
  {
    id: 'premium_monthly',
    name: 'Premium',
    price: 9.99,
    interval: 'month',
    stripePriceId: 'price_premium_monthly',
    popular: true,
    features: [
      'All Free features',
      'Beta & Gamma waves',
      'Isochronic tones',
      'All noise colors',
      'OM chanting',
      'Unlimited sessions',
      'Unlimited presets',
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
    features: [
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
    features: [
      'All Premium features',
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
    features: [
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
}

export const IN_APP_PURCHASES: InAppPurchase[] = [
  {
    id: 'gamma_pack',
    name: 'Gamma Wave Pack',
    price: 2.99,
    stripePriceId: 'price_gamma_pack',
    description: 'Unlock Gamma frequencies for peak performance',
    features: ['Gamma waves (30-100 Hz)', 'Focus & concentration', 'Peak performance'],
  },
  {
    id: 'isochronic',
    name: 'Isochronic Tones',
    price: 3.99,
    stripePriceId: 'price_isochronic',
    description: 'Advanced brainwave entrainment',
    features: ['Full isochronic generator', 'All frequencies', 'Custom patterns'],
  },
  {
    id: 'om_chanting',
    name: 'OM Chanting',
    price: 4.99,
    stripePriceId: 'price_om_chanting',
    description: 'Sacred OM with harmonics and cave reverb',
    features: ['136.1 Hz Cosmic OM', 'Harmonics', 'Cave reverb effect'],
  },
  {
    id: 'noise_pack',
    name: 'Noise Color Pack',
    price: 2.99,
    stripePriceId: 'price_noise_pack',
    description: 'Pink, brown, purple, and blue noise',
    features: ['Pink noise', 'Brown noise', 'Purple noise', 'Blue noise'],
  },
  {
    id: 'preset_bundle',
    name: 'Preset Bundle',
    price: 1.99,
    stripePriceId: 'price_preset_bundle',
    description: '20 expert-curated healing presets',
    features: ['20 presets', 'Expert-curated', 'Instant access'],
  },
  {
    id: 'security_addon',
    name: 'Security Add-on',
    price: 9.99,
    stripePriceId: 'price_security_addon',
    description: 'Home security camera integration',
    features: ['Camera monitoring', 'Motion detection', 'Recording'],
  },
  {
    id: 'remove_ads',
    name: 'Remove Ads',
    price: 4.99,
    stripePriceId: 'price_remove_ads',
    description: 'Permanent ad removal',
    features: ['No ads forever', 'Clean interface', 'Better experience'],
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
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      const saved = await AsyncStorage.getItem('subscription_status');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSubscription({
          ...parsed,
          expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : undefined,
          trialEndsAt: parsed.trialEndsAt ? new Date(parsed.trialEndsAt) : undefined,
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

  const hasFeature = (feature: string): boolean => {
    // Free tier features
    const freeFeatures = ['delta', 'theta', 'alpha', 'white_noise', 'basic_presets'];
    
    // Premium tier features
    const premiumFeatures = [
      ...freeFeatures,
      'beta',
      'gamma',
      'isochronic',
      'om_chanting',
      'all_noise_colors',
      'unlimited_sessions',
      'unlimited_presets',
      'no_ads',
    ];
    
    // Ultimate tier features
    const ultimateFeatures = [
      ...premiumFeatures,
      'security_cameras',
      'bluetooth',
      'advanced_analytics',
      'api_access',
    ];

    // Check subscription tier
    if (subscription.tier === 'ultimate_monthly' || subscription.tier === 'ultimate_annual') {
      return ultimateFeatures.includes(feature);
    }
    
    if (subscription.tier === 'premium_monthly' || subscription.tier === 'premium_annual' || subscription.tier === 'lifetime') {
      return premiumFeatures.includes(feature);
    }

    // Check individual purchases
    if (purchasedItems.includes('gamma_pack') && feature === 'gamma') return true;
    if (purchasedItems.includes('isochronic') && feature === 'isochronic') return true;
    if (purchasedItems.includes('om_chanting') && feature === 'om_chanting') return true;
    if (purchasedItems.includes('noise_pack') && feature === 'all_noise_colors') return true;
    if (purchasedItems.includes('security_addon') && feature === 'security_cameras') return true;
    if (purchasedItems.includes('remove_ads') && feature === 'no_ads') return true;

    // Default to free tier
    return freeFeatures.includes(feature);
  };

  const subscribe = async (planId: string): Promise<boolean> => {
    try {
      // TODO: Implement actual Stripe payment flow
      // For now, simulate successful subscription
      const newSubscription: SubscriptionStatus = {
        tier: planId as SubscriptionTier,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
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

  return (
    <StripeProviderNative publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <StripeContext.Provider
        value={{
          subscription,
          purchasedItems,
          hasFeature,
          subscribe,
          purchase,
          cancelSubscription,
          restorePurchases,
        }}
      >
        {children}
      </StripeContext.Provider>
    </StripeProviderNative>
  );
}

export function useStripe() {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within StripeProviderWrapper');
  }
  return context;
}
