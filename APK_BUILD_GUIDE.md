# Harmonia App - APK Build & Google Play Store Deployment Guide

## Overview

This guide walks you through building the Harmonia app APK and submitting it to Google Play Store. The app is built using Expo, which provides a managed build service for creating production-ready Android APKs.

---

## Prerequisites

Before building the APK, ensure you have:

1. **Expo Account** - Create one at [https://expo.dev](https://expo.dev)
2. **EAS CLI** - Install with: `npm install -g eas-cli`
3. **Google Play Developer Account** - Register at [https://play.google.com/console](https://play.google.com/console) ($25 one-time fee)
4. **Git** - For version control
5. **Node.js & npm/pnpm** - Already installed

---

## Step 1: Set Up EAS Build

### 1.1 Initialize EAS in Your Project

```bash
cd ${PROJECT_ROOT}
eas init --id <your-expo-project-id>
```

If you don't have a project ID yet:
1. Go to [https://expo.dev/projects](https://expo.dev/projects)
2. Create a new project named "harmonia-healing-app"
3. Copy the project ID and use it above

### 1.2 Configure eas.json

Create or update `eas.json` in your project root:

```json
{
  "cli": {
    "version": ">= 5.0.0",
    "requireCommit": false
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store",
      "android": {
        "buildType": "app-bundle",
        "keystore": {
          "keystorePath": "keystore.jks",
          "keystorePassword": "$KEYSTORE_PASSWORD",
          "keyAlias": "harmonia-key",
          "keyPassword": "$KEY_PASSWORD"
        }
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-play-key.json",
        "track": "internal"
      }
    }
  }
}
```

---

## Step 2: Create Android Keystore

The keystore is used to sign your APK. Create it once and keep it safe!

```bash
# Generate keystore (run this once)
keytool -genkey-pair -v -storetype PKCS12 \
  -keystore keystore.jks \
  -keyalias harmonia-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10950 \
  -storepass your_keystore_password \
  -keypass your_key_password
```

**Important:** Save the keystore file and passwords securely. You'll need them for future updates.

---

## Step 3: Set Environment Variables

Add your keystore credentials to EAS secrets:

```bash
eas secret:create --scope project --name KEYSTORE_PASSWORD
# Enter your keystore password

eas secret:create --scope project --name KEY_PASSWORD
# Enter your key password
```

---

## Step 4: Build the APK

### Option A: Build for Testing (Internal Testing Track)

```bash
eas build --platform android --profile preview
```

This creates an APK you can test on devices.

### Option B: Build for Production (App Bundle for Play Store)

```bash
eas build --platform android --profile production
```

This creates an optimized App Bundle (.aab) for Google Play Store submission.

**Build Status:** Monitor at [https://expo.dev/builds](https://expo.dev/builds)

---

## Step 5: Download Your Build

Once the build completes:

1. Go to [https://expo.dev/builds](https://expo.dev/builds)
2. Click on your build
3. Download the APK or App Bundle
4. Save it locally for testing or submission

---

## Step 6: Test the APK (Optional but Recommended)

### Install on Android Device via USB

```bash
# Connect your Android device via USB and enable USB debugging
adb install path/to/harmonia.apk
```

### Test Key Features

- [ ] App launches without crashes
- [ ] Home screen displays correctly
- [ ] Brainwave selector works
- [ ] Preset loading works
- [ ] Settings screen accessible
- [ ] Premium/free feature gating works
- [ ] Dark/light theme switching works

---

## Step 7: Prepare for Google Play Store Submission

### 7.1 Create Google Play Developer Account

1. Go to [https://play.google.com/console](https://play.google.com/console)
2. Sign in with your Google account
3. Accept the Developer Agreement
4. Pay the $25 registration fee

### 7.2 Create Service Account for Automated Submission

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project named "harmonia-app"
3. Enable the Google Play Android Developer API
4. Create a Service Account:
   - Go to **IAM & Admin** → **Service Accounts**
   - Click **Create Service Account**
   - Name: "harmonia-play-publisher"
   - Grant role: **Editor**
5. Create a JSON key:
   - Click on the service account
   - Go to **Keys** tab
   - Click **Add Key** → **Create new key** → **JSON**
   - Download and save as `google-play-key.json` in your project root

### 7.3 Grant Service Account Access in Play Console

1. Go to [Play Console](https://play.google.com/console)
2. Go to **Settings** → **User and permissions**
3. Click **Invite user**
4. Enter the service account email (from the JSON key)
5. Grant **Admin** role

---

## Step 8: Create App Listing in Play Console

### 8.1 Create New App

1. Go to [Play Console](https://play.google.com/console)
2. Click **Create app**
3. App name: "Harmonia"
4. Default language: English
5. App or game: Select "App"
6. Category: Select "Health & Fitness" or "Lifestyle"
7. Content rating: Complete the questionnaire
8. Target audience: Adults (18+)

### 8.2 Fill in App Details

**Store Listing:**
- **Title:** Harmonia - Advanced Sound Healing
- **Short description:** "Experience transformative sound healing with binaural beats, isochronic tones, sacred OM chanting, and advanced security features. Heal your body, calm your mind, elevate your consciousness."
- **Full description:** 
  ```
  Harmonia is an advanced sound healing and security app designed for deep wellness and peace.

  🎵 SOUND HEALING FEATURES:
  • Binaural Beats - Brainwave entrainment for Delta, Theta, Alpha, Beta, Gamma states
  • Isochronic Tones - Rapid pulsing frequencies for enhanced effectiveness
  • 5 Noise Colors - White, Pink, Brown, Purple, Blue noise generators
  • Sacred OM Chanting - 136.1 Hz Cosmic OM with harmonics and cave reverb
  • Healing Frequencies - 528 Hz DNA repair, 432 Hz natural harmony, Solfeggio scale
  • Preset Library - 8 curated presets + unlimited custom presets
  • Session Timer - Customizable duration with fade in/out

  🔒 SECURITY FEATURES (Premium):
  • Home Security Cameras - Monitor up to 8 cameras
  • Live Feed Viewing - Real-time camera streams
  • Recording & Playback - Capture and review footage
  • Motion Detection - Instant alerts
  • Audio Monitoring - Listen to camera audio

  🎧 CONNECTIVITY:
  • Bluetooth Support - Connect to speakers, headphones, car audio
  • Multi-device Sync - Seamless experience across devices
  • Background Playback - Continue healing while using other apps

  ✨ PREMIUM FEATURES:
  • Unlimited presets
  • Advanced frequencies (Gamma, Beta)
  • Isochronic tone generator
  • Camera integration (up to 8 cameras)
  • Priority support

  🌟 BENEFITS:
  • Deep meditation and relaxation
  • Improved sleep quality
  • Enhanced focus and concentration
  • Stress and anxiety relief
  • Cellular healing and regeneration
  • Spiritual growth and consciousness expansion

  All frequencies are scientifically researched and based on healing frequency protocols used in holistic wellness practices worldwide.

  Download Harmonia today and begin your journey to perfect health, peace, and elevated consciousness.
  ```

- **Screenshots:** Upload 5-8 screenshots showing:
  1. Home dashboard
  2. Brainwave selector
  3. Sound studio interface
  4. Presets library
  5. Settings screen
  6. Security camera view
  7. Premium features

- **Feature Graphic:** 1024x500px banner image (your logo with tagline)

- **Icon:** Use your app icon (512x512px)

- **Privacy Policy:** Create and link a privacy policy (required)

- **Content Rating:** Complete the content rating questionnaire

---

## Step 9: Set Up App Signing

1. In Play Console, go to **Setup** → **App signing**
2. Choose "Google Play App Signing" (recommended)
3. Upload your app bundle

---

## Step 10: Submit for Review

### 10.1 Create Release

1. Go to **Release** → **Production** (or **Internal testing** first)
2. Click **Create new release**
3. Upload your App Bundle (.aab file)
4. Add release notes:
   ```
   Version 1.0.0 - Initial Release

   Welcome to Harmonia! This initial release includes:
   • Complete sound healing suite with 5 brainwave states
   • Binaural beats, isochronic tones, and noise generators
   • Sacred OM chanting with cave reverb
   • Preset library with 8 curated presets
   • Home security camera integration
   • Bluetooth connectivity
   • Dark/light theme support
   • Premium and free versions

   Enjoy your journey to perfect health and elevated consciousness!
   ```

### 10.2 Review and Submit

1. Review all app details
2. Confirm content rating
3. Accept agreements
4. Click **Submit for review**

**Review Time:** Typically 2-4 hours for initial submission

---

## Step 11: Monitor Review Status

1. Go to **Release** → **Production**
2. Check status:
   - **In review** - Being reviewed by Google
   - **Approved** - Ready to publish
   - **Rejected** - Check feedback and resubmit

---

## Step 12: Publish to Play Store

Once approved:

1. Go to **Release** → **Production**
2. Click **Review release**
3. Click **Publish**
4. Your app is now live on Google Play Store!

---

## Automated Submission with EAS

After initial setup, you can submit future updates automatically:

```bash
# Build and submit in one command
eas build --platform android --profile production --auto-submit
```

---

## Troubleshooting

### Build Fails

- Check that all required fields in `eas.json` are correct
- Verify keystore credentials
- Ensure `app.config.ts` has valid configuration

### App Rejected

Common reasons:
- **Crashes on launch** - Test thoroughly before submission
- **Misleading description** - Ensure description matches functionality
- **Privacy policy missing** - Add a privacy policy URL
- **Inappropriate content** - Ensure app content aligns with Play Store policies

### Build Size Too Large

- Optimize images and assets
- Remove unused dependencies
- Use code splitting

---

## Security Best Practices

1. **Never commit keystore to Git** - Add to `.gitignore`
2. **Protect credentials** - Use environment variables for sensitive data
3. **Keep keystore backup** - Store securely offline
4. **Update regularly** - Release security patches promptly
5. **Monitor reviews** - Respond to user feedback

---

## Version Updates

For future updates:

1. Update version in `app.json`:
   ```json
   {
     "expo": {
       "version": "1.1.0"
     }
   }
   ```

2. Build and submit:
   ```bash
   eas build --platform android --profile production --auto-submit
   ```

3. Update release notes in Play Console

---

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [EAS Build Guide](https://docs.expo.dev/build/setup)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Android App Bundle Guide](https://developer.android.com/guide/app-bundle)

---

## Support

For issues:
- Check Expo documentation
- Review Google Play Console guidelines
- Contact Expo support at support@expo.dev

---

**Your Harmonia app is ready for the world! Good luck with your launch! 🚀✨**
