# Harmonia App - Comprehensive QA & Testing Protocol

## Executive Summary

This document outlines the complete quality assurance and testing protocol for the Harmonia advanced sound healing application. It covers frequency accuracy verification, latency optimization, UI/UX testing, backend integration validation, and speaker calibration procedures.

---

## Part 1: Frequency Accuracy Verification

### 1.1 Binaural Beat Frequency Testing

**Objective:** Verify that binaural beats are generated at precise frequencies within ±2% accuracy.

**Test Procedure:**

1. **Delta Wave (4 Hz)**
   - Carrier: 200 Hz
   - Beat: 4 Hz
   - Duration: 30 seconds
   - Expected Result: Brain perceives 4 Hz frequency
   - Verification: FFT analysis should show peak at 4 Hz ±0.08 Hz

2. **Theta Wave (6 Hz)**
   - Carrier: 200 Hz
   - Beat: 6 Hz
   - Duration: 30 seconds
   - Expected Result: Brain perceives 6 Hz frequency
   - Verification: FFT analysis should show peak at 6 Hz ±0.12 Hz

3. **Alpha Wave (10 Hz)**
   - Carrier: 200 Hz
   - Beat: 10 Hz
   - Duration: 30 seconds
   - Expected Result: Brain perceives 10 Hz frequency
   - Verification: FFT analysis should show peak at 10 Hz ±0.2 Hz

4. **Beta Wave (20 Hz)**
   - Carrier: 200 Hz
   - Beat: 20 Hz
   - Duration: 30 seconds
   - Expected Result: Brain perceives 20 Hz frequency
   - Verification: FFT analysis should show peak at 20 Hz ±0.4 Hz

5. **Gamma Wave (40 Hz)**
   - Carrier: 200 Hz
   - Beat: 40 Hz
   - Duration: 30 seconds
   - Expected Result: Brain perceives 40 Hz frequency
   - Verification: FFT analysis should show peak at 40 Hz ±0.8 Hz

**Acceptance Criteria:**
- ✓ All frequencies accurate within ±2%
- ✓ THD (Total Harmonic Distortion) < 5%
- ✓ SNR (Signal-to-Noise Ratio) > 40 dB

### 1.2 Isochronic Tone Frequency Testing

**Objective:** Verify isochronic tone pulse accuracy and frequency stability.

**Test Procedure:**

1. **Delta Isochronic (4 Hz pulse rate)**
   - Frequency: 40 Hz
   - Pulse Rate: 4 Hz
   - Duration: 30 seconds
   - Expected: 4 pulses per second at 40 Hz
   - Verification: Oscilloscope should show clean 4 Hz pulse pattern

2. **Theta Isochronic (7 Hz pulse rate)**
   - Frequency: 40 Hz
   - Pulse Rate: 7 Hz
   - Duration: 30 seconds
   - Expected: 7 pulses per second at 40 Hz
   - Verification: Oscilloscope should show clean 7 Hz pulse pattern

3. **Alpha Isochronic (10 Hz pulse rate)**
   - Frequency: 40 Hz
   - Pulse Rate: 10 Hz
   - Duration: 30 seconds
   - Expected: 10 pulses per second at 40 Hz
   - Verification: Oscilloscope should show clean 10 Hz pulse pattern

**Acceptance Criteria:**
- ✓ Pulse rate accurate within ±1%
- ✓ Pulse duty cycle 50% ±5%
- ✓ Frequency stable throughout duration
- ✓ No phase drift detected

### 1.3 Healing Frequency Testing

**Objective:** Verify that healing frequencies are generated accurately.

**Test Procedure:**

1. **528 Hz (DNA Repair)**
   - Expected: 528 Hz ±5 Hz
   - Verification: FFT should show peak at 528 Hz
   - Duration: 1 minute
   - Harmonics: Should include 1056 Hz, 1584 Hz

2. **432 Hz (Natural Harmony)**
   - Expected: 432 Hz ±4 Hz
   - Verification: FFT should show peak at 432 Hz
   - Duration: 1 minute
   - Harmonics: Should include 864 Hz, 1296 Hz

3. **136.1 Hz (Cosmic OM)**
   - Expected: 136.1 Hz ±1.4 Hz
   - Verification: FFT should show peak at 136.1 Hz
   - Duration: 1 minute
   - Harmonics: Should include 272.2 Hz, 408.3 Hz, 680.5 Hz

4. **Solfeggio Frequencies**
   - 174 Hz (Foundation): ±1.7 Hz
   - 285 Hz (Tissue Repair): ±2.85 Hz
   - 396 Hz (Liberation): ±3.96 Hz
   - 417 Hz (Transformation): ±4.17 Hz
   - 528 Hz (Healing): ±5.28 Hz
   - 639 Hz (Connection): ±6.39 Hz
   - 741 Hz (Intuition): ±7.41 Hz
   - 852 Hz (Awakening): ±8.52 Hz
   - 963 Hz (Crown Chakra): ±9.63 Hz

**Acceptance Criteria:**
- ✓ All frequencies within specified tolerance
- ✓ Harmonic series present and accurate
- ✓ No frequency drift over 5 minutes
- ✓ Amplitude stable (±3% variation)

### 1.4 OM Chanting Frequency Testing

**Objective:** Verify OM chanting fundamental and harmonic content.

**Test Procedure:**

1. **Fundamental Frequency**
   - Expected: 136.1 Hz ±1.4 Hz
   - Verification: FFT peak analysis
   - Duration: 2 minutes

2. **Harmonic Series**
   - 2nd Harmonic: 272.2 Hz
   - 3rd Harmonic: 408.3 Hz
   - 5th Harmonic: 680.5 Hz
   - 8th Harmonic: 1088.8 Hz
   - 13th Harmonic: 1769.3 Hz

3. **Vibrato Modulation**
   - Vibrato Frequency: 5 Hz ±0.5 Hz
   - Vibrato Depth: ±2 cents
   - Verification: Frequency modulation visible in spectrogram

**Acceptance Criteria:**
- ✓ Fundamental accurate within ±1%
- ✓ All harmonics present and within ±2%
- ✓ Vibrato smooth and consistent
- ✓ No aliasing or artifacts

---

## Part 2: Latency & Performance Testing

### 2.1 Audio Latency Measurement

**Objective:** Measure end-to-end audio latency from user input to speaker output.

**Test Procedure:**

1. **Baseline Latency**
   - Measure: Time from play button press to first audio output
   - Target: < 50 ms
   - Method: High-speed audio analysis with reference click

2. **Buffer Latency**
   - Measure: Audio buffer processing time
   - Target: < 20 ms
   - Method: Monitor buffer fill/drain rates

3. **Device Latency**
   - Test on: Multiple devices (flagship, mid-range, budget)
   - Target: < 100 ms on all devices
   - Method: Measure on each device type

**Acceptance Criteria:**
- ✓ Desktop/Web: < 30 ms
- ✓ Mobile (high-end): < 50 ms
- ✓ Mobile (mid-range): < 75 ms
- ✓ Mobile (budget): < 100 ms

### 2.2 CPU Usage Profiling

**Objective:** Ensure audio processing doesn't consume excessive CPU.

**Test Procedure:**

1. **Single Sound Generation**
   - Binaural beats: Target < 5% CPU
   - Isochronic tones: Target < 3% CPU
   - Noise generation: Target < 8% CPU
   - OM chanting: Target < 10% CPU

2. **Multiple Simultaneous Sounds**
   - Binaural + Noise: Target < 15% CPU
   - Binaural + OM + Noise: Target < 20% CPU
   - All sounds: Target < 25% CPU

3. **Long Duration Playback**
   - Duration: 1 hour continuous
   - Target: No CPU spikes or thermal throttling
   - Monitor: CPU usage, temperature, battery drain

**Acceptance Criteria:**
- ✓ Single sound < 10% CPU
- ✓ Multiple sounds < 25% CPU
- ✓ No thermal throttling
- ✓ Battery drain < 5% per hour

### 2.3 Memory Usage Analysis

**Objective:** Ensure audio engine doesn't leak memory.

**Test Procedure:**

1. **Initial Memory**
   - Baseline: Measure memory before audio
   - Target: < 50 MB

2. **During Playback**
   - Monitor: Memory usage over 30 minutes
   - Target: Stable, no growth
   - Method: Memory profiler

3. **After Stopping**
   - Measure: Memory after stopping audio
   - Target: Return to baseline ±5%
   - Verify: No memory leaks

**Acceptance Criteria:**
- ✓ Baseline < 50 MB
- ✓ Playback memory stable
- ✓ Post-playback memory returns to baseline
- ✓ No memory leaks detected

---

## Part 3: UI/UX Testing

### 3.1 Navigation Flow Testing

**Test Cases:**

| Screen | Action | Expected Result | Status |
|--------|--------|-----------------|--------|
| Home | Tap "Binaural Beats" | Navigate to Sound Studio | ☐ Pass |
| Home | Tap "Presets" | Navigate to Presets Library | ☐ Pass |
| Home | Tap "Settings" | Navigate to Settings | ☐ Pass |
| Studio | Tap "Delta" | Load Delta preset | ☐ Pass |
| Studio | Tap "Play" | Audio starts playing | ☐ Pass |
| Studio | Tap "Pause" | Audio pauses | ☐ Pass |
| Presets | Tap preset | Load and play preset | ☐ Pass |
| Settings | Toggle theme | Theme changes | ☐ Pass |

### 3.2 Button Responsiveness Testing

**Test Procedure:**

1. **All Buttons**
   - Verify: Each button is clickable
   - Verify: Visual feedback on press (scale, opacity)
   - Verify: Action triggers correctly
   - Verify: No dead zones

2. **Slider Controls**
   - Verify: Smooth dragging
   - Verify: Value updates in real-time
   - Verify: Haptic feedback on change
   - Verify: Min/max limits enforced

3. **Toggle Switches**
   - Verify: Toggle action works
   - Verify: State persists
   - Verify: Visual feedback clear

**Acceptance Criteria:**
- ✓ All buttons responsive (< 100ms)
- ✓ Visual feedback immediate
- ✓ No duplicate actions
- ✓ Haptic feedback consistent

### 3.3 Accessibility Testing

**Test Cases:**

| Feature | Test | Expected | Status |
|---------|------|----------|--------|
| VoiceOver | Enable on iOS | All elements labeled | ☐ Pass |
| TalkBack | Enable on Android | All elements labeled | ☐ Pass |
| High Contrast | Enable | Text readable | ☐ Pass |
| Font Size | Increase | UI adapts | ☐ Pass |
| Color Blindness | Simulate | All info conveyed | ☐ Pass |
| Keyboard Nav | Tab through | All controls accessible | ☐ Pass |

### 3.4 Dark/Light Theme Testing

**Test Procedure:**

1. **Light Theme**
   - Verify: All text readable (contrast ≥ 4.5:1)
   - Verify: Icons visible
   - Verify: Colors match brand

2. **Dark Theme**
   - Verify: All text readable (contrast ≥ 4.5:1)
   - Verify: Icons visible
   - Verify: Colors match brand
   - Verify: No eye strain

3. **Theme Switching**
   - Verify: Smooth transition
   - Verify: State preserved
   - Verify: No visual glitches

**Acceptance Criteria:**
- ✓ WCAG AA contrast ratio (4.5:1 minimum)
- ✓ Smooth theme switching
- ✓ All elements visible in both themes

---

## Part 4: Backend Integration Testing

### 4.1 Preset Storage Testing

**Test Cases:**

| Action | Expected | Status |
|--------|----------|--------|
| Save preset | Stored locally | ☐ Pass |
| Load preset | Settings applied | ☐ Pass |
| Delete preset | Removed from list | ☐ Pass |
| Sync presets | Cloud sync works | ☐ Pass |
| Offline | Presets available | ☐ Pass |

### 4.2 Camera Integration Testing

**Test Procedure:**

1. **Camera Discovery**
   - Verify: Cameras found on network
   - Verify: Camera list updated
   - Verify: Connection status shown

2. **Live Streaming**
   - Verify: Stream starts within 2 seconds
   - Verify: 30+ fps maintained
   - Verify: No latency > 1 second

3. **Recording**
   - Verify: Recording starts/stops
   - Verify: Files saved correctly
   - Verify: Playback works

4. **Motion Detection**
   - Verify: Alerts triggered
   - Verify: Notifications sent
   - Verify: Recording on motion

**Acceptance Criteria:**
- ✓ Camera discovery < 5 seconds
- ✓ Stream latency < 1 second
- ✓ Recording stable
- ✓ Motion detection accurate

### 4.3 Bluetooth Connectivity Testing

**Test Procedure:**

1. **Device Discovery**
   - Verify: Bluetooth devices found
   - Verify: Device list updated
   - Verify: Signal strength shown

2. **Pairing**
   - Verify: Pairing successful
   - Verify: Device remembered
   - Verify: Auto-reconnect works

3. **Audio Routing**
   - Verify: Audio routes to device
   - Verify: Volume control works
   - Verify: Quality maintained

4. **Reconnection**
   - Verify: Reconnects within 2 seconds
   - Verify: Audio resumes
   - Verify: No audio loss

**Acceptance Criteria:**
- ✓ Discovery < 5 seconds
- ✓ Pairing < 10 seconds
- ✓ Reconnection < 2 seconds
- ✓ Audio quality maintained

---

## Part 5: Speaker Calibration & Verification

### 5.1 Speaker Check Procedure

**Objective:** Verify speaker output is producing correct frequencies.

**Equipment Needed:**
- Frequency analyzer app (e.g., Spectroid, AudioTool)
- Reference microphone (optional)
- Calibrated speakers

**Test Procedure:**

1. **1000 Hz Reference Tone**
   - Play 1000 Hz tone
   - Measure with analyzer
   - Expected: 1000 Hz ±10 Hz
   - Record calibration factor

2. **Healing Frequencies**
   - Play 528 Hz
   - Measure: Should be 528 Hz ±5 Hz
   - Play 432 Hz
   - Measure: Should be 432 Hz ±4 Hz
   - Play 136.1 Hz
   - Measure: Should be 136.1 Hz ±1.4 Hz

3. **Binaural Beats**
   - Play 200 Hz carrier + 4 Hz beat
   - Measure: Left/right channels should differ by 4 Hz
   - Verify with stereo analyzer

4. **Noise Colors**
   - Play white noise
   - Verify: Flat frequency response
   - Play pink noise
   - Verify: -3dB/octave rolloff
   - Play brown noise
   - Verify: -6dB/octave rolloff

**Acceptance Criteria:**
- ✓ All frequencies within tolerance
- ✓ Stereo separation correct
- ✓ Noise colors accurate
- ✓ No distortion detected

### 5.2 Audio Quality Verification

**Test Procedure:**

1. **Frequency Response**
   - Range: 20 Hz - 20 kHz
   - Flatness: ±3 dB
   - Measurement: Use frequency sweep

2. **Harmonic Distortion**
   - THD: < 5%
   - Measurement: FFT analysis
   - Test at: 0.3, 0.5, 0.7 volume levels

3. **Signal-to-Noise Ratio**
   - SNR: > 40 dB
   - Measurement: Noise floor analysis
   - Test: All frequencies

4. **Dynamic Range**
   - Range: > 60 dB
   - Measurement: Min/max levels
   - Test: All volume levels

**Acceptance Criteria:**
- ✓ Frequency response flat ±3 dB
- ✓ THD < 5%
- ✓ SNR > 40 dB
- ✓ Dynamic range > 60 dB

---

## Part 6: End-to-End User Flow Testing

### 6.1 Complete Meditation Session

**Test Scenario:**

1. **Launch App**
   - ✓ App opens without crashes
   - ✓ Home screen displays
   - ✓ All buttons visible

2. **Select Brainwave**
   - ✓ Tap "Theta" brainwave
   - ✓ Studio screen opens
   - ✓ Theta preset loaded

3. **Customize Settings**
   - ✓ Adjust frequency slider
   - ✓ Set duration to 20 minutes
   - ✓ Enable cave reverb

4. **Start Session**
   - ✓ Tap "Play" button
   - ✓ Audio starts immediately
   - ✓ Timer begins counting

5. **During Session**
   - ✓ Audio plays continuously
   - ✓ No stuttering or glitches
   - ✓ Volume control works
   - ✓ Pause/resume works

6. **End Session**
   - ✓ Timer reaches zero
   - ✓ Audio fades out smoothly
   - ✓ Session summary shown
   - ✓ Option to save session

7. **Save Session**
   - ✓ Tap "Save"
   - ✓ Session saved to library
   - ✓ Can be replayed later

**Acceptance Criteria:**
- ✓ Zero crashes
- ✓ Smooth audio playback
- ✓ All features functional
- ✓ Session saved correctly

### 6.2 Premium Feature Testing

**Test Scenario:**

1. **Attempt Premium Feature (Free User)**
   - ✓ Tap "Gamma" brainwave
   - ✓ Premium lock shown
   - ✓ Upgrade prompt displayed

2. **Upgrade to Premium**
   - ✓ Tap "Upgrade"
   - ✓ Payment screen opens
   - ✓ Purchase completes

3. **Access Premium Feature**
   - ✓ Gamma brainwave now accessible
   - ✓ All premium features unlocked
   - ✓ No more lock icons

**Acceptance Criteria:**
- ✓ Feature gating works
- ✓ Upgrade flow smooth
- ✓ Premium features accessible

---

## Part 7: Device Compatibility Testing

### 7.1 Device Matrix

| Device | OS | Version | Status |
|--------|----|---------| -------|
| iPhone 15 Pro | iOS | 17.x | ☐ Pass |
| iPhone 14 | iOS | 16.x | ☐ Pass |
| iPhone 12 | iOS | 15.x | ☐ Pass |
| Samsung S24 | Android | 14 | ☐ Pass |
| Samsung S23 | Android | 13 | ☐ Pass |
| Pixel 8 | Android | 14 | ☐ Pass |
| iPad Pro | iPadOS | 17.x | ☐ Pass |
| Android Tablet | Android | 13 | ☐ Pass |

### 7.2 Network Conditions

| Condition | Speed | Latency | Status |
|-----------|-------|---------|--------|
| WiFi 5GHz | 100+ Mbps | < 10ms | ☐ Pass |
| WiFi 2.4GHz | 50 Mbps | < 20ms | ☐ Pass |
| 4G LTE | 20 Mbps | < 50ms | ☐ Pass |
| 5G | 100+ Mbps | < 10ms | ☐ Pass |
| Offline | N/A | N/A | ☐ Pass |

---

## Part 8: Performance Benchmarks

### 8.1 Load Times

| Screen | Target | Measured | Status |
|--------|--------|----------|--------|
| App Launch | < 2s | ☐ | ☐ Pass |
| Home Screen | < 1s | ☐ | ☐ Pass |
| Sound Studio | < 1s | ☐ | ☐ Pass |
| Presets Load | < 2s | ☐ | ☐ Pass |
| Camera View | < 3s | ☐ | ☐ Pass |

### 8.2 Battery Impact

| Activity | Duration | Battery Drain | Target | Status |
|----------|----------|---------------|--------|--------|
| Binaural Playback | 1 hour | ☐ % | < 5% | ☐ Pass |
| Isochronic Playback | 1 hour | ☐ % | < 5% | ☐ Pass |
| Camera Streaming | 1 hour | ☐ % | < 10% | ☐ Pass |
| Idle (Screen Off) | 1 hour | ☐ % | < 1% | ☐ Pass |

---

## Part 9: Security & Privacy Testing

### 9.1 Data Security

- [ ] Credentials encrypted in storage
- [ ] API calls use HTTPS
- [ ] No sensitive data in logs
- [ ] Secure key storage implemented
- [ ] No hardcoded secrets

### 9.2 Privacy

- [ ] Privacy policy accessible
- [ ] User data not shared
- [ ] Camera access permission requested
- [ ] Microphone access permission requested
- [ ] Location not accessed

---

## Part 10: Regression Testing

### 10.1 Critical Paths

After each update, verify:

1. **Audio Generation**
   - [ ] Binaural beats generate
   - [ ] Isochronic tones generate
   - [ ] Noise colors generate
   - [ ] OM chanting generates

2. **Playback**
   - [ ] Play/pause works
   - [ ] Volume control works
   - [ ] Timer works
   - [ ] Fade in/out works

3. **Navigation**
   - [ ] All screens accessible
   - [ ] Back button works
   - [ ] Tab navigation works

4. **Data Persistence**
   - [ ] Presets save
   - [ ] Settings persist
   - [ ] Favorites saved

---

## Test Execution Checklist

### Pre-Testing
- [ ] All test devices prepared
- [ ] Test environment clean
- [ ] Latest app build deployed
- [ ] Test data prepared
- [ ] Frequency analyzer tools ready

### During Testing
- [ ] Document all findings
- [ ] Take screenshots of issues
- [ ] Record videos of bugs
- [ ] Note device/OS versions
- [ ] Record timestamps

### Post-Testing
- [ ] Compile test report
- [ ] Calculate success rate
- [ ] Identify critical issues
- [ ] Prioritize fixes
- [ ] Schedule retesting

---

## Reporting Template

```
TEST REPORT - Harmonia App v1.0.0
Date: [DATE]
Tester: [NAME]
Device: [DEVICE]
OS: [OS VERSION]

SUMMARY:
- Total Tests: [X]
- Passed: [X]
- Failed: [X]
- Success Rate: [X%]

CRITICAL ISSUES:
1. [Issue]
2. [Issue]

MAJOR ISSUES:
1. [Issue]
2. [Issue]

MINOR ISSUES:
1. [Issue]
2. [Issue]

RECOMMENDATIONS:
1. [Recommendation]
2. [Recommendation]

SIGN-OFF:
Tester: _________________ Date: _______
Lead QA: ________________ Date: _______
```

---

## Continuous Testing

- **Daily:** Smoke tests on critical paths
- **Weekly:** Full regression suite
- **Monthly:** Performance benchmarking
- **Quarterly:** Security audit
- **Before Release:** Complete audit

---

**This protocol ensures Harmonia meets the highest standards for audio quality, performance, and user experience.**
