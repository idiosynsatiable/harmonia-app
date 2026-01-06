/**
 * Harmonia Audio Engine
 * Advanced sound generation for binaural beats, isochronic tones, noise, and OM chanting
 * Created by Dallas Cullen Whitten 'idiosynsatiable'
 */

import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { Platform } from 'react-native';

// Types
export type BrainwaveState = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';
export type NoiseType = 'white' | 'pink' | 'brown' | 'purple' | 'blue';
export type WaveformType = 'sine' | 'square' | 'triangle' | 'sawtooth';

export interface BinauralSettings {
  enabled: boolean;
  carrierFreq: number; // Hz (e.g., 528)
  beatFreq: number; // Hz (e.g., 4 for delta)
  volume: number; // 0-1
}

export interface IsochronicSettings {
  enabled: boolean;
  baseFreq: number; // Hz
  pulseRate: number; // Hz (0.5-40)
  dutyCycle: number; // 0-1 (percentage on)
  waveform: WaveformType;
  volume: number;
}

export interface NoiseSettings {
  enabled: boolean;
  type: NoiseType;
  volume: number;
  lowPassFreq: number; // Hz
  highPassFreq: number; // Hz
}

export interface OmSettings {
  enabled: boolean;
  frequency: number; // Hz (default 136.1)
  octaves: {
    low: boolean; // 68.05 Hz
    mid: boolean; // 136.1 Hz
    high: boolean; // 272.2 Hz
  };
  reverbIntensity: number; // 0-1
  breathingCycle: number; // seconds
  volume: number;
}

export interface AudioState {
  isPlaying: boolean;
  isPremium: boolean;
  masterVolume: number;
  binaural: BinauralSettings;
  isochronic: IsochronicSettings;
  noise: NoiseSettings;
  om: OmSettings;
  sessionDuration: number; // seconds, 0 = infinite
  elapsedTime: number; // seconds
  currentBrainwaveState: BrainwaveState;
}

// Brainwave frequency ranges
export const BRAINWAVE_RANGES = {
  delta: { min: 0.5, max: 4, description: 'Deep Sleep & Healing', color: '#3B82F6' },
  theta: { min: 4, max: 8, description: 'Meditation & Creativity', color: '#A78BFA' },
  alpha: { min: 8, max: 12, description: 'Relaxation & Calm', color: '#34D399' },
  beta: { min: 12, max: 30, description: 'Focus & Alertness', color: '#FBBF24' },
  gamma: { min: 30, max: 100, description: 'Peak Performance', color: '#F87171' },
};

// Healing frequencies
export const HEALING_FREQUENCIES = {
  om: 136.1,
  dnaRepair: 528,
  foundation: 174,
  crownChakra: 963,
  tissueRegeneration: 285,
  liberation: 396,
  detox: 741,
  spiritualAwakening: 852,
  naturalHarmony: 432,
  schumann: 7.83,
};

// Initial state
const initialState: AudioState = {
  isPlaying: false,
  isPremium: false,
  masterVolume: 0.7,
  binaural: {
    enabled: true,
    carrierFreq: 528,
    beatFreq: 5.5,
    volume: 0.8,
  },
  isochronic: {
    enabled: false,
    baseFreq: 200,
    pulseRate: 10,
    dutyCycle: 0.5,
    waveform: 'sine',
    volume: 0.6,
  },
  noise: {
    enabled: false,
    type: 'pink',
    volume: 0.3,
    lowPassFreq: 20000,
    highPassFreq: 20,
  },
  om: {
    enabled: false,
    frequency: 136.1,
    octaves: { low: true, mid: true, high: false },
    reverbIntensity: 0.6,
    breathingCycle: 8,
    volume: 0.7,
  },
  sessionDuration: 600, // 10 minutes default
  elapsedTime: 0,
  currentBrainwaveState: 'theta',
};

// Action types
type AudioAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'STOP' }
  | { type: 'SET_MASTER_VOLUME'; payload: number }
  | { type: 'SET_PREMIUM'; payload: boolean }
  | { type: 'UPDATE_BINAURAL'; payload: Partial<BinauralSettings> }
  | { type: 'UPDATE_ISOCHRONIC'; payload: Partial<IsochronicSettings> }
  | { type: 'UPDATE_NOISE'; payload: Partial<NoiseSettings> }
  | { type: 'UPDATE_OM'; payload: Partial<OmSettings> }
  | { type: 'SET_SESSION_DURATION'; payload: number }
  | { type: 'UPDATE_ELAPSED_TIME'; payload: number }
  | { type: 'SET_BRAINWAVE_STATE'; payload: BrainwaveState }
  | { type: 'LOAD_PRESET'; payload: Partial<AudioState> }
  | { type: 'RESET' };

// Reducer
function audioReducer(state: AudioState, action: AudioAction): AudioState {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'STOP':
      return { ...state, isPlaying: false, elapsedTime: 0 };
    case 'SET_MASTER_VOLUME':
      return { ...state, masterVolume: Math.max(0, Math.min(1, action.payload)) };
    case 'SET_PREMIUM':
      return { ...state, isPremium: action.payload };
    case 'UPDATE_BINAURAL':
      return { ...state, binaural: { ...state.binaural, ...action.payload } };
    case 'UPDATE_ISOCHRONIC':
      return { ...state, isochronic: { ...state.isochronic, ...action.payload } };
    case 'UPDATE_NOISE':
      return { ...state, noise: { ...state.noise, ...action.payload } };
    case 'UPDATE_OM':
      return { ...state, om: { ...state.om, ...action.payload } };
    case 'SET_SESSION_DURATION':
      return { ...state, sessionDuration: action.payload };
    case 'UPDATE_ELAPSED_TIME':
      return { ...state, elapsedTime: action.payload };
    case 'SET_BRAINWAVE_STATE':
      return { ...state, currentBrainwaveState: action.payload };
    case 'LOAD_PRESET':
      return { ...state, ...action.payload };
    case 'RESET':
      return { ...initialState, isPremium: state.isPremium };
    default:
      return state;
  }
}

// Calculate brainwave state from frequency
export function getBrainwaveState(frequency: number): BrainwaveState {
  if (frequency < 4) return 'delta';
  if (frequency < 8) return 'theta';
  if (frequency < 12) return 'alpha';
  if (frequency < 30) return 'beta';
  return 'gamma';
}

// Context
interface AudioContextType {
  state: AudioState;
  dispatch: React.Dispatch<AudioAction>;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setMasterVolume: (volume: number) => void;
  updateBinaural: (settings: Partial<BinauralSettings>) => void;
  updateIsochronic: (settings: Partial<IsochronicSettings>) => void;
  updateNoise: (settings: Partial<NoiseSettings>) => void;
  updateOm: (settings: Partial<OmSettings>) => void;
  setBrainwaveTarget: (state: BrainwaveState) => void;
  loadPreset: (preset: Partial<AudioState>) => void;
  reset: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

// Provider component
export function AudioEngineProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer effect
  useEffect(() => {
    if (state.isPlaying) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'UPDATE_ELAPSED_TIME', payload: state.elapsedTime + 1 });
        
        // Check if session should end
        if (state.sessionDuration > 0 && state.elapsedTime + 1 >= state.sessionDuration) {
          dispatch({ type: 'STOP' });
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.isPlaying, state.elapsedTime, state.sessionDuration]);

  // Update brainwave state when binaural beat frequency changes
  useEffect(() => {
    if (state.binaural.enabled) {
      const newState = getBrainwaveState(state.binaural.beatFreq);
      if (newState !== state.currentBrainwaveState) {
        dispatch({ type: 'SET_BRAINWAVE_STATE', payload: newState });
      }
    }
  }, [state.binaural.beatFreq, state.binaural.enabled]);

  const play = useCallback(() => dispatch({ type: 'PLAY' }), []);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const stop = useCallback(() => dispatch({ type: 'STOP' }), []);
  
  const setMasterVolume = useCallback((volume: number) => {
    dispatch({ type: 'SET_MASTER_VOLUME', payload: volume });
  }, []);

  const updateBinaural = useCallback((settings: Partial<BinauralSettings>) => {
    dispatch({ type: 'UPDATE_BINAURAL', payload: settings });
  }, []);

  const updateIsochronic = useCallback((settings: Partial<IsochronicSettings>) => {
    dispatch({ type: 'UPDATE_ISOCHRONIC', payload: settings });
  }, []);

  const updateNoise = useCallback((settings: Partial<NoiseSettings>) => {
    dispatch({ type: 'UPDATE_NOISE', payload: settings });
  }, []);

  const updateOm = useCallback((settings: Partial<OmSettings>) => {
    dispatch({ type: 'UPDATE_OM', payload: settings });
  }, []);

  const setBrainwaveTarget = useCallback((brainwaveState: BrainwaveState) => {
    const range = BRAINWAVE_RANGES[brainwaveState];
    const targetFreq = (range.min + range.max) / 2;
    dispatch({ type: 'UPDATE_BINAURAL', payload: { beatFreq: targetFreq } });
    dispatch({ type: 'SET_BRAINWAVE_STATE', payload: brainwaveState });
  }, []);

  const loadPreset = useCallback((preset: Partial<AudioState>) => {
    dispatch({ type: 'LOAD_PRESET', payload: preset });
  }, []);

  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const value: AudioContextType = {
    state,
    dispatch,
    play,
    pause,
    stop,
    setMasterVolume,
    updateBinaural,
    updateIsochronic,
    updateNoise,
    updateOm,
    setBrainwaveTarget,
    loadPreset,
    reset,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

// Hook
export function useAudioEngine() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioEngine must be used within an AudioEngineProvider');
  }
  return context;
}

// Preset definitions
export const DEFAULT_PRESETS = [
  {
    id: 'deep-sleep-delta',
    name: 'Deep Sleep Delta',
    description: 'Ultra-deep delta waves for restorative sleep and cellular healing',
    category: 'sleep' as const,
    isPremium: false,
    settings: {
      binaural: { enabled: true, carrierFreq: 174, beatFreq: 2, volume: 0.7 },
      noise: { enabled: true, type: 'pink' as NoiseType, volume: 0.2, lowPassFreq: 500, highPassFreq: 20 },
      om: { enabled: false },
      isochronic: { enabled: false },
    },
  },
  {
    id: 'dna-repair-528',
    name: 'DNA Repair 528Hz',
    description: 'Miracle frequency for DNA repair and cellular regeneration',
    category: 'healing' as const,
    isPremium: false,
    settings: {
      binaural: { enabled: true, carrierFreq: 528, beatFreq: 5.5, volume: 0.8 },
      noise: { enabled: false },
      om: { enabled: false },
      isochronic: { enabled: false },
    },
  },
  {
    id: 'theta-meditation',
    name: 'Theta Meditation',
    description: 'Deep meditative state for creativity and insight',
    category: 'meditation' as const,
    isPremium: false,
    settings: {
      binaural: { enabled: true, carrierFreq: 432, beatFreq: 6, volume: 0.7 },
      noise: { enabled: false },
      om: { enabled: true, frequency: 136.1, octaves: { low: true, mid: true, high: false }, reverbIntensity: 0.5, volume: 0.4 },
      isochronic: { enabled: false },
    },
  },
  {
    id: 'focus-beta',
    name: 'Focus & Concentration',
    description: 'Beta waves for enhanced focus and productivity',
    category: 'focus' as const,
    isPremium: false,
    settings: {
      binaural: { enabled: true, carrierFreq: 300, beatFreq: 18, volume: 0.6 },
      noise: { enabled: true, type: 'brown' as NoiseType, volume: 0.15, lowPassFreq: 300, highPassFreq: 20 },
      om: { enabled: false },
      isochronic: { enabled: false },
    },
  },
  {
    id: 'crown-chakra-963',
    name: 'Crown Chakra Activation',
    description: 'Purple vibration for spiritual awakening and higher consciousness',
    category: 'meditation' as const,
    isPremium: true,
    settings: {
      binaural: { enabled: true, carrierFreq: 963, beatFreq: 7, volume: 0.7 },
      noise: { enabled: false },
      om: { enabled: true, frequency: 136.1, octaves: { low: false, mid: true, high: true }, reverbIntensity: 0.7, volume: 0.5 },
      isochronic: { enabled: false },
    },
  },
  {
    id: 'telomere-repair',
    name: 'Telomere Regeneration',
    description: 'Ultra-deep delta for anti-aging and telomere repair',
    category: 'healing' as const,
    isPremium: true,
    settings: {
      binaural: { enabled: true, carrierFreq: 285, beatFreq: 1, volume: 0.8 },
      noise: { enabled: false },
      om: { enabled: false },
      isochronic: { enabled: true, baseFreq: 100, pulseRate: 1, dutyCycle: 0.5, waveform: 'sine' as WaveformType, volume: 0.3 },
    },
  },
  {
    id: 'sacred-om-cave',
    name: 'Sacred OM Cave',
    description: 'Deep cave reverberations with sacred OM chanting',
    category: 'meditation' as const,
    isPremium: true,
    settings: {
      binaural: { enabled: true, carrierFreq: 136.1, beatFreq: 4, volume: 0.5 },
      noise: { enabled: false },
      om: { enabled: true, frequency: 136.1, octaves: { low: true, mid: true, high: true }, reverbIntensity: 0.9, breathingCycle: 8, volume: 0.8 },
      isochronic: { enabled: false },
    },
  },
  {
    id: 'gamma-peak',
    name: 'Gamma Peak Performance',
    description: 'High-frequency gamma for peak cognitive performance',
    category: 'focus' as const,
    isPremium: true,
    settings: {
      binaural: { enabled: true, carrierFreq: 400, beatFreq: 40, volume: 0.5 },
      noise: { enabled: false },
      om: { enabled: false },
      isochronic: { enabled: true, baseFreq: 400, pulseRate: 40, dutyCycle: 0.5, waveform: 'sine' as WaveformType, volume: 0.4 },
    },
  },
];
