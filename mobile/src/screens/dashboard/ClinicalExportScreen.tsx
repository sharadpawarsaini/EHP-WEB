import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Card, SectionHeader, Badge, PrimaryButton, SecondaryButton } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function ClinicalExportScreen({ navigation }: any) {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [medical, setMedical] = useState<any>(null);
  const [medicines, setMedicines] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [pRes, mRes, rxRes] = await Promise.allSettled([
          api.get('/profile'),
          api.get('/medical'),
          api.get('/medicines'),
        ]);
        if (pRes.status === 'fulfilled') setProfile(pRes.value.data);
        if (mRes.status === 'fulfilled') setMedical(mRes.value.data);
        if (rxRes.status === 'fulfilled') setMedicines(rxRes.value.data || []);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const shareSummaryText = () => {
    const summary = `📄 OFFICIAL EHP CLINICAL MEDICAL SUMMARY\n===============================\nPatient: ${profile?.fullName || 'Patient'}\nBlood Group: ${profile?.bloodGroup || 'UNK'}\nEmergency Contact: ${profile?.emergencyContact || 'None'}\n\n🚨 ALLERGIES:\n${medical?.allergies?.join(', ') || 'None'}\n\n🩺 CHRONIC CONDITIONS:\n${medical?.conditions?.join(', ') || 'None'}\n\n💊 ACTIVE PRESCRIPTIONS:\n${medicines.map((m) => `- ${m.name} (${m.dosage})`).join('\n') || 'None'}\n\nVerification Token: https://ehp.health/em/${profile?.emergencySlug || 'user_token'}`;

    Share.share({
      title: 'EHP Clinical Health Summary',
      message: summary,
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      <SectionHeader
        title="Clinical Medical Summary"
        subtitle="Doctor-ready PDF & synopsis export"
        icon={<MaterialCommunityIcons name="file-certificate" size={24} color={theme.primary} />}
      />

      {/* Printable Sheet Simulation */}
      <Card style={styles.sheetCard}>
        <View style={styles.sheetHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MaterialCommunityIcons name="shield-cross" size={24} color="#2563eb" />
            <Text style={styles.sheetTitle}>EHP MEDICAL DOSSIER</Text>
          </View>
          <Badge label="Official Verified" color="green" />
        </View>

        <View style={styles.sheetSection}>
          <Text style={styles.sheetSectionTitle}>PATIENT DEMOGRAPHICS</Text>
          <Text style={styles.sheetText}>Full Name: {profile?.fullName || 'Valued Patient'}</Text>
          <Text style={styles.sheetText}>Blood Group: {profile?.bloodGroup || 'UNK'}</Text>
          <Text style={styles.sheetText}>Emergency Contact: {profile?.emergencyContact || 'None'}</Text>
        </View>

        <View style={styles.sheetSection}>
          <Text style={styles.sheetSectionTitle}>KNOWN ADVERSE ALLERGIES</Text>
          <Text style={[styles.sheetText, { color: '#e11d48', fontWeight: fontWeight.bold }]}>
            {medical?.allergies && medical.allergies.length > 0
              ? medical.allergies.join(', ')
              : 'No known severe allergies'}
          </Text>
        </View>

        <View style={styles.sheetSection}>
          <Text style={styles.sheetSectionTitle}>ACTIVE MEDICATIONS</Text>
          {medicines.length > 0 ? (
            medicines.map((m, i) => (
              <Text key={i} style={styles.sheetText}>
                • {m.name} — {m.dosage} ({m.frequency || 'Daily'})
              </Text>
            ))
          ) : (
            <Text style={styles.sheetText}>No active medications logged</Text>
          )}
        </View>

        <View style={styles.sheetFooter}>
          <Text style={styles.footerNote}>Zero-Latency Paramedic Verification QR</Text>
          <View style={{ alignItems: 'center', marginVertical: 6 }}>
            <QRCode value={`https://ehp.health/em/${profile?.emergencySlug || 'user'}`} size={70} />
          </View>
          <Text style={styles.timestamp}>Generated on {new Date().toLocaleDateString()}</Text>
        </View>
      </Card>

      <PrimaryButton
        title="Export & Share Medical Synopsis"
        onPress={shareSummaryText}
        icon={<Ionicons name="share-social" size={18} color="#ffffff" />}
      />
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
  sheetCard: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
  },
  sheetTitle: {
    color: '#0f172a',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  sheetSection: {
    marginBottom: spacing.md,
  },
  sheetSectionTitle: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sheetText: {
    color: '#0f172a',
    fontSize: fontSize.xs,
    lineHeight: 18,
  },
  sheetFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  footerNote: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  timestamp: {
    color: '#94a3b8',
    fontSize: 8,
  },
});
