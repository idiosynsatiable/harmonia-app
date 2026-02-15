import { ScrollView, Text, View, Pressable, Image } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { audioTracks } from "@/lib/audio-tracks";
import { usePlayerStore } from "@/src/core/playerStore";
import { SessionCard } from "@/src/ui/SessionCard";

/**
 * Listen Screen - Now Playing + Quick Access
 * 
 * Features:
 * - Now Playing card (if active)
 * - Quick-start presets
 * - Recent sessions
 * - Favorite sessions
 */
export default function ListenScreen() {
  const colors = useColors();
  const { currentSession, isPlaying, favorites, recents, loadSession } = usePlayerStore();

  // Get recent and favorite sessions
  const recentSessions = recents
    .map(id => audioTracks.find(t => t.id === id))
    .filter(Boolean)
    .slice(0, 5);

  const favoriteSessions = favorites
    .map(id => audioTracks.find(t => t.id === id))
    .filter(Boolean);

  // Quick-start presets (curated selection)
  const quickStartPresets = [
    audioTracks.find(t => t.id === 'deep-focus'),
    audioTracks.find(t => t.id === 'relaxed-awareness'),
    audioTracks.find(t => t.id === 'sleep-delta'),
  ].filter(Boolean);

  const handleSessionPress = (session: any) => {
    loadSession({
      id: session.id,
      name: session.name,
      description: session.description,
      type: session.type,
      frequency: session.frequency,
      duration: session.duration,
      category: session.category,
      audioFile: session.audioFile,
      headphonesRequired: session.headphonesRequired,
    });
    router.push(`/player/${session.id}`);
  };

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Logo Header */}
        <View style={{ alignItems: 'center', paddingVertical: 24 }}>
          <Image
            source={require("@/assets/images/harmonia-logo.png")}
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.foreground, marginTop: 12 }}>
            Harmonia
          </Text>
          <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>
            Sound experiences for focus, calm & sleep
          </Text>
        </View>

        {/* Now Playing Section */}
        {currentSession && (
          <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.foreground, marginBottom: 12 }}>
              🎵 Now Playing
            </Text>
            <Pressable
              onPress={() => router.push(`/player/${currentSession.id}`)}
              style={({ pressed }) => ({
                backgroundColor: colors.primary + '15',
                borderRadius: 16,
                padding: 20,
                borderWidth: 2,
                borderColor: colors.primary,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: isPlaying ? colors.primary : colors.muted,
                    marginRight: 8,
                  }}
                />
                <Text style={{ fontSize: 12, color: colors.muted, fontWeight: '600' }}>
                  {isPlaying ? 'PLAYING' : 'PAUSED'}
                </Text>
              </View>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.foreground, marginBottom: 4 }}>
                {currentSession.name}
              </Text>
              <Text style={{ fontSize: 14, color: colors.muted }}>
                {currentSession.type} • {currentSession.frequency}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Quick Start Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.foreground, marginBottom: 12 }}>
            ⚡ Quick Start
          </Text>
          {quickStartPresets.map((session) => (
            <SessionCard
              key={session.id}
              session={{
                id: session.id,
                name: session.name,
                description: session.description,
                type: session.type,
                frequency: session.frequency,
                duration: session.duration,
                category: session.category,
                audioFile: session.audioFile,
                headphonesRequired: session.headphonesRequired,
              }}
              onPress={() => handleSessionPress(session)}
            />
          ))}
        </View>

        {/* Recents Section */}
        {recentSessions.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.foreground, marginBottom: 12 }}>
              🕐 Recent
            </Text>
            {recentSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={{
                  id: session.id,
                  name: session.name,
                  description: session.description,
                  type: session.type,
                  frequency: session.frequency,
                  duration: session.duration,
                  category: session.category,
                  audioFile: session.audioFile,
                  headphonesRequired: session.headphonesRequired,
                }}
                onPress={() => handleSessionPress(session)}
              />
            ))}
          </View>
        )}

        {/* Favorites Section */}
        {favoriteSessions.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.foreground, marginBottom: 12 }}>
              ⭐ Favorites
            </Text>
            {favoriteSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={{
                  id: session.id,
                  name: session.name,
                  description: session.description,
                  type: session.type,
                  frequency: session.frequency,
                  duration: session.duration,
                  category: session.category,
                  audioFile: session.audioFile,
                  headphonesRequired: session.headphonesRequired,
                }}
                onPress={() => handleSessionPress(session)}
              />
            ))}
          </View>
        )}

        {/* Empty State */}
        {!currentSession && recentSessions.length === 0 && favoriteSessions.length === 0 && (
          <View style={{ paddingHorizontal: 20, paddingVertical: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🎧</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground, marginBottom: 8, textAlign: 'center' }}>
              Start Your First Session
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted, textAlign: 'center', marginBottom: 24 }}>
              Explore curated sessions for focus, calm, and sleep
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/explore')}
              style={({ pressed }) => ({
                backgroundColor: colors.primary,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 24,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                Explore Sessions
              </Text>
            </Pressable>
          </View>
        )}

        {/* Safety Footer */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}>
          <Text style={{ fontSize: 11, color: colors.muted, textAlign: 'center', lineHeight: 16 }}>
            Not intended for medical use. Stop listening if discomfort occurs.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
