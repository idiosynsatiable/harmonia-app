import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { audioTracks } from "@/lib/audio-tracks";
import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { useColors } from "@/hooks/use-colors";
import { usePlayerStore } from "@/src/core/playerStore";

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const track = audioTracks.find((t) => t.id === id);
  
  const {
    isPlaying: audioIsPlaying,
    volume: audioVolume,
    remainingTime,
    playTrack,
    pause: audioPause,
    resume: audioResume,
    stop: audioStop,
    setVolume: audioSetVolume,
  } = useAudioPlayback();

  const {
    timer,
    setTimer,
    toggleFavorite,
    favorites,
    volume: storeVolume,
    setVolume: storeSetVolume,
    play: storePlay,
    pause: storePause,
    stop: storeStop,
  } = usePlayerStore();

  const [showTimerPicker, setShowTimerPicker] = useState(false);
  const isFavorite = track ? favorites.includes(track.id) : false;

  useEffect(() => {
    if (track) {
      playTrack(track.id, track.audioFile, storeVolume, track.duration);
      storePlay();
    }
    return () => {
      audioStop();
      storeStop();
    };
  }, [track?.id]);

  if (!track) {
    return (
      <ScreenContainer className="p-6 justify-center items-center">
        <Text className="text-foreground text-xl">Session not found</Text>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text className="text-background font-semibold">Go Back</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (audioIsPlaying) {
      audioPause();
      storePause();
    } else {
      audioResume();
      storePlay();
    }
  };

  const handleVolumeChange = (delta: number) => {
    const newVolume = Math.max(0, Math.min(1, storeVolume + delta));
    audioSetVolume(newVolume);
    storeSetVolume(newVolume);
  };

  const timerOptions = [
    { label: 'Off', value: 0 },
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '60 min', value: 60 },
  ];

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Text style={{ fontSize: 28, color: colors.foreground }}>←</Text>
            </Pressable>
            <Text style={{ fontSize: 14, color: colors.muted, fontWeight: '600' }}>
              {track.type.toUpperCase()}
            </Text>
            <Pressable
              onPress={() => toggleFavorite(track.id)}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Text style={{ fontSize: 28 }}>{isFavorite ? '⭐' : '☆'}</Text>
            </Pressable>
          </View>

          {/* Session Visual */}
          <View style={styles.visualContainer}>
            <View
              style={[
                styles.visual,
                { backgroundColor: colors.surface, borderColor: colors.border }
              ]}
            >
              <Text style={{ fontSize: 80 }}>
                {track.type === "binaural"
                  ? "🎧"
                  : track.type === "isochronic"
                  ? "〰️"
                  : track.type === "harmonic"
                  ? "🕉️"
                  : "🌊"}
              </Text>
            </View>
          </View>

          {/* Session Info */}
          <View style={styles.infoContainer}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {track.name}
            </Text>
            <Text style={[styles.frequency, { color: colors.primary }]}>
              {track.frequency}
            </Text>
            <Text style={[styles.description, { color: colors.muted }]}>
              {track.description}
            </Text>
          </View>

          {/* Timer Display */}
          <View style={styles.timerContainer}>
            <Text style={[styles.timerText, { color: colors.foreground }]}>
              {formatTime(remainingTime)}
            </Text>
            <Text style={[styles.timerLabel, { color: colors.muted }]}>
              {remainingTime > 0 ? "Time Remaining" : "Session Complete"}
            </Text>
          </View>

          {/* Headphones Warning */}
          {track.headphonesRequired && (
            <View
              style={[
                styles.warning,
                { backgroundColor: colors.primary + '15', borderColor: colors.primary }
              ]}
            >
              <Text style={{ fontSize: 20 }}>🎧</Text>
              <Text style={[styles.warningText, { color: colors.primary }]}>
                Headphones required for binaural beats to work correctly
              </Text>
            </View>
          )}

          {/* Playback Controls */}
          <View style={styles.controls}>
            <Pressable
              onPress={() => handleVolumeChange(-0.1)}
              style={({ pressed }) => [
                styles.controlButton,
                { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={{ fontSize: 24 }}>🔉</Text>
            </Pressable>

            <Pressable
              onPress={handlePlayPause}
              style={({ pressed }) => [
                styles.playButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={{ fontSize: 36 }}>
                {audioIsPlaying ? "⏸" : "▶️"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleVolumeChange(0.1)}
              style={({ pressed }) => [
                styles.controlButton,
                { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={{ fontSize: 24 }}>🔊</Text>
            </Pressable>
          </View>

          {/* Volume Indicator */}
          <View style={styles.volumeContainer}>
            <Text style={[styles.volumeText, { color: colors.muted }]}>
              Volume: {Math.round(storeVolume * 100)}%
            </Text>
          </View>

          {/* Timer Controls */}
          <View style={styles.timerControls}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Sleep Timer
            </Text>
            <View style={styles.timerOptions}>
              {timerOptions.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setTimer({ enabled: option.value > 0, durationMinutes: option.value })}
                  style={({ pressed }) => [
                    styles.timerOption,
                    {
                      backgroundColor: timer.durationMinutes === option.value && timer.enabled
                        ? colors.primary
                        : colors.surface,
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: timer.durationMinutes === option.value && timer.enabled
                        ? '#FFFFFF'
                        : colors.foreground,
                    }}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            {timer.enabled && (
              <Text style={[styles.timerHint, { color: colors.muted }]}>
                Session will fade out after {timer.durationMinutes} minutes
              </Text>
            )}
          </View>

          {/* Session Details */}
          <View
            style={[
              styles.detailsCard,
              { backgroundColor: colors.surface, borderColor: colors.border }
            ]}
          >
            <Text style={[styles.detailsTitle, { color: colors.foreground }]}>
              Session Details
            </Text>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.muted }]}>Type:</Text>
              <Text style={[styles.detailValue, { color: colors.foreground }]}>
                {track.type.charAt(0).toUpperCase() + track.type.slice(1)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.muted }]}>Frequency:</Text>
              <Text style={[styles.detailValue, { color: colors.foreground }]}>
                {track.frequency}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.muted }]}>Duration:</Text>
              <Text style={[styles.detailValue, { color: colors.foreground }]}>
                {track.duration} minutes
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.muted }]}>Category:</Text>
              <Text style={[styles.detailValue, { color: colors.foreground }]}>
                {track.category.charAt(0).toUpperCase() + track.category.slice(1)}
              </Text>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  visualContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  visual: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  frequency: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  timerLabel: {
    fontSize: 13,
    marginTop: 4,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  volumeText: {
    fontSize: 13,
  },
  timerControls: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  timerOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timerOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  timerHint: {
    fontSize: 12,
    marginTop: 8,
  },
  detailsCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
});
