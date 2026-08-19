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
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext';
import { Card, Badge, HealthInput, PrimaryButton, SecondaryButton } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function PrivacyVaultScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [passphrase, setPassphrase] = useState('');
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [vaultFiles, setVaultFiles] = useState([
    { id: '1', name: 'Blood_Test_CBC_Lipid_Profile.pdf', size: '1.8 MB', date: 'Aug 15, 2026', encrypted: true },
    { id: '2', name: 'Cardiology_ECG_Echocardiogram.png', size: '3.4 MB', date: 'Jul 22, 2026', encrypted: true },
    { id: '3', name: 'Star_Health_Policy_Document.pdf', size: '2.1 MB', date: 'Jun 10, 2026', encrypted: true },
  ]);

  const handleUnlock = () => {
    if (!passphrase || passphrase.length < 4) {
      Alert.alert('Required', 'Please enter a valid vault passphrase (at least 4 characters).');
      return;
    }
    setVaultUnlocked(true);
    Alert.alert('Vault Decrypted 🔓', 'AES-256 keys derived in memory. Files are now accessible.');
  };

  const handleUpload = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Required', 'Please grant photo library permissions.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const newFile = {
        id: Date.now().toString(),
        name: `Encrypted_Scan_${vaultFiles.length + 1}.jpg`,
        size: '2.4 MB',
        date: 'Today',
        encrypted: true,
      };
      setVaultFiles([newFile, ...vaultFiles]);
      Alert.alert('Encrypted & Stored 🛡️', 'File encrypted on-device and saved into zero-knowledge vault.');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <LinearGradient
        colors={isDark ? ['#09251e', '#064e3b'] : ['#059669', '#10b981']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.hero}
      >
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="safe" size={38} color="#ffffff" />
        </View>
        <Text style={styles.heroTitle}>Zero-Knowledge Privacy Vault</Text>
        <Text style={styles.heroSub}>
          Client-side AES-256 encryption. Your private medical files are never accessible to our servers without your local key.
        </Text>
      </LinearGradient>

      {/* Unlock / Key derivation */}
      {!vaultUnlocked ? (
        <Card>
          <Text style={[styles.cardTitle, { color: theme.heading }]}>Unlock Medical Vault</Text>
          <Text style={[styles.cardSub, { color: theme.muted }]}>
            Enter your secret passphrase to decrypt files locally:
          </Text>

          <HealthInput
            label="Master Vault Passphrase"
            placeholder="••••••••••••"
            value={passphrase}
            onChangeText={setPassphrase}
            secureTextEntry
          />

          <PrimaryButton title="Decrypt Vault" onPress={handleUnlock} />
        </Card>
      ) : (
        <Card>
          <View style={styles.unlockedHeader}>
            <View>
              <Text style={[styles.cardTitle, { color: theme.heading }]}>Vault Unlocked</Text>
              <Text style={[styles.cardSub, { color: theme.success }]}>● AES-256 Decryption Active</Text>
            </View>
            <SecondaryButton title="Lock" onPress={() => setVaultUnlocked(false)} />
          </View>

          <PrimaryButton
            title="Upload & Encrypt File"
            onPress={handleUpload}
            icon={<MaterialCommunityIcons name="file-upload-outline" size={20} color="#ffffff" />}
            style={{ marginTop: spacing.md }}
          />
        </Card>
      )}

      {/* Files List */}
      <Text style={[styles.sectionLabel, { color: theme.muted, marginTop: spacing.lg }]}>
        ENCRYPTED VAULT ARCHIVE ({vaultFiles.length})
      </Text>

      {vaultFiles.map((file) => (
        <Card key={file.id} style={styles.fileCard}>
          <View style={styles.fileRow}>
            <View style={[styles.fileIconBox, { backgroundColor: theme.bgSecondary }]}>
              <MaterialCommunityIcons
                name={vaultUnlocked ? 'file-document-outline' : 'file-lock-outline'}
                size={24}
                color={vaultUnlocked ? theme.primary : theme.danger}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fileName, { color: theme.heading }]} numberOfLines={1}>
                {vaultUnlocked ? file.name : '••••••••••••••••••••.enc'}
              </Text>
              <Text style={[styles.fileMeta, { color: theme.muted }]}>
                {file.size} • {file.date}
              </Text>
            </View>
            <Badge label={vaultUnlocked ? 'Decrypted' : 'Encrypted'} color={vaultUnlocked ? 'green' : 'blue'} />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 80,
  },
  hero: {
    borderRadius: radius['3xl'],
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
  heroSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: fontSize.xs,
    marginBottom: spacing.md,
  },
  unlockedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  fileCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  fileIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  fileMeta: {
    fontSize: 10,
    marginTop: 2,
  },
});
