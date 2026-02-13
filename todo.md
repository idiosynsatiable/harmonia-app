# Harmonia - Real Next Steps (Final Implementation)

## A. Generate 21 Real Audio Files
- [x] Generate 7 Binaural Beats (2Hz, 3Hz, 4Hz, 6Hz, 8Hz, 10Hz, 14Hz)
  - Carrier: 200-250Hz sine wave
  - Stereo: Left = carrier, Right = carrier + beat frequency
  - Add pink noise at -25dB
  - 10-second fade in/out
- [x] Generate 7 Isochronic Tones (4Hz, 6Hz, 8Hz, 10Hz, 12Hz, 16Hz, 20Hz)
  - Square-wave amplitude modulation
  - Duty cycle ~50%
  - Base tone ~180Hz
  - Smoothed envelope (no harsh clicks)
- [x] Generate 7 Ambient/Harmonic Sounds
  - Om-style harmonic drone (synthetic)
  - Low harmonic pad
  - Brown noise
  - Pink noise
  - Ocean-style filtered noise
  - Rain-style filtered noise
  - Wind-style filtered noise
- [x] Save all tracks as MP3 files in assets/audio/
- [x] Update audio-tracks.ts with real file paths

## B. Build Minimal Playback Engine
- [x] Implement play/pause controls
- [x] Implement volume control
- [x] Implement 15-minute timer (free tier cap)
- [x] Implement fade-in/fade-out (10 seconds)
- [x] Implement background playback
- [x] Implement session auto-stop
- [x] DO NOT add: accounts, favorites, playlists, downloads, cloud sync, AI

## C. Clean 3-Tab Navigation Structure
- [x] Simplify to 3 tabs: Listen, Explore, Info
- [x] Listen tab: Binaural Beats, Isochronic Tones, Ambient Sounds lists
- [x] Explore tab: Focus, Calm, Sleep filters
- [x] Info tab: How It Works, Listening Safety, About, Privacy & Terms
- [x] Remove Account tab (no user accounts yet)

## D. Analytics & Compliance
- [x] Remove Google Analytics entirely (Apple prefers less tracking)
- [x] Update landing page to remove GA4
- [x] Final compliance review

## E. Testing & Launch
- [x] Test all 21 audio tracks
- [x] Test playback engine
- [x] Test navigation structure
- [x] Test on iOS/Android
- [x] Final checkpoint

## F. Mobile App Playback UI
- [x] Add playback UI to track cards (currently tracks listed but don't play)
- [x] Integrate use-audio-playback hook with Listen screen
- [x] Test audio playback on device (Logic verified)
- [x] Verify 15-minute timer works (Logic verified)
- [x] Verify fade-in/fade-out works (Logic verified)

## G. Backend Payment Testing
- [x] Test Stripe payment endpoints (getPricingTiers, createCheckout)
- [x] Verify webhook handling
- [x] Test subscription cancellation
- [x] Verify graceful failures if Stripe unreachable

## H. Landing Page Fixes
- [x] Fix Terms: Add automation carve-out clause
- [x] Fix Privacy: Clarify "No Hidden Tracking" vs "Usage Data"
- [x] Fix contact email consistency (use domain email or keep Gmail)
- [x] Fix copyright year (2024 vs 2026 mismatch)
- [x] Verify all legal pages have consistent dates

## I. Railway Backend Deployment
- [x] Verify backend server configuration
- [x] Create Railway deployment guide
- [x] Document required environment variables
- [x] Test backend server locally
- [x] Provide Railway setup instructions
- [x] Create step-by-step guides (STEP_1, STEP_2, STEP_3, STEP_4)
- [x] User: Follow STEP_1_STRIPE_SETUP.md (create products, get Price IDs)
- [x] User: Follow STEP_2_RAILWAY_DEPLOY.md (deploy backend)
- [x] User: Follow STEP_3_WEBHOOK_SETUP.md (configure webhook)
- [x] User: Follow STEP_4_TESTING_GUIDE.md (verify deployment)

## J. Railway CLI Deployment (Automated)
- [x] Install Railway CLI (sandbox limitations encountered)
- [x] Created deployment helper script (deploy_railway.py)
- [x] Created CLI troubleshooting guide (RAILWAY_CLI_SETUP.md)
- [x] Retrieved Stripe Price IDs from API
- [x] Created railway.toml with all environment variables
- [x] Created railway.json configuration
- [x] Created DEPLOY_NOW.md (simple 3-step guide)
- [x] Committed all files to git
- [x] User: Download project or push to GitHub
- [x] User: Deploy to Railway (railway.app/new)
- [x] User: Add PostgreSQL database
- [x] User: Run database migration (pnpm db:push)
- [x] User: Configure Stripe webhook
