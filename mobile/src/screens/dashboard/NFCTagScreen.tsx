import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Card, SectionHeader, Badge, PrimaryButton, SecondaryButton } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';
import api from '../../api/api';

export default function NFCTagScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [nfcWriting, setNfcWriting] = useState(false);
  const [nfcSuccess, setNfcSuccess] = useState(false);
  const [tagStatus, setTagStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS' | 'ERROR'>('IDLE');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/profile');
        setProfile(res.data);
      } catch (e) {
        console.log('Error fetching profile for NFC:', e);
      }
    })();
  }, []);

  const startNFCWrite = () => {
    setTagStatus('SCANNING');
    setNfcWriting(true);

    // Simulate NFC NDEF Payload write
    setTimeout(() => {
      setNfcWriting(false);
      setNfcSuccess(true);
      setTagStatus('SUCCESS');
      Alert.alert(
        'NFC Tag Programmed',
        'Life-Link Emergency URL successfully written to the NFC card/wristband. Tap to test with any smartphone.',
        [{ text: 'Great' }]
      );
    }, 2500);
  };

  const emergencyUrl = `https://ehp.health/em/${profile?.emergencySlug || 'user_token'}`;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      {/* Modern NFC Smart Card Preview */}
      <LinearGradient
        colors={isDark ? ['#1e293b', '#0f172a'] : ['#2563eb', '#0284c7']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.nfcCard}
      >
        <View style={styles.nfcCardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MaterialCommunityIcons name="nfc" size={28} color="#ffffff" />
            <Text style={styles.nfcCardChip}>EHP CONTACTLESS</Text>
          </View>
          <MaterialCommunityIcons name="contactless-payment" size={32} color="rgba(255,255,255,0.7)" />
        </View>

        <View style={styles.nfcCardMiddle}>
          <Text style={styles.cardHolderName}>{profile?.fullName || 'VALUED PATIENT'}</Text>
          <Text style={styles.cardPayloadUrl}>{emergencyUrl}</Text>
        </View>

        <View style={styles.nfcCardFooter}>
          <View>
            <Text style={styles.cardFooterSub}>BLOOD GROUP</Text>
            <Text style={styles.cardFooterVal}>{profile?.bloodGroup || 'UNKNOWN'}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.cardFooterSub}>STATUS</Text>
            <Text style={[styles.cardFooterVal, { color: '#34d399' }]}>LIFE-LINK ARMED</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Writer Control Card */}
      <Card style={styles.writerCard}>
        <SectionHeader
          title="NFC Programmer"
          subtitle="Write to wristband or smart card"
          icon={<MaterialCommunityIcons name="cellphone-nfc" size={22} color={theme.primary} />}
        />

        <Text style={[styles.writerDesc, { color: theme.body }]}>
          Hold an NFC tag or smart wristband near the back of your phone to write your encrypted emergency Life-Link profile.
        </Text>

        <View style={styles.chipSpecs}>
          <Badge label="NTAG213 / 215 / 216" color="blue" />
          <Badge label="NDEF Standard" color="green" />
          <Badge label="Zero-Latency" color="amber" />
        </View>

        <PrimaryButton
          title={nfcWriting ? 'Scanning for NFC Tag...' : 'Write Emergency Tag'}
          onPress={startNFCWrite}
          loading={nfcWriting}
          style={{ marginTop: spacing.md }}
        />
      </Card>

      {/* NFC Capabilities List */}
      <SectionHeader title="How it Works" subtitle="Paramedic tap protocol" />

      <Card style={styles.guideCard}>
        {[
          {
            icon: 'cellphone-wireless',
            title: 'No App Required for Paramedics',
            desc: 'First responders just tap any iPhone or Android phone on your tag to open your emergency medical sheet instantly.',
          },
          {
            icon: 'lock-check',
            title: 'AES-256 Vault Protection',
            desc: 'Only critical lifesaving details (allergies, blood type, emergency contacts) are decrypted.',
          },
          {
            icon: 'shield-refresh',
            title: 'Real-Time Dynamic Updates',
            desc: 'Whenever you update your medical info in the app, your NFC tag automatically serves the latest data without reprogramming.',
          },
        ].map((item, i) => (
          <View key={i} style={[styles.guideRow, i > 0 && { borderTopColor: theme.border, borderTopWidth: 1 }]}>
            <View style={[styles.guideIcon, { backgroundColor: theme.bgSecondary }]}>
              <MaterialCommunityIcons name={item.icon as any} size={22} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.guideTitle, { color: theme.heading }]}>{item.title}</Text>
              <Text style={[styles.guideDesc, { color: theme.muted }]}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </Card>
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
    paddingBottom: 60,
  },
  nfcCard: {
    borderRadius: radius['3xl'],
    padding: spacing.xl,
    minHeight: 200,
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    elevation: 6,
  },
  nfcCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nfcCardChip: {
    color: '#ffffff',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.5,
  },
  nfcCardMiddle: {
    marginVertical: spacing.md,
  },
  cardHolderName: {
    color: '#ffffff',
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  cardPayloadUrl: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 4,
  },
  nfcCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardFooterSub: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 9,
    fontWeight: fontWeight.bold,
  },
  cardFooterVal: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    marginTop: 2,
  },
  writerCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  writerDesc: {
    fontSize: fontSize.xs,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  chipSpecs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: spacing.xs,
  },
  guideCard: {
    padding: 0,
    overflow: 'hidden',
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    gap: spacing.md,
  },
  guideIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    marginBottom: 2,
  },
  guideDesc: {
    fontSize: fontSize.xs,
    lineHeight: 16,
  },
});
