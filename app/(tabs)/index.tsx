import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

/**
 * Home Screen - Clean, Minimal, Professional
 * 
 * Features:
 * - Today's Session (rotating daily)
 * - Continue Listening (if session active)
 * - Single primary CTA
 * - No clutter
 */
export default function HomeScreen() {
  const colors = useColors();

  // TODO: Implement session rotation logic
  const todaysSession = {
    name: "Deep Focus",
    duration: 25,
    description: "Sustained concentration with 14 Hz binaural beats",
    type: "Binaural Beat",
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-8">
          {/* Welcome Header */}
          <View className="items-center gap-2 mt-8">
            <Text className="text-4xl font-bold text-foreground">Welcome to</Text>
            <Text className="text-5xl font-bold" style={{ color: colors.primary }}>
              Harmonia
            </Text>
            <Text className="text-base text-muted text-center mt-2">
              Sound-based experiences for focus, relaxation, and mindful states
            </Text>
          </View>

          {/* Today's Session Card */}
          <View className="w-full max-w-sm self-center">
            <Text className="text-lg font-semibold text-foreground mb-3">
              ✨ Today's Free Session
            </Text>
            <View 
              className="bg-surface rounded-2xl p-6 shadow-sm border border-border"
              style={{ borderColor: colors.border }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-2xl font-bold text-foreground">
                  {todaysSession.name}
                </Text>
                <View className="bg-primary/20 px-3 py-1 rounded-full">
                  <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                    {todaysSession.duration} min
                  </Text>
                </View>
              </View>
              
              <Text className="text-sm text-muted mb-2">
                {todaysSession.type}
              </Text>
              
              <Text className="text-base text-foreground leading-relaxed mb-6">
                {todaysSession.description}
              </Text>

              {/* Start Session Button */}
              <TouchableOpacity
                className="bg-primary rounded-full py-4 items-center active:opacity-80"
                style={{ backgroundColor: colors.primary }}
                onPress={() => {
                  // TODO: Navigate to session player
                  console.log("Start session:", todaysSession.name);
                }}
              >
                <Text className="text-background font-semibold text-lg">
                  Start Session
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Continue Listening (if applicable) */}
          {/* TODO: Show only if session was interrupted */}
          {/* <View className="w-full max-w-sm self-center">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Continue Listening
            </Text>
            <View className="bg-surface rounded-2xl p-4 shadow-sm border border-border">
              <Text className="text-base font-semibold text-foreground">
                Meditative Drift
              </Text>
              <Text className="text-sm text-muted mt-1">
                12 minutes remaining
              </Text>
            </View>
          </View> */}

          {/* Founding Listener Badge */}
          <View className="w-full max-w-sm self-center mt-4">
            <View 
              className="bg-surface rounded-xl p-4 border border-border"
              style={{ borderColor: colors.border }}
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-3xl">🌟</Text>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">
                    Founding Listener
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    You're using Harmonia in its early phase. Founding listeners will receive lifetime perks when premium launches.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Safety Notice */}
          <View className="w-full max-w-sm self-center mt-4">
            <Text className="text-xs text-muted text-center leading-relaxed">
              Not intended for medical use. Always listen at a comfortable volume. Use headphones for binaural beats.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
