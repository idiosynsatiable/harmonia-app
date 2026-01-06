/**
 * Presets Storage Manager
 * Handles saving and loading user presets
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AudioState, DEFAULT_PRESETS } from './audio-engine';

const PRESETS_KEY = '@harmonia_presets';
const USER_PRESETS_KEY = '@harmonia_user_presets';
const FAVORITES_KEY = '@harmonia_favorites';

export interface SavedPreset {
  id: string;
  name: string;
  description: string;
  category: 'sleep' | 'focus' | 'meditation' | 'healing' | 'energy' | 'custom';
  isPremium: boolean;
  isUserCreated: boolean;
  settings: Partial<AudioState>;
  createdAt: string;
  updatedAt: string;
}

// Get all default presets
export function getDefaultPresets(): SavedPreset[] {
  return DEFAULT_PRESETS.map(preset => ({
    id: preset.id,
    name: preset.name,
    description: preset.description,
    category: preset.category,
    isPremium: preset.isPremium,
    isUserCreated: false,
    settings: preset.settings as unknown as Partial<AudioState>,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

// Get user-created presets
export async function getUserPresets(): Promise<SavedPreset[]> {
  try {
    const data = await AsyncStorage.getItem(USER_PRESETS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading user presets:', error);
    return [];
  }
}

// Save a new user preset
export async function saveUserPreset(preset: Omit<SavedPreset, 'id' | 'createdAt' | 'updatedAt' | 'isUserCreated'>): Promise<SavedPreset> {
  try {
    const userPresets = await getUserPresets();
    const newPreset: SavedPreset = {
      ...preset,
      id: `user_${Date.now()}`,
      isUserCreated: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    userPresets.push(newPreset);
    await AsyncStorage.setItem(USER_PRESETS_KEY, JSON.stringify(userPresets));
    return newPreset;
  } catch (error) {
    console.error('Error saving user preset:', error);
    throw error;
  }
}

// Update an existing user preset
export async function updateUserPreset(id: string, updates: Partial<SavedPreset>): Promise<SavedPreset | null> {
  try {
    const userPresets = await getUserPresets();
    const index = userPresets.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    userPresets[index] = {
      ...userPresets[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(USER_PRESETS_KEY, JSON.stringify(userPresets));
    return userPresets[index];
  } catch (error) {
    console.error('Error updating user preset:', error);
    throw error;
  }
}

// Delete a user preset
export async function deleteUserPreset(id: string): Promise<boolean> {
  try {
    const userPresets = await getUserPresets();
    const filtered = userPresets.filter(p => p.id !== id);
    
    if (filtered.length === userPresets.length) return false;
    
    await AsyncStorage.setItem(USER_PRESETS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting user preset:', error);
    throw error;
  }
}

// Get favorite preset IDs
export async function getFavorites(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
}

// Toggle favorite status
export async function toggleFavorite(presetId: string): Promise<boolean> {
  try {
    const favorites = await getFavorites();
    const index = favorites.indexOf(presetId);
    
    if (index === -1) {
      favorites.push(presetId);
    } else {
      favorites.splice(index, 1);
    }
    
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return index === -1; // Returns true if now favorited
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}

// Get all presets (default + user)
export async function getAllPresets(): Promise<SavedPreset[]> {
  const defaultPresets = getDefaultPresets();
  const userPresets = await getUserPresets();
  return [...defaultPresets, ...userPresets];
}

// Get presets by category
export async function getPresetsByCategory(category: string): Promise<SavedPreset[]> {
  const allPresets = await getAllPresets();
  return allPresets.filter(p => p.category === category);
}
