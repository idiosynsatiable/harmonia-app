import { useState, useEffect } from "react";
import { ScrollView, Text, View, Pressable, StyleSheet, Switch, Linking, Platform, Alert } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { usePremium } from "@/lib/premium-context";

const SETTINGS_KEY = '@harmonia_settings';

interface AppSettings {
  backgroundPlayback: boolean;
  hapticFeedback: boolean;
  autoStopTimer: boolean;
  highQualityAudio: boolean;
  notifications: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  backgroundPlayback: true,
  hapticFeedback: true,
  autoStopTimer: true,
  highQualityAudio: false,
  notifications: true,
};

export default function SettingsScreen() {
  const colors = useColors();
  const { isPremium, setPremium } = usePremium();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      if (data) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(data) });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSetting = (key: keyof AppSettings, value: boolean) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (key === 'highQualityAudio' && value && !isPremium) {
      Alert.alert('Premium Feature', 'High quality audio requires Harmonia Premium');
      return;
    }
    
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:Dall.whitt@gmail.com?subject=Harmonia%20Support');
  };

  const handlePremiumToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(
        isPremium 
          ? Haptics.NotificationFeedbackType.Warning 
          : Haptics.NotificationFeedbackType.Success
      );
    }
    setPremium(!isPremium);
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    description: string,
    value: boolean,
    onToggle: (value: boolean) => void
  ) => (
    <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
      <View style={[styles.settingIcon, { backgroundColor: colors.primary + '15' }]}>
        <IconSymbol name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: colors.foreground }]}>
          {title}
        </Text>
        <Text style={[styles.settingDesc, { color: colors.muted }]}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#fff"
      />
    </View>
  );

  return (
    <ScreenContainer>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Settings</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(100)}>
          <Pressable
            onPress={handlePremiumToggle}
            style={({ pressed }) => [
              styles.premiumCard,
              { 
                backgroundColor: isPremium ? colors.primary : colors.surface,
                opacity: pressed ? 0.9 : 1,
              }
            ]}
          >
            <View style={styles.premiumCardContent}>
              <View style={[
                styles.premiumIcon,
                { backgroundColor: isPremium ? 'rgba(255,255,255,0.2)' : colors.primary + '20' }
              ]}>
                <IconSymbol 
                  name="crown.fill" 
                  size={28} 
                  color={isPremium ? '#fff' : colors.primary} 
                />
              </View>
              <View style={styles.premiumInfo}>
                <Text style={[
                  styles.premiumTitle,
                  { color: isPremium ? '#fff' : colors.foreground }
                ]}>
                  {isPremium ? 'Premium Active' : 'Upgrade to Premium'}
                </Text>
                <Text style={[
                  styles.premiumDesc,
                  { color: isPremium ? 'rgba(255,255,255,0.8)' : colors.muted }
                ]}>
                  {isPremium 
                    ? 'All features unlocked' 
                    : 'Unlock all frequencies & cameras'}
                </Text>
              </View>
            </View>
            <IconSymbol 
              name="chevron.right" 
              size={20} 
              color={isPremium ? '#fff' : colors.muted} 
            />
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Audio
          </Text>
          <View style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
            {renderSettingItem(
              'speaker.wave.3.fill',
              'Background Playback',
              'Continue playing when app is in background',
              settings.backgroundPlayback,
              (value) => updateSetting('backgroundPlayback', value)
            )}
            {renderSettingItem(
              'timer',
              'Auto-Stop Timer',
              'Automatically stop after session duration',
              settings.autoStopTimer,
              (value) => updateSetting('autoStopTimer', value)
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            App
          </Text>
          <View style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
            {renderSettingItem(
              'sparkles',
              'Haptic Feedback',
              'Vibration feedback for interactions',
              settings.hapticFeedback,
              (value) => updateSetting('hapticFeedback', value)
            )}
            {renderSettingItem(
              'bell.fill',
              'Notifications',
              'Receive session reminders and alerts',
              settings.notifications,
              (value) => updateSetting('notifications', value)
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            About
          </Text>
          <View style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
            <Pressable
              onPress={handleContactSupport}
              style={({ pressed }) => [
                styles.linkItem,
                { borderBottomColor: colors.border, opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <View style={[styles.settingIcon, { backgroundColor: colors.accent + '15' }]}>
                <IconSymbol name="person.fill" size={20} color={colors.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.foreground }]}>
                  Contact Creator
                </Text>
                <Text style={[styles.settingDesc, { color: colors.muted }]}>
                  Dall.whitt@gmail.com
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={18} color={colors.muted} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.linkItem,
                { borderBottomColor: 'transparent', opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <View style={[styles.settingIcon, { backgroundColor: colors.success + '15' }]}>
                <IconSymbol name="info.circle.fill" size={20} color={colors.success} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.foreground }]}>
                  Version 1.0.0
                </Text>
                <Text style={[styles.settingDesc, { color: colors.muted }]}>
                  Heal. Protect. Resonate.
                </Text>
              </View>
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500)}>
          <View style={[styles.quoteCard, { backgroundColor: colors.primary + '10' }]}>
            <Text style={[styles.quoteText, { color: colors.foreground }]}>
              "The universe is not outside of you. Look inside yourself; everything that you want, you already are."
            </Text>
            <Text style={[styles.quoteAuthor, { color: colors.primary }]}>
              — Rumi
            </Text>
          </View>
        </Animated.View>

        <View style={styles.appInfo}>
          <Text style={[styles.appName, { color: colors.foreground }]}>
            Harmonia
          </Text>
          <Text style={[styles.creatorCredit, { color: colors.muted }]}>
            Created by Dallas Cullen Whitten 'idiosynsatiable'
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 20,
    marginBottom: 28,
  },
  premiumCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  premiumIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumInfo: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  premiumDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 14,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  settingDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 14,
  },
  quoteCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
    textAlign: 'center',
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  creatorCredit: {
    fontSize: 12,
    marginTop: 8,
  },
});
