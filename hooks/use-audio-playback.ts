/**
 * Harmonia Audio Playback Hook
 * 
 * Minimal playback engine with:
 * - Play/pause controls
 * - Volume control
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
      player.volume = currentVolumeRef.current;
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
        player.volume = currentVolumeRef.current;
        currentStep++;
      }, stepDuration);
    });
  };

  /**
   * Play a track
   */
  const playTrack = async (trackId: string, audioUri: string, initialVolume: number = 0.7, trackDurationMinutes?: number) => {
    try {
      // Stop current track if playing
      if (player.playing) {
        await stopWithFade();
      }

      // Set up session timer for free tier
      const maxSessionLength = getMaxSessionLength();
      let sessionDurationSeconds = maxSessionLength > 0 ? maxSessionLength * 60 : 0;
      
      // If track duration is provided and less than max session length, use it
      if (trackDurationMinutes && trackDurationMinutes > 0) {
        const trackSeconds = trackDurationMinutes * 60;
        if (sessionDurationSeconds === 0 || trackSeconds < sessionDurationSeconds) {
          sessionDurationSeconds = trackSeconds;
        }
      }

      setSessionDuration(sessionDurationSeconds);
      setSessionStartTime(Date.now());
      setRemainingTime(sessionDurationSeconds);

      // Set volume
      targetVolumeRef.current = initialVolume;
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
   * Set volume (0-1)
   */
  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    targetVolumeRef.current = clampedVolume;
    setVolumeState(clampedVolume);
    
    // If not fading, set volume immediately
    if (!fadeIntervalRef.current) {
      currentVolumeRef.current = clampedVolume;
      player.volume = clampedVolume;
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
