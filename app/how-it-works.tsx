import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

/**
 * How Harmonia Works Page
 * 
 * Educational content about:
 * - Binaural beats
 * - Isochronic tones
 * - Sacred frequencies
 * - Ambient sounds
 * - No medical claims
 */
export default function HowItWorksScreen() {
  const colors = useColors();

  const Section = ({ title, content }: { title: string; content: string }) => (
    <View className="mb-6">
      <Text className="text-xl font-bold text-foreground mb-3">{title}</Text>
      <Text className="text-base text-foreground leading-relaxed">
        {content}
      </Text>
    </View>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="mt-4 mb-4">
            <Text className="text-3xl font-bold text-foreground">How Harmonia Works</Text>
            <Text className="text-base text-muted mt-2">
              Understanding sound-based experiences
            </Text>
          </View>

          {/* Introduction */}
          <View 
            className="bg-surface rounded-xl p-4 border border-border mb-4"
            style={{ borderColor: colors.border }}
          >
            <Text className="text-base text-foreground leading-relaxed">
              Harmonia uses four types of audio experiences—binaural beats, isochronic tones, harmonic frequencies, and ambient sounds—to support focus, relaxation, and mindful states. 
              These are not medical treatments, but rather tools for creating intentional listening environments.
            </Text>
          </View>

          {/* Binaural Beats */}
          <Section
            title="🎧 Binaural Beats"
            content="Binaural beats work by presenting two slightly different frequencies to each ear through stereo headphones. For example, if your left ear hears 200 Hz and your right ear hears 210 Hz, your brain perceives a 10 Hz 'beat.' This phenomenon is called frequency following response. Binaural beats require headphones to function properly and are commonly used for meditation, focus, and relaxation practices."
          />

          {/* Isochronic Tones */}
          <Section
            title="📻 Isochronic Tones"
            content="Isochronic tones are single tones that pulse on and off at precise intervals. Unlike binaural beats, they don't require headphones and can be enjoyed through speakers. The rhythmic pulsing creates a clear, distinct pattern that many find easier to follow than binaural beats. They're often used for focus, creativity, and relaxation."
          />

          {/* Sacred Frequencies */}
          <Section
            title="🕉️ Sacred & Harmonic Frequencies"
            content="Harmonia includes frequencies from various sound traditions, such as 432 Hz (often described as a natural tuning), Solfeggio tones (528 Hz, 741 Hz, 852 Hz), and OM resonance (136.1 Hz). These frequencies have historical and cultural significance in meditation and sound practices. We present them for relaxation and focused listening—not for medical outcomes."
          />

          {/* Ambient Sounds */}
          <Section
            title="🌊 Ambient & Masking Sounds"
            content="Ambient sounds like pink noise, brown noise, rainfall, and ocean waves provide consistent background audio that can help mask distractions, support sleep, or create calming environments. These natural and synthesized sounds are widely used for focus, relaxation, and sleep support."
          />

          {/* Brainwave States */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-foreground mb-3">Brainwave Frequency Ranges</Text>
            <View className="bg-surface rounded-xl p-4 border border-border" style={{ borderColor: colors.border }}>
              <Text className="text-sm text-foreground mb-2">
                <Text className="font-semibold">Delta (0.5-4 Hz):</Text> Deep sleep, rest
              </Text>
              <Text className="text-sm text-foreground mb-2">
                <Text className="font-semibold">Theta (4-8 Hz):</Text> Meditation, relaxation
              </Text>
              <Text className="text-sm text-foreground mb-2">
                <Text className="font-semibold">Alpha (8-14 Hz):</Text> Calm focus, light relaxation
              </Text>
              <Text className="text-sm text-foreground mb-2">
                <Text className="font-semibold">Beta (14-30 Hz):</Text> Alert focus, concentration
              </Text>
              <Text className="text-sm text-muted mt-2">
                These ranges are based on common neuroscience classifications. Harmonia uses frequencies within these ranges to support different listening intentions.
              </Text>
            </View>
          </View>

          {/* Best Practices */}
          <Section
            title="✨ Best Practices"
            content="For best results: use headphones for binaural beats, start at low volume, choose sessions that match your intention (focus, calm, or sleep), and listen in a comfortable environment. Take breaks between sessions and stop if you experience any discomfort."
          />

          {/* Scientific Context */}
          <View 
            className="bg-surface rounded-xl p-4 border border-border mb-8"
            style={{ borderColor: colors.border }}
          >
            <Text className="text-sm font-semibold text-foreground mb-2">
              Scientific Context
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              While binaural beats and isochronic tones have been studied in research settings, results vary widely across individuals. 
              Harmonia is designed as a tool for intentional listening and mindfulness practices, not as a medical or therapeutic intervention. 
              Individual experiences may differ.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
