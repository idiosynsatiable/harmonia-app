import { useState, useEffect } from "react";
import { Text, View, Pressable, StyleSheet, FlatList, TextInput, Alert, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { usePremium } from "@/lib/premium-context";

const CAMERAS_KEY = '@harmonia_cameras';

interface Camera {
  id: string;
  name: string;
  ipAddress: string;
  port: number;
  protocol: 'rtsp' | 'http';
  username?: string;
  password?: string;
  isOnline: boolean;
  isRecording: boolean;
  motionDetection: boolean;
}

export default function SecurityScreen() {
  const colors = useColors();
  const { isPremium, features } = usePremium();

  const [cameras, setCameras] = useState<Camera[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  
  // New camera form
  const [newCameraName, setNewCameraName] = useState('');
  const [newCameraIp, setNewCameraIp] = useState('');
  const [newCameraPort, setNewCameraPort] = useState('554');
  const [newCameraUsername, setNewCameraUsername] = useState('');
  const [newCameraPassword, setNewCameraPassword] = useState('');

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    try {
      const data = await AsyncStorage.getItem(CAMERAS_KEY);
      if (data) {
        setCameras(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading cameras:', error);
    }
  };

  const saveCameras = async (newCameras: Camera[]) => {
    try {
      await AsyncStorage.setItem(CAMERAS_KEY, JSON.stringify(newCameras));
      setCameras(newCameras);
    } catch (error) {
      console.error('Error saving cameras:', error);
    }
  };

  const handleAddCamera = () => {
    if (!newCameraName.trim() || !newCameraIp.trim()) {
      Alert.alert('Error', 'Please enter camera name and IP address');
      return;
    }

    if (cameras.length >= features.maxCameras) {
      Alert.alert('Limit Reached', `You can add up to ${features.maxCameras} cameras with your current plan.`);
      return;
    }

    const newCamera: Camera = {
      id: `camera_${Date.now()}`,
      name: newCameraName.trim(),
      ipAddress: newCameraIp.trim(),
      port: parseInt(newCameraPort) || 554,
      protocol: 'rtsp',
      username: newCameraUsername.trim() || undefined,
      password: newCameraPassword.trim() || undefined,
      isOnline: false,
      isRecording: false,
      motionDetection: false,
    };

    saveCameras([...cameras, newCamera]);
    
    // Reset form
    setNewCameraName('');
    setNewCameraIp('');
    setNewCameraPort('554');
    setNewCameraUsername('');
    setNewCameraPassword('');
    setShowAddModal(false);

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleDeleteCamera = (cameraId: string) => {
    Alert.alert(
      'Delete Camera',
      'Are you sure you want to remove this camera?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            saveCameras(cameras.filter(c => c.id !== cameraId));
            if (selectedCamera?.id === cameraId) {
              setSelectedCamera(null);
            }
          },
        },
      ]
    );
  };

  const toggleRecording = (cameraId: string) => {
    if (!features.recording) {
      Alert.alert('Premium Feature', 'Recording requires Harmonia Premium');
      return;
    }
    
    const updated = cameras.map(c => 
      c.id === cameraId ? { ...c, isRecording: !c.isRecording } : c
    );
    saveCameras(updated);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const toggleMotionDetection = (cameraId: string) => {
    if (!features.motionDetection) {
      Alert.alert('Premium Feature', 'Motion detection requires Harmonia Premium');
      return;
    }
    
    const updated = cameras.map(c => 
      c.id === cameraId ? { ...c, motionDetection: !c.motionDetection } : c
    );
    saveCameras(updated);
  };

  // Premium lock screen
  if (!isPremium) {
    return (
      <ScreenContainer>
        <View style={styles.premiumLock}>
          <LinearGradient
            colors={[colors.primary + '20', colors.secondary + '20']}
            style={styles.premiumLockGradient}
          >
            <IconSymbol name="shield.fill" size={64} color={colors.primary} />
            <Text style={[styles.premiumLockTitle, { color: colors.foreground }]}>
              Home Security
            </Text>
            <Text style={[styles.premiumLockDesc, { color: colors.muted }]}>
              Monitor your home with up to 8 security cameras. View live feeds, record footage, and receive motion alerts.
            </Text>
            
            <View style={styles.premiumFeatures}>
              <View style={styles.premiumFeatureItem}>
                <IconSymbol name="video.fill" size={20} color={colors.primary} />
                <Text style={[styles.premiumFeatureText, { color: colors.foreground }]}>
                  Live Camera Feeds
                </Text>
              </View>
              <View style={styles.premiumFeatureItem}>
                <IconSymbol name="record.circle" size={20} color={colors.error} />
                <Text style={[styles.premiumFeatureText, { color: colors.foreground }]}>
                  Recording & Playback
                </Text>
              </View>
              <View style={styles.premiumFeatureItem}>
                <IconSymbol name="bell.fill" size={20} color={colors.warning} />
                <Text style={[styles.premiumFeatureText, { color: colors.foreground }]}>
                  Motion Detection Alerts
                </Text>
              </View>
              <View style={styles.premiumFeatureItem}>
                <IconSymbol name="speaker.wave.3.fill" size={20} color={colors.accent} />
                <Text style={[styles.premiumFeatureText, { color: colors.foreground }]}>
                  Two-Way Audio
                </Text>
              </View>
            </View>

            <Pressable
              style={[styles.upgradeButton, { backgroundColor: colors.primary }]}
            >
              <IconSymbol name="crown.fill" size={18} color="#fff" />
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </ScreenContainer>
    );
  }

  const renderCameraCard = ({ item, index }: { item: Camera; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <Pressable
        onPress={() => setSelectedCamera(item)}
        onLongPress={() => handleDeleteCamera(item.id)}
        style={({ pressed }) => [
          styles.cameraCard,
          { 
            backgroundColor: colors.surface,
            borderColor: selectedCamera?.id === item.id ? colors.primary : colors.border,
            borderWidth: selectedCamera?.id === item.id ? 2 : 1,
            opacity: pressed ? 0.8 : 1,
          }
        ]}
      >
        {/* Camera Preview Placeholder */}
        <View style={[styles.cameraPreview, { backgroundColor: colors.background }]}>
          <IconSymbol name="video.fill" size={32} color={colors.muted} />
          <View style={[
            styles.statusIndicator,
            { backgroundColor: item.isOnline ? colors.success : colors.error }
          ]} />
          {item.isRecording && (
            <View style={[styles.recordingIndicator, { backgroundColor: colors.error }]}>
              <IconSymbol name="record.circle" size={12} color="#fff" />
            </View>
          )}
        </View>

        {/* Camera Info */}
        <View style={styles.cameraInfo}>
          <Text style={[styles.cameraName, { color: colors.foreground }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.cameraAddress, { color: colors.muted }]}>
            {item.ipAddress}:{item.port}
          </Text>
          
          {/* Quick Actions */}
          <View style={styles.cameraActions}>
            <Pressable
              onPress={() => toggleRecording(item.id)}
              style={[
                styles.actionChip,
                { backgroundColor: item.isRecording ? colors.error + '20' : colors.surface }
              ]}
            >
              <IconSymbol 
                name="record.circle" 
                size={14} 
                color={item.isRecording ? colors.error : colors.muted} 
              />
            </Pressable>
            <Pressable
              onPress={() => toggleMotionDetection(item.id)}
              style={[
                styles.actionChip,
                { backgroundColor: item.motionDetection ? colors.warning + '20' : colors.surface }
              ]}
            >
              <IconSymbol 
                name="bell.fill" 
                size={14} 
                color={item.motionDetection ? colors.warning : colors.muted} 
              />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Security</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            {cameras.length} of {features.maxCameras} cameras
          </Text>
        </View>
        <Pressable
          onPress={() => setShowAddModal(true)}
          style={[styles.addButton, { backgroundColor: colors.primary }]}
        >
          <IconSymbol name="plus" size={20} color="#fff" />
        </Pressable>
      </View>

      {/* Selected Camera View */}
      {selectedCamera && (
        <View style={[styles.selectedCameraView, { backgroundColor: colors.surface }]}>
          <View style={[styles.selectedCameraPreview, { backgroundColor: colors.background }]}>
            <IconSymbol name="video.fill" size={48} color={colors.muted} />
            <Text style={[styles.selectedCameraLabel, { color: colors.muted }]}>
              {selectedCamera.name}
            </Text>
            <Text style={[styles.connectionInfo, { color: colors.muted }]}>
              Connecting to {selectedCamera.protocol}://{selectedCamera.ipAddress}:{selectedCamera.port}
            </Text>
          </View>
          
          <View style={styles.selectedCameraControls}>
            <Pressable
              onPress={() => toggleRecording(selectedCamera.id)}
              style={[
                styles.controlButton,
                { backgroundColor: selectedCamera.isRecording ? colors.error : colors.surface }
              ]}
            >
              <IconSymbol 
                name="record.circle" 
                size={20} 
                color={selectedCamera.isRecording ? '#fff' : colors.foreground} 
              />
              <Text style={[
                styles.controlButtonText,
                { color: selectedCamera.isRecording ? '#fff' : colors.foreground }
              ]}>
                {selectedCamera.isRecording ? 'Stop' : 'Record'}
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => toggleMotionDetection(selectedCamera.id)}
              style={[
                styles.controlButton,
                { backgroundColor: selectedCamera.motionDetection ? colors.warning : colors.surface }
              ]}
            >
              <IconSymbol 
                name="bell.fill" 
                size={20} 
                color={selectedCamera.motionDetection ? '#fff' : colors.foreground} 
              />
              <Text style={[
                styles.controlButtonText,
                { color: selectedCamera.motionDetection ? '#fff' : colors.foreground }
              ]}>
                Motion
              </Text>
            </Pressable>
            
            <Pressable
              style={[styles.controlButton, { backgroundColor: colors.surface }]}
            >
              <IconSymbol name="speaker.wave.3.fill" size={20} color={colors.foreground} />
              <Text style={[styles.controlButtonText, { color: colors.foreground }]}>
                Audio
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Camera Grid */}
      <FlatList
        data={cameras}
        keyExtractor={(item) => item.id}
        renderItem={renderCameraCard}
        numColumns={2}
        columnWrapperStyle={styles.cameraGrid}
        contentContainerStyle={styles.cameraList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <IconSymbol name="video.fill" size={48} color={colors.muted} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No cameras added
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.muted }]}>
              Add your first security camera to start monitoring
            </Text>
            <Pressable
              onPress={() => setShowAddModal(true)}
              style={[styles.emptyButton, { backgroundColor: colors.primary }]}
            >
              <IconSymbol name="plus" size={18} color="#fff" />
              <Text style={styles.emptyButtonText}>Add Camera</Text>
            </Pressable>
          </View>
        }
      />

      {/* Add Camera Modal */}
      {showAddModal && (
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              Add Camera
            </Text>
            
            <TextInput
              value={newCameraName}
              onChangeText={setNewCameraName}
              placeholder="Camera name (e.g., Front Door)"
              placeholderTextColor={colors.muted}
              style={[styles.modalInput, { 
                backgroundColor: colors.surface, 
                color: colors.foreground,
                borderColor: colors.border,
              }]}
            />
            
            <TextInput
              value={newCameraIp}
              onChangeText={setNewCameraIp}
              placeholder="IP Address (e.g., 192.168.1.100)"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              style={[styles.modalInput, { 
                backgroundColor: colors.surface, 
                color: colors.foreground,
                borderColor: colors.border,
              }]}
            />
            
            <TextInput
              value={newCameraPort}
              onChangeText={setNewCameraPort}
              placeholder="Port (default: 554)"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              style={[styles.modalInput, { 
                backgroundColor: colors.surface, 
                color: colors.foreground,
                borderColor: colors.border,
              }]}
            />
            
            <TextInput
              value={newCameraUsername}
              onChangeText={setNewCameraUsername}
              placeholder="Username (optional)"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              style={[styles.modalInput, { 
                backgroundColor: colors.surface, 
                color: colors.foreground,
                borderColor: colors.border,
              }]}
            />
            
            <TextInput
              value={newCameraPassword}
              onChangeText={setNewCameraPassword}
              placeholder="Password (optional)"
              placeholderTextColor={colors.muted}
              secureTextEntry
              style={[styles.modalInput, { 
                backgroundColor: colors.surface, 
                color: colors.foreground,
                borderColor: colors.border,
              }]}
            />

            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => {
                  setShowAddModal(false);
                  setNewCameraName('');
                  setNewCameraIp('');
                }}
                style={[styles.modalButton, { backgroundColor: colors.surface }]}
              >
                <Text style={[styles.modalButtonText, { color: colors.foreground }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleAddCamera}
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                  Add Camera
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumLock: {
    flex: 1,
    padding: 20,
  },
  premiumLockGradient: {
    flex: 1,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumLockTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 20,
  },
  premiumLockDesc: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  premiumFeatures: {
    marginTop: 32,
    gap: 16,
    width: '100%',
  },
  premiumFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  premiumFeatureText: {
    fontSize: 15,
    fontWeight: '500',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 32,
    gap: 8,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  selectedCameraView: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  selectedCameraPreview: {
    aspectRatio: 16 / 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCameraLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  connectionInfo: {
    fontSize: 12,
    marginTop: 4,
  },
  selectedCameraControls: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  controlButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  cameraList: {
    padding: 20,
    paddingBottom: 100,
  },
  cameraGrid: {
    gap: 12,
  },
  cameraCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  cameraPreview: {
    aspectRatio: 4 / 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  statusIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  recordingIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cameraInfo: {
    padding: 12,
  },
  cameraName: {
    fontSize: 14,
    fontWeight: '700',
  },
  cameraAddress: {
    fontSize: 11,
    marginTop: 2,
  },
  cameraActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  actionChip: {
    padding: 6,
    borderRadius: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
