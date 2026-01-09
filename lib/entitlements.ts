/**
 * Entitlement System - Payment-Agnostic Monetization
 * 
 * This system defines what features are available to free vs premium users.
 * Currently all users are "free" tier. When payments unlock, this becomes
 * the single source of truth for feature gating.
 * 
 * Design: Toggle-ready. When Stripe/IAP is added, flip the entitlements
 * and UI auto-updates.
 */

export type UserTier = "free" | "premium" | "ultimate" | "lifetime";

export interface Entitlements {
  // Session limits
  maxSessionLength: number; // minutes (0 = unlimited)
  unlimitedSessions: boolean;
  
  // Features
  offlinePlayback: boolean;
  customPresets: boolean;
  extendedSleepMode: boolean;
  
  // Content access
  allTracksUnlocked: boolean;
  
  // UI
  showAds: boolean;
  showUpgradePrompts: boolean;
}

/**
 * Entitlement definitions by tier
 */
const TIER_ENTITLEMENTS: Record<UserTier, Entitlements> = {
  free: {
    maxSessionLength: 15, // 15-minute limit
    unlimitedSessions: false,
    offlinePlayback: false,
    customPresets: false,
    extendedSleepMode: false,
    allTracksUnlocked: true, // All tracks accessible, just time-limited
    showAds: false, // No ads for now
    showUpgradePrompts: true,
  },
  premium: {
    maxSessionLength: 0, // Unlimited
    unlimitedSessions: true,
    offlinePlayback: true,
    customPresets: true,
    extendedSleepMode: true,
    allTracksUnlocked: true,
    showAds: false,
    showUpgradePrompts: false,
  },
  ultimate: {
    maxSessionLength: 0,
    unlimitedSessions: true,
    offlinePlayback: true,
    customPresets: true,
    extendedSleepMode: true,
    allTracksUnlocked: true,
    showAds: false,
    showUpgradePrompts: false,
  },
  lifetime: {
    maxSessionLength: 0,
    unlimitedSessions: true,
    offlinePlayback: true,
    customPresets: true,
    extendedSleepMode: true,
    allTracksUnlocked: true,
    showAds: false,
    showUpgradePrompts: false,
  },
};

/**
 * Get entitlements for a user tier
 */
export const getEntitlements = (tier: UserTier): Entitlements => {
  return TIER_ENTITLEMENTS[tier];
};

/**
 * Current user tier (hardcoded to "free" for now)
 * TODO: Replace with actual user tier from auth/subscription system
 */
export const getCurrentUserTier = (): UserTier => {
  return "free";
};

/**
 * Get current user's entitlements
 */
export const getCurrentEntitlements = (): Entitlements => {
  return getEntitlements(getCurrentUserTier());
};

/**
 * Check if user has a specific entitlement
 */
export const hasEntitlement = (key: keyof Entitlements): boolean => {
  const entitlements = getCurrentEntitlements();
  return !!entitlements[key];
};

/**
 * Get max session length for current user
 */
export const getMaxSessionLength = (): number => {
  return getCurrentEntitlements().maxSessionLength;
};

/**
 * Check if user can access unlimited sessions
 */
export const canAccessUnlimitedSessions = (): boolean => {
  return getCurrentEntitlements().unlimitedSessions;
};

/**
 * Check if user should see upgrade prompts
 */
export const shouldShowUpgradePrompts = (): boolean => {
  return getCurrentEntitlements().showUpgradePrompts;
};

/**
 * Premium features list (for UI display)
 */
export const PREMIUM_FEATURES = [
  "Unlimited session length",
  "Offline playback",
  "Custom presets",
  "Extended sleep mode (overnight)",
  "No upgrade prompts",
];

/**
 * Pricing tiers (for future use)
 */
export const PRICING_TIERS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    features: [
      "All 21 audio tracks",
      "15-minute sessions",
      "Focus, Calm, Sleep modes",
      "Safety guidance",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$9.99/month",
    features: [
      "Everything in Free",
      "Unlimited session length",
      "Offline playback",
      "Custom presets",
    ],
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: "$19.99/month",
    features: [
      "Everything in Premium",
      "Extended sleep mode",
      "Priority support",
      "Early access to new features",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$49.99 one-time",
    features: [
      "Everything in Ultimate",
      "Lifetime access",
      "All future updates",
      "Founding listener perks",
    ],
  },
];
