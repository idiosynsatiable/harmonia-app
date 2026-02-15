/**
 * MiniPlayer Component
 * Persistent mini player that appears at bottom when session is active
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/use-colors';
import { usePlayerStore } from '@/src/core/playerStore';

export function MiniPlayer() {
  const colors = useColors();
  const router = useRouter();
  const { currentSession, isPlaying, play, pause } = usePlayerStore();

  if (!currentSession) return null;

  const handlePress = () => {
    router.push(`/player/${currentSession.id}`);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      ]}
    >
      <Pressable
        style={styles.content}
        onPress={handlePress}
      >
        <View style={styles.info}>
          <Text
            style={[styles.title, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {currentSession.name}
          </Text>
          <Text
            style={[styles.subtitle, { color: colors.muted }]}
            numberOfLines={1}
          >
            {currentSession.type} • {currentSession.frequency}
          </Text>
        </View>

        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            isPlaying ? pause() : play();
          }}
          style={({ pressed }) => [
            styles.playButton,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶️'}</Text>
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingBottom: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 18,
  },
});
