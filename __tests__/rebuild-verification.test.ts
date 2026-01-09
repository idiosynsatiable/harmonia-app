import { describe, it, expect } from "vitest";
import { 
  audioTracks, 
  getBinauralTracks, 
  getIsochronicTracks, 
  getHarmonicTracks, 
  getAmbientTracks,
  getFocusTracks,
  getCalmTracks,
  getSleepTracks,
  getTrackById
} from "@/lib/audio-tracks";
import { 
  getCurrentEntitlements, 
  getMaxSessionLength, 
  canAccessUnlimitedSessions,
  shouldShowUpgradePrompts,
  PREMIUM_FEATURES,
  PRICING_TIERS
} from "@/lib/entitlements";

describe("Harmonia Professional Rebuild - Verification Tests", () => {
  
  // ===== PHASE 3: Audio Track Implementation =====
  describe("Audio Track Data Model", () => {
    it("should have exactly 21 audio tracks", () => {
      expect(audioTracks).toHaveLength(21);
    });

    it("should have 7 binaural beat tracks", () => {
      const binauralTracks = getBinauralTracks();
      expect(binauralTracks).toHaveLength(7);
      binauralTracks.forEach(track => {
        expect(track.type).toBe("binaural");
        expect(track.headphonesRequired).toBe(true);
      });
    });

    it("should have 5 isochronic tone tracks", () => {
      const isochronicTracks = getIsochronicTracks();
      expect(isochronicTracks).toHaveLength(5);
      isochronicTracks.forEach(track => {
        expect(track.type).toBe("isochronic");
        expect(track.headphonesRequired).toBe(false);
      });
    });

    it("should have 5 harmonic frequency tracks", () => {
      const harmonicTracks = getHarmonicTracks();
      expect(harmonicTracks).toHaveLength(5);
      harmonicTracks.forEach(track => {
        expect(track.type).toBe("harmonic");
        expect(track.headphonesRequired).toBe(false);
      });
    });

    it("should have 4 ambient sound tracks", () => {
      const ambientTracks = getAmbientTracks();
      expect(ambientTracks).toHaveLength(4);
      ambientTracks.forEach(track => {
        expect(track.type).toBe("ambient");
        expect(track.headphonesRequired).toBe(false);
      });
    });

    it("should categorize tracks into Focus/Calm/Sleep", () => {
      const focusTracks = getFocusTracks();
      const calmTracks = getCalmTracks();
      const sleepTracks = getSleepTracks();
      
      expect(focusTracks.length).toBeGreaterThan(0);
      expect(calmTracks.length).toBeGreaterThan(0);
      expect(sleepTracks.length).toBeGreaterThan(0);
      
      // Total should equal 21
      expect(focusTracks.length + calmTracks.length + sleepTracks.length).toBe(21);
    });

    it("should have complete metadata for each track", () => {
      audioTracks.forEach(track => {
        expect(track.id).toBeTruthy();
        expect(track.name).toBeTruthy();
        expect(track.type).toBeTruthy();
        expect(track.frequency).toBeTruthy();
        expect(track.duration).toBeGreaterThan(0);
        expect(track.category).toBeTruthy();
        expect(track.description).toBeTruthy();
        expect(track.bestFor).toBeTruthy();
        expect(track.recommendedSession).toBeTruthy();
        expect(typeof track.headphonesRequired).toBe("boolean");
      });
    });

    it("should have no 'DNA Repair' language (renamed to Solfeggio 528 Hz)", () => {
      const track528 = getTrackById("solfeggio-528");
      expect(track528).toBeTruthy();
      expect(track528?.name).toBe("Solfeggio 528 Hz");
      expect(track528?.name).not.toContain("DNA");
      expect(track528?.name).not.toContain("Repair");
    });

    it("should have proper frequency ranges for binaural beats", () => {
      const binauralTracks = getBinauralTracks();
      const frequencies = ["1 Hz", "2 Hz", "4 Hz", "6 Hz", "8 Hz", "10 Hz", "14 Hz"];
      
      binauralTracks.forEach(track => {
        expect(frequencies).toContain(track.frequency);
      });
    });
  });

  // ===== PHASE 5: Payment-Agnostic Monetization =====
  describe("Entitlement System", () => {
    it("should default to free tier", () => {
      const entitlements = getCurrentEntitlements();
      expect(entitlements.maxSessionLength).toBe(15); // 15-minute limit
      expect(entitlements.unlimitedSessions).toBe(false);
      expect(entitlements.allTracksUnlocked).toBe(true);
      expect(entitlements.showUpgradePrompts).toBe(true);
    });

    it("should have 15-minute session limit for free tier", () => {
      const maxLength = getMaxSessionLength();
      expect(maxLength).toBe(15);
    });

    it("should not allow unlimited sessions for free tier", () => {
      const canAccess = canAccessUnlimitedSessions();
      expect(canAccess).toBe(false);
    });

    it("should show upgrade prompts for free tier", () => {
      const shouldShow = shouldShowUpgradePrompts();
      expect(shouldShow).toBe(true);
    });

    it("should have premium features defined", () => {
      expect(PREMIUM_FEATURES).toHaveLength(5);
      expect(PREMIUM_FEATURES).toContain("Unlimited session length");
      expect(PREMIUM_FEATURES).toContain("Offline playback");
      expect(PREMIUM_FEATURES).toContain("Custom presets");
    });

    it("should have 4 pricing tiers defined", () => {
      expect(PRICING_TIERS).toHaveLength(4);
      const tierIds = PRICING_TIERS.map(t => t.id);
      expect(tierIds).toContain("free");
      expect(tierIds).toContain("premium");
      expect(tierIds).toContain("ultimate");
      expect(tierIds).toContain("lifetime");
    });

    it("should have correct pricing for tiers", () => {
      const free = PRICING_TIERS.find(t => t.id === "free");
      const premium = PRICING_TIERS.find(t => t.id === "premium");
      const lifetime = PRICING_TIERS.find(t => t.id === "lifetime");
      
      expect(free?.price).toBe("$0");
      expect(premium?.price).toBe("$9.99/month");
      expect(lifetime?.price).toBe("$49.99 one-time");
    });
  });

  // ===== LANGUAGE COMPLIANCE =====
  describe("App-Store Safe Language", () => {
    it("should not contain forbidden medical language in track names", () => {
      const forbiddenWords = ["heal", "healing", "cure", "therapy", "therapeutic", "treat", "treatment", "trauma", "disorder", "diagnose", "medical", "DNA Repair"];
      
      audioTracks.forEach(track => {
        forbiddenWords.forEach(word => {
          expect(track.name.toLowerCase()).not.toContain(word.toLowerCase());
        });
      });
    });

    it("should not contain forbidden medical language in track descriptions", () => {
      const forbiddenWords = ["heal", "healing", "cure", "therapy", "therapeutic", "treat", "treatment", "trauma", "disorder", "diagnose"];
      
      audioTracks.forEach(track => {
        forbiddenWords.forEach(word => {
          expect(track.description.toLowerCase()).not.toContain(word.toLowerCase());
        });
        
        // "medical" is allowed ONLY in disclaimers like "not medical"
        if (track.description.toLowerCase().includes("medical")) {
          expect(track.description.toLowerCase()).toMatch(/not medical|non-medical/);
        }
      });
    });

    it("should use approved language in descriptions", () => {
      const approvedPhrases = [
        "designed for",
        "intended for",
        "support",
        "encourage",
        "commonly associated with",
        "often used for",
      ];
      
      // At least some tracks should use approved language
      const hasApprovedLanguage = audioTracks.some(track => 
        approvedPhrases.some(phrase => 
          track.description.toLowerCase().includes(phrase.toLowerCase())
        )
      );
      
      expect(hasApprovedLanguage).toBe(true);
    });
  });

  // ===== DATA INTEGRITY =====
  describe("Data Integrity", () => {
    it("should have unique track IDs", () => {
      const ids = audioTracks.map(t => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(audioTracks.length);
    });

    it("should have valid duration values", () => {
      audioTracks.forEach(track => {
        expect(track.duration).toBeGreaterThan(0);
        expect(track.duration).toBeLessThanOrEqual(90);
      });
    });

    it("should have valid category values", () => {
      const validCategories = ["focus", "calm", "sleep"];
      audioTracks.forEach(track => {
        expect(validCategories).toContain(track.category);
      });
    });

    it("should have valid type values", () => {
      const validTypes = ["binaural", "isochronic", "harmonic", "ambient"];
      audioTracks.forEach(track => {
        expect(validTypes).toContain(track.type);
      });
    });
  });

  // ===== PROFESSIONAL STANDARDS =====
  describe("Professional Standards", () => {
    it("should have professional track names (title case)", () => {
      audioTracks.forEach(track => {
        // Check that name starts with capital letter
        expect(track.name[0]).toBe(track.name[0].toUpperCase());
      });
    });

    it("should have complete descriptions (not placeholder text)", () => {
      audioTracks.forEach(track => {
        expect(track.description.length).toBeGreaterThan(20);
        expect(track.description).not.toContain("TODO");
        expect(track.description).not.toContain("placeholder");
      });
    });

    it("should have meaningful 'Best For' guidance", () => {
      audioTracks.forEach(track => {
        expect(track.bestFor.length).toBeGreaterThan(5);
        expect(track.bestFor).not.toContain("TODO");
      });
    });
  });
});
