# HARMONIA v1.1.0 — BUILD QUICK START

## 🚀 ONE-COMMAND BUILD

```bash
cd /home/ubuntu/harmonia-app
EXPO_PUBLIC_GIT_SHA=$(git rev-parse --short HEAD) eas build --platform android --profile preview --clear-cache
```

## 📦 WHAT YOU GET

- **APK file** (not AAB) for direct device installation
- **Version:** 1.1.0
- **Version Code:** 11
- **Git SHA:** a6eb3b1
- **Bundle ID:** space.manus.harmonia_healing_app.t20260104033312

## ✅ VERIFICATION STEPS

1. Download APK from EAS dashboard
2. Install on Android device: `adb install harmonia-v1.1.0.apk`
3. Open app → Should land on **Explore** tab (not Listen/Home)
4. Tap **Info** tab → Scroll to bottom → Verify **Build Stamp**:
   - Version: 1.1.0
   - Version Code: 11
   - Git SHA: a6eb3b1

## 🎯 KEY FEATURES TO TEST

### Explore Screen
- ✅ Search bar filters sessions in real-time
- ✅ Filter chips: All, Focus, Calm, Sleep
- ✅ Tap session card → Opens player

### Listen Screen
- ✅ Shows "Now Playing" when session active
- ✅ Quick Start presets (3 sessions)
- ✅ Recent sessions (last played)
- ✅ Favorite sessions

### Player Screen
- ✅ Play/pause button works
- ✅ Volume controls (🔉/🔊)
- ✅ Sleep timer options (Off, 15m, 30m, 45m, 60m)
- ✅ Favorite toggle (☆/⭐)
- ✅ Headphones warning for binaural tracks

## 🔒 ROUTE LOCK VERIFICATION

**Critical:** App must NEVER show old UI (Home, Studio, Presets, Security, Settings tabs)

1. Force close app
2. Reopen 5 times
3. Should always land on **Explore** tab
4. Tab bar should show: **Listen | Explore | Info**

## 📊 BUILD STAMP LOCATION

**Info Tab → Scroll to Bottom → "🏗️ Build Information" Card**

Shows:
- Version (from app.config.ts)
- Version Code (Android build number)
- Git SHA (commit identifier)
- Bundle ID (package name)

## 🐛 KNOWN LIMITATIONS (v1.1.0)

1. **MiniPlayer not visible** — Component created but not integrated into tab layout
2. **Timer doesn't auto-stop** — UI present but fade-out logic not implemented
3. **Favorites/Recents reset on restart** — No AsyncStorage persistence yet
4. **No lock-screen controls** — Background playback basic (keep-awake only)

## 🔄 NEXT ITERATION PRIORITIES

1. Integrate MiniPlayer into tab layout wrapper
2. Implement AsyncStorage for favorites/recents persistence
3. Add sleep timer countdown and fade-out logic
4. Implement lock-screen media controls

## 📝 FULL REPORT

See `HARMONIA_UPGRADE_REPORT.md` for complete implementation details, persona rationale, audit results, and comprehensive testing checklist.

---

**Build Date:** February 15, 2026  
**Commit:** a6eb3b1  
**Status:** ✅ Ready for EAS build
