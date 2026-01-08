import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Note: For full Bluetooth functionality, you'll need to install:
// npm install react-native-bluetooth-classic
// or
// npm install react-native-ble-plx (for BLE devices)

export interface BluetoothDevice {
  id: string;
  name: string;
  address: string;
  type: 'classic' | 'ble';
  connected: boolean;
  lastConnected?: Date;
}

interface BluetoothContextType {
  devices: BluetoothDevice[];
  connectedDevice: BluetoothDevice | null;
  isScanning: boolean;
  isBluetoothEnabled: boolean;
  scanForDevices: () => Promise<void>;
  connectToDevice: (deviceId: string) => Promise<boolean>;
  disconnectDevice: () => Promise<void>;
  routeAudioToBluetooth: (deviceId: string) => Promise<boolean>;
  getLastConnectedDevice: () => Promise<BluetoothDevice | null>;
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);

export function BluetoothProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);

  useEffect(() => {
    checkBluetoothStatus();
    loadLastConnectedDevice();
  }, []);

  const checkBluetoothStatus = async () => {
    // TODO: Implement actual Bluetooth status check
    // For now, assume enabled
    setIsBluetoothEnabled(true);
  };

  const requestBluetoothPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return (
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.error('Bluetooth permission error:', err);
        return false;
      }
    }
    return true; // iOS handles permissions automatically
  };

  const loadLastConnectedDevice = async () => {
    try {
      const saved = await AsyncStorage.getItem('last_bluetooth_device');
      if (saved) {
        const device = JSON.parse(saved);
        device.lastConnected = new Date(device.lastConnected);
        setConnectedDevice(device);
      }
    } catch (error) {
      console.error('Failed to load last device:', error);
    }
  };

  const scanForDevices = async () => {
    const hasPermission = await requestBluetoothPermissions();
    if (!hasPermission) {
      console.error('Bluetooth permissions not granted');
      return;
    }

    setIsScanning(true);

    try {
      // TODO: Implement actual Bluetooth scanning
      // For now, simulate with mock devices
      const mockDevices: BluetoothDevice[] = [
        {
          id: '1',
          name: 'Car Audio',
          address: '00:11:22:33:44:55',
          type: 'classic',
          connected: false,
        },
        {
          id: '2',
          name: 'Bluetooth Speaker',
          address: '00:11:22:33:44:66',
          type: 'classic',
          connected: false,
        },
        {
          id: '3',
          name: 'Wireless Headphones',
          address: '00:11:22:33:44:77',
          type: 'classic',
          connected: false,
        },
      ];

      // Simulate scan delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setDevices(mockDevices);
    } catch (error) {
      console.error('Bluetooth scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (deviceId: string): Promise<boolean> => {
    try {
      const device = devices.find(d => d.id === deviceId);
      if (!device) return false;

      // TODO: Implement actual Bluetooth connection
      // For now, simulate connection
      const connectedDev: BluetoothDevice = {
        ...device,
        connected: true,
        lastConnected: new Date(),
      };

      setConnectedDevice(connectedDev);
      await AsyncStorage.setItem('last_bluetooth_device', JSON.stringify(connectedDev));

      // Update devices list
      setDevices(devices.map(d => 
        d.id === deviceId ? connectedDev : { ...d, connected: false }
      ));

      return true;
    } catch (error) {
      console.error('Connection failed:', error);
      return false;
    }
  };

  const disconnectDevice = async () => {
    try {
      if (connectedDevice) {
        // TODO: Implement actual Bluetooth disconnection
        setConnectedDevice(null);
        setDevices(devices.map(d => ({ ...d, connected: false })));
      }
    } catch (error) {
      console.error('Disconnection failed:', error);
    }
  };

  const routeAudioToBluetooth = async (deviceId: string): Promise<boolean> => {
    try {
      // First, ensure device is connected
      const device = devices.find(d => d.id === deviceId);
      if (!device || !device.connected) {
        const connected = await connectToDevice(deviceId);
        if (!connected) return false;
      }

      // TODO: Implement actual audio routing
      // This would involve configuring the audio session to route to Bluetooth
      // For React Native, this is typically handled automatically when a Bluetooth
      // audio device is connected

      console.log(`Audio routed to device: ${deviceId}`);
      return true;
    } catch (error) {
      console.error('Audio routing failed:', error);
      return false;
    }
  };

  const getLastConnectedDevice = async (): Promise<BluetoothDevice | null> => {
    try {
      const saved = await AsyncStorage.getItem('last_bluetooth_device');
      if (saved) {
        const device = JSON.parse(saved);
        device.lastConnected = new Date(device.lastConnected);
        return device;
      }
      return null;
    } catch (error) {
      console.error('Failed to get last device:', error);
      return null;
    }
  };

  return (
    <BluetoothContext.Provider
      value={{
        devices,
        connectedDevice,
        isScanning,
        isBluetoothEnabled,
        scanForDevices,
        connectToDevice,
        disconnectDevice,
        routeAudioToBluetooth,
        getLastConnectedDevice,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
}

export function useBluetooth() {
  const context = useContext(BluetoothContext);
  if (!context) {
    throw new Error('useBluetooth must be used within BluetoothProvider');
  }
  return context;
}
