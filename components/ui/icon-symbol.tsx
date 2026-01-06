// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Harmonia App Icon Mappings
 * SF Symbols to Material Icons
 */
const MAPPING = {
  // Tab bar icons
  "house.fill": "home",
  "waveform": "graphic-eq",
  "music.note.list": "library-music",
  "shield.fill": "security",
  "gearshape.fill": "settings",
  
  // Sound icons
  "waveform.circle.fill": "surround-sound",
  "speaker.wave.3.fill": "volume-up",
  "speaker.wave.1.fill": "volume-down",
  "speaker.slash.fill": "volume-off",
  "headphones": "headset",
  
  // Brainwave icons
  "brain": "psychology",
  "sparkles": "auto-awesome",
  "moon.fill": "nightlight",
  "sun.max.fill": "wb-sunny",
  "bolt.fill": "bolt",
  "flame.fill": "local-fire-department",
  
  // Control icons
  "play.fill": "play-arrow",
  "pause.fill": "pause",
  "stop.fill": "stop",
  "forward.fill": "fast-forward",
  "backward.fill": "fast-rewind",
  "repeat": "repeat",
  "shuffle": "shuffle",
  
  // Feature icons
  "slider.horizontal.3": "tune",
  "dial.min.fill": "radio-button-checked",
  "timer": "timer",
  "clock.fill": "schedule",
  "heart.fill": "favorite",
  "star.fill": "star",
  "bookmark.fill": "bookmark",
  
  // Security icons
  "video.fill": "videocam",
  "camera.fill": "camera",
  "record.circle": "fiber-manual-record",
  "eye.fill": "visibility",
  "eye.slash.fill": "visibility-off",
  "bell.fill": "notifications",
  "bell.slash.fill": "notifications-off",
  
  // Bluetooth icons
  "bluetooth": "bluetooth",
  "antenna.radiowaves.left.and.right": "wifi",
  "car.fill": "directions-car",
  "hifispeaker.fill": "speaker",
  
  // Navigation icons
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "chevron.down": "expand-more",
  "chevron.up": "expand-less",
  "xmark": "close",
  "plus": "add",
  "minus": "remove",
  "checkmark": "check",
  
  // Misc icons
  "info.circle.fill": "info",
  "questionmark.circle.fill": "help",
  "person.fill": "person",
  "crown.fill": "workspace-premium",
  "lock.fill": "lock",
  "lock.open.fill": "lock-open",
  "trash.fill": "delete",
  "pencil": "edit",
  "square.and.arrow.up": "share",
  "doc.fill": "description",
  "folder.fill": "folder",
  
  // OM and meditation
  "leaf.fill": "eco",
  "drop.fill": "water-drop",
  "wind": "air",
  "mountain.2.fill": "landscape",
  
  // Premium
  "sparkle": "auto-awesome",
  "gift.fill": "card-giftcard",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name] || "help-outline";
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
