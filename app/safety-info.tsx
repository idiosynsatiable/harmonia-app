import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

/**
 * Safety Information Page
 * 
 * Required content:
 * - Volume guidance
 * - Headphone recommendations
 * - Driving warnings
 * - Discomfort guidance
 * - Not medical advice disclaimer
 */
export default function SafetyInfoScreen() {
  const colors = useColors();

  const SafetySection = ({ icon, title, content }: { icon: string; title: string; content: string }) => (
    <View className="mb-6">
      <View className="flex-row items-center gap-2 mb-2">
        <Text className="text-2xl">{icon}</Text>
        <Text className="text-lg font-bold text-foreground">{title}</Text>
      </View>
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
            <Text className="text-3xl font-bold text-foreground">Safety Information</Text>
            <Text className="text-base text-muted mt-2">
              Please read these guidelines before using Harmonia
            </Text>
          </View>

          {/* Important Notice */}
          <View 
            className="bg-surface rounded-xl p-4 border-2 mb-4"
            style={{ borderColor: colors.primary }}
          >
            <Text className="text-base font-semibold text-foreground mb-2">
              ⚠️ Important Notice
            </Text>
            <Text className="text-sm text-foreground leading-relaxed">
              Harmonia provides sound-based experiences designed for relaxation, focus, and mindful states. 
              These audio experiences are not medical treatments, therapeutic interventions, or diagnostic tools. 
              Always consult healthcare professionals for medical conditions.
            </Text>
          </View>

          {/* Safety Guidelines */}
          <SafetySection
            icon="🔊"
            title="Volume Safety"
            content="Always start at a low volume and increase gradually to a comfortable level. Louder does not mean more effective. Extended exposure to high volumes can damage hearing. We recommend keeping volume below 80% of maximum."
          />

          <SafetySection
            icon="🎧"
            title="Headphone Recommendations"
            content="Binaural beats require stereo headphones to work properly, as they deliver different frequencies to each ear. Isochronic tones, harmonic frequencies, and ambient sounds can be enjoyed through speakers or headphones."
          />

          <SafetySection
            icon="🚗"
            title="Avoid While Driving"
            content="Never listen to Harmonia while driving, operating machinery, or performing tasks that require full attention. Some audio experiences may induce relaxation or altered states of awareness."
          />

          <SafetySection
            icon="⏱️"
            title="Session Duration"
            content="Start with shorter sessions (10-15 minutes) and gradually increase duration as you become familiar with the experience. Take breaks between sessions. Free users have a 15-minute session limit for safety."
          />

          <SafetySection
            icon="🛑"
            title="Stop If Uncomfortable"
            content="If you experience discomfort, dizziness, headache, or any adverse effects, stop listening immediately. Some individuals may be sensitive to certain frequencies or audio patterns."
          />

          <SafetySection
            icon="⚕️"
            title="Medical Considerations"
            content="Consult your healthcare provider before using Harmonia if you have epilepsy, seizure disorders, heart conditions, or are pregnant. This app is not intended to diagnose, treat, cure, or prevent any medical condition."
          />

          <SafetySection
            icon="👂"
            title="Hearing Protection"
            content="If you have tinnitus, hearing loss, or ear conditions, consult an audiologist before use. Protect your hearing by using comfortable volumes and taking regular breaks."
          />

          <SafetySection
            icon="🌙"
            title="Sleep Sessions"
            content="For overnight use, set a comfortable volume and use a timer. Ensure your device is secure and won't cause discomfort during sleep. Remove headphones if they become uncomfortable."
          />

          {/* Footer Disclaimer */}
          <View 
            className="bg-surface rounded-xl p-4 border border-border mt-4 mb-8"
            style={{ borderColor: colors.border }}
          >
            <Text className="text-sm text-muted text-center leading-relaxed">
              By using Harmonia, you acknowledge that you have read and understood these safety guidelines. 
              Harmonia and its creators are not liable for any adverse effects resulting from misuse or failure to follow safety recommendations.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
