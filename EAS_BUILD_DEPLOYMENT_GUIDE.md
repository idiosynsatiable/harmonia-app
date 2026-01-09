# Harmonia - EAS Build & Google Play Store Deployment Guide

## Complete Step-by-Step Instructions for APK Build and Submission

---

## Part 1: Prerequisites & Setup

### 1.1 Accounts You'll Need

1. **Expo Account** (free)
   - Sign up at https://expo.dev
   - Used for EAS Build service

2. **Google Play Developer Account** ($25 one-time fee)
   - Sign up at https://play.google.com/console
   - Used to publish apps to Google Play Store

3. **GitHub Account** (free, optional but recommended)
   - For version control and backup

### 1.2 Install Required Tools

```bash
# EAS CLI (already installed)
eas --version

# Verify Expo CLI
npm install -g expo-cli
expo --version

# Verify Node.js
node --version  # Should be 16+
```

---

## Part 2: Configure Your App for Production

### 2.1 Update app.config.ts

Your app is already configured with:
- ✅ App name: "Harmonia"
- ✅ App slug: "harmonia_healing_app"
- ✅ Bundle ID: "space.manus.harmonia_healing_app.t20250108"
- ✅ Package name: "space.manus.harmonia_healing_app.t20250108"
- ✅ Version: "1.0.0"

### 2.2 Generate Signing Keys

```bash
# Navigate to your project
cd /home/ubuntu/harmonia_healing_app

# Create a keystore for Android signing (do this once)
# EAS will handle this automatically, but you can create manually:
eas credentials

# Follow prompts to:
# 1. Select "Android"
# 2. Choose "Create new keystore"
# 3. Save credentials securely
```

### 2.3 Verify Build Configuration

```bash
# Check eas.json exists
cat eas.json

# Should contain:
# {
#   "build": {
#     "preview": {
#       "android": { "buildType": "apk" }
#     },
#     "production": {
#       "android": { "buildType": "aab" }
#     }
#   }
# }
```

---

## Part 3: Build the APK with EAS

### 3.1 Build for Preview (Testing APK)

```bash
# Build a preview APK for testing on your device
eas build --platform android --profile preview

# This will:
# 1. Upload your code to EAS
# 2. Build the APK in the cloud
# 3. Provide a download link
# 4. Takes ~15-20 minutes

# Once complete, you'll get a link like:
# https://expo.dev/builds/[build-id]
```

### 3.2 Test the Preview APK

```bash
# Download the APK from the link provided
# Transfer to your Android device
# Install: adb install Harmonia-preview.apk
# Test all features before production build
```

### 3.3 Build for Production (AAB for Play Store)

```bash
# Build production Android App Bundle (required for Play Store)
eas build --platform android --profile production

# This will:
# 1. Create a signed, production-ready AAB
# 2. Takes ~15-20 minutes
# 3. Provides download link

# The AAB file is what you submit to Google Play Store
```

---

## Part 4: Set Up Google Play Developer Account

### 4.1 Create Google Play Developer Account

1. Go to https://play.google.com/console
2. Pay $25 one-time registration fee
3. Complete your developer profile:
   - Developer name
   - Email
   - Address
   - Phone

### 4.2 Agree to Policies

- Accept Google Play Developer Agreement
- Accept Content Rating Questionnaire
- Accept US export laws

---

## Part 5: Create Your App on Google Play Console

### 5.1 Create New App

1. Click **"Create app"** in Google Play Console
2. Fill in:
   - **App name:** "Harmonia"
   - **Default language:** English
   - **App type:** Application
   - **Category:** Health & Fitness (or Lifestyle)
   - **Content rating:** Complete questionnaire

### 5.2 Complete Store Listing

Go to **Store Listing** section and fill in:

**Short description (80 characters):**
```
Advanced sound healing for wellness, meditation, and consciousness expansion
```

**Full description (4000 characters):**
```
Harmonia is a comprehensive sound healing application featuring:

🎵 Advanced Audio Engine:
- Binaural beats (Delta, Theta, Alpha, Beta, Gamma frequencies)
- Isochronic tones for brainwave entrainment
- 5 noise colors (white, pink, brown, purple, blue)
- Sacred OM chanting with cave reverb
- Hemispheric synchronization technology

🧘 Wellness Features:
- Guided meditations for astral projection
- 10-day free trial of Premium features
- Session intent selector (healing, meditation, focus, sleep)
- Customizable sound presets
- Background playback (screen off)

🔐 Smart Features:
- Bluetooth audio routing to cars, speakers, headphones
- Home security camera integration
- Astrological backgrounds (Human Design, Natal Chart, Zodiac)
- Advanced analytics and progress tracking

💜 Healing Frequencies:
- 528 Hz DNA repair frequency
- 136.1 Hz Cosmic OM
- 432 Hz natural harmony
- Complete Solfeggio spectrum
- Schumann resonance (7.83 Hz)

Free Tier: 15-minute sessions, limited frequencies
Premium: $9.99/month - Unlimited sessions, all frequencies
Ultimate: $19.99/month - All features + camera integration
Lifetime: $49.99 one-time - Permanent access

⚠️ IMPORTANT: This app is for relaxation and wellness only. It is NOT a medical device and does not diagnose, treat, cure, or prevent any medical condition. Consult a healthcare provider before use.

See our Health & Safety Guidelines for complete information.
```

**Screenshots (5 required, 1280x720 or 1440x810):**
1. Home screen with brainwave states
2. Sound Studio with frequency controls
3. Presets library
4. Pricing tiers
5. Settings and customization

**Feature Graphic (1024x500):**
Create a banner showing:
- "Harmonia" logo
- "Advanced Sound Healing"
- Purple/indigo healing colors
- Frequency waves visualization

### 5.3 Content Rating

Complete the content rating questionnaire:
- Violence: None
- Sexual content: None
- Profanity: None
- Alcohol/Tobacco: None
- Medical: Wellness/relaxation only (NOT medical)

### 5.4 Privacy Policy & Terms

1. Go to **App content** → **Privacy policy**
2. Add link to your privacy policy:
   ```
   https://harmonia.app/privacy
   ```

3. Go to **App content** → **Terms of Service**
4. Add link to your terms:
   ```
   https://harmonia.app/terms
   ```

---

## Part 6: Upload Your Build

### 6.1 Prepare Your AAB File

```bash
# Download the production AAB from EAS
# It will be named something like: Harmonia-1.0.0.aab
# Save it locally
```

### 6.2 Upload to Google Play Console

1. Go to **Release** → **Production**
2. Click **"Create new release"**
3. Upload your AAB file
4. Fill in release notes:
   ```
   Version 1.0.0 - Initial Release
   
   Features:
   - Binaural beats and isochronic tones
   - OM chanting with cave reverb
   - Bluetooth audio routing
   - 10-day free trial
   - Customizable presets
   - Home security camera integration
   ```

### 6.3 Review & Rollout

1. Review all app information
2. Click **"Review release"**
3. Accept Google Play policies
4. Choose rollout strategy:
   - **Full rollout:** Available to all users immediately
   - **Staged rollout:** Start with 5%, increase gradually

---

## Part 7: Submit for Review

### 7.1 Final Checks

Before submitting, verify:

- ✅ App name and description accurate
- ✅ Screenshots show actual app features
- ✅ Privacy policy is accessible
- ✅ Terms of Service are accessible
- ✅ Health & Safety warnings are clear
- ✅ Medical disclaimer is prominent
- ✅ No false health claims in description
- ✅ Pricing is clearly disclosed
- ✅ Free trial terms are clear
- ✅ Support email is provided

### 7.2 Submit for Review

1. Click **"Submit release"**
2. Google Play will review within 24-48 hours
3. You'll receive email notification of approval or rejection

### 7.3 Common Rejection Reasons & Fixes

**"Medical claims detected"**
- Remove words like "treats," "cures," "prevents"
- Use "for relaxation," "designed to help," "may support"
- Add medical disclaimer prominently

**"Incomplete privacy policy"**
- Ensure privacy policy covers:
  - What data you collect
  - How you use it
  - Third-party sharing
  - User rights

**"Unclear pricing"**
- Clearly state subscription prices
- Explain what's included in each tier
- Clearly explain free trial terms

---

## Part 8: Post-Launch Monitoring

### 8.1 Monitor Reviews & Ratings

- Check daily for user feedback
- Respond to reviews professionally
- Fix bugs reported by users

### 8.2 Track Analytics

In Google Play Console:
- Monitor installs and uninstalls
- Track crash rates
- Monitor user retention
- Check revenue (if applicable)

### 8.3 Update Your App

```bash
# To release an update:
# 1. Update version in app.config.ts
# 2. Make code changes
# 3. Build new AAB: eas build --platform android --profile production
# 4. Upload to Google Play Console
# 5. Submit for review
```

---

## Part 9: Marketing & Growth

### 9.1 Pre-Launch Marketing

- Create social media accounts
- Build landing page (website)
- Create YouTube demo videos
- Reach out to wellness influencers

### 9.2 Post-Launch Growth

- Encourage user reviews
- Run social media campaigns
- Partner with meditation/wellness communities
- Create content marketing (blog posts, guides)

### 9.3 Monetization Optimization

- Monitor conversion rates
- A/B test pricing
- Analyze user retention by tier
- Optimize trial-to-paid conversion

---

## Part 10: Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
eas build --platform android --profile production --clear-cache

# Check logs
eas build:log --build-id [build-id]
```

### APK Won't Install

```bash
# Ensure device has Android 8.0+ (API 26+)
# Check device storage space
# Try: adb install -r Harmonia.apk (reinstall)
```

### App Crashes on Startup

- Check dev server logs
- Verify all providers are wrapped in app/_layout.tsx
- Check for missing dependencies
- Run: npm install

### Submission Rejected

- Read rejection reason carefully
- Make requested changes
- Resubmit (no additional fee)
- Contact Google Play Support if unclear

---

## Part 11: Key Contacts & Resources

**Harmonia Support:**
- Email: support@harmonia.app
- Response time: 48 hours

**Privacy & Legal:**
- Email: privacy@harmonia.app
- Email: health@harmonia.app

**Google Play Support:**
- https://support.google.com/googleplay/android-developer

**Expo Support:**
- https://docs.expo.dev
- https://expo.dev/support

---

## Part 12: Quick Reference Commands

```bash
# Build preview APK
eas build --platform android --profile preview

# Build production AAB
eas build --platform android --profile production

# Check build status
eas build:list

# View build logs
eas build:log --build-id [build-id]

# Manage credentials
eas credentials

# Submit to Play Store (if using EAS Submit)
eas submit --platform android --latest
```

---

## Timeline Estimate

| Step | Time |
|------|------|
| Account setup | 1-2 hours |
| Build APK | 15-20 minutes |
| Test APK | 30 minutes |
| Build production AAB | 15-20 minutes |
| Create Play Store listing | 1-2 hours |
| Upload and review | 24-48 hours |
| **Total** | **3-4 days** |

---

## Success Criteria

Your app is ready to launch when:

✅ All features working in preview APK
✅ No crashes or errors
✅ Privacy policy accessible
✅ Terms of Service accessible
✅ Health & Safety warnings clear
✅ Medical disclaimer prominent
✅ Pricing clearly disclosed
✅ Support email provided
✅ Screenshots show real app features
✅ Description is accurate and compelling

---

**You're ready to launch Harmonia to the world! 🚀**

For questions or support, contact: support@harmonia.app
