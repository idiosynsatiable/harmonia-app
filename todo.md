# Harmonia Professional Rebuild - Master Execution Checklist

## ⚠️ CRITICAL: Language & Positioning Changes
**FORBIDDEN WORDS** (must be removed everywhere):
- ❌ Heal / Healing
- ❌ Cure
- ❌ Therapy / Therapeutic
- ❌ Treat / Treatment
- ❌ Trauma
- ❌ Disorder
- ❌ Diagnose / Diagnosis
- ❌ Medical
- ❌ DNA Repair

**APPROVED LANGUAGE** (use instead):
- ✅ Audio experience
- ✅ Sound-based
- ✅ Support focus/relaxation/sleep
- ✅ Mindfulness
- ✅ Simulated sound patterns
- ✅ Designed for / Intended for

---

## Phase 1: Core Product Redefinition
- [ ] Remove ALL "healing" language from app name, descriptions, UI
- [ ] Update core promise: "Sound-based experiences designed to support focus, relaxation, and mindful states"
- [ ] Add explicit disclaimers: "Not medical, therapeutic, diagnostic, or healing"
- [ ] Rename "DNA Repair 528Hz" → "Solfeggio 528Hz"
- [ ] Remove trauma/surgery/cancer content (medical claims)
- [ ] Remove astrology features (out of scope for v1.0)
- [ ] Remove security camera features (out of scope for v1.0)

---

## Phase 2: Navigation Structure Rebuild
- [ ] Replace current 6-tab navigation with clean 4-tab structure:
  - Home (Today's Session, Continue Listening)
  - Explore (Focus, Calm, Sleep categories)
  - Library (All sounds with filters)
  - Account (Safety Info, Preferences, Legal)
- [ ] Remove "Sound Studio" tab (too complex)
- [ ] Remove "Security" tab (out of scope)
- [ ] Remove "Favorites" tab (move to Library filter)
- [ ] Remove "Pricing" tab (move to Account)

---

## Phase 3: Audio Content - 21 Professional Tracks

### Binaural Beats (7 tracks) - Headphones Required
- [ ] 1. Alpha Focus — 10 Hz (calm focus, light productivity)
- [ ] 2. Deep Focus — 14 Hz (sustained concentration)
- [ ] 3. Relaxed Awareness — 8 Hz (calm clarity)
- [ ] 4. Meditative Drift — 6 Hz (meditation, introspection)
- [ ] 5. Deep Meditation — 4 Hz (stillness, inner calm)
- [ ] 6. Sleep Descent — 2 Hz (falling asleep)
- [ ] 7. Deep Sleep — 1 Hz (rest and recovery)

### Isochronic Tones (5 tracks) - Headphones Optional
- [ ] 8. Calm Pulse — 7 Hz (relaxation)
- [ ] 9. Creative Flow — 9 Hz (creativity, ideation)
- [ ] 10. Study Pulse — 13 Hz (mental stamina)
- [ ] 11. Stress Relief — 5 Hz (nervous system calming)
- [ ] 12. Night Calm — 3 Hz (pre-sleep relaxation)

### Sacred & Harmonic Frequencies (5 tracks)
- [ ] 13. OM Resonance — 136.1 Hz (grounding, meditation)
- [ ] 14. Harmonic Balance — 432 Hz (relaxation, listening comfort)
- [ ] 15. Solfeggio 528 Hz (calm clarity) - RENAMED from "DNA Repair"
- [ ] 16. Solfeggio 741 Hz (mental clarity)
- [ ] 17. Solfeggio 852 Hz (stillness)

### Ambient & Masking Sounds (4 tracks)
- [ ] 18. Pink Noise (focus, sleep)
- [ ] 19. Brown Noise (deep focus, sleep)
- [ ] 20. Rainfall (relaxation)
- [ ] 21. Ocean Waves (calm, rhythmic relaxation)

### Track Metadata (REQUIRED for each track)
- [ ] Name
- [ ] Type (binaural / isochronic / ambient / harmonic)
- [ ] Frequency (if applicable)
- [ ] Description (neutral, no medical claims)
- [ ] Recommended duration (10-60 min)
- [ ] Headphone requirement (boolean)
- [ ] Category tags (Focus / Calm / Sleep)
- [ ] "Best For" usage guidance

---

## Phase 4: Safety-First UX Implementation

### First-Run Onboarding (3 screens max, skippable)
- [ ] Screen 1: What Harmonia Is (audio experience, not medical)
- [ ] Screen 2: How to Use Audio Safely (volume, headphones)
- [ ] Screen 3: Headphones + Volume Guidance
- [ ] Add "Skip" button on all onboarding screens

### Audio Safety Features
- [ ] Implement smooth fade-in (3-5 seconds) on all tracks
- [ ] Implement smooth fade-out (3-5 seconds) on all tracks
- [ ] Start volume at 50% or lower (never higher)
- [ ] Show warning modal if volume > 80%
- [ ] Volume tooltip: "Use a comfortable volume. Louder does not mean more effective."
- [ ] Never auto-increase volume
- [ ] No abrupt stops (always fade out)
- [ ] Loop-safe playback (no clipping or distortion)

### Headphone Detection (Binaural Only)
- [ ] Show modal when binaural beat selected:
  - "For binaural beats, stereo headphones are recommended."
- [ ] No enforcement (just notice)
- [ ] Dismissible modal

### Mandatory Session Timers
- [ ] Add timer options: 10 min, 15 min, 30 min, 60 min
- [ ] Add "Unlimited" option (premium only, future)
- [ ] Auto-stop required (no infinite sessions for free users)
- [ ] Show timer countdown during session
- [ ] Fade out audio when timer expires

### Universal Safety Footer
- [ ] Add to all session screens:
  - "Not intended for medical use. Stop listening if discomfort occurs."

---

## Phase 5: Legal & Compliance Pages

### Required Pages (must exist and be linked)
- [ ] Privacy Policy (data minimization, no health data)
- [ ] Terms of Use (no medical claims, liability limits)
- [ ] Safety Information (volume, headphones, driving warnings)
- [ ] How Harmonia Works (binaural beats, isochronic tones explained)

### Safety Information Page Content
- [ ] Always start at low volume
- [ ] Use headphones for binaural beats
- [ ] Avoid listening while driving
- [ ] Stop if you feel discomfort
- [ ] Not medical advice
- [ ] Consult healthcare professionals for medical conditions

### Data Minimization
- [ ] No health data collected
- [ ] No biometric claims
- [ ] No session analytics tied to identity (unless user opts in)
- [ ] Minimal data collection (only email if provided)

---

## Phase 6: Payment-Agnostic Monetization

### Remove Stripe Integration
- [ ] Remove all Stripe SDK imports
- [ ] Remove payment processing code
- [ ] Remove subscription management code
- [ ] Remove IAP (in-app purchase) code

### Feature Gating (WITHOUT PAYMENTS)
- [ ] Implement feature flags:
  - `max_session_length = 15` (free tier)
  - `premium_features = false`
- [ ] Free tier limits:
  - 15-minute session limit
  - All sounds accessible (no content gating)
  - Basic presets only
- [ ] Premium features (future):
  - Unlimited session length
  - Offline playback
  - Custom presets
  - Extended sleep mode

### "Unlock" UI (No Checkout)
- [ ] Replace "Subscribe" buttons with "Unlock Full Access"
- [ ] "Unlock" buttons open info modal (not checkout)
- [ ] Modal copy: "Coming Soon - Extended sessions and premium features launching soon. Join the waitlist to be notified."
- [ ] No payment processing (just informational)

### Founding Listener Narrative
- [ ] Add "Founding Listener" messaging throughout app
- [ ] Copy: "You're using Harmonia in its early phase. Founding listeners will receive lifetime perks when premium launches."
- [ ] Show "Founding Listener" badge in Account screen
- [ ] Create sense of exclusivity and early access

### Email Capture (Low Pressure)
- [ ] Only ask after first completed session
- [ ] Modal copy: "Want extended sessions when Harmonia unlocks premium? Get notified."
- [ ] Checkbox consent required
- [ ] Optional (can be dismissed)
- [ ] Store email locally (no server sync yet)

### Entitlement System (Future-Proof)
- [ ] Define entitlements in code (even if unused):
  - `unlimited_sessions`
  - `offline_playback`
  - `custom_presets`
  - `sleep_mode_extended`
- [ ] Implement toggle-ready design (when payments unlock, entitlements flip)

---

## Phase 7: Home Screen Redesign

### Today's Session (Rotating)
- [ ] Show one featured session per day
- [ ] Rotate automatically (daily)
- [ ] Copy: "Today's Free Session: Deep Focus (25 min)"
- [ ] Single CTA: "Start Session"

### Continue Listening
- [ ] Show if session was interrupted
- [ ] Resume from last position
- [ ] Show session name, time remaining

### No Clutter
- [ ] Remove complex UI elements
- [ ] Remove long text blocks
- [ ] Single primary action per screen
- [ ] Clean, minimal design

---

## Phase 8: Explore Screen Redesign

### Three Subsections Only
- [ ] Focus (3-6 curated sessions)
- [ ] Calm (3-6 curated sessions)
- [ ] Sleep (3-6 curated sessions)

### Session Cards
- [ ] Short descriptions (1-2 sentences)
- [ ] Preset timers (10/15/30 min)
- [ ] "Best For" tags
- [ ] Play button (no complex controls)

### Prevents Decision Fatigue
- [ ] Curated selection (not full library)
- [ ] Clear categorization
- [ ] Simple choices

---

## Phase 9: Library Screen Redesign

### Filters
- [ ] Type: Binaural, Isochronic, Ambient, Harmonic
- [ ] Duration: 10 min, 15 min, 30 min, 60 min
- [ ] Frequency band: Delta, Theta, Alpha, Beta, Gamma (optional)
- [ ] Favorites toggle

### Sorting
- [ ] Default: Recommended
- [ ] Optional: Alphabetical, Duration, Frequency

### All 21 Tracks Visible
- [ ] Grid or list view
- [ ] Search functionality
- [ ] Clear metadata for each track

---

## Phase 10: Account Screen Redesign

### Must Include
- [ ] Safety Information (link to page)
- [ ] How Harmonia Works (link to page)
- [ ] Preferences:
  - Volume fade duration (3/5/7 seconds)
  - Default timer (10/15/30 min)
- [ ] Email capture (optional)
- [ ] Legal links (Privacy, Terms, Safety)
- [ ] "Founding Listener" status badge
- [ ] App version number

---

## Phase 11: Remove Out-of-Scope Features

### Security Camera Features (REMOVE)
- [ ] Remove camera discovery/scanning
- [ ] Remove RTSP stream integration
- [ ] Remove camera grid view
- [ ] Remove recording functionality
- [ ] Remove motion detection
- [ ] Remove audio monitoring
- [ ] Remove Security tab

### Astrological Features (REMOVE)
- [ ] Remove Human Design chart
- [ ] Remove Natal Chart
- [ ] Remove Zodiac backgrounds
- [ ] Remove Chinese Zodiac backgrounds
- [ ] Remove astrological profile screen

### Overly Complex Features (REMOVE)
- [ ] Remove AI chat
- [ ] Remove health tracking
- [ ] Remove personalized "diagnosis"
- [ ] Remove social features
- [ ] Remove complex visualizations (keep simple waveforms)

---

## Phase 12: Landing Page Rebuild

### Hero Section
- [ ] Update headline: "Sound-Based Experiences for Focus, Relaxation, and Mindful States"
- [ ] Remove "healing" language
- [ ] Add safety disclaimer
- [ ] Single CTA: "Download Now" or "Join Waitlist"

### Menu Structure
- [ ] Home
- [ ] Sounds (submenu):
  - Binaural Beats
  - Isochronic Tones
  - Sacred Frequencies
  - Ambient Sounds
- [ ] Sessions (submenu):
  - Meditation
  - Sleep
  - Focus
  - Deep Work
- [ ] About / Biography
- [ ] Safety & Usage
- [ ] Contact / Support

### Educational Content
- [ ] "What are binaural beats?" (short article)
- [ ] "How do isochronic tones differ?" (short article)
- [ ] "Best frequencies for sleep / focus" (short article)
- [ ] "How to listen safely" (short article)

### Footer
- [ ] Privacy Policy
- [ ] Terms of Use
- [ ] Safety Information
- [ ] Health & Safety Disclaimer
- [ ] Creator contact info

---

## Phase 13: Performance & Stability

### Offline Handling
- [ ] Allow playback of cached sounds
- [ ] Disable streaming gracefully
- [ ] No crashes when offline

### Error States
- [ ] Show calm messages (never raw errors)
- [ ] Never blame user
- [ ] Example: "This session couldn't start right now. Please try again."

### Audio Quality
- [ ] Sample rate: 44.1 kHz
- [ ] Bit depth: 16-bit
- [ ] Channels: Stereo (2)
- [ ] No clipping or distortion
- [ ] Frequency accuracy: ±2% tolerance

---

## Phase 14: Analytics (Safe Only)

### Allowed Metrics
- [ ] Session started
- [ ] Session completed
- [ ] Duration used
- [ ] Category selected (Focus/Calm/Sleep)
- [ ] Track played

### Forbidden Metrics
- [ ] Emotional inference
- [ ] Mental state tagging
- [ ] Health conclusions
- [ ] Biometric data

---

## Phase 15: Testing & QA

### QA Pass 1 - Functional
- [ ] All sounds play correctly
- [ ] All timers stop correctly
- [ ] No crashes on any screen
- [ ] No audio clipping or distortion
- [ ] Fade-in/fade-out works smoothly
- [ ] Volume warning appears at >80%
- [ ] Headphone modal appears for binaural beats

### QA Pass 2 - Language
- [ ] No forbidden claims anywhere
- [ ] Consistent tone throughout
- [ ] Safety information visible
- [ ] All disclaimers present
- [ ] No medical/therapeutic language

### QA Pass 3 - UX
- [ ] First-time user understands in <30 seconds
- [ ] No dead buttons or broken links
- [ ] No confusion about what's free vs premium
- [ ] Onboarding can be skipped
- [ ] All navigation flows work
- [ ] No orphaned tracks (all categorized)

---

## Phase 16: Final Deployment

### App Store Preparation
- [ ] Update app description (no medical claims)
- [ ] Generate new screenshots
- [ ] Update keywords (focus, relaxation, meditation, mindfulness)
- [ ] Add safety disclaimer to app store listing
- [ ] Submit for review

### Landing Page Deployment
- [ ] Deploy updated landing page
- [ ] Test all links
- [ ] Verify SEO meta tags
- [ ] Test on mobile/desktop
- [ ] Monitor analytics

### Documentation
- [ ] Update README
- [ ] Create deployment guide
- [ ] Update legal documents
- [ ] Create user manual

---

## ✅ Success Criteria

- [ ] Zero medical/therapeutic claims anywhere
- [ ] All 21 tracks implemented with proper metadata
- [ ] Safety-first UX (volume warnings, fade-in/out, timers)
- [ ] Clean 4-tab navigation (Home, Explore, Library, Account)
- [ ] Payment-agnostic monetization (no Stripe, just "Unlock" modals)
- [ ] Founding Listener narrative implemented
- [ ] Email capture working (low pressure)
- [ ] All legal pages complete
- [ ] App store safe language throughout
- [ ] First-time user can start session in <30 seconds
- [ ] Zero crashes on core flows
- [ ] Professional, calm, trustworthy feel

---

**This is the professional rebuild. Execute faithfully for a clean, defensible, monetization-ready product.**
