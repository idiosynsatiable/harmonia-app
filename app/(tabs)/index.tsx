import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useAudioEngine, BRAINWAVE_RANGES, DEFAULT_PRESETS } from "@/lib/audio-engine";
import { usePremium } from "@/lib/premium-context";

const FEATURED_PRESETS = DEFAULT_PRESETS.slice(0, 4);

const BRAINWAVE_STATES = [
  { key: 'delta', label: 'Delta', icon: 'moon.fill', desc: 'Deep Sleep' },
  { key: 'theta', label: 'Theta', icon: 'sparkles', desc: 'Meditation' },
  { key: 'alpha', label: 'Alpha', icon: 'leaf.fill', desc: 'Relaxation' },
  { key: 'beta', label: 'Beta', icon: 'bolt.fill', desc: 'Focus' },
  { key: 'gamma', label: 'Gamma', icon: 'flame.fill', desc: 'Peak' },
] as const;

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { state, play, pause, loadPreset, setBrainwaveTarget } = useAudioEngine();
  const { isPremium } = usePremium();

  const handlePresetPress = (preset: typeof FEATURED_PRESETS[0]) => {
    if (preset.isPremium && !isPremium) {
      return;
    }
    loadPreset(preset.settings as any);
    play();
  };

  const handleBrainwavePress = (brainwave: typeof BRAINWAVE_STATES[number]) => {
    if ((brainwave.key === 'gamma' || brainwave.key === 'beta') && !isPremium) {
      return;
    }
    setBrainwaveTarget(brainwave.key);
    router.push('./studio');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScreenContainer>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.muted }]}>Welcome to</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>Harmonia</Text>
          </View>
          {!isPremium && (
            <Pressable
              style={({ pressed }) => [
                styles.premiumBadge,
                { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <IconSymbol name="crown.fill" size={14} color="#fff" />
              <Text style={styles.premiumText}>PRO</Text>
            </Pressable>
          )}
        </Animated.View>

        {/* Now Playing Card */}
        {state.isPlaying && (
          <Animated.View entering={FadeInUp.delay(150)}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nowPlayingCard}
            >
              <View style={styles.nowPlayingHeader}>
                <View style={styles.nowPlayingInfo}>
                  <Text style={styles.nowPlayingLabel}>Now Playing</Text>
                  <Text style={styles.nowPlayingTitle}>
                    {BRAINWAVE_RANGES[state.currentBrainwaveState].description}
                  </Text>
                </View>
                <View style={styles.nowPlayingTimer}>
                  <Text style={styles.timerText}>{formatTime(state.elapsedTime)}</Text>
                  {state.sessionDuration > 0 && (
                    <Text style={styles.timerTotal}>/ {formatTime(state.sessionDuration)}</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.nowPlayingControls}>
                <View style={styles.frequencyInfo}>
                  <Text style={styles.frequencyLabel}>
                    {state.binaural.carrierFreq} Hz carrier
                  </Text>
                  <Text style={styles.frequencyValue}>
                    {state.binaural.beatFreq} Hz {state.currentBrainwaveState}
                  </Text>
                </View>
                <Pressable
                  onPress={() => pause()}
                  style={({ pressed }) => [
                    styles.playPauseButton,
                    { opacity: pressed ? 0.8 : 1 }
                  ]}
                >
                  <IconSymbol name="pause.fill" size={24} color={colors.primary} />
                </Pressable>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Brainwave Quick Select */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Brainwave States
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.brainwaveScroll}
          >
            {BRAINWAVE_STATES.map((bw) => {
              const range = BRAINWAVE_RANGES[bw.key];
              const isLocked = (bw.key === 'gamma' || bw.key === 'beta') && !isPremium;
              return (
                <Pressable
                  key={bw.key}
                  onPress={() => handleBrainwavePress(bw)}
                  style={({ pressed }) => [
                    styles.brainwaveCard,
                    { 
                      backgroundColor: colors.surface,
                      borderColor: state.currentBrainwaveState === bw.key ? range.color : colors.border,
                      borderWidth: state.currentBrainwaveState === bw.key ? 2 : 1,
                      opacity: pressed ? 0.8 : 1,
                    }
                  ]}
                >
                  {isLocked && (
                    <View style={[styles.lockBadge, { backgroundColor: colors.warning }]}>
                      <IconSymbol name="lock.fill" size={10} color="#fff" />
                    </View>
                  )}
                  <View style={[styles.brainwaveIcon, { backgroundColor: range.color + '20' }]}>
                    <IconSymbol name={bw.icon} size={24} color={range.color} />
                  </View>
                  <Text style={[styles.brainwaveLabel, { color: colors.foreground }]}>
                    {bw.label}
                  </Text>
                  <Text style={[styles.brainwaveDesc, { color: colors.muted }]}>
                    {bw.desc}
                  </Text>
                  <Text style={[styles.brainwaveFreq, { color: range.color }]}>
                    {range.min}-{range.max} Hz
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Featured Presets */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Quick Start Presets
            </Text>
            <Pressable onPress={() => router.push('./presets')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </Pressable>
          </View>
          
          <View style={styles.presetsGrid}>
            {FEATURED_PRESETS.map((preset) => (
              <Pressable
                key={preset.id}
                onPress={() => handlePresetPress(preset)}
                style={({ pressed }) => [
                  styles.presetCard,
                  { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.8 : 1,
                  }
                ]}
              >
                {preset.isPremium && !isPremium && (
                  <View style={[styles.premiumTag, { backgroundColor: colors.warning }]}>
                    <IconSymbol name="crown.fill" size={10} color="#fff" />
                  </View>
                )}
                <View style={[styles.presetIcon, { backgroundColor: colors.primary + '20' }]}>
                  <IconSymbol 
                    name={preset.category === 'sleep' ? 'moon.fill' : 
                          preset.category === 'healing' ? 'heart.fill' :
                          preset.category === 'meditation' ? 'sparkles' : 'bolt.fill'} 
                    size={20} 
                    color={colors.primary} 
                  />
                </View>
                <Text style={[styles.presetName, { color: colors.foreground }]} numberOfLines={1}>
                  {preset.name}
                </Text>
                <Text style={[styles.presetDesc, { color: colors.muted }]} numberOfLines={2}>
                  {preset.description}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Sound Tools
          </Text>
          <View style={styles.actionsGrid}>
            <Pressable
              onPress={() => router.push('./studio')}
              style={({ pressed }) => [
                styles.actionCard,
                { backgroundColor: colors.surface, opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <IconSymbol name="waveform" size={28} color={colors.primary} />
              <Text style={[styles.actionLabel, { color: colors.foreground }]}>
                Binaural Beats
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => router.push('./studio')}
              style={({ pressed }) => [
                styles.actionCard,
                { backgroundColor: colors.surface, opacity: pressed ? 0.8 : 1 }
              ]}
            >
              {!isPremium && (
                <View style={[styles.lockBadge, { backgroundColor: colors.warning }]}>
                  <IconSymbol name="lock.fill" size={10} color="#fff" />
                </View>
              )}
              <IconSymbol name="dial.min.fill" size={28} color={colors.secondary} />
              <Text style={[styles.actionLabel, { color: colors.foreground }]}>
                Isochronic
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => router.push('./studio')}
              style={({ pressed }) => [
                styles.actionCard,
                { backgroundColor: colors.surface, opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <IconSymbol name="speaker.wave.3.fill" size={28} color={colors.accent} />
              <Text style={[styles.actionLabel, { color: colors.foreground }]}>
                Noise Gen
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => router.push('./studio')}
              style={({ pressed }) => [
                styles.actionCard,
                { backgroundColor: colors.surface, opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <IconSymbol name="leaf.fill" size={28} color={colors.success} />
              <Text style={[styles.actionLabel, { color: colors.foreground }]}>
                OM Chant
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Premium Banner */}
        {!isPremium && (
          <Animated.View entering={FadeInDown.delay(500)}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumBanner}
            >
              <View style={styles.premiumBannerContent}>
                <IconSymbol name="crown.fill" size={32} color="#fff" />
                <View style={styles.premiumBannerText}>
                  <Text style={styles.premiumBannerTitle}>Unlock Full Potential</Text>
                  <Text style={styles.premiumBannerDesc}>
                    Get unlimited access to all frequencies, security cameras, and more
                  </Text>
                </View>
              </View>
              <IconSymbol name="chevron.right" size={24} color="#fff" />
            </LinearGradient>
          </Animated.View>
        )}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  premiumText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  nowPlayingCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  nowPlayingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  nowPlayingInfo: {
    flex: 1,
  },
  nowPlayingLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nowPlayingTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  nowPlayingTimer: {
    alignItems: 'flex-end',
  },
  timerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  timerTotal: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  nowPlayingControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frequencyInfo: {},
  frequencyLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  frequencyValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  playPauseButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  brainwaveScroll: {
    paddingRight: 20,
    gap: 12,
  },
  brainwaveCard: {
    width: 100,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    position: 'relative',
  },
  brainwaveIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  brainwaveLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  brainwaveDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  brainwaveFreq: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  lockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    position: 'relative',
  },
  premiumTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  presetName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  presetDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    position: 'relative',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 20,
    marginTop: 8,
  },
  premiumBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  premiumBannerText: {
    flex: 1,
  },
  premiumBannerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  premiumBannerDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
});
