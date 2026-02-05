import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { getFocusTracks, getCalmTracks, getSleepTracks } from "@/lib/audio-tracks";
import { useRouter } from "expo-router";

/**
 * Explore Screen - Guided Discovery
 */
export default function ExploreScreen() {
  const colors = useColors();
  const router = useRouter();

  const focusSessions = getFocusTracks().slice(0, 3);
  const calmSessions = getCalmTracks().slice(0, 3);
  const sleepSessions = getSleepTracks().slice(0, 3);

  const FeatureCard = ({ icon, title, subtitle, onPress }: { icon: string, title: string, subtitle: string, onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      className="bg-surface rounded-xl p-4 mb-3 border border-border active:opacity-70 flex-row items-center"
      style={{ borderColor: colors.border }}
    >
      <Text className="text-3xl mr-4">{icon}</Text>
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">{title}</Text>
        <Text className="text-sm text-muted">{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSessionCard = (session: any) => (
    <TouchableOpacity
      key={session.id}
      className="bg-surface rounded-xl p-4 mb-3 border border-border active:opacity-70"
      style={{ borderColor: colors.border }}
      onPress={() => router.push(`/player/${session.id}`)}
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
      <Text className="text-sm text-foreground">{session.description}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          <View className="mt-4">
            <Text className="text-3xl font-bold text-foreground">Explore</Text>
            <Text className="text-base text-muted mt-1">Curated sessions for your intention</Text>
          </View>

          {/* Functional Features Section */}
          <View>
            <Text className="text-xl font-bold text-foreground mb-3">Features</Text>
            <FeatureCard 
              icon="🎵" 
              title="Binaural Beats" 
              subtitle="Frequency difference between ears" 
              onPress={() => router.push({ pathname: "/(tabs)", params: { filter: 'binaural' } })}
            />
            <FeatureCard 
              icon="🌀" 
              title="Isochronic Tones" 
              subtitle="Rhythmic pulses for brain entrainment" 
              onPress={() => router.push({ pathname: "/(tabs)", params: { filter: 'isochronic' } })}
            />
            <FeatureCard 
              icon="🧘" 
              title="Om Chanting" 
              subtitle="Sacred sound layering" 
              onPress={() => router.push("/player/om-resonance")}
            />
          </View>

          {/* Curated Sections */}
          <View>
            <View className="flex-row items-center gap-2 mb-3">
              <Text className="text-2xl">🎯</Text>
              <Text className="text-xl font-bold text-foreground">Focus</Text>
            </View>
            {focusSessions.map(renderSessionCard)}
          </View>

          <View>
            <View className="flex-row items-center gap-2 mb-3">
              <Text className="text-2xl">🌊</Text>
              <Text className="text-xl font-bold text-foreground">Calm</Text>
            </View>
            {calmSessions.map(renderSessionCard)}
          </View>

          <View className="mt-4 mb-8">
            <Text className="text-xs text-muted text-center leading-relaxed">
              ⚠ Not a medical device. Binaural beats may trigger seizures in 1-3% of people.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
