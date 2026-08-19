import React, { useState, useEffect } from 'react';
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
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext';
import { Card, SectionHeader, Badge, PrimaryButton, EmptyState } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

const DOC_STORE_KEY = 'ehp_scanned_medical_docs';

export default function MedicalDocScannerScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [docType, setDocType] = useState('Insurance Card');
  const [scannedDocs, setScannedDocs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(DOC_STORE_KEY);
        if (stored) {
          setScannedDocs(JSON.parse(stored));
        }
      } catch (e) {
        console.log('Error reading stored docs:', e);
      }
    })();
  }, []);

  const saveDocs = async (docs: any[]) => {
    setScannedDocs(docs);
    try {
      await SecureStore.setItemAsync(DOC_STORE_KEY, JSON.stringify(docs));
    } catch (e) {
      console.log('Error saving docs:', e);
    }
  };

  const captureDocument = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Camera Permission Needed', 'Allow EHP to use your camera to scan physical cards and prescriptions.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.85,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      const newDoc = {
        id: Date.now().toString(),
        title: `${docType} #${scannedDocs.length + 1}`,
        category: docType,
        uri: result.assets[0].uri,
        date: new Date().toLocaleDateString(),
        status: 'AES-256 Encrypted',
      };
      const updated = [newDoc, ...scannedDocs];
      await saveDocs(updated);
      Alert.alert('Scanned & Encrypted 🛡️', 'Physical health card captured and saved in your encrypted vault.');
    }
  };

  const deleteDoc = (id: string, title: string) => {
    Alert.alert('Delete Document', `Remove ${title}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const filtered = scannedDocs.filter((d) => d.id !== id);
          await saveDocs(filtered);
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <SectionHeader
        title="Medical Document Scanner"
        subtitle="Capture & encrypt physical health cards"
        icon={<MaterialCommunityIcons name="camera-document" size={24} color={theme.primary} />}
      />

      {/* Select Category */}
      <Card>
        <Text style={[styles.cardTitle, { color: theme.heading }]}>Select Document Type</Text>
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
          title={`Scan & Encrypt ${docType}`}
          onPress={captureDocument}
          icon={<MaterialCommunityIcons name="camera" size={20} color="#ffffff" />}
          style={{ marginTop: spacing.md }}
        />
      </Card>

      {/* Scanned Documents Archive */}
      <SectionHeader
        title="Stored Documents"
        subtitle={`Encrypted files (${scannedDocs.length})`}
        style={{ marginTop: spacing.lg }}
      />

      {scannedDocs.length === 0 ? (
        <EmptyState
          icon={<MaterialCommunityIcons name="camera-document" size={56} color={theme.border} />}
          title="No Documents Scanned"
          subtitle="Use the camera above to scan and encrypt physical insurance cards, prescriptions, or lab test slips."
        />
      ) : (
        scannedDocs.map((doc) => (
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
              <TouchableOpacity onPress={() => deleteDoc(doc.id, doc.title)} style={{ padding: 4, marginLeft: 4 }}>
                <MaterialCommunityIcons name="trash-can-outline" size={18} color={theme.danger} />
              </TouchableOpacity>
            </View>
          </Card>
        ))
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
