import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { PREMIUM_FEATURES } from "@/lib/entitlements";

/**
 * Unlock Modal - Payment-Agnostic
 * 
 * Shows premium features and "Coming Soon" messaging.
 * No payment processing - just informational.
 * 
 * When payments unlock, replace "Join Waitlist" with actual checkout.
 */

interface UnlockModalProps {
  visible: boolean;
  onClose: () => void;
  onJoinWaitlist?: () => void;
}

export function UnlockModal({ visible, onClose, onJoinWaitlist }: UnlockModalProps) {
  const colors = useColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View 
          className="bg-background rounded-t-3xl p-6"
          style={{ backgroundColor: colors.background, maxHeight: "80%" }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/* Header */}
            <View className="items-center mb-6">
              <Text className="text-3xl mb-2">✨</Text>
              <Text className="text-2xl font-bold text-foreground">
                Unlock Full Access
              </Text>
              <Text className="text-base text-muted mt-2 text-center">
                Extended sessions and premium features launching soon
              </Text>
            </View>

            {/* Founding Listener Notice */}
            <View 
              className="bg-surface rounded-xl p-4 border-2 mb-6"
              style={{ borderColor: colors.primary }}
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-3xl">🌟</Text>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">
                    Founding Listener Perks
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    You're using Harmonia in its early phase. Founding listeners will receive lifetime perks when premium launches.
                  </Text>
                </View>
              </View>
            </View>

            {/* Premium Features */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-foreground mb-3">
                What's Coming
              </Text>
              {PREMIUM_FEATURES.map((feature, index) => (
                <View key={index} className="flex-row items-center gap-3 mb-3">
                  <View 
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className="text-white text-xs font-bold">✓</Text>
                  </View>
                  <Text className="text-base text-foreground flex-1">
                    {feature}
                  </Text>
                </View>
              ))}
            </View>

            {/* Current Limitation */}
            <View 
              className="bg-surface rounded-xl p-4 border border-border mb-6"
              style={{ borderColor: colors.border }}
            >
              <Text className="text-sm text-muted text-center leading-relaxed">
                Free tier: 15-minute sessions • All 21 tracks accessible
              </Text>
            </View>

            {/* CTA Buttons */}
            <View className="gap-3">
              {/* Join Waitlist Button */}
              <TouchableOpacity
                className="bg-primary rounded-full py-4 items-center active:opacity-80"
                style={{ backgroundColor: colors.primary }}
                onPress={() => {
                  onClose();
                  onJoinWaitlist?.();
                }}
              >
                <Text className="text-white font-semibold text-lg">
                  Join Waitlist
                </Text>
              </TouchableOpacity>

              {/* Close Button */}
              <TouchableOpacity
                className="bg-surface rounded-full py-4 items-center active:opacity-70"
                style={{ backgroundColor: colors.surface }}
                onPress={onClose}
              >
                <Text className="text-foreground font-semibold text-base">
                  Continue with Free
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer Note */}
            <Text className="text-xs text-muted text-center mt-6 leading-relaxed">
              No payment required. We'll notify you when premium features launch.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
