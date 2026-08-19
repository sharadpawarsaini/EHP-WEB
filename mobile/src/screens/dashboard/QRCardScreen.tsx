import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import api from '../../api/api';
import { useTheme } from '../../context/ThemeContext';
import { Card, SectionHeader, PrimaryButton, SecondaryButton, Badge } from '../../components/ui';
import { fontSize, fontWeight, radius, spacing, shadows } from '../../utils/theme';

export default function QRCardScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [linkData, setLinkData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);

  useEffect(() => {
    fetchEmergencyLink();
  }, []);

  const fetchEmergencyLink = async () => {
    try {
      const res = await api.get('/emergency/link');
      setLinkData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const rotateToken = async () => {
    Alert.alert(
      'Rotate Emergency Token',
      'This will invalidate all previously printed QR codes and NFC tags. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Rotate Now',
          style: 'destructive',
          onPress: async () => {
            setRotating(true);
            try {
              const res = await api.post('/emergency/link/rotate');
              setLinkData(res.data);
              Alert.alert('Success', 'New emergency link generated.');
            } catch (e) {
              Alert.alert('Error', 'Failed to rotate token.');
            } finally {
              setRotating(false);
            }
          },
        },
      ]
    );
  };

  const shareEmergencyLink = () => {
    if (linkData?.publicUrl) {
      Share.share({
        message: `🚨 EHP Emergency Medical Life-Link: ${linkData.publicUrl}`,
        url: linkData.publicUrl,
        title: 'Emergency Medical Life-Link',
      });
    }
  };

  const emergencyUrl = linkData?.publicUrl || 'https://ehp.health/emergency/demo';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      <SectionHeader
        title="Emergency QR & NFC"
        subtitle="Paramedic zero-latency access"
        icon={<MaterialCommunityIcons name="qrcode-scan" size={24} color={theme.primary} />}
      />

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* Main Printable Emergency ID Card */}
          <Card style={styles.qrCardContainer}>
            <View style={styles.cardTopBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.cardTopBadgeText}>EHP LIFE-LINK ARMED</Text>
            </View>

            {/* High Contrast QR Code */}
            <View style={styles.qrBox}>
              <QRCode
                value={emergencyUrl}
                size={200}
                color="#0f172a"
                backgroundColor="#ffffff"
              />
            </View>

            <Text style={[styles.scanInstruction, { color: theme.heading }]}>
              Point any mobile camera or scanner
            </Text>
            <Text style={[styles.urlText, { color: theme.muted }]}>{emergencyUrl}</Text>

            <View style={styles.badgeRow}>
              <Badge label="AES-256 Vault" color="blue" />
              <Badge label="Public Fast-Path" color="green" />
            </View>
          </Card>

          {/* Quick Action Controls */}
          <View style={styles.buttonStack}>
            <PrimaryButton
              title="Share Emergency Link"
              onPress={shareEmergencyLink}
              icon={<Ionicons name="share-social" size={18} color="#ffffff" />}
            />

            <SecondaryButton
              title="Write to NFC Tag / Band"
              onPress={() => navigation.navigate('NFCTag')}
              icon={<MaterialCommunityIcons name="nfc" size={18} color={theme.primary} />}
            />

            <TouchableOpacity
              style={[styles.rotateBtn, { borderColor: theme.dangerBorder, backgroundColor: theme.dangerBg }]}
              onPress={rotateToken}
              disabled={rotating}
            >
              <MaterialCommunityIcons name="refresh" size={16} color={theme.danger} />
              <Text style={[styles.rotateBtnText, { color: theme.danger }]}>
                {rotating ? 'Rotating...' : 'Rotate Security Token'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 80,
  },
  qrCardContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  cardTopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.full,
    gap: 6,
    marginBottom: spacing.lg,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  cardTopBadgeText: {
    color: '#2563eb',
    fontSize: 10,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  qrBox: {
    backgroundColor: '#ffffff',
    padding: spacing.md,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 3,
    marginBottom: spacing.md,
  },
  scanInstruction: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    marginTop: spacing.xs,
  },
  urlText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 4,
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  buttonStack: {
    gap: spacing.sm,
  },
  rotateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: 6,
    marginTop: spacing.xs,
  },
  rotateBtnText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
});
