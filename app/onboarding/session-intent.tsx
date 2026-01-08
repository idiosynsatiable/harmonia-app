import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export interface SessionIntent {
  id: string;
  title: string;
  description: string;
  icon: string;
  recommendedPresets: string[];
  color: string;
}

const SESSION_INTENTS: SessionIntent[] = [
  {
    id: 'healing',
    title: 'Healing & Recovery',
    description: 'Physical healing, pain relief, post-surgery recovery',
    icon: '🩺',
    recommendedPresets: ['DNA Repair 528Hz', 'Deep Healing Delta', 'Pain Relief Alpha'],
    color: '#10B981', // Green
  },
  {
    id: 'meditation',
    title: 'Deep Meditation',
    description: 'Mindfulness, inner peace, spiritual connection',
    icon: '🧘',
    recommendedPresets: ['OM Meditation', 'Theta Meditation', 'Zen Alpha'],
    color: '#8B5CF6', // Purple
  },
  {
    id: 'focus',
    title: 'Focus & Productivity',
    description: 'Concentration, study, work performance',
    icon: '🎯',
    recommendedPresets: ['Beta Focus', 'Gamma Peak Performance', 'Alpha Concentration'],
    color: '#F59E0B', // Orange
  },
  {
    id: 'sleep',
    title: 'Deep Sleep',
    description: 'Fall asleep faster, improve sleep quality',
    icon: '😴',
    recommendedPresets: ['Delta Sleep', 'Theta Drowsiness', 'Sleep Induction'],
    color: '#3B82F6', // Blue
  },
  {
    id: 'energy',
    title: 'Energy & Vitality',
    description: 'Boost energy, overcome fatigue, morning activation',
    icon: '⚡',
    recommendedPresets: ['Gamma Energy', 'Beta Activation', 'Morning Boost'],
    color: '#EF4444', // Red
  },
  {
    id: 'astral',
    title: 'Astral Projection',
    description: 'Out-of-body experience, lucid dreaming, vibrational stage',
    icon: '✨',
    recommendedPresets: ['Vibrational Stage', 'Theta Gateway', 'Astral Theta-Delta'],
    color: '#EC4899', // Pink
  },
  {
    id: 'enlightenment',
    title: 'Self-Enlightenment',
    description: 'Spiritual awakening, higher consciousness, self-discovery',
    icon: '🌟',
    recommendedPresets: ['963Hz Crown Chakra', 'Gamma Enlightenment', 'Cosmic OM'],
    color: '#A855F7', // Purple
  },
  {
    id: 'stress',
    title: 'Stress Relief',
    description: 'Anxiety reduction, emotional balance, relaxation',
    icon: '🌊',
    recommendedPresets: ['Alpha Relaxation', 'Theta Calm', 'Stress Release'],
    color: '#06B6D4', // Cyan
  },
];

export default function SessionIntentScreen() {
  const router = useRouter();
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);

  const handleSelectIntent = async (intentId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedIntent(intentId);

    // Save last intent
    await AsyncStorage.setItem('last_session_intent', intentId);

    // Navigate to recommended presets or home
    setTimeout(() => {
      router.push('/(tabs)');
    }, 300);
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('onboarding_completed', 'true');
    router.push('/(tabs)');
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="p-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            What's your goal today?
          </Text>
          <Text className="text-base text-muted">
            Choose your intention to get personalized recommendations
          </Text>
        </View>

        {/* Intent Cards */}
        <View className="px-6">
          {SESSION_INTENTS.map((intent) => (
            <TouchableOpacity
              key={intent.id}
              onPress={() => handleSelectIntent(intent.id)}
              className={`mb-4 p-6 rounded-2xl border-2 ${
                selectedIntent === intent.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-surface'
              }`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View className="flex-row items-center mb-3">
                <Text className="text-4xl mr-3">{intent.icon}</Text>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-foreground">
                    {intent.title}
                  </Text>
                </View>
              </View>

              <Text className="text-sm text-muted mb-3">
                {intent.description}
              </Text>

              {/* Recommended Presets */}
              <View className="flex-row flex-wrap gap-2">
                {intent.recommendedPresets.map((preset, idx) => (
                  <View
                    key={idx}
                    className="px-3 py-1 rounded-full bg-primary/20"
                  >
                    <Text className="text-xs text-primary font-medium">
                      {preset}
                    </Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Skip Button */}
        <View className="px-6 mt-6">
          <TouchableOpacity
            onPress={handleSkip}
            className="py-4 rounded-lg border border-border"
          >
            <Text className="text-center text-muted font-semibold">
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>

        {/* Educational Note */}
        <View className="px-6 mt-6 p-4 bg-primary/5 rounded-xl">
          <Text className="text-sm text-foreground font-semibold mb-2">
            💡 Why this matters
          </Text>
          <Text className="text-sm text-muted leading-relaxed">
            Different brainwave frequencies affect your mind and body in unique ways. 
            By selecting your intention, we can recommend the most effective frequencies 
            for your specific goal.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
