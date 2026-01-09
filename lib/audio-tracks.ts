/**
 * Audio Track Data Model - All 21 Professional Tracks
 * 
 * Based on Audio Content Pack v1.0
 * Language: App-store safe, no medical claims
 */

export type TrackType = "binaural" | "isochronic" | "harmonic" | "ambient";
export type TrackCategory = "focus" | "calm" | "sleep";

export interface AudioTrack {
  id: string;
  name: string;
  type: TrackType;
  frequency: string;
  duration: number; // minutes
  category: TrackCategory;
  description: string;
  bestFor: string;
  headphonesRequired: boolean;
  recommendedSession: string; // e.g., "15-30 minutes"
}

/**
 * All 21 Audio Tracks
 * 
 * Categorization:
 * - 7 Binaural Beats (headphones required)
 * - 5 Isochronic Tones (headphones optional)
 * - 5 Sacred & Harmonic Frequencies
 * - 4 Ambient & Masking Sounds
 */
export const audioTracks: AudioTrack[] = [
  // ===== BINAURAL BEATS (7 tracks) =====
  {
    id: "alpha-focus",
    name: "Alpha Focus",
    type: "binaural",
    frequency: "10 Hz",
    duration: 25,
    category: "focus",
    description: "A gentle alpha-range binaural beat designed to support relaxed attention. Ideal for reading, planning, or easing into a focused state without pressure.",
    bestFor: "Studying, light work, mindfulness breaks",
    headphonesRequired: true,
    recommendedSession: "15-30 minutes",
  },
  {
    id: "deep-focus",
    name: "Deep Focus",
    type: "binaural",
    frequency: "14 Hz",
    duration: 30,
    category: "focus",
    description: "This higher-alpha / low-beta range supports alert focus while minimizing mental chatter. Clean, steady, and intentional.",
    bestFor: "Coding, writing, analytical work",
    headphonesRequired: true,
    recommendedSession: "25-45 minutes",
  },
  {
    id: "relaxed-awareness",
    name: "Relaxed Awareness",
    type: "binaural",
    frequency: "8 Hz",
    duration: 20,
    category: "calm",
    description: "A smooth alpha beat that encourages relaxation while maintaining awareness. Often used before meditation or after stressful activity.",
    bestFor: "Stress relief, transitions, grounding",
    headphonesRequired: true,
    recommendedSession: "15-30 minutes",
  },
  {
    id: "meditative-drift",
    name: "Meditative Drift",
    type: "binaural",
    frequency: "6 Hz",
    duration: 30,
    category: "calm",
    description: "Theta-range binaural beats are commonly associated with deep meditative states. This track encourages inward attention and mental quiet.",
    bestFor: "Meditation, breathwork, reflection",
    headphonesRequired: true,
    recommendedSession: "20-40 minutes",
  },
  {
    id: "deep-meditation",
    name: "Deep Meditation",
    type: "binaural",
    frequency: "4 Hz",
    duration: 45,
    category: "calm",
    description: "A low-theta experience designed for longer meditation sessions. Best used in a comfortable, distraction-free environment.",
    bestFor: "Advanced meditation, deep relaxation",
    headphonesRequired: true,
    recommendedSession: "30-60 minutes",
  },
  {
    id: "sleep-descent",
    name: "Sleep Descent",
    type: "binaural",
    frequency: "2 Hz",
    duration: 45,
    category: "sleep",
    description: "Delta-range binaural beats intended to support the transition into sleep. Gentle and minimal to avoid stimulation.",
    bestFor: "Bedtime wind-down",
    headphonesRequired: true,
    recommendedSession: "30-60 minutes",
  },
  {
    id: "deep-sleep",
    name: "Deep Sleep",
    type: "binaural",
    frequency: "1 Hz",
    duration: 60,
    category: "sleep",
    description: "An ultra-low delta beat designed for overnight use. Subtle, slow, and steady.",
    bestFor: "Deep rest, sleep environments",
    headphonesRequired: true,
    recommendedSession: "60-90 minutes",
  },

  // ===== ISOCHRONIC TONES (5 tracks) =====
  {
    id: "calm-pulse",
    name: "Calm Pulse",
    type: "isochronic",
    frequency: "7 Hz",
    duration: 20,
    category: "calm",
    description: "Isochronic tones use rhythmic pulses instead of stereo separation. This track offers a calming cadence suitable for speakers or headphones.",
    bestFor: "Relaxing spaces, background calm",
    headphonesRequired: false,
    recommendedSession: "15-30 minutes",
  },
  {
    id: "creative-flow",
    name: "Creative Flow",
    type: "isochronic",
    frequency: "9 Hz",
    duration: 30,
    category: "focus",
    description: "A lightly energizing alpha pulse intended to support idea generation and creative thinking.",
    bestFor: "Art, brainstorming, design",
    headphonesRequired: false,
    recommendedSession: "20-40 minutes",
  },
  {
    id: "study-pulse",
    name: "Study Pulse",
    type: "isochronic",
    frequency: "13 Hz",
    duration: 25,
    category: "focus",
    description: "A beta-range isochronic tone designed for alertness and sustained mental effort without overstimulation.",
    bestFor: "Studying, focused tasks",
    headphonesRequired: false,
    recommendedSession: "25-45 minutes",
  },
  {
    id: "stress-relief",
    name: "Stress Relief",
    type: "isochronic",
    frequency: "5 Hz",
    duration: 30,
    category: "calm",
    description: "A slower theta-range pulse that promotes deep relaxation. Best used seated or lying down.",
    bestFor: "Anxiety relief, decompression",
    headphonesRequired: false,
    recommendedSession: "20-40 minutes",
  },
  {
    id: "night-calm",
    name: "Night Calm",
    type: "isochronic",
    frequency: "3 Hz",
    duration: 40,
    category: "sleep",
    description: "A low-frequency isochronic tone designed to support nighttime calm and sleep preparation.",
    bestFor: "Evening use",
    headphonesRequired: false,
    recommendedSession: "30-60 minutes",
  },

  // ===== SACRED & HARMONIC FREQUENCIES (5 tracks) =====
  {
    id: "om-resonance",
    name: "OM Resonance",
    type: "harmonic",
    frequency: "136.1 Hz",
    duration: 20,
    category: "calm",
    description: "Inspired by the traditional OM tone, this frequency is often associated with rhythmic breathing and meditative focus.",
    bestFor: "Breathwork, grounding rituals",
    headphonesRequired: false,
    recommendedSession: "10-30 minutes",
  },
  {
    id: "harmonic-balance",
    name: "Harmonic Balance",
    type: "harmonic",
    frequency: "432 Hz",
    duration: 30,
    category: "calm",
    description: "432 Hz is often described as a softer alternative tuning. This track is intended for gentle, non-intrusive listening.",
    bestFor: "Background calm, relaxation",
    headphonesRequired: false,
    recommendedSession: "Open-ended",
  },
  {
    id: "solfeggio-528",
    name: "Solfeggio 528 Hz",
    type: "harmonic",
    frequency: "528 Hz",
    duration: 25,
    category: "calm",
    description: "Part of the Solfeggio scale tradition. This tone is presented for relaxation and focused listening—not medical outcomes.",
    bestFor: "Meditation, quiet focus",
    headphonesRequired: false,
    recommendedSession: "15-30 minutes",
  },
  {
    id: "solfeggio-741",
    name: "Solfeggio 741 Hz",
    type: "harmonic",
    frequency: "741 Hz",
    duration: 20,
    category: "focus",
    description: "A higher Solfeggio frequency often used for attentive listening and reflective states.",
    bestFor: "Reflection, awareness",
    headphonesRequired: false,
    recommendedSession: "10-25 minutes",
  },
  {
    id: "solfeggio-852",
    name: "Solfeggio 852 Hz",
    type: "harmonic",
    frequency: "852 Hz",
    duration: 15,
    category: "focus",
    description: "A bright, high-frequency tone best used at low volume. Designed for short, intentional listening sessions.",
    bestFor: "Quiet contemplation",
    headphonesRequired: false,
    recommendedSession: "5-20 minutes",
  },

  // ===== AMBIENT & MASKING SOUNDS (4 tracks) =====
  {
    id: "pink-noise",
    name: "Pink Noise",
    type: "ambient",
    frequency: "Broadband",
    duration: 60,
    category: "sleep",
    description: "Balanced noise with reduced high frequencies. Commonly used for sleep and concentration.",
    bestFor: "Background masking",
    headphonesRequired: false,
    recommendedSession: "Open-ended",
  },
  {
    id: "brown-noise",
    name: "Brown Noise",
    type: "ambient",
    frequency: "Broadband",
    duration: 60,
    category: "sleep",
    description: "Lower-frequency noise with a heavier, grounding sound profile.",
    bestFor: "Sleep, noise masking",
    headphonesRequired: false,
    recommendedSession: "Open-ended",
  },
  {
    id: "rainfall",
    name: "Rainfall",
    type: "ambient",
    frequency: "Natural",
    duration: 60,
    category: "sleep",
    description: "A natural rain soundscape designed for calming environments.",
    bestFor: "Sleep, relaxation",
    headphonesRequired: false,
    recommendedSession: "Open-ended",
  },
  {
    id: "ocean-waves",
    name: "Ocean Waves",
    type: "ambient",
    frequency: "Natural",
    duration: 60,
    category: "calm",
    description: "Slow, rolling waves for grounding and stress relief.",
    bestFor: "Meditation, rest",
    headphonesRequired: false,
    recommendedSession: "Open-ended",
  },
];

/**
 * Helper functions for filtering and querying tracks
 */
export const getTracksByType = (type: TrackType): AudioTrack[] => {
  return audioTracks.filter((track) => track.type === type);
};

export const getTracksByCategory = (category: TrackCategory): AudioTrack[] => {
  return audioTracks.filter((track) => track.category === category);
};

export const getTrackById = (id: string): AudioTrack | undefined => {
  return audioTracks.find((track) => track.id === id);
};

export const getBinauralTracks = (): AudioTrack[] => getTracksByType("binaural");
export const getIsochronicTracks = (): AudioTrack[] => getTracksByType("isochronic");
export const getHarmonicTracks = (): AudioTrack[] => getTracksByType("harmonic");
export const getAmbientTracks = (): AudioTrack[] => getTracksByType("ambient");

export const getFocusTracks = (): AudioTrack[] => getTracksByCategory("focus");
export const getCalmTracks = (): AudioTrack[] => getTracksByCategory("calm");
export const getSleepTracks = (): AudioTrack[] => getTracksByCategory("sleep");
