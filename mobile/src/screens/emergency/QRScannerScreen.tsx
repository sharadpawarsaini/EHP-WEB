import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '../../utils/theme';

export default function QRScannerScreen({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);

    // Extract token/slug from scanned URL (e.g. https://.../emergency/abc-123 or raw token)
    let token = data;
    if (data.includes('/emergency/')) {
      token = data.split('/emergency/')[1].split('/')[0];
    } else if (data.includes('/e/')) {
      token = data.split('/e/')[1].split('/')[0];
    }

    navigation.navigate('EmergencyCard', { slug: token });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.infoText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons name="camera-off" size={48} color={colors.danger} />
        <Text style={styles.errorText}>No camera access granted</Text>
        <Text style={styles.subText}>Camera is required to scan emergency QR codes.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      {/* Top Header Overlay */}
      <View style={styles.headerOverlay}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.scannerHeaderTitle}>First Responder Scanner</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* QR Target Frame */}
      <View style={styles.frameContainer}>
        <View style={styles.scanTarget}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
        </View>
        <Text style={styles.scanPrompt}>Align QR code inside the frame</Text>
      </View>

      {scanned && (
        <TouchableOpacity style={styles.rescanBtn} onPress={() => setScanned(false)}>
          <Text style={styles.rescanText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgLight,
    padding: spacing.xl,
  },
  infoText: {
    fontSize: fontSize.md,
    color: colors.body,
  },
  errorText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.black,
    color: colors.danger,
    marginTop: spacing.md,
  },
  subText: {
    fontSize: fontSize.sm,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  backBtn: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl,
  },
  backBtnText: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  headerOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerHeaderTitle: {
    color: '#ffffff',
    fontSize: fontSize.md,
    fontWeight: fontWeight.black,
    letterSpacing: 0.5,
  },
  frameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanTarget: {
    width: 260,
    height: 260,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#38bdf8',
  },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  scanPrompt: {
    color: '#ffffff',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    marginTop: spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
  },
  rescanBtn: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl,
  },
  rescanText: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.black,
    textTransform: 'uppercase',
  },
});
