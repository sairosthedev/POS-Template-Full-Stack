import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '../../ui/theme';
import { HeaderBar } from '../../ui/HeaderBar';

export default function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = React.useState(false);

  React.useEffect(() => {
    if (permission?.status === 'undetermined') requestPermission();
  }, [permission?.status, requestPermission]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <HeaderBar onBack={() => navigation.goBack()} rightIcon="help-circle-outline" />

      {!permission?.granted ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <Ionicons name="camera-outline" size={38} color={theme.colors.muted} />
          <Text style={{ color: theme.colors.text, fontWeight: '800', fontSize: 18, marginTop: 12 }}>
            Camera permission needed
          </Text>
          <Text style={{ color: theme.colors.muted, textAlign: 'center', marginTop: 8 }}>
            Enable camera access to scan barcodes.
          </Text>
          <View style={{ height: 16 }} />
          <Pressable
            onPress={requestPermission}
            style={({ pressed }) => ({
              backgroundColor: theme.colors.gold,
              borderRadius: theme.radius.md,
              paddingVertical: 12,
              paddingHorizontal: 16,
              opacity: pressed ? 0.9 : 1,
            })}>
            <Text style={{ fontWeight: '900', color: '#1C2B45' }}>Grant permission</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'],
            }}
            onBarcodeScanned={(result) => {
              if (scanned) return;
              const code = result?.data;
              if (!code) return;
              setScanned(true);
              navigation.replace('Main', {
                screen: 'Sell',
                params: { scannedCode: String(code) },
              });
            }}
          />

          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '74%',
                height: 220,
                borderRadius: 18,
                borderWidth: 2,
                borderColor: 'rgba(240, 193, 90, 0.65)',
                backgroundColor: 'rgba(0,0,0,0.15)',
              }}
            />
            <View style={{ height: 14 }} />
            <Text style={{ color: theme.colors.text, fontWeight: '800' }}>
              Scan the product barcode to add to cart
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

