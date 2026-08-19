import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  StatusBar,
  Modal,
  Image,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { HealthInput, PrimaryButton } from '../../components/ui';
import { fontSize, fontWeight, radius, spacing } from '../../utils/theme';

/* ── Preset emoji avatars ── */
const PRESET_EMOJIS = [
  '🧑‍⚕️','👨','👩','🧓','👶','🧑','👦','👧',
  '🦸','🧙','👑','👸',
];

/* ── Blood group colour map ── */
const BLOOD_COLORS: Record<string, string> = {
  'A+': '#ef4444','A-': '#f87171','B+': '#3b82f6','B-': '#60a5fa',
  'AB+': '#8b5cf6','AB-': '#a78bfa','O+': '#10b981','O-': '#34d399',
};

/* ── Reusable info row ── */
function InfoRow({ icon, label, value, theme, last }: any) {
  return (
    <View style={[
      infoRow.row,
      { borderBottomColor: theme.border },
      last && { borderBottomWidth: 0 },
    ]}>
      <View style={[infoRow.iconBox, { backgroundColor: theme.bgSecondary }]}>
        <MaterialCommunityIcons name={icon} size={17} color={theme.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[infoRow.label, { color: theme.muted }]}>{label}</Text>
        <Text style={[infoRow.value, { color: theme.heading }]}>{value || '—'}</Text>
      </View>
    </View>
  );
}
const infoRow = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
  iconBox: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10.5, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  value: { fontSize: 14, fontWeight: '600', marginTop: 1 },
});

/* ── Section wrapper ── */
function Section({ title, children, theme }: any) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={[sec.label, { color: theme.muted }]}>{title.toUpperCase()}</Text>
      <View style={[sec.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>{children}</View>
    </View>
  );
}
const sec = StyleSheet.create({
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: 6, marginLeft: 4 },
  card: { borderRadius: 18, borderWidth: 1, paddingHorizontal: 16, overflow: 'hidden' },
});

/* ══════════════════════════════════════════════════════════
   Main Screen
   ══════════════════════════════════════════════════════════ */
export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const { theme, isDark } = useTheme();

  const [profile, setProfile] = useState<any>({
    fullName: '', dob: '', gender: '', bloodGroup: '',
    phone: '', address: '', emergencyContact: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  /* Avatar state */
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState('🧑‍⚕️');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      if (res.data) setProfile(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/profile', profile);
      setEditMode(false);
      Alert.alert('✅ Saved', 'Your profile has been updated.');
    } catch { Alert.alert('Error', 'Failed to update profile.'); }
    finally { setSaving(false); }
  };

  const handleLogout = () =>
    Alert.alert('Sign Out', 'End your active EHP session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);

  const pickFromGallery = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Needed', 'Allow EHP to access your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
      setShowAvatarModal(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const initials = profile?.fullName
    ? profile.fullName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'P';
  const bloodColor = BLOOD_COLORS[profile?.bloodGroup] || theme.primary;

  const calcAge = () => {
    if (!profile?.dob) return '—';
    return Math.floor((Date.now() - new Date(profile.dob).getTime()) / (365.25 * 24 * 3600 * 1000));
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

      {/* ── AVATAR PICKER MODAL ── */}
      <Modal visible={showAvatarModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.bgCard }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: theme.heading }]}>Customize Avatar</Text>

            {/* Emoji grid */}
            <FlatList
              data={PRESET_EMOJIS}
              numColumns={4}
              keyExtractor={(_, i) => i.toString()}
              contentContainerStyle={styles.emojiGrid}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.emojiBtn,
                    { backgroundColor: theme.bgSecondary, borderColor: theme.border },
                    selectedEmoji === item && avatarUri === null && { borderColor: theme.primary, borderWidth: 2 },
                  ]}
                  onPress={() => {
                    setSelectedEmoji(item);
                    setAvatarUri(null);
                    setShowAvatarModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.emojiText}>{item}</Text>
                </TouchableOpacity>
              )}
            />

            {/* Upload */}
            <TouchableOpacity style={[styles.uploadBtn, { backgroundColor: theme.primary }]} onPress={pickFromGallery}>
              <Ionicons name="image-outline" size={18} color="#ffffff" />
              <Text style={styles.uploadBtnText}>Upload from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cancelBtn, { borderColor: theme.border }]} onPress={() => setShowAvatarModal(false)}>
              <Text style={[styles.cancelBtnText, { color: theme.muted }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={[styles.content, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>

        {/* ── HERO BANNER ── */}
        <LinearGradient
          colors={isDark ? ['#0a1628', '#0d2040'] : ['#1d4ed8', '#0284c7']}
          start={[0, 0]} end={[1, 1]}
          style={styles.hero}
        >
          {/* Settings shortcut */}
          <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
            <MaterialCommunityIcons name="cog-outline" size={22} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>

          {/* Avatar with edit pencil */}
          <TouchableOpacity style={styles.avatarWrapper} onPress={() => setShowAvatarModal(true)} activeOpacity={0.85}>
            <View style={styles.avatarRing}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <LinearGradient colors={['#38bdf8', '#2563eb']} style={styles.avatarGradient}>
                  <Text style={styles.avatarEmoji}>{selectedEmoji}</Text>
                </LinearGradient>
              )}
            </View>
            {/* Edit pencil badge */}
            <View style={styles.editBadge}>
              <MaterialCommunityIcons name="pencil" size={11} color="#ffffff" />
            </View>
          </TouchableOpacity>

          <Text style={styles.heroName}>{profile?.fullName || 'Anonymous Patient'}</Text>
          <Text style={styles.heroEmail}>{user?.email || ''}</Text>

          {/* Stats strip */}
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <View style={[styles.bloodBadge, { backgroundColor: bloodColor }]}>
                <Text style={styles.bloodText}>{profile?.bloodGroup || '—'}</Text>
              </View>
              <Text style={styles.heroStatLabel}>Blood</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <MaterialCommunityIcons
                name={profile?.gender?.toLowerCase() === 'female' ? 'gender-female' : profile?.gender?.toLowerCase() === 'male' ? 'gender-male' : 'gender-non-binary'}
                size={22} color="#ffffff"
              />
              <Text style={styles.heroStatLabel}>{profile?.gender || 'N/A'}</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatBig}>{calcAge()}</Text>
              <Text style={styles.heroStatLabel}>Yrs</Text>
            </View>
          </View>

          {/* Edit / Save toggle */}
          <TouchableOpacity style={styles.editHeroBtn} onPress={() => editMode ? handleSave() : setEditMode(true)}>
            <MaterialCommunityIcons
              name={editMode ? 'content-save-check-outline' : 'account-edit-outline'}
              size={16} color="#1d4ed8"
            />
            <Text style={styles.editHeroBtnText}>
              {editMode ? (saving ? 'Saving…' : 'Save Changes') : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* ── QUICK ACTION CARDS ── */}
        <View style={styles.quickRow}>
          {[
            { icon: 'qrcode', label: 'QR Card', screen: 'QRCard', color: '#0284c7', bg: isDark ? '#0c2738' : '#dbeafe' },
            { icon: 'face-recognition', label: 'Face ID', screen: 'FaceIDEnrollment', color: '#10b981', bg: isDark ? '#09251e' : '#dcfce7' },
            { icon: 'shield-alert', label: 'SOS', screen: 'SOSBeacon', color: '#e11d48', bg: isDark ? '#2a1215' : '#ffe4e6' },
            { icon: 'wallet-membership', label: 'Wallet', screen: 'DigitalWalletCard', color: '#7c3aed', bg: isDark ? '#2e1065' : '#f3e8ff' },
          ].map((q) => (
            <TouchableOpacity
              key={q.screen}
              style={[styles.quickCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
              onPress={() => navigation.navigate(q.screen)}
              activeOpacity={0.75}
            >
              <View style={[styles.quickIcon, { backgroundColor: q.bg }]}>
                <MaterialCommunityIcons name={q.icon as any} size={22} color={q.color} />
              </View>
              <Text style={[styles.quickLabel, { color: theme.heading }]}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── DEMOGRAPHICS ── */}
        {editMode ? (
          <Section title="Personal Information" theme={theme}>
            <View style={{ paddingVertical: 8 }}>
              <HealthInput label="Full Legal Name" placeholder="e.g. John Doe" value={profile.fullName || ''} onChangeText={(t: string) => setProfile({ ...profile, fullName: t })} />
              <HealthInput label="Date of Birth" placeholder="YYYY-MM-DD" value={profile.dob ? profile.dob.split('T')[0] : ''} onChangeText={(t: string) => setProfile({ ...profile, dob: t })} />
              <HealthInput label="Gender" placeholder="Male / Female / Other" value={profile.gender || ''} onChangeText={(t: string) => setProfile({ ...profile, gender: t })} />
              <HealthInput label="Blood Group" placeholder="O+, A+, B+, AB-" value={profile.bloodGroup || ''} onChangeText={(t: string) => setProfile({ ...profile, bloodGroup: t })} autoCapitalize="characters" />
              <HealthInput label="Primary Phone" placeholder="+91 9876543210" value={profile.phone || ''} onChangeText={(t: string) => setProfile({ ...profile, phone: t })} keyboardType="phone-pad" />
              <HealthInput label="Home Address" placeholder="Street, City, State" value={profile.address || ''} onChangeText={(t: string) => setProfile({ ...profile, address: t })} />
              <HealthInput label="Emergency Contact" placeholder="+91 9876543210" value={profile.emergencyContact || ''} onChangeText={(t: string) => setProfile({ ...profile, emergencyContact: t })} keyboardType="phone-pad" />
              <PrimaryButton title={saving ? 'Saving…' : 'Save Profile'} onPress={handleSave} loading={saving} />
              <TouchableOpacity style={styles.cancelEditBtn} onPress={() => setEditMode(false)}>
                <Text style={[styles.cancelEditText, { color: theme.muted }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Section>
        ) : (
          <Section title="Personal Information" theme={theme}>
            <InfoRow icon="account-outline" label="Full Name" value={profile.fullName} theme={theme} />
            <InfoRow icon="calendar-outline" label="Date of Birth" value={profile.dob ? profile.dob.split('T')[0] : null} theme={theme} />
            <InfoRow icon="gender-male-female" label="Gender" value={profile.gender} theme={theme} />
            <InfoRow icon="water" label="Blood Group" value={profile.bloodGroup} theme={theme} />
            <InfoRow icon="phone-outline" label="Primary Phone" value={profile.phone} theme={theme} />
            <InfoRow icon="map-marker-outline" label="Address" value={profile.address} theme={theme} />
            <InfoRow icon="phone-alert-outline" label="Emergency Contact" value={profile.emergencyContact} theme={theme} last />
          </Section>
        )}

        {/* ── HEALTH IDENTITY ── */}
        <Section title="Health Identity" theme={theme}>
          {[
            { icon: 'qrcode-scan', label: 'Emergency QR Code', sub: 'Paramedic fast-path scan', color: '#0284c7', bg: isDark ? '#0c2738' : '#dbeafe', screen: 'QRCard' },
            { icon: 'wallet-membership', label: 'Digital Wallet Card', sub: '3D flippable NFC health pass', color: '#7c3aed', bg: isDark ? '#2e1065' : '#f3e8ff', screen: 'DigitalWalletCard' },
            { icon: 'hospital-building', label: 'Hospital Visits', sub: 'Admissions & ER history', color: '#2563eb', bg: isDark ? '#0c2738' : '#dbeafe', screen: 'HospitalVisits' },
          ].map((item, idx, arr) => (
            <TouchableOpacity
              key={item.screen}
              style={[styles.navRow, idx < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={[styles.navIcon, { backgroundColor: item.bg }]}>
                <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.navLabel, { color: theme.heading }]}>{item.label}</Text>
                <Text style={[styles.navSub, { color: theme.muted }]}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.muted} />
            </TouchableOpacity>
          ))}
        </Section>

        {/* ── ACCOUNT ── */}
        <Section title="Account" theme={theme}>
          <TouchableOpacity style={[styles.navRow, { borderBottomWidth: 1, borderBottomColor: theme.border }]} onPress={() => navigation.navigate('Settings')} activeOpacity={0.7}>
            <View style={[styles.navIcon, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
              <MaterialCommunityIcons name="cog-outline" size={20} color={theme.muted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.navLabel, { color: theme.heading }]}>Settings & Preferences</Text>
              <Text style={[styles.navSub, { color: theme.muted }]}>Theme, security, notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navRow} onPress={handleLogout} activeOpacity={0.7}>
            <View style={[styles.navIcon, { backgroundColor: '#fef2f2' }]}>
              <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.navLabel, { color: '#ef4444' }]}>Sign Out</Text>
              <Text style={[styles.navSub, { color: theme.muted }]}>End your active session</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#ef4444" />
          </TouchableOpacity>
        </Section>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Hero */
  hero: {
    borderRadius: 24, padding: 24, alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 60 : 40, marginBottom: 16, position: 'relative',
  },
  settingsBtn: {
    position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },

  /* Avatar */
  avatarWrapper: { marginBottom: 12, position: 'relative' },
  avatarRing: {
    width: 88, height: 88, borderRadius: 44, borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)', overflow: 'hidden',
  },
  avatarGradient: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: '100%', height: '100%' },
  avatarEmoji: { fontSize: 40 },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#ffffff',
  },

  heroName: { color: '#ffffff', fontSize: 20, fontWeight: '700', textAlign: 'center' },
  heroEmail: { color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 2, marginBottom: 16 },
  heroStats: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16,
    paddingVertical: 12, paddingHorizontal: 20, marginBottom: 16,
    width: '100%', justifyContent: 'space-around',
  },
  heroStat: { alignItems: 'center', gap: 4 },
  heroStatDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' },
  bloodBadge: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  bloodText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  heroStatBig: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  heroStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10.5, fontWeight: '600' },
  editHeroBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#ffffff', paddingVertical: 9, paddingHorizontal: 18, borderRadius: 20,
  },
  editHeroBtnText: { color: '#1d4ed8', fontSize: 13, fontWeight: '700' },

  /* Quick cards */
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  quickCard: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 16, borderWidth: 1, gap: 6 },
  quickIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 10, fontWeight: '700' },

  /* Nav rows */
  navRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 12 },
  navIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 14, fontWeight: '600' },
  navSub: { fontSize: 11.5, marginTop: 1 },

  cancelEditBtn: { alignItems: 'center', paddingVertical: 12 },
  cancelEditText: { fontSize: 13, fontWeight: '600' },

  /* Avatar modal */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#cbd5e1', alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  emojiGrid: { paddingBottom: 16 },
  emojiBtn: {
    flex: 1, margin: 6, aspectRatio: 1, borderRadius: 16, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  emojiText: { fontSize: 32 },
  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 14, marginBottom: 10,
  },
  uploadBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  cancelBtn: { paddingVertical: 12, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '600' },
});
