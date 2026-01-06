import { useState, useEffect, useRef } from "react";
import { ScrollView, Text, View, Pressable, StyleSheet, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Animated, { 
  FadeIn, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  Easing 
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import { useKeepAwake } from "expo-keep-awake";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useAudioEngine, BRAINWAVE_RANGES, HEALING_FREQUENCIES, BrainwaveState, NoiseType } from "@/lib/audio-engine";
import { usePremium, FREE_LIMITS } from "@/lib/premium-context";

type TabType = 'binaural' | 'isochronic' | 'noise' | 'om';

const TABS: { key: TabType; label: string; icon: string }[] = [
  { key: 'binaural', label: 'Binaural', icon: 'waveform' },
  { key: 'isochronic', label: 'Isochronic', icon: 'dial.min.fill' },
  { key: 'noise', label: 'Noise', icon: 'speaker.wave.3.fill' },
  { key: 'om', label: 'OM', icon: 'leaf.fill' },
];

const NOISE_TYPES: { key: NoiseType; label: string; color: string }[] = [
  { key: 'white', label: 'White', color: '#E5E7EB' },
  { key: 'pink', label: 'Pink', color: '#F9A8D4' },
  { key: 'brown', label: 'Brown', color: '#92400E' },
  { key: 'purple', label: 'Purple', color: '#A78BFA' },
  { key: 'blue', label: 'Blue', color: '#60A5FA' },
];

const CARRIER_PRESETS = [
  { freq: HEALING_FREQUENCIES.foundation, label: '174 Hz Foundation' },
  { freq: HEALING_FREQUENCIES.tissueRegeneration, label: '285 Hz Tissue' },
  { freq: HEALING_FREQUENCIES.liberation, label: '396 Hz Liberation' },
  { freq: HEALING_FREQUENCIES.naturalHarmony, label: '432 Hz Harmony' },
  { freq: HEALING_FREQUENCIES.dnaRepair, label: '528 Hz DNA Repair' },
  { freq: HEALING_FREQUENCIES.detox, label: '741 Hz Detox' },
  { freq: HEALING_FREQUENCIES.spiritualAwakening, label: '852 Hz Awakening' },
  { freq: HEALING_FREQUENCIES.crownChakra, label: '963 Hz Crown' },
];

export default function StudioScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ tab?: string }>();
  const { state, play, pause, stop, updateBinaural, updateIsochronic, updateNoise, updateOm, setMasterVolume, setBrainwaveTarget } = useAudioEngine();
  const { isPremium, checkFeature } = usePremium();
  
  const [activeTab, setActiveTab] = useState<TabType>('binaural');
  
  // Keep screen awake during playback
  useKeepAwake();

  // Animation for playing indicator
  const pulseAnim = useSharedValue(1);
  
  useEffect(() => {
    if (state.isPlaying) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      pulseAnim.value = withTiming(1, { duration: 300 });
    }
  }, [state.isPlaying]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  // Set initial tab from params
  useEffect(() => {
    if (params.tab && ['binaural', 'isochronic', 'noise', 'om'].includes(params.tab)) {
      setActiveTab(params.tab as TabType);
    }
  }, [params.tab]);

  const handleTabPress = (tab: TabType) => {
    if (tab === 'isochronic' && !isPremium) {
      // Show premium prompt
      return;
    }
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setActiveTab(tab);
  };

  const handlePlayPause = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleStop = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    stop();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderBinauralTab = () => (
    <View style={styles.tabContent}>
      {/* Brainwave State Selector */}
      <View style={styles.controlSection}>
        <Text style={[styles.controlLabel, { color: colors.foreground }]}>
          Target Brainwave State
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.brainwaveRow}>
            {(Object.keys(BRAINWAVE_RANGES) as BrainwaveState[]).map((bw) => {
              const range = BRAINWAVE_RANGES[bw];
              const isActive = state.currentBrainwaveState === bw;
              const isLocked = !isPremium && (bw === 'beta' || bw === 'gamma');
              return (
                <Pressable
                  key={bw}
                  onPress={() => !isLocked && setBrainwaveTarget(bw)}
                  style={({ pressed }) => [
                    styles.brainwaveButton,
                    { 
                      backgroundColor: isActive ? range.color : colors.surface,
                      borderColor: range.color,
                      opacity: pressed ? 0.8 : isLocked ? 0.5 : 1,
                    }
                  ]}
                >
                  {isLocked && (
                    <IconSymbol name="lock.fill" size={12} color={colors.warning} style={styles.lockIcon} />
                  )}
                  <Text style={[
                    styles.brainwaveButtonText,
                    { color: isActive ? '#fff' : colors.foreground }
                  ]}>
                    {bw.charAt(0).toUpperCase() + bw.slice(1)}
                  </Text>
                  <Text style={[
                    styles.brainwaveButtonFreq,
                    { color: isActive ? 'rgba(255,255,255,0.8)' : colors.muted }
                  ]}>
                    {range.min}-{range.max} Hz
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Carrier Frequency */}
      <View style={styles.controlSection}>
        <Text style={[styles.controlLabel, { color: colors.foreground }]}>
          Carrier Frequency (Healing Tone)
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.carrierRow}>
            {CARRIER_PRESETS.map((preset) => {
              const isActive = state.binaural.carrierFreq === preset.freq;
              return (
                <Pressable
                  key={preset.freq}
                  onPress={() => updateBinaural({ carrierFreq: preset.freq })}
                  style={({ pressed }) => [
                    styles.carrierButton,
                    { 
                      backgroundColor: isActive ? colors.primary : colors.surface,
                      borderColor: isActive ? colors.primary : colors.border,
                      opacity: pressed ? 0.8 : 1,
                    }
                  ]}
                >
                  <Text style={[
                    styles.carrierButtonText,
                    { color: isActive ? '#fff' : colors.foreground }
                  ]}>
                    {preset.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Beat Frequency Slider */}
      <View style={styles.controlSection}>
        <View style={styles.sliderHeader}>
          <Text style={[styles.controlLabel, { color: colors.foreground }]}>
            Binaural Beat Frequency
          </Text>
          <Text style={[styles.sliderValue, { color: colors.primary }]}>
            {state.binaural.beatFreq.toFixed(1)} Hz
          </Text>
        </View>
        <View style={styles.sliderContainer}>
          <View style={[styles.sliderTrack, { backgroundColor: colors.surface }]}>
            <View 
              style={[
                styles.sliderFill, 
                { 
                  backgroundColor: BRAINWAVE_RANGES[state.currentBrainwaveState].color,
                  width: `${(state.binaural.beatFreq / 40) * 100}%` 
                }
              ]} 
            />
          </View>
          <View style={styles.sliderButtons}>
            <Pressable
              onPress={() => updateBinaural({ beatFreq: Math.max(0.5, state.binaural.beatFreq - 0.5) })}
              style={[styles.sliderButton, { backgroundColor: colors.surface }]}
            >
              <IconSymbol name="minus" size={20} color={colors.foreground} />
            </Pressable>
            <Pressable
              onPress={() => {
                const maxFreq = isPremium ? 40 : FREE_LIMITS.maxBinauralFreq;
                updateBinaural({ beatFreq: Math.min(maxFreq, state.binaural.beatFreq + 0.5) });
              }}
              style={[styles.sliderButton, { backgroundColor: colors.surface }]}
            >
              <IconSymbol name="plus" size={20} color={colors.foreground} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Volume */}
      <View style={styles.controlSection}>
        <View style={styles.sliderHeader}>
          <Text style={[styles.controlLabel, { color: colors.foreground }]}>
            Binaural Volume
          </Text>
          <Text style={[styles.sliderValue, { color: colors.primary }]}>
            {Math.round(state.binaural.volume * 100)}%
          </Text>
        </View>
        <View style={styles.sliderContainer}>
          <View style={[styles.sliderTrack, { backgroundColor: colors.surface }]}>
            <View 
              style={[
                styles.sliderFill, 
                { backgroundColor: colors.primary, width: `${state.binaural.volume * 100}%` }
              ]} 
            />
          </View>
          <View style={styles.sliderButtons}>
            <Pressable
              onPress={() => updateBinaural({ volume: Math.max(0, state.binaural.volume - 0.1) })}
              style={[styles.sliderButton, { backgroundColor: colors.surface }]}
            >
              <IconSymbol name="speaker.wave.1.fill" size={18} color={colors.foreground} />
            </Pressable>
            <Pressable
              onPress={() => updateBinaural({ volume: Math.min(1, state.binaural.volume + 0.1) })}
              style={[styles.sliderButton, { backgroundColor: colors.surface }]}
            >
              <IconSymbol name="speaker.wave.3.fill" size={18} color={colors.foreground} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Enable Toggle */}
      <Pressable
        onPress={() => updateBinaural({ enabled: !state.binaural.enabled })}
        style={[
          styles.toggleButton,
          { 
            backgroundColor: state.binaural.enabled ? colors.primary : colors.surface,
            borderColor: colors.primary,
          }
        ]}
      >
        <IconSymbol 
          name={state.binaural.enabled ? "checkmark" : "xmark"} 
          size={18} 
          color={state.binaural.enabled ? '#fff' : colors.muted} 
        />
        <Text style={[
          styles.toggleText,
          { color: state.binaural.enabled ? '#fff' : colors.foreground }
        ]}>
          {state.binaural.enabled ? 'Binaural Enabled' : 'Binaural Disabled'}
        </Text>
      </Pressable>
    </View>
  );

  const renderIsochronicTab = () => {
    if (!isPremium) {
      return (
        <View style={styles.premiumLock}>
          <IconSymbol name="lock.fill" size={48} color={colors.warning} />
          <Text style={[styles.premiumLockTitle, { color: colors.foreground }]}>
            Premium Feature
          </Text>
          <Text style={[styles.premiumLockDesc, { color: colors.muted }]}>
            Isochronic tones are available with Harmonia Premium
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <View style={styles.controlSection}>
          <View style={styles.sliderHeader}>
            <Text style={[styles.controlLabel, { color: colors.foreground }]}>
              Base Frequency
            </Text>
            <Text style={[styles.sliderValue, { color: colors.secondary }]}>
              {state.isochronic.baseFreq} Hz
            </Text>
          </View>
          <View style={styles.sliderButtons}>
            <Pressable
              onPress={() => updateIsochronic({ baseFreq: Math.max(50, state.isochronic.baseFreq - 10) })}
              style={[styles.sliderButton, { backgroundColor: colors.surface }]}
            >
              <IconSymbol name="minus" size={20} color={colors.foreground} />
            </Pressable>
            <Pressable
              onPress={() => updateIsochronic({ baseFreq: Math.min(1000, state.isochronic.baseFreq + 10) })}
              style={[styles.sliderButton, { backgroundColor: colors.surface }]}
            >
              <IconSymbol name="plus" size={20} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        <View style={styles.controlSection}>
          <View style={styles.sliderHeader}>
            <Text style={[styles.controlLabel, { color: colors.foreground }]}>
              Pulse Rate
            </Text>
            <Text style={[styles.sliderValue, { color: colors.secondary }]}>
              {state.isochronic.pulseRate} Hz
            </Text>
          </View>
          <View style={styles.sliderButtons}>
            <Pressable
              onPress={() => updateIsochronic({ pulseRate: Math.max(0.5, state.isochronic.pulseRate - 0.5) })}
              style={[styles.sliderButton, { backgroundColor: colors.surface }]}
            >
              <IconSymbol name="minus" size={20} color={colors.foreground} />
            </Pressable>
            <Pressable
              onPress={() => updateIsochronic({ pulseRate: Math.min(40, state.isochronic.pulseRate + 0.5) })}
              style={[styles.sliderButton, { backgroundColor: colors.surface }]}
            >
              <IconSymbol name="plus" size={20} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        <View style={styles.controlSection}>
          <View style={styles.sliderHeader}>
            <Text style={[styles.controlLabel, { color: colors.foreground }]}>
              Volume
            </Text>
            <Text style={[styles.sliderValue, { color: colors.secondary }]}>
              {Math.round(state.isochronic.volume * 100)}%
            </Text>
          </View>
          <View style={styles.sliderButtons}>
            <Pressable
              onPress={() => updateIsochronic({ volume: Math.max(0, state.isochronic.volume - 0.1) })}
              style={[styles.sliderButton, { backgroundColor: colors.surface }]}
            >
              <IconSymbol name="speaker.wave.1.fill" size={18} color={colors.foreground} />
            </Pressable>
            <Pressable
              onPress={() => updateIsochronic({ volume: Math.min(1, state.isochronic.volume + 0.1) })}
              style={[styles.sliderButton, { backgroundColor: colors.surface }]}
            >
              <IconSymbol name="speaker.wave.3.fill" size={18} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={() => updateIsochronic({ enabled: !state.isochronic.enabled })}
          style={[
            styles.toggleButton,
            { 
              backgroundColor: state.isochronic.enabled ? colors.secondary : colors.surface,
              borderColor: colors.secondary,
            }
          ]}
        >
          <IconSymbol 
            name={state.isochronic.enabled ? "checkmark" : "xmark"} 
            size={18} 
            color={state.isochronic.enabled ? '#fff' : colors.muted} 
          />
          <Text style={[
            styles.toggleText,
            { color: state.isochronic.enabled ? '#fff' : colors.foreground }
          ]}>
            {state.isochronic.enabled ? 'Isochronic Enabled' : 'Isochronic Disabled'}
          </Text>
        </Pressable>
      </View>
    );
  };

  const renderNoiseTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.controlSection}>
        <Text style={[styles.controlLabel, { color: colors.foreground }]}>
          Noise Type
        </Text>
        <View style={styles.noiseTypeGrid}>
          {NOISE_TYPES.map((noise) => {
            const isActive = state.noise.type === noise.key;
            const isLocked = !isPremium && !FREE_LIMITS.noiseTypes.includes(noise.key);
            return (
              <Pressable
                key={noise.key}
                onPress={() => !isLocked && updateNoise({ type: noise.key })}
                style={({ pressed }) => [
                  styles.noiseTypeButton,
                  { 
                    backgroundColor: isActive ? noise.color : colors.surface,
                    borderColor: noise.color,
                    opacity: pressed ? 0.8 : isLocked ? 0.5 : 1,
                  }
                ]}
              >
                {isLocked && (
                  <IconSymbol name="lock.fill" size={12} color={colors.warning} style={styles.lockIcon} />
                )}
                <Text style={[
                  styles.noiseTypeText,
                  { color: isActive ? (noise.key === 'white' ? '#000' : '#fff') : colors.foreground }
                ]}>
                  {noise.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.controlSection}>
        <View style={styles.sliderHeader}>
          <Text style={[styles.controlLabel, { color: colors.foreground }]}>
            Volume
          </Text>
          <Text style={[styles.sliderValue, { color: colors.accent }]}>
            {Math.round(state.noise.volume * 100)}%
          </Text>
        </View>
        <View style={styles.sliderContainer}>
          <View style={[styles.sliderTrack, { backgroundColor: colors.surface }]}>
            <View 
              style={[
                styles.sliderFill, 
                { backgroundColor: colors.accent, width: `${state.noise.volume * 100}%` }
              ]} 
            />
          </View>
          <View style={styles.sliderButtons}>
            <Pressable
              onPress={() => updateNoise({ volume: Math.max(0, state.noise.volume - 0.05) })}
              style={[styles.sliderButton, { backgroundColor: colors.surface }]}
            >
              <IconSymbol name="speaker.wave.1.fill" size={18} color={colors.foreground} />
            </Pressable>
            <Pressable
              onPress={() => updateNoise({ volume: Math.min(1, state.noise.volume + 0.05) })}
              style={[styles.sliderButton, { backgroundColor: colors.surface }]}
            >
              <IconSymbol name="speaker.wave.3.fill" size={18} color={colors.foreground} />
            </Pressable>
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => updateNoise({ enabled: !state.noise.enabled })}
        style={[
          styles.toggleButton,
          { 
            backgroundColor: state.noise.enabled ? colors.accent : colors.surface,
            borderColor: colors.accent,
          }
        ]}
      >
        <IconSymbol 
          name={state.noise.enabled ? "checkmark" : "xmark"} 
          size={18} 
          color={state.noise.enabled ? '#fff' : colors.muted} 
        />
        <Text style={[
          styles.toggleText,
          { color: state.noise.enabled ? '#fff' : colors.foreground }
        ]}>
          {state.noise.enabled ? 'Noise Enabled' : 'Noise Disabled'}
        </Text>
      </Pressable>
    </View>
  );

  const renderOmTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.controlSection}>
        <Text style={[styles.controlLabel, { color: colors.foreground }]}>
          OM Frequency
        </Text>
        <View style={styles.omFreqRow}>
          <Pressable
            onPress={() => updateOm({ frequency: 136.1 })}
            style={[
              styles.omFreqButton,
              { 
                backgroundColor: state.om.frequency === 136.1 ? colors.success : colors.surface,
                borderColor: colors.success,
              }
            ]}
          >
            <Text style={[
              styles.omFreqText,
              { color: state.om.frequency === 136.1 ? '#fff' : colors.foreground }
            ]}>
              136.1 Hz (Cosmic OM)
            </Text>
          </Pressable>
          <Pressable
            onPress={() => updateOm({ frequency: 432 })}
            style={[
              styles.omFreqButton,
              { 
                backgroundColor: state.om.frequency === 432 ? colors.success : colors.surface,
                borderColor: colors.success,
              }
            ]}
          >
            <Text style={[
              styles.omFreqText,
              { color: state.om.frequency === 432 ? '#fff' : colors.foreground }
            ]}>
              432 Hz (Natural)
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.controlSection}>
        <Text style={[styles.controlLabel, { color: colors.foreground }]}>
          Octave Layers
        </Text>
        <View style={styles.octaveRow}>
          {(['low', 'mid', 'high'] as const).map((octave) => {
            const isActive = state.om.octaves[octave];
            const isLocked = !isPremium && octave !== 'mid';
            return (
              <Pressable
                key={octave}
                onPress={() => !isLocked && updateOm({ 
                  octaves: { ...state.om.octaves, [octave]: !isActive } 
                })}
                style={[
                  styles.octaveButton,
                  { 
                    backgroundColor: isActive ? colors.success : colors.surface,
                    borderColor: colors.success,
                    opacity: isLocked ? 0.5 : 1,
                  }
                ]}
              >
                {isLocked && (
                  <IconSymbol name="lock.fill" size={12} color={colors.warning} style={styles.lockIcon} />
                )}
                <Text style={[
                  styles.octaveText,
                  { color: isActive ? '#fff' : colors.foreground }
                ]}>
                  {octave === 'low' ? 'Low (68 Hz)' : octave === 'mid' ? 'Mid (136 Hz)' : 'High (272 Hz)'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.controlSection}>
        <View style={styles.sliderHeader}>
          <Text style={[styles.controlLabel, { color: colors.foreground }]}>
            Cave Reverb {!isPremium && '🔒'}
          </Text>
          <Text style={[styles.sliderValue, { color: colors.success }]}>
            {Math.round(state.om.reverbIntensity * 100)}%
          </Text>
        </View>
        <View style={styles.sliderButtons}>
          <Pressable
            onPress={() => isPremium && updateOm({ reverbIntensity: Math.max(0, state.om.reverbIntensity - 0.1) })}
            style={[styles.sliderButton, { backgroundColor: colors.surface, opacity: isPremium ? 1 : 0.5 }]}
          >
            <IconSymbol name="minus" size={20} color={colors.foreground} />
          </Pressable>
          <Pressable
            onPress={() => isPremium && updateOm({ reverbIntensity: Math.min(1, state.om.reverbIntensity + 0.1) })}
            style={[styles.sliderButton, { backgroundColor: colors.surface, opacity: isPremium ? 1 : 0.5 }]}
          >
            <IconSymbol name="plus" size={20} color={colors.foreground} />
          </Pressable>
        </View>
      </View>

      <View style={styles.controlSection}>
        <View style={styles.sliderHeader}>
          <Text style={[styles.controlLabel, { color: colors.foreground }]}>
            Volume
          </Text>
          <Text style={[styles.sliderValue, { color: colors.success }]}>
            {Math.round(state.om.volume * 100)}%
          </Text>
        </View>
        <View style={styles.sliderButtons}>
          <Pressable
            onPress={() => updateOm({ volume: Math.max(0, state.om.volume - 0.1) })}
            style={[styles.sliderButton, { backgroundColor: colors.surface }]}
          >
            <IconSymbol name="speaker.wave.1.fill" size={18} color={colors.foreground} />
          </Pressable>
          <Pressable
            onPress={() => updateOm({ volume: Math.min(1, state.om.volume + 0.1) })}
            style={[styles.sliderButton, { backgroundColor: colors.surface }]}
          >
            <IconSymbol name="speaker.wave.3.fill" size={18} color={colors.foreground} />
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={() => updateOm({ enabled: !state.om.enabled })}
        style={[
          styles.toggleButton,
          { 
            backgroundColor: state.om.enabled ? colors.success : colors.surface,
            borderColor: colors.success,
          }
        ]}
      >
        <IconSymbol 
          name={state.om.enabled ? "checkmark" : "xmark"} 
          size={18} 
          color={state.om.enabled ? '#fff' : colors.muted} 
        />
        <Text style={[
          styles.toggleText,
          { color: state.om.enabled ? '#fff' : colors.foreground }
        ]}>
          {state.om.enabled ? 'OM Chanting Enabled' : 'OM Chanting Disabled'}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <ScreenContainer>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Sound Studio</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Create your healing soundscape
          </Text>
        </View>

        {/* Playback Controls */}
        <View style={[styles.playbackCard, { backgroundColor: colors.surface }]}>
          <View style={styles.playbackInfo}>
            <Animated.View style={[styles.playingIndicator, pulseStyle]}>
              <View style={[
                styles.playingDot,
                { backgroundColor: state.isPlaying ? colors.success : colors.muted }
              ]} />
            </Animated.View>
            <View>
              <Text style={[styles.playbackStatus, { color: colors.foreground }]}>
                {state.isPlaying ? 'Playing' : 'Ready'}
              </Text>
              <Text style={[styles.playbackTime, { color: colors.muted }]}>
                {formatTime(state.elapsedTime)}
                {state.sessionDuration > 0 && ` / ${formatTime(state.sessionDuration)}`}
              </Text>
            </View>
          </View>
          
          <View style={styles.playbackControls}>
            <Pressable
              onPress={handleStop}
              style={({ pressed }) => [
                styles.controlButton,
                { backgroundColor: colors.error + '20', opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <IconSymbol name="stop.fill" size={20} color={colors.error} />
            </Pressable>
            <Pressable
              onPress={handlePlayPause}
              style={({ pressed }) => [
                styles.playButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <IconSymbol 
                name={state.isPlaying ? "pause.fill" : "play.fill"} 
                size={28} 
                color="#fff" 
              />
            </Pressable>
          </View>
        </View>

        {/* Master Volume */}
        <View style={[styles.masterVolume, { backgroundColor: colors.surface }]}>
          <IconSymbol name="speaker.wave.3.fill" size={20} color={colors.primary} />
          <View style={styles.masterVolumeSlider}>
            <View style={[styles.sliderTrack, { backgroundColor: colors.background }]}>
              <View 
                style={[
                  styles.sliderFill, 
                  { backgroundColor: colors.primary, width: `${state.masterVolume * 100}%` }
                ]} 
              />
            </View>
          </View>
          <Text style={[styles.masterVolumeText, { color: colors.foreground }]}>
            {Math.round(state.masterVolume * 100)}%
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const isLocked = tab.key === 'isochronic' && !isPremium;
            return (
              <Pressable
                key={tab.key}
                onPress={() => handleTabPress(tab.key)}
                style={({ pressed }) => [
                  styles.tab,
                  { 
                    backgroundColor: isActive ? colors.primary : colors.surface,
                    opacity: pressed ? 0.8 : isLocked ? 0.6 : 1,
                  }
                ]}
              >
                <IconSymbol 
                  name={tab.icon} 
                  size={18} 
                  color={isActive ? '#fff' : colors.foreground} 
                />
                <Text style={[
                  styles.tabLabel,
                  { color: isActive ? '#fff' : colors.foreground }
                ]}>
                  {tab.label}
                </Text>
                {isLocked && (
                  <IconSymbol name="lock.fill" size={10} color={colors.warning} />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Tab Content */}
        <Animated.View entering={FadeIn.duration(200)}>
          {activeTab === 'binaural' && renderBinauralTab()}
          {activeTab === 'isochronic' && renderIsochronicTab()}
          {activeTab === 'noise' && renderNoiseTab()}
          {activeTab === 'om' && renderOmTab()}
        </Animated.View>

        {/* Footer spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  playbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  playbackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playingIndicator: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  playbackStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  playbackTime: {
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  masterVolume: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  masterVolumeSlider: {
    flex: 1,
  },
  masterVolumeText: {
    fontSize: 14,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabContent: {
    gap: 20,
  },
  controlSection: {
    gap: 12,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  sliderContainer: {
    gap: 12,
  },
  sliderTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brainwaveRow: {
    flexDirection: 'row',
    gap: 10,
  },
  brainwaveButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    minWidth: 80,
    position: 'relative',
  },
  brainwaveButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  brainwaveButtonFreq: {
    fontSize: 10,
    marginTop: 2,
  },
  carrierRow: {
    flexDirection: 'row',
    gap: 8,
  },
  carrierButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  carrierButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  lockIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  premiumLock: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  premiumLockTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  premiumLockDesc: {
    fontSize: 14,
    textAlign: 'center',
  },
  noiseTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  noiseTypeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    position: 'relative',
  },
  noiseTypeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  omFreqRow: {
    flexDirection: 'row',
    gap: 10,
  },
  omFreqButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  omFreqText: {
    fontSize: 13,
    fontWeight: '600',
  },
  octaveRow: {
    flexDirection: 'row',
    gap: 10,
  },
  octaveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    position: 'relative',
  },
  octaveText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
