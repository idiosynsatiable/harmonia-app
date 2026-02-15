import { ScrollView, Text, View, TouchableOpacity, Linking } from "react-native";
import Constants from 'expo-constants';
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { UnlockModal } from "@/components/unlock-modal";

/**
 * Account Screen - Safety, Preferences, Legal
 * 
 * Must include:
 * - Safety Information
 * - How Harmonia Works
 * - Preferences (volume fade, timer default)
 * - Email capture (optional)
 * - Legal links
 * - Founding Listener badge
 */
export default function InfoScreen() {
  const colors = useColors();
  const router = useRouter();
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const MenuItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress 
  }: { 
    icon: string; 
    title: string; 
    subtitle?: string; 
    onPress: () => void;
  }) => (
    <TouchableOpacity
      className="bg-surface rounded-xl p-4 mb-3 border border-border active:opacity-70"
      style={{ borderColor: colors.border }}
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1">
          <Text className="text-2xl">{icon}</Text>
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">
              {title}
            </Text>
            {subtitle && (
              <Text className="text-sm text-muted mt-1">
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        <IconSymbol name="chevron.right" size={20} color={colors.muted} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="mt-4">
            <Text className="text-3xl font-bold text-foreground">Info</Text>
            <Text className="text-base text-muted mt-1">
              Safety, science, and guidance
            </Text>
          </View>

          {/* Founding Listener Badge */}
          <View 
            className="bg-surface rounded-xl p-4 border-2"
            style={{ borderColor: colors.primary }}
          >
            <View className="flex-row items-center gap-3">
              <Text className="text-4xl">🌟</Text>
              <View className="flex-1">
                <Text className="text-lg font-bold text-foreground">
                  Founding Listener
                </Text>
                <Text className="text-sm text-muted mt-1">
                  You're using Harmonia in its early phase. Founding listeners will receive lifetime perks when premium launches.
                </Text>
              </View>
            </View>
          </View>

          {/* Unlock Full Access */}
          <TouchableOpacity
            className="bg-primary rounded-xl p-4 active:opacity-80"
            style={{ backgroundColor: colors.primary }}
            onPress={() => setShowUnlockModal(true)}
          >
            <View className="items-center">
              <Text className="text-white font-bold text-lg">
                Unlock Full Access
              </Text>
              <Text className="text-white/80 text-sm mt-1">
                Extended sessions • Offline playback • Custom presets
              </Text>
            </View>
          </TouchableOpacity>

          {/* Safety & Information Section */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">
              Safety & Information
            </Text>
            
            <MenuItem
              icon="🛡️"
              title="Safety Information"
              subtitle="Volume, headphones, and usage guidance"
              onPress={() => {
                router.push("/safety-info");
              }}
            />
            
            <MenuItem
              icon="📚"
              title="How Harmonia Works"
              subtitle="Learn about binaural beats and isochronic tones"
              onPress={() => {
                router.push("/how-it-works");
              }}
            />
          </View>

          {/* Preferences Section */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">
              Preferences
            </Text>
            
            <MenuItem
              icon="🎚️"
              title="Volume Fade Duration"
              subtitle="Currently: 3 seconds"
              onPress={() => {
                // TODO: Show fade duration picker
                console.log("Show fade duration picker");
              }}
            />
            
            <MenuItem
              icon="⏱️"
              title="Default Timer"
              subtitle="Currently: 15 minutes"
              onPress={() => {
                // TODO: Show timer picker
                console.log("Show timer picker");
              }}
            />
          </View>

          {/* Email Capture (Optional) */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">
              Stay Updated
            </Text>
            
            <MenuItem
              icon="📧"
              title="Get Notified"
              subtitle="Receive updates when premium features launch"
              onPress={() => {
                // TODO: Show email capture modal
                console.log("Show email capture");
              }}
            />
          </View>

          {/* Legal Section */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">
              Legal
            </Text>
            
            <MenuItem
              icon="📄"
              title="Privacy Policy"
              onPress={() => {
                Linking.openURL("https://harmonia-sounds.vercel.app/privacy");
              }}
            />
            
            <MenuItem
              icon="📋"
              title="Terms of Service"
              onPress={() => {
                Linking.openURL("https://harmonia-sounds.vercel.app/terms");
              }}
            />
            
            <MenuItem
              icon="⚕️"
              title="Health & Safety"
              onPress={() => {
                Linking.openURL("https://harmonia-sounds.vercel.app/health-safety");
              }}
            />
          </View>

          {/* About Section */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">
              About
            </Text>
            
            <MenuItem
              icon="❤️"
              title="About the Creator"
              subtitle="Dallas Cullen Whitten (idiosynsatiable)"
              onPress={() => {
                Linking.openURL("https://github.com/idiosynsatiable");
              }}
            />
            
            <MenuItem
              icon="📊"
              title="Admin Dashboard"
              subtitle="Manage users and view analytics"
              onPress={() => {
                router.push("/admin/dashboard");
              }}
            />
            
            <MenuItem
              icon="📧"
              title="Contact Support"
              subtitle="Dall.whitt@gmail.com"
              onPress={() => {
                Linking.openURL("mailto:Dall.whitt@gmail.com");
              }}
            />
          </View>

          {/* Build Stamp */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 16,
              marginTop: 8,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.foreground, marginBottom: 12 }}>
              🏗️ Build Information
            </Text>
            <View style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, color: colors.muted }}>Version:</Text>
                <Text style={{ fontSize: 12, color: colors.foreground, fontWeight: '500' }}>
                  {Constants.expoConfig?.version || '1.1.0'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, color: colors.muted }}>Version Code:</Text>
                <Text style={{ fontSize: 12, color: colors.foreground, fontWeight: '500' }}>
                  {Constants.expoConfig?.android?.versionCode || 'N/A'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, color: colors.muted }}>Git SHA:</Text>
                <Text style={{ fontSize: 12, color: colors.foreground, fontWeight: '500', fontFamily: 'monospace' }}>
                  {process.env.EXPO_PUBLIC_GIT_SHA?.substring(0, 7) || 'unknown'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, color: colors.muted }}>Bundle ID:</Text>
                <Text style={{ fontSize: 11, color: colors.foreground, fontWeight: '500' }} numberOfLines={1}>
                  {Constants.expoConfig?.android?.package || 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {/* App Description */}
          <View className="items-center mt-6 mb-8">
            <Text className="text-xs text-muted mt-2 text-center leading-relaxed">
              Sound-based experiences designed for focus, relaxation, and mindful states.
              Not intended for medical use.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Unlock Modal */}
      <UnlockModal
        visible={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        onJoinWaitlist={() => {
          // TODO: Show email capture
          console.log("Join waitlist");
        }}
      />
    </ScreenContainer>
  );
}
