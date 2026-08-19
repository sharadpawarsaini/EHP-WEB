import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Card, SectionHeader, Badge, PrimaryButton, SecondaryButton } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function MedicalDocScannerScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [docType, setDocType] = useState('Insurance Card');
  const [scannedDocs, setScannedDocs] = useState([
    {
      id: '1',
      title: 'Star Health Comprehensive Policy Card',
      category: 'Insurance Card',
      date: 'Aug 10, 2026',
      status: 'AES-256 Encrypted',
    },
    {
      id: '2',
      title: 'Lipid Panel & CBC Blood Test Slip',
      category: 'Lab Report',
      date: 'Jul 28, 2026',
      status: 'Decrypted',
    },
  ]);

  const captureDocument = () => {
    Alert.alert(
      'Document Scanner',
      `Align your ${docType} within the camera viewfinder. Tap Capture to encrypt and store in your medical vault.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Capture Document',
          onPress: () => {
            const newDoc = {
              id: Date.now().toString(),
              title: `${docType} #${scannedDocs.length + 1}`,
              category: docType,
              date: 'Today',
              status: 'AES-256 Encrypted',
            };
            setScannedDocs([newDoc, ...scannedDocs]);
            Alert.alert('Scanned & Encrypted', 'Document saved to your secure medical vault.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      <SectionHeader
        title="Medical Document Scanner"
        subtitle="Capture & encrypt physical health cards"
        icon={<MaterialCommunityIcons name="camera-document" size={24} color={theme.primary} />}
      />

      {/* Select Category */}
      <Card>
        <Text style={[styles.cardTitle, { color: theme.heading }]}>Document Category</Text>
        <View style={styles.catPillRow}>
          {['Insurance Card', 'Prescription', 'Lab Slip', 'Discharge Summary'].map((cat) => {
            const active = docType === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.catPill,
                  {
                    backgroundColor: active ? (isDark ? '#0284c7' : '#2563eb') : theme.bgSecondary,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setDocType(cat)}
              >
                <Text style={[styles.catPillText, { color: active ? '#ffffff' : theme.heading }]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <PrimaryButton
          title={`Scan New ${docType}`}
          onPress={captureDocument}
          icon={<MaterialCommunityIcons name="camera" size={20} color="#ffffff" />}
          style={{ marginTop: spacing.md }}
        />
      </Card>

      {/* Scanned Documents Archive */}
      <SectionHeader title="Stored Documents" subtitle="Encrypted health files" style={{ marginTop: spacing.lg }} />

      {scannedDocs.map((doc) => (
        <Card key={doc.id} style={styles.docCard}>
          <View style={styles.docRow}>
            <View style={[styles.docIconBox, { backgroundColor: theme.bgSecondary }]}>
              <MaterialCommunityIcons name="file-document-outline" size={24} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.docTitle, { color: theme.heading }]}>{doc.title}</Text>
              <Text style={[styles.docMeta, { color: theme.muted }]}>
                {doc.category} • {doc.date}
              </Text>
            </View>
            <Badge label={doc.status} color="green" />
          </View>
        </Card>
      ))}
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
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
  },
  catPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.xs,
  },
  catPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  docCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  docIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  docMeta: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
});
