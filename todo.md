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