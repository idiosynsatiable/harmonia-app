import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { audioTracks, getTracksByType, type TrackType } from "@/lib/audio-tracks";

/**
 * Library Screen - All 21 Tracks with Filters
 * 
 * Filters:
 * - Type: Binaural, Isochronic, Ambient, Harmonic
 * - Duration: 10, 15, 30, 60 min
 * - Favorites toggle
 * 
 * Sorting:
 * - Default: Recommended
 * - Optional: Alphabetical, Duration
 */
export default function LibraryScreen() {
  const colors = useColors();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Get filtered tracks from data model
  const filteredTracks = activeFilter === "all" 
    ? audioTracks 
    : getTracksByType(activeFilter as TrackType);

  const renderTrackCard = (track: any) => (
    <TouchableOpacity
      key={track.id}
      className="bg-surface rounded-xl p-4 mb-3 border border-border active:opacity-70"
      style={{ borderColor: colors.border }}
      onPress={() => {
        // TODO: Navigate to session player
        console.log("Play track:", track.name);
      }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">
            {track.name}
          </Text>
          {track.headphonesRequired && (
            <Text className="text-xs text-muted mt-1">
              🎧 Headphones required
            </Text>
          )}
        </View>
        <View className="bg-primary/20 px-2 py-1 rounded-full">
          <Text className="text-xs font-semibold" style={{ color: colors.primary }}>
            {track.duration} min
          </Text>
        </View>
      </View>
      
      <View className="flex-row items-center gap-2">
        <Text className="text-xs text-muted">
          {track.type.charAt(0).toUpperCase() + track.type.slice(1)}
        </Text>
        <Text className="text-xs text-muted">•</Text>
        <Text className="text-xs text-muted">
          {track.frequency}
        </Text>
        <Text className="text-xs text-muted">•</Text>
        <Text className="text-xs" style={{ color: colors.primary }}>
          {track.category.charAt(0).toUpperCase() + track.category.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const FilterButton = ({ label, value }: { label: string; value: string }) => (
    <TouchableOpacity
      className="px-4 py-2 rounded-full mr-2"
      style={{
        backgroundColor: activeFilter === value ? colors.primary : colors.surface,
        borderWidth: 1,
        borderColor: activeFilter === value ? colors.primary : colors.border,
      }}
      onPress={() => setActiveFilter(value)}
    >
      <Text
        className="text-sm font-semibold"
        style={{ color: activeFilter === value ? "#ffffff" : colors.foreground }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="mt-4">
            <Text className="text-3xl font-bold text-foreground">Library</Text>
            <Text className="text-base text-muted mt-1">
              All 21 audio experiences
            </Text>
          </View>

          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            <View className="flex-row">
              <FilterButton label="All" value="all" />
              <FilterButton label="Binaural" value="binaural" />
              <FilterButton label="Isochronic" value="isochronic" />
              <FilterButton label="Harmonic" value="harmonic" />
              <FilterButton label="Ambient" value="ambient" />
            </View>
          </ScrollView>

          {/* Track Count */}
          <Text className="text-sm text-muted">
            {filteredTracks.length} {filteredTracks.length === 1 ? "track" : "tracks"}
          </Text>

          {/* Tracks List */}
          <View>
            {filteredTracks.map(renderTrackCard)}
          </View>

          {/* Safety Footer */}
          <View className="mt-4 mb-8">
            <Text className="text-xs text-muted text-center leading-relaxed">
              Not intended for medical use. Stop listening if discomfort occurs.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
