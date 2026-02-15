import { FlatList, Text, View, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState, useMemo } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { audioTracks, getFocusTracks, getCalmTracks, getSleepTracks } from "@/lib/audio-tracks";
import { SessionCard } from "@/src/ui/SessionCard";
import { usePlayerStore } from "@/src/core/playerStore";

type FilterType = 'all' | 'focus' | 'calm' | 'sleep';

/**
 * Explore Screen - State-of-the-Art Discovery Experience
 * 
 * Features:
 * - Search functionality
 * - Filter chips (All, Focus, Calm, Sleep)
 * - Sectioned content with FlatList performance
 * - Premium card-based layout
 * - Integrated with central player store
 */
export default function ExploreScreen() {
  const colors = useColors();
  const router = useRouter();
  const { loadSession } = usePlayerStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Filter and search logic
  const filteredSessions = useMemo(() => {
    let sessions = audioTracks;
    
    // Apply category filter
    if (activeFilter !== 'all') {
      sessions = sessions.filter(track => track.category === activeFilter);
    }
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      sessions = sessions.filter(track => 
        track.name.toLowerCase().includes(query) ||
        track.description.toLowerCase().includes(query) ||
        track.type.toLowerCase().includes(query)
      );
    }
    
    return sessions;
  }, [activeFilter, searchQuery]);

  // Sectioned data for better organization
  const sections = useMemo(() => {
    if (searchQuery.trim() || activeFilter !== 'all') {
      return [{ title: 'Results', data: filteredSessions }];
    }
    
    return [
      { title: '🎯 For Focus', data: getFocusTracks().slice(0, 4) },
      { title: '🌊 For Calm', data: getCalmTracks().slice(0, 4) },
      { title: '🌙 For Sleep', data: getSleepTracks().slice(0, 4) },
    ];
  }, [searchQuery, activeFilter, filteredSessions]);

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

  const FilterChip = ({ label, value }: { label: string; value: FilterType }) => (
    <Pressable
      onPress={() => setActiveFilter(value)}
      style={({ pressed }) => ({
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: activeFilter === value ? colors.primary : colors.surface,
        borderWidth: 1,
        borderColor: activeFilter === value ? colors.primary : colors.border,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: activeFilter === value ? '#FFFFFF' : colors.foreground,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.foreground, marginBottom: 4 }}>
          Explore
        </Text>
        <Text style={{ fontSize: 15, color: colors.muted }}>
          Discover sessions for focus, calm, and sleep
        </Text>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search sessions..."
          placeholderTextColor={colors.muted}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 15,
            color: colors.foreground,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />
      </View>

      {/* Filter Chips */}
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row' }}>
          <FilterChip label="All" value="all" />
          <FilterChip label="Focus" value="focus" />
          <FilterChip label="Calm" value="calm" />
          <FilterChip label="Sleep" value="sleep" />
        </View>
      </View>

      {/* Sessions List */}
      <FlatList
        data={sections}
        keyExtractor={(section) => section.title}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        renderItem={({ item: section }) => (
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: colors.foreground,
                marginBottom: 12,
              }}
            >
              {section.title}
            </Text>
            {section.data.map((session) => (
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
        ListEmptyComponent={
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: colors.muted }}>
              No sessions found
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}
