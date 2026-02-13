import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { audioTracks } from "@/lib/audio-tracks";
import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { useEffect } from "react";
import { useColors } from "@/hooks/use-colors";

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const track = audioTracks.find((t) => t.id === id);

  const {
    isPlaying,
    volume,
    remainingTime,
    playTrack,
    pause,
    resume,
    stop,
    setVolume,
  } = useAudioPlayback();

  useEffect(() => {
    if (track) {
      playTrack(track.id, track.audioFile, 0.7, track.duration);
    }
    return () => {
      stop();
    };
  }, [track?.id]);

  if (!track) {
    return (
      <ScreenContainer className="p-6 justify-center items-center">
        <Text className="text-foreground text-xl">Track not found</Text>
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

  return (
    <ScreenContainer className="p-6">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-8">
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text className="text-foreground text-2xl">←</Text>
        </Pressable>
        <Text className="text-muted text-sm">{track.type}</Text>
      </View>

      {/* Track Info */}
      <View className="items-center mb-12">
        <View
          className="w-48 h-48 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="text-6xl">
            {track.type === "binaural"
              ? "🎧"
              : track.type === "isochronic"
              ? "〰️"
              : track.type === "harmonic"
              ? "🕉️"
              : "🌊"}
          </Text>
        </View>

        <Text className="text-foreground text-2xl font-bold mb-2 text-center">
          {track.name}
        </Text>
        <Text className="text-muted text-base mb-1">{track.frequency}</Text>
        <Text className="text-muted text-sm text-center px-6">
          {track.description}
        </Text>
      </View>

      {/* Timer */}
      <View className="items-center mb-8">
        <Text className="text-foreground text-4xl font-mono">
          {formatTime(remainingTime)}
        </Text>
        <Text className="text-muted text-sm mt-2">
          {remainingTime > 0 ? "Time Remaining (Free Tier)" : "Session Complete"}
        </Text>
      </View>

      {/* Headphones Warning */}
      {track.headphonesRequired && (
        <View className="bg-primary/10 p-3 rounded-lg mb-6 flex-row items-center gap-3">
          <Text className="text-xl">🎧</Text>
          <Text className="text-xs text-primary font-semibold flex-1">
            Headphones required for this binaural experience to function correctly.
          </Text>
        </View>
      )}

      {/* Playback Controls */}
      <View className="flex-row items-center justify-center gap-6 mb-8">
        <Pressable
          onPress={() => setVolume(Math.max(0, volume - 0.1))}
          style={({ pressed }) => [
            styles.controlButton,
            { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text className="text-foreground text-xl">🔉</Text>
        </Pressable>

        <Pressable
          onPress={() => (isPlaying ? pause() : resume())}
          style={({ pressed }) => [
            styles.playButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text className="text-background text-3xl">
            {isPlaying ? "⏸️" : "▶️"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setVolume(Math.min(1, volume + 0.1))}
          style={({ pressed }) => [
            styles.controlButton,
            { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text className="text-foreground text-xl">🔊</Text>
        </Pressable>
      </View>

      {/* Volume Indicator */}
      <View className="items-center mb-8">
        <Text className="text-muted text-sm">
          Volume: {Math.round(volume * 100)}%
        </Text>
      </View>

      {/* Track Details */}
      <View
        className="p-4 rounded-xl"
        style={{ backgroundColor: colors.surface }}
      >
        <Text className="text-foreground font-semibold mb-2">Track Details</Text>
        <Text className="text-muted text-sm mb-1">
          Type: {track.type.charAt(0).toUpperCase() + track.type.slice(1)}
        </Text>
        <Text className="text-muted text-sm mb-1">
          Frequency: {track.frequency}
        </Text>
        <Text className="text-muted text-sm mb-1">
          Duration: {track.duration} minutes
        </Text>
        <Text className="text-muted text-sm mb-1">
          Category: {track.category.charAt(0).toUpperCase() + track.category.slice(1)}
        </Text>
        {track.type === 'binaural' && (
          <Text className="text-warning text-sm mt-2">
            🎧 Headphones required for optimal experience
          </Text>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
