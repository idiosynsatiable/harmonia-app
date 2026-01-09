/**
 * Final Implementation Tests
 * 
 * Validates all 3 critical components:
 * A. 21 Real Audio Files
 * B. Minimal Playback Engine
 * C. 3-Tab Navigation Structure
 */

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("A. Real Audio Files", () => {
  it("should have exactly 21 MP3 files", () => {
    const audioDir = path.join(process.cwd(), "assets/audio");
    const files = fs.readdirSync(audioDir);
    const mp3Files = files.filter((f) => f.endsWith(".mp3"));
    
    expect(mp3Files).toHaveLength(21);
  });

  it("should have 7 binaural beat files", () => {
    const audioDir = path.join(process.cwd(), "assets/audio");
    const files = fs.readdirSync(audioDir);
    const binauralFiles = files.filter((f) => f.includes("binaural"));
    
    expect(binauralFiles).toHaveLength(7);
  });

  it("should have 7 isochronic tone files", () => {
    const audioDir = path.join(process.cwd(), "assets/audio");
    const files = fs.readdirSync(audioDir);
    const isochronicFiles = files.filter((f) => f.includes("isochronic"));
    
    expect(isochronicFiles).toHaveLength(7);
  });

  it("should have harmonic and ambient files", () => {
    const audioDir = path.join(process.cwd(), "assets/audio");
    const files = fs.readdirSync(audioDir);
    
    const harmonicFiles = files.filter((f) => 
      f.includes("om-drone") || 
      f.includes("harmonic-pad")
    );
    
    const ambientFiles = files.filter((f) => 
      f.includes("noise") || 
      f.includes("rain") || 
      f.includes("ocean") || 
      f.includes("wind")
    );
    
    expect(harmonicFiles.length).toBeGreaterThan(0);
    expect(ambientFiles.length).toBeGreaterThan(0);
  });

  it("all audio files should be MP3 format", () => {
    const audioDir = path.join(process.cwd(), "assets/audio");
    const files = fs.readdirSync(audioDir);
    
    files.forEach((file) => {
      expect(file).toMatch(/\.mp3$/);
    });
  });

  it("all audio files should have reasonable file sizes", () => {
    const audioDir = path.join(process.cwd(), "assets/audio");
    const files = fs.readdirSync(audioDir);
    
    files.forEach((file) => {
      const filePath = path.join(audioDir, file);
      const stats = fs.statSync(filePath);
      
      // Each file should be between 1MB and 15MB (5 minutes of MP3)
      expect(stats.size).toBeGreaterThan(1 * 1024 * 1024); // > 1MB
      expect(stats.size).toBeLessThan(15 * 1024 * 1024); // < 15MB
    });
  });
});

describe("B. Minimal Playback Engine", () => {
  it("should have playback hook", () => {
    const hookPath = path.join(process.cwd(), "hooks/use-audio-playback.ts");
    expect(fs.existsSync(hookPath)).toBe(true);
    
    const content = fs.readFileSync(hookPath, "utf-8");
    expect(content).toContain("useAudioPlayback");
    expect(content).toContain("playTrack");
    expect(content).toContain("pause");
    expect(content).toContain("resume");
    expect(content).toContain("setVolume");
    expect(content).toContain("fadeIn");
    expect(content).toContain("fadeOut");
  });

  it("should have 15-minute free tier timer", () => {
    const hookPath = path.join(process.cwd(), "hooks/use-audio-playback.ts");
    const content = fs.readFileSync(hookPath, "utf-8");
    
    expect(content).toContain("sessionDuration");
    expect(content).toContain("remainingTime");
    expect(content).toContain("getMaxSessionLength");
  });

  it("should have entitlements system", () => {
    const entitlementsPath = path.join(process.cwd(), "lib/entitlements.ts");
    expect(fs.existsSync(entitlementsPath)).toBe(true);
    
    const content = fs.readFileSync(entitlementsPath, "utf-8");
    expect(content).toContain("getMaxSessionLength");
    expect(content).toContain("15"); // 15-minute limit
  });

  it("should not have accounts, favorites, playlists features", () => {
    const forbiddenFiles = [
      "lib/accounts.ts",
      "lib/favorites.ts",
      "lib/playlists.ts",
      "lib/downloads.ts",
      "lib/cloud-sync.ts",
      "lib/ai.ts",
    ];
    
    forbiddenFiles.forEach((file) => {
      const fullPath = path.join(process.cwd(), file);
      expect(fs.existsSync(fullPath)).toBe(false);
    });
  });
});

describe("C. 3-Tab Navigation Structure", () => {
  it("should have exactly 3 tabs", () => {
    const tabsDir = path.join(process.cwd(), "app/(tabs)");
    const files = fs.readdirSync(tabsDir);
    
    // Count screen files (excluding _layout.tsx and old files)
    const screenFiles = files.filter((f) => 
      f.endsWith(".tsx") && 
      !f.startsWith("_") &&
      !f.includes("old")
    );
    
    expect(screenFiles).toHaveLength(3);
  });

  it("should have Listen, Explore, Info tabs", () => {
    const tabsDir = path.join(process.cwd(), "app/(tabs)");
    
    expect(fs.existsSync(path.join(tabsDir, "index.tsx"))).toBe(true); // Listen
    expect(fs.existsSync(path.join(tabsDir, "explore.tsx"))).toBe(true); // Explore
    expect(fs.existsSync(path.join(tabsDir, "info.tsx"))).toBe(true); // Info
  });

  it("should not have Account tab", () => {
    const tabsDir = path.join(process.cwd(), "app/(tabs)");
    expect(fs.existsSync(path.join(tabsDir, "account.tsx"))).toBe(false);
  });

  it("should have safety and how-it-works pages", () => {
    const appDir = path.join(process.cwd(), "app");
    
    expect(fs.existsSync(path.join(appDir, "safety-info.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(appDir, "how-it-works.tsx"))).toBe(true);
  });

  it("Listen tab should show all tracks", () => {
    const listenPath = path.join(process.cwd(), "app/(tabs)/index.tsx");
    const content = fs.readFileSync(listenPath, "utf-8");
    
    expect(content).toContain("audioTracks");
    expect(content).toContain("Binaural");
    expect(content).toContain("Isochronic");
  });

  it("Explore tab should have Focus/Calm/Sleep categories", () => {
    const explorePath = path.join(process.cwd(), "app/(tabs)/explore.tsx");
    const content = fs.readFileSync(explorePath, "utf-8");
    
    expect(content).toContain("Focus");
    expect(content).toContain("Calm");
    expect(content).toContain("Sleep");
  });

  it("Info tab should have safety and educational content", () => {
    const infoPath = path.join(process.cwd(), "app/(tabs)/info.tsx");
    const content = fs.readFileSync(infoPath, "utf-8");
    
    expect(content).toContain("Safety");
    expect(content).toContain("How");
  });
});

describe("D. Analytics & Compliance", () => {
  it("should not have Google Analytics in mobile app", () => {
    const appDir = path.join(process.cwd(), "app");
    
    const checkForGA = (dir: string): boolean => {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (checkForGA(fullPath)) return true;
        } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
          const content = fs.readFileSync(fullPath, "utf-8");
          if (content.includes("gtag") || content.includes("googletagmanager")) {
            return true;
          }
        }
      }
      
      return false;
    };
    
    expect(checkForGA(appDir)).toBe(false);
  });

  it("should have safe language in audio track data", () => {
    const tracksPath = path.join(process.cwd(), "lib/audio-tracks.ts");
    const content = fs.readFileSync(tracksPath, "utf-8");
    
    // Should not have forbidden medical language (except in disclaimers)
    const lines = content.split("\n");
    const descriptionLines = lines.filter((line) => 
      line.includes("description:") || 
      line.includes("bestFor:")
    );
    
    descriptionLines.forEach((line) => {
      if (!line.includes("not medical") && !line.includes("not therapeutic")) {
        expect(line.toLowerCase()).not.toContain("heal");
        expect(line.toLowerCase()).not.toContain("cure");
        expect(line.toLowerCase()).not.toContain("treat");
        expect(line.toLowerCase()).not.toContain("diagnose");
      }
    });
  });
});

describe("E. App Configuration", () => {
  it("should have correct app name (no 'healing' language)", () => {
    const configPath = path.join(process.cwd(), "app.config.ts");
    const content = fs.readFileSync(configPath, "utf-8");
    
    // Extract app name from config
    const nameMatch = content.match(/appName:\s*["']([^"']+)["']/);
    if (nameMatch) {
      expect(nameMatch[1].toLowerCase()).not.toContain("healing");
    }
  });

  it("should have proper bundle ID", () => {
    const configPath = path.join(process.cwd(), "app.config.ts");
    const content = fs.readFileSync(configPath, "utf-8");
    
    expect(content).toContain("space.manus");
  });
});

describe("F. Production Readiness", () => {
  it("should have all required screens", () => {
    const requiredFiles = [
      "app/(tabs)/index.tsx", // Listen
      "app/(tabs)/explore.tsx", // Explore
      "app/(tabs)/info.tsx", // Info
      "app/safety-info.tsx",
      "app/how-it-works.tsx",
      "lib/audio-tracks.ts",
      "hooks/use-audio-playback.ts",
      "lib/entitlements.ts",
    ];
    
    requiredFiles.forEach((file) => {
      const fullPath = path.join(process.cwd(), file);
      expect(fs.existsSync(fullPath)).toBe(true);
    });
  });

  it("should have audio track metadata", () => {
    const tracksPath = path.join(process.cwd(), "lib/audio-tracks.ts");
    const content = fs.readFileSync(tracksPath, "utf-8");
    
    expect(content).toContain("audioFile");
    expect(content).toContain("headphonesRequired");
    expect(content).toContain("recommendedSession");
    expect(content).toContain("bestFor");
  });

  it("should have proper icon mappings", () => {
    const iconPath = path.join(process.cwd(), "components/ui/icon-symbol.tsx");
    const content = fs.readFileSync(iconPath, "utf-8");
    
    expect(content).toContain("play.circle.fill");
    expect(content).toContain("magnifyingglass");
    expect(content).toContain("info.circle.fill");
  });

  it("should have unlock modal for premium features", () => {
    const modalPath = path.join(process.cwd(), "components/unlock-modal.tsx");
    expect(fs.existsSync(modalPath)).toBe(true);
    
    const content = fs.readFileSync(modalPath, "utf-8");
    expect(content).toContain("Unlock");
    expect(content).toContain("premium");
  });
});
