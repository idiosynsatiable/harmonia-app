import { describe, it, expect } from "vitest";
import { 
  getEntitlements, 
  getCurrentUserTier, 
  getCurrentEntitlements, 
  hasEntitlement, 
  getMaxSessionLength,
  canAccessUnlimitedSessions,
  shouldShowUpgradePrompts,
  PREMIUM_FEATURES,
  PRICING_TIERS
} from "../lib/entitlements";

describe("Entitlements Logic", () => {
  describe("User Tiers", () => {
    it("should default to 'free' tier", () => {
      expect(getCurrentUserTier()).toBe("free");
    });

    it("should return correct entitlements for 'free' tier", () => {
      const entitlements = getEntitlements("free");
      expect(entitlements.maxSessionLength).toBe(15);
      expect(entitlements.unlimitedSessions).toBe(false);
      expect(entitlements.allTracksUnlocked).toBe(true);
      expect(entitlements.showUpgradePrompts).toBe(true);
    });

    it("should return correct entitlements for 'premium' tier", () => {
      const entitlements = getEntitlements("premium");
      expect(entitlements.maxSessionLength).toBe(0);
      expect(entitlements.unlimitedSessions).toBe(true);
      expect(entitlements.showUpgradePrompts).toBe(false);
    });
  });

  describe("Helper Functions", () => {
    it("getCurrentEntitlements should return free entitlements by default", () => {
      const entitlements = getCurrentEntitlements();
      expect(entitlements.maxSessionLength).toBe(15);
    });

    it("hasEntitlement should return correct values for free tier", () => {
      expect(hasEntitlement("allTracksUnlocked")).toBe(true);
      expect(hasEntitlement("unlimitedSessions")).toBe(false);
      expect(hasEntitlement("offlinePlayback")).toBe(false);
    });

    it("getMaxSessionLength should return 15 for free tier", () => {
      expect(getMaxSessionLength()).toBe(15);
    });

    it("canAccessUnlimitedSessions should return false for free tier", () => {
      expect(canAccessUnlimitedSessions()).toBe(false);
    });

    it("shouldShowUpgradePrompts should return true for free tier", () => {
      expect(shouldShowUpgradePrompts()).toBe(true);
    });
  });

  describe("Static Data", () => {
    it("PREMIUM_FEATURES should contain expected features", () => {
      expect(PREMIUM_FEATURES).toContain("Unlimited session length");
      expect(PREMIUM_FEATURES).toContain("Offline playback");
      expect(PREMIUM_FEATURES).toContain("Custom presets");
    });

    it("PRICING_TIERS should have 4 tiers", () => {
      expect(PRICING_TIERS).toHaveLength(4);
      expect(PRICING_TIERS[0].id).toBe("free");
      expect(PRICING_TIERS[1].id).toBe("premium");
      expect(PRICING_TIERS[2].id).toBe("ultimate");
      expect(PRICING_TIERS[3].id).toBe("lifetime");
    });
  });
});
