/**
 * Harmonia Audio Playback Hook
 * 
 * Minimal playback engine with:
 * - Play/pause controls
 * - Volume control with anti-clipping normalization
 * - 15-minute timer (free tier cap)
 * - Fade-in/fade-out
 * - Background playback
 * - Session auto-stop
 */

import { useState, useEffect, useRef } from "react";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import { getMaxSessionLength } from "@/lib/entitlements";

export interface PlaybackState {
  isPlaying: boolean;
  currentTrackId: string | null;
  currentPosition: number; // seconds
  duration: number; // seconds
  volume: number; // 0-1
  remainingTime: number; // seconds (for free tier timer)
}

/**
 * Volume normalization with anti-clipping
 * Prevents distortion by using logarithmic scaling
 * and clamping at safe levels
 */
const normalizeVolume = (rawVolume: number): number => {
  // Clamp to 0-1
  const clamped = Math.max(0, Math.min(1, rawVolume));
  
  // Use logarithmic scaling for smoother volume curve
  // This prevents harsh jumps at high volumes
  const logarithmic = Math.log10(clamped * 9 + 1) / Math.log10(10);
  
  // Cap at 0.95 to prevent clipping
  // This leaves headroom for any audio peaks
  return Math.min(0.95, logarithmic);
};

export function useAudioPlayback() {
  const player = useAudioPlayer(null);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(0.7);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentVolumeRef = useRef(0);
  const targetVolumeRef = useRef(0.7);

  // Initialize audio mode
  useEffect(() => {
    const initAudio = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
        });
      } catch (error) {
        console.error("Failed to initialize audio mode:", error);
      }
    };
    initAudio();
  }, []);

  // Session timer
  useEffect(() => {
    if (player.playing && sessionDuration > 0) {
      timerIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - sessionStartTime) / 1000;
        const remaining = Math.max(0, sessionDuration - elapsed);
        setRemainingTime(remaining);
        
        if (remaining <= 0) {
          // Session expired
          stopWithFade();
        }
      }, 1000);
      
      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    }
  }, [player.playing, sessionDuration, sessionStartTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      player.release();
    };
  }, []);

  /**
   * Fade in over duration (seconds)
   */
  const fadeIn = (duration: number) => {
    const steps = 50;
    const stepDuration = (duration * 1000) / steps;
    const volumeIncrement = targetVolumeRef.current / steps;
    
    let currentStep = 0;
    
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }
    
    fadeIntervalRef.current = setInterval(() => {
      if (currentStep >= steps) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
        return;
      }
      
      currentVolumeRef.current = Math.min(
        targetVolumeRef.current,
        currentVolumeRef.current + volumeIncrement
      );
      // Apply normalization to prevent clipping during fade
      player.volume = normalizeVolume(currentVolumeRef.current);
      currentStep++;
    }, stepDuration);
  };

  /**
   * Fade out over duration (seconds)
   */
  const fadeOut = (duration: number): Promise<void> => {
    return new Promise((resolve) => {
      const steps = 50;
      const stepDuration = (duration * 1000) / steps;
      const volumeDecrement = currentVolumeRef.current / steps;
      
      let currentStep = 0;
      
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      
      fadeIntervalRef.current = setInterval(() => {
        if (currentStep >= steps) {
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
          resolve();
          return;
        }
        
        currentVolumeRef.current = Math.max(0, currentVolumeRef.current - volumeDecrement);
        player.volume = normalizeVolume(currentVolumeRef.current);
        currentStep++;
      }, stepDuration);
    });
  };

  /**
   * Play a track
   */
  const playTrack = async (trackId: string, audioUri: string, initialVolume: number = 0.7) => {
    try {
      // Stop current track if playing
      if (player.playing) {
        await stopWithFade();
      }

      // Set up session timer for free tier
      const maxSessionLength = getMaxSessionLength();
      const sessionDurationSeconds = maxSessionLength > 0 ? maxSessionLength * 60 : 0;
      setSessionDuration(sessionDurationSeconds);
      setSessionStartTime(Date.now());
      setRemainingTime(sessionDurationSeconds);

      // Set volume with normalization
      const normalizedVolume = normalizeVolume(initialVolume);
      targetVolumeRef.current = normalizedVolume;
      currentVolumeRef.current = 0;
      setVolumeState(initialVolume);

      // Replace player source
      player.replace(audioUri);
      player.volume = 0;

      // Play
      player.play();
      setCurrentTrackId(trackId);

      // Fade in (10 seconds)
      fadeIn(10);
    } catch (error) {
      console.error("Failed to play track:", error);
      throw error;
    }
  };

  /**
   * Pause playback
   */
  const pause = () => {
    if (player.playing) {
      player.pause();
    }
  };

  /**
   * Resume playback
   */
  const resume = () => {
    if (!player.playing) {
      player.play();
    }
  };

  /**
   * Stop playback with fade-out
   */
  const stopWithFade = async () => {
    if (player.playing) {
      await fadeOut(10);
      player.pause();
    }
    player.release();
    setCurrentTrackId(null);
    setSessionStartTime(0);
    setSessionDuration(0);
    setRemainingTime(0);
  };

  /**
   * Set volume (0-1) with anti-clipping normalization
   */
  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    const normalizedVolume = normalizeVolume(clampedVolume);
    
    targetVolumeRef.current = normalizedVolume;
    setVolumeState(clampedVolume);
    
    // If not fading, set volume immediately with normalization
    if (!fadeIntervalRef.current) {
      currentVolumeRef.current = normalizedVolume;
      player.volume = normalizedVolume;
    }
  };

  /**
   * Get current playback state
   */
  const getState = (): PlaybackState => {
    return {
      isPlaying: player.playing,
      currentTrackId,
      currentPosition: player.currentTime,
      duration: player.duration,
      volume,
      remainingTime,
    };
  };

  return {
    playTrack,
    pause,
    resume,
    stop: stopWithFade,
    setVolume,
    getState,
    // Expose player state
    isPlaying: player.playing,
    currentTrackId,
    currentPosition: player.currentTime,
    duration: player.duration,
    volume,
    remainingTime,
  };
}
