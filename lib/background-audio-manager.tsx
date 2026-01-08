import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { setAudioModeAsync, AudioMode } from 'expo-audio';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Note: For full background playback with lock screen controls, you'll need:
// npm install expo-av
// npm install expo-notifications

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  sessionName: string;
  keepScreenAwake: boolean;
}

interface BackgroundAudioContextType {
  playbackState: PlaybackState;
  enableBackgroundPlayback: () => Promise<void>;
  disableBackgroundPlayback: () => Promise<void>;
  setKeepScreenAwake: (enabled: boolean) => Promise<void>;
  updatePlaybackState: (state: Partial<PlaybackState>) => void;
  configureAudioSession: () => Promise<void>;
}

const BackgroundAudioContext = createContext<BackgroundAudioContextType | undefined>(undefined);

export function BackgroundAudioProvider({ children }: { children: React.ReactNode }) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    sessionName: '',
    keepScreenAwake: false,
  });

  useEffect(() => {
    configureAudioSession();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const keepAwake = await AsyncStorage.getItem('keep_screen_awake');
      if (keepAwake === 'true') {
        setPlaybackState(prev => ({ ...prev, keepScreenAwake: true }));
        await activateKeepAwakeAsync();
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const configureAudioSession = async () => {
    try {
      // Configure audio mode for background playback
      await setAudioModeAsync({
        playsInSilentModeIOS: true,
      } as unknown as AudioMode);

      console.log('Audio session configured for background playback');
    } catch (error) {
      console.error('Failed to configure audio session:', error);
    }
  };

  const enableBackgroundPlayback = async () => {
    try {
      // Ensure audio mode is configured
      await configureAudioSession();

      // TODO: Set up lock screen controls
      // This would involve:
      // 1. Creating a notification with playback controls
      // 2. Registering media session callbacks
      // 3. Updating notification when playback state changes

      console.log('Background playback enabled');
    } catch (error) {
      console.error('Failed to enable background playback:', error);
    }
  };

  const disableBackgroundPlayback = async () => {
    try {
      // TODO: Remove lock screen controls
      // Clear notification and media session

      console.log('Background playback disabled');
    } catch (error) {
      console.error('Failed to disable background playback:', error);
    }
  };

  const setKeepScreenAwake = async (enabled: boolean) => {
    try {
      if (enabled) {
        await activateKeepAwakeAsync();
      } else {
        deactivateKeepAwake();
      }

      await AsyncStorage.setItem('keep_screen_awake', enabled.toString());
      setPlaybackState(prev => ({ ...prev, keepScreenAwake: enabled }));

      console.log(`Keep screen awake: ${enabled}`);
    } catch (error) {
      console.error('Failed to set keep awake:', error);
    }
  };

  const updatePlaybackState = (state: Partial<PlaybackState>) => {
    setPlaybackState(prev => ({ ...prev, ...state }));

    // TODO: Update lock screen controls with new state
    // This would update the notification with:
    // - Current time
    // - Session name
    // - Play/pause state
  };

  return (
    <BackgroundAudioContext.Provider
      value={{
        playbackState,
        enableBackgroundPlayback,
        disableBackgroundPlayback,
        setKeepScreenAwake,
        updatePlaybackState,
        configureAudioSession,
      }}
    >
      {children}
    </BackgroundAudioContext.Provider>
  );
}

export function useBackgroundAudio() {
  const context = useContext(BackgroundAudioContext);
  if (!context) {
    throw new Error('useBackgroundAudio must be used within BackgroundAudioProvider');
  }
  return context;
}

// Utility function to create lock screen controls
export async function createLockScreenControls(
  sessionName: string,
  isPlaying: boolean,
  onPlay: () => void,
  onPause: () => void,
  onStop: () => void
) {
  // TODO: Implement actual lock screen controls
  // This would use expo-notifications or react-native-track-player
  // to create a persistent notification with media controls

  console.log('Lock screen controls created:', {
    sessionName,
    isPlaying,
  });

  // Example structure for lock screen notification:
  // {
  //   title: sessionName,
  //   body: isPlaying ? 'Playing' : 'Paused',
  //   actions: [
  //     { id: 'play', title: 'Play' },
  //     { id: 'pause', title: 'Pause' },
  //     { id: 'stop', title: 'Stop' },
  //   ],
  //   ongoing: true,
  //   category: 'media',
  // }
}

// Utility function to update lock screen controls
export async function updateLockScreenControls(
  currentTime: number,
  duration: number,
  isPlaying: boolean
) {
  // TODO: Update the existing notification with new playback state

  console.log('Lock screen controls updated:', {
    currentTime,
    duration,
    isPlaying,
  });
}

// Utility function to remove lock screen controls
export async function removeLockScreenControls() {
  // TODO: Dismiss the notification

  console.log('Lock screen controls removed');
}
