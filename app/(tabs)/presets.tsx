import { useState, useEffect, useCallback } from "react";
import { Text, View, Pressable, StyleSheet, FlatList, TextInput, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useAudioEngine, DEFAULT_PRESETS } from "@/lib/audio-engine";
import { usePremium, FREE_LIMITS } from "@/lib/premium-context";
import { SavedPreset, getUserPresets, saveUserPreset, deleteUserPreset, toggleFavorite, getFavorites } from "@/lib/presets-storage";

type Category = 'all' | 'sleep' | 'focus' | 'meditation' | 'healing' | 'energy' | 'custom';

const CATEGORIES: { key: Category; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: 'star.fill' },
  { key: 'sleep', label: 'Sleep', icon: 'moon.fill' },
  { key: 'focus', label: 'Focus', icon: 'bolt.fill' },
  { key: 'meditation', label: 'Meditation', icon: 'sparkles' },
  { key: 'healing', label: 'Healing', icon: 'heart.fill' },
  { key: 'custom', label: 'My Presets', icon: 'person.fill' },
];

export default function PresetsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { state, loadPreset, play } = useAudioEngine();
  const { isPremium } = usePremium();

  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [userPresets, setUserPresets] = useState<SavedPreset[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDesc, setNewPresetDesc] = useState('');

  // Load user presets and favorites
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const presets = await getUserPresets();
    const favs = await getFavorites();
    setUserPresets(presets);
    setFavorites(favs);
  };

  // Combine default and user presets
  const allPresets: SavedPreset[] = [
    ...DEFAULT_PRESETS.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category as SavedPreset['category'],
      isPremium: p.isPremium,
      isUserCreated: false,
      settings: p.settings as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    ...userPresets,
  ];

  // Filter presets
  const filteredPresets = allPresets.filter(preset => {
    // Category filter
    if (activeCategory === 'custom') {
      if (!preset.isUserCreated) return false;
    } else if (activeCategory !== 'all') {
      if (preset.category !== activeCategory) return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return preset.name.toLowerCase().includes(query) || 
             preset.description.toLowerCase().includes(query);
    }
    
    return true;
  });

  const handlePresetPress = (preset: SavedPreset) => {
    if (preset.isPremium && !isPremium) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      Alert.alert(
        'Premium Feature',
        'This preset requires Harmonia Premium. Upgrade to unlock all presets.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => {} },
        ]
      );
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    loadPreset(preset.settings as any);
    play();
    router.push('/(tabs)/studio');
  };

  const handleFavoriteToggle = async (presetId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const isFavorited = await toggleFavorite(presetId);
    setFavorites(prev => 
      isFavorited 
        ? [...prev, presetId]
        : prev.filter(id => id !== presetId)
    );
  };

  const handleDeletePreset = async (presetId: string) => {
    Alert.alert(
      'Delete Preset',
      'Are you sure you want to delete this preset?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await deleteUserPreset(presetId);
            setUserPresets(prev => prev.filter(p => p.id !== presetId));
          }
        },
      ]
    );
  };

  const handleSaveCurrentSettings = async () => {
    if (!newPresetName.trim()) {
      Alert.alert('Error', 'Please enter a preset name');
      return;
    }

    // Check preset limit for free users
    if (!isPremium && userPresets.length >= FREE_LIMITS.maxPresets) {
      Alert.alert(
        'Preset Limit Reached',
        `Free users can save up to ${FREE_LIMITS.maxPresets} presets. Upgrade to Premium for unlimited presets.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => {} },
        ]
      );
      return;
    }

    try {
      const newPreset = await saveUserPreset({
        name: newPresetName.trim(),
        description: newPresetDesc.trim() || 'Custom preset',
        category: 'custom',
        isPremium: false,
        settings: {
          binaural: state.binaural,
          isochronic: state.isochronic,
          noise: state.noise,
          om: state.om,
          masterVolume: state.masterVolume,
        },
      });
      
      setUserPresets(prev => [...prev, newPreset]);
      setShowSaveModal(false);
      setNewPresetName('');
      setNewPresetDesc('');
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert('Success', 'Preset saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save preset');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sleep': return 'moon.fill';
      case 'focus': return 'bolt.fill';
      case 'meditation': return 'sparkles';
      case 'healing': return 'heart.fill';
      case 'energy': return 'flame.fill';
      default: return 'star.fill';
    }
  };

  const renderPresetCard = ({ item, index }: { item: SavedPreset; index: number }) => {
    const isFavorite = favorites.includes(item.id);
    
    return (
      <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
        <Pressable
          onPress={() => handlePresetPress(item)}
          onLongPress={() => item.isUserCreated && handleDeletePreset(item.id)}
          style={({ pressed }) => [
            styles.presetCard,
            { 
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: pressed ? 0.8 : 1,
            }
          ]}
        >
          {/* Premium Badge */}
          {item.isPremium && !isPremium && (
            <View style={[styles.premiumBadge, { backgroundColor: colors.warning }]}>
              <IconSymbol name="crown.fill" size={10} color="#fff" />
            </View>
          )}
          
          {/* User Created Badge */}
          {item.isUserCreated && (
            <View style={[styles.userBadge, { backgroundColor: colors.accent }]}>
              <IconSymbol name="person.fill" size={10} color="#fff" />
            </View>
          )}

          <View style={styles.presetContent}>
            {/* Icon */}
            <View style={[styles.presetIcon, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol 
                name={getCategoryIcon(item.category)} 
                size={24} 
                color={colors.primary} 
              />
            </View>

            {/* Info */}
            <View style={styles.presetInfo}>
              <Text style={[styles.presetName, { color: colors.foreground }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.presetDesc, { color: colors.muted }]} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.presetMeta}>
                <View style={[styles.categoryTag, { backgroundColor: colors.primary + '15' }]}>
                  <Text style={[styles.categoryTagText, { color: colors.primary }]}>
                    {item.category}
                  </Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.presetActions}>
              <Pressable
                onPress={() => handleFavoriteToggle(item.id)}
                style={styles.actionButton}
              >
                <IconSymbol 
                  name={isFavorite ? "heart.fill" : "heart.fill"} 
                  size={20} 
                  color={isFavorite ? colors.error : colors.muted} 
                />
              </Pressable>
              <Pressable
                onPress={() => handlePresetPress(item)}
                style={[styles.playButton, { backgroundColor: colors.primary }]}
              >
                <IconSymbol name="play.fill" size={16} color="#fff" />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Presets</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            {filteredPresets.length} presets available
          </Text>
        </View>
        <Pressable
          onPress={() => setShowSaveModal(true)}
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
        >
          <IconSymbol name="plus" size={20} color="#fff" />
        </Pressable>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <IconSymbol name="waveform" size={18} color={colors.muted} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search presets..."
          placeholderTextColor={colors.muted}
          style={[styles.searchInput, { color: colors.foreground }]}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <IconSymbol name="xmark" size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setActiveCategory(item.key)}
              style={[
                styles.categoryButton,
                { 
                  backgroundColor: activeCategory === item.key ? colors.primary : colors.surface,
                  borderColor: activeCategory === item.key ? colors.primary : colors.border,
                }
              ]}
            >
              <IconSymbol 
                name={item.icon} 
                size={14} 
                color={activeCategory === item.key ? '#fff' : colors.foreground} 
              />
              <Text style={[
                styles.categoryLabel,
                { color: activeCategory === item.key ? '#fff' : colors.foreground }
              ]}>
                {item.label}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Presets List */}
      <FlatList
        data={filteredPresets}
        keyExtractor={(item) => item.id}
        renderItem={renderPresetCard}
        contentContainerStyle={styles.presetsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <IconSymbol name="music.note.list" size={48} color={colors.muted} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No presets found
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.muted }]}>
              {activeCategory === 'custom' 
                ? 'Create your first custom preset from the Sound Studio'
                : 'Try a different category or search term'}
            </Text>
          </View>
        }
      />

      {/* Save Preset Modal */}
      {showSaveModal && (
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              Save Current Settings
            </Text>
            
            <TextInput
              value={newPresetName}
              onChangeText={setNewPresetName}
              placeholder="Preset name"
              placeholderTextColor={colors.muted}
              style={[styles.modalInput, { 
                backgroundColor: colors.surface, 
                color: colors.foreground,
                borderColor: colors.border,
              }]}
            />
            
            <TextInput
              value={newPresetDesc}
              onChangeText={setNewPresetDesc}
              placeholder="Description (optional)"
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={3}
              style={[styles.modalInput, styles.modalTextArea, { 
                backgroundColor: colors.surface, 
                color: colors.foreground,
                borderColor: colors.border,
              }]}
            />

            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => {
                  setShowSaveModal(false);
                  setNewPresetName('');
                  setNewPresetDesc('');
                }}
                style={[styles.modalButton, { backgroundColor: colors.surface }]}
              >
                <Text style={[styles.modalButtonText, { color: colors.foreground }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSaveCurrentSettings}
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                  Save
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  presetsList: {
    padding: 20,
    paddingBottom: 100,
  },
  presetCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  premiumBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  userBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  presetContent: {
    flexDirection: 'row',
    padding: 16,
    gap: 14,
  },
  presetIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  presetName: {
    fontSize: 16,
    fontWeight: '700',
  },
  presetDesc: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  presetMeta: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  categoryTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  presetActions: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  modalTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
