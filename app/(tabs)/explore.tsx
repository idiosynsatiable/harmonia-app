import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { getFocusTracks, getCalmTracks, getSleepTracks } from "@/lib/audio-tracks";

/**
 * Explore Screen - Guided Discovery
 * 
 * Three subsections:
 * - Focus (3-6 curated sessions)
 * - Calm (3-6 curated sessions)
 * - Sleep (3-6 curated sessions)
 * 
 * Prevents decision fatigue with curated selection
 */
export default function ExploreScreen() {
  const colors = useColors();

  // Get curated tracks from data model
  const focusSessions = getFocusTracks().slice(0, 3);
  const calmSessions = getCalmTracks().slice(0, 3);
  const sleepSessions = getSleepTracks().slice(0, 3);

  const renderSessionCard = (session: any) => (
    <TouchableOpacity
      key={session.id}
      className="bg-surface rounded-xl p-4 mb-3 border border-border active:opacity-70"
      style={{ borderColor: colors.border }}
      onPress={() => {
        // TODO: Navigate to session player
        console.log("Play session:", session.name);
      }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-lg font-semibold text-foreground">
          {session.name}
        </Text>
        <View className="bg-primary/20 px-2 py-1 rounded-full">
          <Text className="text-xs font-semibold" style={{ color: colors.primary }}>
            {session.duration} min
          </Text>
        </View>
      </View>
      
      <Text className="text-sm text-muted mb-1">
        {session.type.charAt(0).toUpperCase() + session.type.slice(1)} • {session.frequency}
      </Text>
      
      <Text className="text-sm text-foreground">
        {session.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="mt-4">
            <Text className="text-3xl font-bold text-foreground">Explore</Text>
            <Text className="text-base text-muted mt-1">
              Curated sessions for your intention
            </Text>
          </View>

          {/* Focus Section */}
          <View>
            <View className="flex-row items-center gap-2 mb-3">
              <Text className="text-2xl">🎯</Text>
              <Text className="text-xl font-bold text-foreground">Focus</Text>
            </View>
            {focusSessions.map(renderSessionCard)}
          </View>

          {/* Calm Section */}
          <View>
            <View className="flex-row items-center gap-2 mb-3">
              <Text className="text-2xl">🌊</Text>
              <Text className="text-xl font-bold text-foreground">Calm</Text>
            </View>
            {calmSessions.map(renderSessionCard)}
          </View>

          {/* Sleep Section */}
          <View>
            <View className="flex-row items-center gap-2 mb-3">
              <Text className="text-2xl">🌙</Text>
              <Text className="text-xl font-bold text-foreground">Sleep</Text>
            </View>
            {sleepSessions.map(renderSessionCard)}
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
