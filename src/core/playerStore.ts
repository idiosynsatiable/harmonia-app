/**
 * Central Player Store
 * Synchronizes player state across Explore, Detail, Player, and MiniPlayer
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface SessionData {
  id: string;
  name: string;
  description: string;
  type: string;
  frequency: string;
  duration: number;
  category: string;
  audioFile?: string;
  headphonesRequired?: boolean;
}

export interface TimerSettings {
  enabled: boolean;
  durationMinutes: number;
  fadeOutSeconds: number;
}

export interface PlayerState {
  // Current session
  currentSession: SessionData | null;
  
  // Playback state
  isPlaying: boolean;
  isPaused: boolean;
  volume: number;
  currentTime: number;
  
  // Timer & fade
  timer: TimerSettings;
  
  // Favorites & recents
  favorites: string[];
  recents: string[];
  
  // Actions
  loadSession: (session: SessionData) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setTimer: (settings: Partial<TimerSettings>) => void;
  toggleFavorite: (sessionId: string) => void;
  addToRecents: (sessionId: string) => void;
  clearSession: () => void;
}

const PlayerContext = createContext<PlayerState | null>(null);

export function PlayerStoreProvider({ children }: { children: React.ReactNode }) {
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [currentTime, setCurrentTimeState] = useState(0);
  const [timer, setTimerState] = useState<TimerSettings>({
    enabled: false,
    durationMinutes: 30,
    fadeOutSeconds: 60,
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);

  const addToRecents = useCallback((sessionId: string) => {
    setRecents(prev => {
      const filtered = prev.filter(id => id !== sessionId);
      return [sessionId, ...filtered].slice(0, 10);
    });
  }, []);

  const loadSession = useCallback((session: SessionData) => {
    setCurrentSession(session);
    setCurrentTimeState(0);
    addToRecents(session.id);
  }, [addToRecents]);

  const play = useCallback(() => {
    setIsPlaying(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(true);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTimeState(0);
  }, []);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(Math.max(0, Math.min(1, vol)));
  }, []);

  const setCurrentTime = useCallback((time: number) => {
    setCurrentTimeState(time);
  }, []);

  const setTimer = useCallback((settings: Partial<TimerSettings>) => {
    setTimerState(prev => ({ ...prev, ...settings }));
  }, []);

  const toggleFavorite = useCallback((sessionId: string) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(sessionId);
      return isFavorite
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId];
    });
  }, []);

  const clearSession = useCallback(() => {
    setCurrentSession(null);
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTimeState(0);
  }, []);

  const value: PlayerState = {
    currentSession,
    isPlaying,
    isPaused,
    volume,
    currentTime,
    timer,
    favorites,
    recents,
    loadSession,
    play,
    pause,
    stop,
    setVolume,
    setCurrentTime,
    setTimer,
    toggleFavorite,
    addToRecents,
    clearSession,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayerStore(): PlayerState {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerStore must be used within PlayerStoreProvider');
  }
  return context;
}
