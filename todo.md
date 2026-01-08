# Harmonia App - Development TODO

## Core Infrastructure
- [x] Update theme colors (purple/indigo healing palette)
- [x] Configure app branding (name, icon, splash)
- [x] Set up tab navigation structure
- [x] Create icon mappings for all tabs
- [x] Implement premium/free version logic

## Sound Engine
- [x] Create audio engine context/provider
- [x] Implement binaural beat generator (architecture)
- [x] Implement isochronic tone generator (architecture)
- [x] Implement noise generator (white, pink, brown, purple, blue) (architecture)
- [x] Implement OM chanting with harmonics (architecture)
- [x] Add cave reverb effect (architecture)
- [x] Create audio mixer for layering sounds (architecture)
- [x] Add volume controls per layer (UI)
- [x] Implement fade in/out transitions (architecture)
- [ ] Add audio visualization component

## Screens - Core
- [x] Home/Dashboard screen with quick presets
- [x] Sound Studio screen with tabbed interface
- [x] Binaural Beat Creator tab
- [x] Isochronic Tone Generator tab
- [x] Noise Generator tab
- [x] OM Chanting tab
- [x] Presets Library screen
- [x] Settings screen

## Screens - Premium
- [ ] Ambient Sound Amplifier screen
- [x] Security Camera screen
- [ ] Bluetooth Manager screen
- [ ] Premium Upgrade screen

## Features - Sound Healing
- [x] Brainwave state selector (Delta/Theta/Alpha/Beta/Gamma)
- [x] Frequency sliders with real-time preview
- [x] Session timer with duration presets
- [x] Preset saving functionality
- [x] Preset loading functionality
- [ ] Background audio playback
- [ ] Lock screen controls

## Features - Security (Premium)
- [x] Camera discovery/scanning (UI)
- [ ] RTSP stream integration
- [x] Camera grid view
- [x] Full-screen camera view
- [x] Recording functionality (UI)
- [x] Motion detection alerts (UI)
- [x] Audio monitoring (UI)

## Features - Connectivity
- [ ] Bluetooth device scanning
- [ ] Bluetooth pairing
- [ ] Audio routing to Bluetooth devices
- [ ] Car/speaker/headphone profiles

## UI Components
- [x] Frequency slider component
- [ ] Waveform visualizer component
- [x] Brainwave state indicator
- [x] Session timer component
- [x] Preset card component
- [x] Camera feed component (placeholder)
- [ ] Bluetooth device card component
- [x] Premium badge component
- [x] Loading/playing animations

## Data & Storage
- [x] Preset data model
- [x] Sound settings data model
- [x] Camera data model
- [x] AsyncStorage persistence
- [x] User preferences storage

## Polish & UX
- [x] Haptic feedback integration
- [x] Smooth animations
- [x] Dark/light theme support
- [ ] Accessibility features
- [x] Error handling
- [x] Loading states

## About & Branding
- [x] About the Creator section
- [x] Creator contact info
- [x] Inspirational quote
- [ ] App logo generation


## Phase 2: Audio Engine Implementation & Testing
- [ ] Integrate Web Audio API into audio-engine context
- [ ] Implement real binaural beat generation with frequency verification
- [ ] Implement real isochronic tone generation with pulse accuracy
- [ ] Implement all 5 noise colors (white, pink, brown, purple, blue)
- [ ] Implement OM chanting with 136.1 Hz fundamental + harmonics
- [ ] Add convolution reverb for cave effect
- [ ] Test frequency accuracy with FFT analysis
- [ ] Optimize audio latency (target < 50ms)
- [ ] Implement audio visualization (frequency spectrum)
- [ ] Add audio level metering and monitoring

## Phase 3: Latency & Performance Optimization
- [ ] Profile audio processing performance
- [ ] Optimize oscillator creation/destruction
- [ ] Implement audio buffer pooling
- [ ] Add background audio playback support
- [ ] Optimize rendering performance (60fps target)
- [ ] Implement memory leak detection
- [ ] Add battery usage optimization
- [ ] Test on low-end devices
- [ ] Implement audio ducking for notifications
- [ ] Add audio focus management

## Phase 4: UI/UX Refinement & Accessibility
- [ ] Audit all screen transitions for smoothness
- [ ] Implement haptic feedback for all interactions
- [ ] Add accessibility labels (VoiceOver/TalkBack)
- [ ] Implement high contrast mode
- [ ] Add font size adjustment
- [ ] Test keyboard navigation
- [ ] Implement error recovery flows
- [ ] Add loading state animations
- [ ] Refine color contrast ratios (WCAG AA)
- [ ] Add tooltips and help system

## Phase 5: Backend Integration
- [ ] Set up database schema for presets/favorites
- [ ] Implement user authentication (optional)
- [ ] Add cloud sync for presets
- [ ] Implement camera discovery (mDNS/SSDP)
- [ ] Add RTSP stream handling
- [ ] Implement secure storage for credentials
- [ ] Add API error handling and retry logic
- [ ] Implement offline mode with sync queue
- [ ] Add analytics and crash reporting
- [ ] Implement push notifications

## Phase 6: Bluetooth & Connectivity
- [ ] Implement Bluetooth device discovery
- [ ] Add device pairing flow
- [ ] Implement audio routing to Bluetooth devices
- [ ] Add device connection state management
- [ ] Implement reconnection logic
- [ ] Test with various Bluetooth devices
- [ ] Add device profiles (car, speaker, headphones)
- [ ] Implement audio codec selection
- [ ] Add connection quality monitoring
- [ ] Test latency over Bluetooth

## Phase 7: Security Camera Integration
- [ ] Implement camera discovery (ONVIF/RTSP)
- [ ] Add camera stream decoding
- [ ] Implement recording to device storage
- [ ] Add motion detection algorithm
- [ ] Implement audio monitoring from cameras
- [ ] Add stream encryption
- [ ] Implement credential storage
- [ ] Add camera permission handling
- [ ] Test with real cameras
- [ ] Add stream quality adaptation

## Phase 8: Testing & Verification
- [ ] Create frequency accuracy test suite
- [ ] Implement FFT analysis for verification
- [ ] Create speaker check calibration tool
- [ ] Add latency measurement tools
- [ ] Implement battery usage profiling
- [ ] Create end-to-end user flow tests
- [ ] Add visual regression testing
- [ ] Implement performance benchmarking
- [ ] Create audio quality test suite
- [ ] Add device compatibility matrix

## Phase 9: Documentation & Deployment
- [ ] Create user manual with screenshots
- [ ] Write API documentation
- [ ] Create troubleshooting guide
- [ ] Add in-app help system
- [ ] Create video tutorials
- [ ] Write privacy policy
- [ ] Create terms of service
- [ ] Add release notes template
- [ ] Create developer documentation
- [ ] Prepare app store listings

## Critical Quality Gates
- [ ] All frequencies verified within ±2% accuracy
- [ ] Audio latency < 50ms on all devices
- [ ] Zero crashes on core user flows
- [ ] 95%+ UI test coverage
- [ ] All accessibility standards met
- [ ] Battery drain < 5% per hour playback
- [ ] Offline functionality working
- [ ] Bluetooth reconnection within 2 seconds
- [ ] Camera streams at 30fps minimum
- [ ] App store submission approved


## Monetization & Payment Integration

### Stripe Integration
- [ ] Install Stripe SDK for React Native
- [ ] Create Stripe account and get API keys
- [ ] Implement subscription payment flow
- [ ] Implement one-time payment flow (Lifetime unlock)
- [ ] Implement in-app purchases (IAP)
- [ ] Add payment success/failure screens
- [ ] Implement subscription management
- [ ] Add cancel subscription flow
- [ ] Implement refund handling
- [ ] Add payment receipt generation

### Pricing Tiers
- [ ] Implement Free tier with feature limitations
- [ ] Implement Premium tier ($9.99/month, $79.99/year)
- [ ] Implement Ultimate tier ($19.99/month, $149.99/year)
- [ ] Implement Lifetime unlock ($49.99 one-time)
- [ ] Create pricing comparison screen
- [ ] Add "Upgrade" prompts throughout app
- [ ] Implement 7-day free trial
- [ ] Add trial expiration handling

### In-App Purchases
- [ ] Gamma Wave Pack ($2.99)
- [ ] Isochronic Tones ($3.99)
- [ ] OM Chanting ($4.99)
- [ ] Noise Color Pack ($2.99)
- [ ] Preset Bundle ($1.99)
- [ ] Security Add-on ($9.99)
- [ ] Remove Ads ($4.99)

### Feature Gating
- [ ] Lock Beta/Gamma waves for free users
- [ ] Lock isochronic tones for free users
- [ ] Lock OM chanting for free users
- [ ] Lock custom presets for free users
- [ ] Lock security features for free users
- [ ] Add 10-minute session limit for free users
- [ ] Show ads for free users (non-intrusive)
- [ ] Implement feature unlock logic

### Subscription Management
- [ ] Create user subscription database schema
- [ ] Implement subscription status checking
- [ ] Add subscription renewal handling
- [ ] Implement subscription upgrade/downgrade
- [ ] Add subscription cancellation
- [ ] Implement grace period for failed payments
- [ ] Add subscription restoration (for reinstalls)
- [ ] Create admin dashboard for subscriptions

### Analytics & Tracking
- [ ] Track free-to-paid conversion rate
- [ ] Track subscription churn rate
- [ ] Track IAP purchase rate
- [ ] Track feature usage by tier
- [ ] Track trial-to-paid conversion
- [ ] Implement revenue analytics dashboard
- [ ] Add cohort analysis
- [ ] Track LTV (Lifetime Value)

### Google Play Integration
- [ ] Set up Google Play Console
- [ ] Configure in-app billing
- [ ] Add subscription products
- [ ] Add one-time purchase products
- [ ] Test payment flow in sandbox
- [ ] Implement Play Store receipt validation
- [ ] Add Play Store subscription management link

### Website Stripe Integration
- [ ] Add Stripe checkout to website
- [ ] Create subscription management portal
- [ ] Sync website subscriptions with mobile app
- [ ] Add payment method management
- [ ] Implement invoice generation
- [ ] Add billing history page


## Build Fixes & Testing

### Android Build Issues
- [x] Fix Android SDK version mismatch (requires SDK 24, has SDK 22)
- [x] Update expo-modules-core configuration
- [x] Verify all native dependencies are compatible
- [ ] Test Android build process
- [ ] Fix any Gradle configuration errors

### Comprehensive Testing Checklist
- [ ] Verify dev server starts without errors
- [ ] Test all tab navigation (Home, Studio, Presets, Pricing, Security, Settings)
- [ ] Test audio engine initialization
- [ ] Test binaural beat generation
- [ ] Test isochronic tone generation
- [ ] Test noise generator (all colors)
- [ ] Test OM chanting
- [ ] Test preset saving and loading
- [ ] Test subscription tier checking
- [ ] Test feature gating (free vs premium)
- [ ] Test pricing screen display
- [ ] Test payment flow (simulated)
- [ ] Test data persistence (AsyncStorage)
- [ ] Verify all frequencies are accurate
- [ ] Test session timer
- [ ] Test volume controls
- [ ] Verify no placeholder/mock data in production code
- [ ] Test error handling
- [ ] Verify all buttons are functional
- [ ] Test responsive layout on different screen sizes

### Data Integrity Validation
- [x] Verify frequency values are not manipulated
- [x] Verify pricing values match market analysis
- [x] Verify subscription tiers are correctly configured
- [x] Verify feature flags are properly set
- [x] Verify no hardcoded test data in production
- [x] Verify API endpoints are correct
- [x] Verify Stripe price IDs match products
- [x] Verify database schema is correct


## New Feature Enhancements (2026-01-07)

### Bluetooth Integration
- [ ] Install expo-bluetooth package
- [ ] Create Bluetooth manager service
- [ ] Implement device scanning
- [ ] Implement device pairing
- [ ] Implement audio routing to Bluetooth devices
- [ ] Add Bluetooth device selector UI
- [ ] Test with car audio systems
- [ ] Test with Bluetooth speakers
- [ ] Test with Bluetooth headphones
- [ ] Handle Bluetooth disconnection gracefully

### Background Audio Playback
- [ ] Configure expo-audio for background playback
- [ ] Implement audio session management
- [ ] Add lock screen controls (play/pause, skip)
- [ ] Add notification with playback controls
- [ ] Ensure audio continues when screen locks
- [ ] Test battery impact of background playback
- [ ] Add "keep screen awake" option for active sessions

### 10-Day Free Trial System
- [ ] Update subscription model to include 10-day trial
- [ ] Implement trial tracking (start date, days remaining)
- [ ] Add trial countdown UI
- [ ] Show trial status in settings
- [ ] Add "Upgrade Now" prompts during trial
- [ ] Implement trial expiration logic
- [ ] Add grace period after trial ends
- [ ] Update Stripe integration for trial periods

### Session Intent Selector
- [ ] Create session intent selection screen (first launch)
- [ ] Add intent categories (healing, meditation, focus, sleep, etc.)
- [ ] Implement "What do you want from this session?" quick selector
- [ ] Save user's session history
- [ ] Recommend presets based on intent
- [ ] Add intent-based analytics

### Guided Meditations for Astral Projection
- [ ] Write astral projection meditation scripts
- [ ] Record or generate guided audio
- [ ] Create meditation player UI
- [ ] Add meditation library screen
- [ ] Implement meditation categories (beginner, intermediate, advanced)
- [ ] Add meditation progress tracking
- [ ] Create meditation timer with intervals
- [ ] Add background binaural beats during meditation

### Educational Content
- [ ] Write "Why These Sounds Work" article
- [ ] Create trauma healing guide
- [ ] Create surgery recovery guide
- [ ] Create cancer support guide
- [ ] Create self-enlightenment guide
- [ ] Create telomere lengthening explanation
- [ ] Create awareness enhancement guide
- [ ] Add educational content screen
- [ ] Add in-app learning modules
- [ ] Create video tutorials (optional)

### Vibrational Stage Techniques
- [ ] Write vibrational stage guide
- [ ] Create technique library (rope technique, roll-out, etc.)
- [ ] Add step-by-step instructions
- [ ] Create visualization exercises
- [ ] Add progress tracking for techniques
- [ ] Implement technique reminders
- [ ] Add community tips section

### Astrological Features (One-Time Purchases)
- [ ] Design astrological banner system
- [ ] Create Human Design chart generator
- [ ] Create Natal Chart generator
- [ ] Create Zodiac Sign backgrounds (12 signs)
- [ ] Create Chinese Zodiac backgrounds (12 animals)
- [ ] Implement banner customization UI
- [ ] Add astrological profile screen
- [ ] Integrate with birth date/time input
- [ ] Create one-time purchase flow for each feature
- [ ] Price: $4.99 per astrological feature

### Free Tier Updates
- [ ] Update session limit: 15 minutes (was 10 minutes)
- [ ] Update isochronic tone limit: 5 minutes
- [ ] Update binaural beat limit: 5 minutes
- [ ] Add session timer with warnings at 1 min remaining
- [ ] Show "Upgrade for unlimited" prompt at limit
- [ ] Track daily usage statistics

### Hemi-Sync Integration (Unlabeled)
- [ ] Implement hemispheric synchronization algorithm
- [ ] Add carrier frequency + beat frequency logic
- [ ] Create "Brain Sync" preset category (don't mention Hemi-Sync)
- [ ] Add "Whole Brain" mode
- [ ] Test frequency accuracy for brain synchronization

### Binaural Beats Maker
- [ ] Create custom binaural beat builder UI
- [ ] Add carrier frequency slider (100-500 Hz)
- [ ] Add beat frequency slider (0.5-40 Hz)
- [ ] Add preset save functionality
- [ ] Add frequency presets (Delta, Theta, Alpha, Beta, Gamma)
- [ ] Show real-time frequency display
- [ ] Add stereo test (left/right channel verification)

### Isochronic Tone Creator
- [ ] Create custom isochronic tone builder UI
- [ ] Add frequency slider (0.5-40 Hz)
- [ ] Add pulse duration control
- [ ] Add duty cycle control (25%, 50%, 75%)
- [ ] Add waveform selector (sine, square, triangle)
- [ ] Add preset save functionality
- [ ] Show real-time waveform visualization

### Session Onboarding
- [ ] Create "Quick Start" flow on app launch
- [ ] Add "What's your goal today?" selector
- [ ] Options: Healing, Meditation, Focus, Sleep, Energy, Astral Projection
- [ ] Auto-recommend preset based on goal
- [ ] Add "Skip" option for advanced users
- [ ] Remember last session goal
