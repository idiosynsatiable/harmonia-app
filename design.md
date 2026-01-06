# Harmonia - Advanced Sound Healing & Security App Design Document

## Overview

Harmonia is a comprehensive mobile application that combines cutting-edge sound healing technologies with home security integration. The app delivers binaural beats, isochronic tones, OM chanting, noise generators, and brainwave entrainment while also providing home security camera monitoring and Bluetooth connectivity.

## Brand Identity

**App Name:** Harmonia  
**Tagline:** "Heal. Protect. Resonate."  
**Creator:** Dallas Cullen Whitten 'idiosynsatiable'  
**Contact:** Dall.whitt@gmail.com

**Color Palette:**
- **Primary:** Deep Purple (#7C3AED) - Represents healing, spirituality, crown chakra
- **Secondary:** Cosmic Indigo (#4F46E5) - Represents depth, consciousness
- **Accent:** Healing Cyan (#06B6D4) - Represents clarity, healing energy
- **Background Dark:** Deep Space (#0F0A1A) - Immersive, calming
- **Background Light:** Soft Lavender (#F5F3FF) - Clean, peaceful
- **Success:** Emerald (#10B981) - Positive feedback
- **Warning:** Amber (#F59E0B) - Attention needed
- **Error:** Rose (#F43F5E) - Critical alerts

## Screen Architecture

### 1. Home Screen (Dashboard)
**Primary Content:**
- Quick-access sound healing presets (4 featured cards)
- Current session status (if playing)
- Daily healing streak counter
- Quick-start buttons for each module
- Premium upgrade banner (free version)

**Functionality:**
- One-tap access to favorite presets
- Real-time audio visualization
- Session timer display
- Navigation to all modules

### 2. Sound Studio Screen
**Primary Content:**
- Tabbed interface: Binaural | Isochronic | Noise | OM
- Frequency selector with visual representation
- Brainwave state indicator (Delta/Theta/Alpha/Beta/Gamma)
- Volume mixer for layered sounds
- Duration timer
- Save preset button

**Functionality:**
- Real-time audio generation
- Layer multiple sound types
- Custom frequency input
- Visual brainwave state feedback
- Preset saving and loading

### 3. Binaural Beat Creator Screen
**Primary Content:**
- Left ear frequency slider (20-1500 Hz)
- Right ear frequency slider (20-1500 Hz)
- Calculated binaural beat display
- Carrier frequency selector
- Brainwave state selector (preset targets)
- Waveform visualization

**Functionality:**
- Real-time binaural beat generation
- Automatic brainwave state calculation
- Hemi-sync technology integration
- Save custom beats

### 4. Isochronic Tone Generator Screen
**Primary Content:**
- Base frequency selector
- Pulse rate selector (0.5-40 Hz)
- Duty cycle adjustment
- Tone shape selector (sine, square, triangle)
- Visual pulse indicator

**Functionality:**
- Generate isochronic tones without headphones
- Adjustable pulse patterns
- Multiple waveform options
- Layer with other sounds

### 5. Noise Generator Screen
**Primary Content:**
- Noise type selector: White | Pink | Brown | Purple | Blue
- Intensity slider
- Filter controls (low-pass, high-pass)
- Mix with other sounds toggle
- Visual noise spectrum

**Functionality:**
- Generate various noise colors
- Real-time filtering
- Ambient sound mixing
- Sleep mode optimization

### 6. OM Chanting Screen
**Primary Content:**
- OM frequency selector (136.1 Hz default)
- Octave layers toggle (low/mid/high)
- Cave reverb intensity slider
- Breathing pattern selector
- Chant along mode toggle

**Functionality:**
- Sacred OM frequency generation
- Multi-octave layering
- Cave reverb simulation
- Breathing synchronization
- Guided chanting mode

### 7. Ambient Sound Amplifier Screen
**Primary Content:**
- Microphone input visualization
- Amplification level slider
- Frequency filter controls
- Noise reduction toggle
- Sound enhancement presets

**Functionality:**
- Real-time ambient sound amplification
- Selective frequency boosting
- Background noise reduction
- Hearing enhancement mode

### 8. Security Camera Screen (Premium)
**Primary Content:**
- Camera grid view (up to 4 cameras)
- Individual camera full-screen view
- Recording indicator
- Motion detection alerts
- Audio monitoring toggle

**Functionality:**
- RTSP/ONVIF camera integration
- Live video streaming
- Recording to device storage
- Motion detection notifications
- Two-way audio (if supported)

### 9. Bluetooth Manager Screen
**Primary Content:**
- Paired devices list
- Available devices scanner
- Audio routing selector
- Connection status indicators
- Device-specific settings

**Functionality:**
- Bluetooth device pairing
- Audio output routing
- Multi-device management
- Car/speaker/headphone profiles

### 10. Presets Library Screen
**Primary Content:**
- Categorized preset list (Sleep, Focus, Meditation, Healing, Energy)
- User-created presets section
- Preset cards with details
- Search and filter options
- Premium preset badges

**Functionality:**
- Browse curated presets
- Load and play presets
- Edit user presets
- Share presets (premium)
- Import community presets

### 11. Settings Screen
**Primary Content:**
- Account section (premium status)
- Audio settings (quality, background play)
- Notification preferences
- Theme selection (dark/light/auto)
- About & credits
- Privacy policy
- Contact support

**Functionality:**
- User preference management
- Audio quality selection
- Background playback toggle
- Theme customization
- Legal information access

### 12. Premium Upgrade Screen
**Primary Content:**
- Feature comparison table
- Pricing options
- Testimonials
- Money-back guarantee info
- Purchase buttons

**Functionality:**
- In-app purchase flow
- Feature unlock
- Subscription management
- Restore purchases

## Key User Flows

### Flow 1: Quick Healing Session
1. User opens app → Home Screen
2. Taps featured preset card (e.g., "Deep Sleep Delta")
3. Preset loads → Sound Studio with settings applied
4. Taps Play button
5. Session begins with timer
6. User can adjust volume, add layers
7. Session completes or user stops manually

### Flow 2: Custom Binaural Beat Creation
1. User navigates to Sound Studio → Binaural tab
2. Selects target brainwave state (e.g., Theta)
3. Adjusts carrier frequency if desired
4. Previews the beat
5. Taps "Save Preset"
6. Names preset and selects category
7. Preset saved to library

### Flow 3: Security Camera Setup (Premium)
1. User navigates to Security tab
2. Taps "Add Camera"
3. Scans network for cameras OR enters manual IP
4. Authenticates with camera credentials
5. Camera appears in grid view
6. User can enable recording/alerts

### Flow 4: Bluetooth Audio Routing
1. User navigates to Bluetooth Manager
2. Scans for available devices
3. Selects device to pair
4. Confirms pairing
5. Sets as default audio output
6. Returns to Sound Studio - audio routes to device

### Flow 5: OM Chanting Meditation
1. User navigates to OM Chanting screen
2. Selects frequency and octave layers
3. Adjusts cave reverb intensity
4. Enables "Chant Along" mode
5. Taps Play
6. Visual breathing guide appears
7. User chants along with audio cues

## Free vs Premium Features

### Free Version
- Basic binaural beat generator (limited frequencies)
- White and pink noise only
- 3 preset slots
- 15-minute session limit
- Basic OM chanting (single octave)
- Standard audio quality
- Ads displayed

### Premium Version ($9.99/month or $59.99/year)
- Full frequency range (0.5-40 Hz binaural)
- All noise colors (white, pink, brown, purple, blue)
- Unlimited presets
- Unlimited session duration
- Full OM chanting with cave reverb
- Isochronic tone generator
- Ambient sound amplifier
- Security camera integration (up to 8 cameras)
- Bluetooth audio routing
- High-quality audio (320kbps)
- No ads
- Priority support
- Cloud preset sync
- Community preset sharing

## Technical Architecture

### Audio Engine
- Web Audio API for cross-platform audio generation
- Real-time oscillator management
- Gain node mixing
- Convolution reverb for cave effects
- Analyser node for visualizations

### State Management
- React Context for global audio state
- AsyncStorage for local persistence
- Zustand for complex state (if needed)

### Navigation Structure
```
Tab Navigator
├── Home (Dashboard)
├── Sound Studio
│   ├── Binaural Tab
│   ├── Isochronic Tab
│   ├── Noise Tab
│   └── OM Tab
├── Presets Library
├── Security (Premium)
└── Settings
```

### Data Models

**Preset:**
```typescript
interface Preset {
  id: string;
  name: string;
  category: 'sleep' | 'focus' | 'meditation' | 'healing' | 'energy' | 'custom';
  type: 'binaural' | 'isochronic' | 'noise' | 'om' | 'mixed';
  settings: SoundSettings;
  duration: number; // seconds, 0 = infinite
  isPremium: boolean;
  createdAt: Date;
  userId?: string;
}
```

**SoundSettings:**
```typescript
interface SoundSettings {
  binaural?: {
    carrierFreq: number;
    beatFreq: number;
    volume: number;
  };
  isochronic?: {
    baseFreq: number;
    pulseRate: number;
    dutyCycle: number;
    waveform: 'sine' | 'square' | 'triangle';
    volume: number;
  };
  noise?: {
    type: 'white' | 'pink' | 'brown' | 'purple' | 'blue';
    volume: number;
    lowPassFreq?: number;
    highPassFreq?: number;
  };
  om?: {
    frequency: number;
    octaves: ('low' | 'mid' | 'high')[];
    reverbIntensity: number;
    breathingCycle: number;
    volume: number;
  };
}
```

**Camera:**
```typescript
interface Camera {
  id: string;
  name: string;
  ipAddress: string;
  port: number;
  protocol: 'rtsp' | 'onvif' | 'http';
  credentials?: {
    username: string;
    password: string;
  };
  isRecording: boolean;
  motionDetection: boolean;
}
```

## UI/UX Guidelines

### Visual Design
- Dark mode default (healing/meditation focus)
- Smooth gradients for frequency visualizations
- Glowing effects for active elements
- Minimal, distraction-free interface during sessions
- High contrast for accessibility

### Interaction Design
- Haptic feedback on all interactive elements
- Smooth animations (300ms standard)
- Pull-to-refresh on lists
- Swipe gestures for quick actions
- Long-press for additional options

### Audio Feedback
- Subtle UI sounds (optional)
- Smooth fade in/out for all audio
- No jarring transitions
- Background playback support

### Accessibility
- VoiceOver/TalkBack support
- Minimum touch target 44x44
- Color-blind friendly indicators
- Adjustable text sizes
- High contrast mode option

## Quote for About Section

*"The universe is not outside of you. Look inside yourself; everything that you want, you already are."* — Rumi

This quote embodies the philosophy of Harmonia: that healing, peace, and transformation come from within, and our tools simply help you access what already exists inside you.
