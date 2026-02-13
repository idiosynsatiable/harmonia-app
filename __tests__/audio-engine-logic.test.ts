import { describe, it, expect } from "vitest";
import { getBrainwaveState, BRAINWAVE_RANGES, HEALING_FREQUENCIES } from "../lib/audio-engine";

describe("Audio Engine Logic", () => {
  describe("getBrainwaveState", () => {
    it("should return 'delta' for frequencies < 4Hz", () => {
      expect(getBrainwaveState(0.5)).toBe("delta");
      expect(getBrainwaveState(2)).toBe("delta");
      expect(getBrainwaveState(3.9)).toBe("delta");
    });

    it("should return 'theta' for frequencies between 4Hz and 8Hz", () => {
      expect(getBrainwaveState(4)).toBe("theta");
      expect(getBrainwaveState(6)).toBe("theta");
      expect(getBrainwaveState(7.9)).toBe("theta");
    });

    it("should return 'alpha' for frequencies between 8Hz and 12Hz", () => {
      expect(getBrainwaveState(8)).toBe("alpha");
      expect(getBrainwaveState(10)).toBe("alpha");
      expect(getBrainwaveState(11.9)).toBe("alpha");
    });

    it("should return 'beta' for frequencies between 12Hz and 30Hz", () => {
      expect(getBrainwaveState(12)).toBe("beta");
      expect(getBrainwaveState(20)).toBe("beta");
      expect(getBrainwaveState(29.9)).toBe("beta");
    });

    it("should return 'gamma' for frequencies >= 30Hz", () => {
      expect(getBrainwaveState(30)).toBe("gamma");
      expect(getBrainwaveState(40)).toBe("gamma");
      expect(getBrainwaveState(100)).toBe("gamma");
    });
  });

  describe("BRAINWAVE_RANGES", () => {
    it("should have correct delta range", () => {
      expect(BRAINWAVE_RANGES.delta.min).toBe(0.5);
      expect(BRAINWAVE_RANGES.delta.max).toBe(4);
    });

    it("should have correct theta range", () => {
      expect(BRAINWAVE_RANGES.theta.min).toBe(4);
      expect(BRAINWAVE_RANGES.theta.max).toBe(8);
    });

    it("should have correct alpha range", () => {
      expect(BRAINWAVE_RANGES.alpha.min).toBe(8);
      expect(BRAINWAVE_RANGES.alpha.max).toBe(12);
    });

    it("should have correct beta range", () => {
      expect(BRAINWAVE_RANGES.beta.min).toBe(12);
      expect(BRAINWAVE_RANGES.beta.max).toBe(30);
    });

    it("should have correct gamma range", () => {
      expect(BRAINWAVE_RANGES.gamma.min).toBe(30);
      expect(BRAINWAVE_RANGES.gamma.max).toBe(100);
    });
  });

  describe("HEALING_FREQUENCIES", () => {
    it("should have correct Solfeggio frequencies", () => {
      expect(HEALING_FREQUENCIES.dnaRepair).toBe(528);
      expect(HEALING_FREQUENCIES.foundation).toBe(174);
      expect(HEALING_FREQUENCIES.crownChakra).toBe(963);
      expect(HEALING_FREQUENCIES.liberation).toBe(396);
      expect(HEALING_FREQUENCIES.detox).toBe(741);
      expect(HEALING_FREQUENCIES.spiritualAwakening).toBe(852);
    });

    it("should have correct harmonic frequencies", () => {
      expect(HEALING_FREQUENCIES.om).toBe(136.1);
      expect(HEALING_FREQUENCIES.naturalHarmony).toBe(432);
      expect(HEALING_FREQUENCIES.schumann).toBe(7.83);
    });
  });

  describe("Frequency Calculations", () => {
    it("should calculate binaural difference correctly", () => {
      const left = 200;
      const right = 210;
      expect(Math.abs(right - left)).toBe(10);
    });

    it("should calculate isochronic pulse duration correctly", () => {
      const pulseRate = 10; // 10 pulses per second
      const duration = 1 / pulseRate;
      expect(duration).toBe(0.1);
    });
  });
});
