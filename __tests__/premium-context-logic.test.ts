import { describe, it, expect } from "vitest";
import { FREE_LIMITS, PREMIUM_FEATURE_LIST } from "../lib/premium-context";

describe("Premium Context Logic", () => {
  describe("FREE_LIMITS", () => {
    it("should have correct max presets", () => {
      expect(FREE_LIMITS.maxPresets).toBe(3);
    });

    it("should have correct max session minutes", () => {
      expect(FREE_LIMITS.maxSessionMinutes).toBe(15);
    });

    it("should have correct max binaural frequency", () => {
      expect(FREE_LIMITS.maxBinauralFreq).toBe(12);
    });

    it("should have correct noise types", () => {
      expect(FREE_LIMITS.noiseTypes).toContain("white");
      expect(FREE_LIMITS.noiseTypes).toContain("pink");
      expect(FREE_LIMITS.noiseTypes).not.toContain("brown");
    });
  });

  describe("PREMIUM_FEATURE_LIST", () => {
    it("should contain all 10 premium features", () => {
      expect(PREMIUM_FEATURE_LIST).toHaveLength(10);
    });

    it("should have required fields for each feature", () => {
      PREMIUM_FEATURE_LIST.forEach(feature => {
        expect(feature.icon).toBeDefined();
        expect(feature.title).toBeDefined();
        expect(feature.description).toBeDefined();
        expect(feature.free).toBeDefined();
      });
    });

    it("should include key features", () => {
      const titles = PREMIUM_FEATURE_LIST.map(f => f.title);
      expect(titles).toContain("Full Frequency Range");
      expect(titles).toContain("Unlimited Sessions");
      expect(titles).toContain("Security Cameras");
      expect(titles).toContain("No Ads");
    });
  });
});
