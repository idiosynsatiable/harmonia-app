/**
 * SessionCard Component
 * Premium card design for session display in Explore and other screens
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { SessionData } from '@/src/core/playerStore';

interface SessionCardProps {
  session: SessionData;
  onPress: () => void;
  showCategory?: boolean;
}

export function SessionCard({ session, onPress, showCategory = false }: SessionCardProps) {
  const colors = useColors();

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'binaural': return '🎧';
      case 'isochronic': return '〰️';
      case 'harmonic': return '🕉️';
      default: return '🌊';
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{getSessionIcon(session.type)}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
            {session.name}
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]} numberOfLines={1}>
            {session.type.charAt(0).toUpperCase() + session.type.slice(1)} • {session.frequency}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>
            {session.duration}m
          </Text>
        </View>
      </View>
      
      <Text style={[styles.description, { color: colors.foreground }]} numberOfLines={2}>
        {session.description}
      </Text>

      {showCategory && (
        <View style={styles.footer}>
          <Text style={[styles.category, { color: colors.muted }]}>
            {session.category.charAt(0).toUpperCase() + session.category.slice(1)}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  category: {
    fontSize: 12,
  },
});
