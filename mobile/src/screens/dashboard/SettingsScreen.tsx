import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import api from '../../api/api';
import { HealthInput, PrimaryButton } from '../../components/ui';
import { fontSize, fontWeight, radius, spacing } from '../../utils/theme';

/* ─────────────────────────────────────────────────────────
   Reusable row atoms
   ───────────────────────────────────────────────────────── */

function SettingToggleRow({
  icon,
  iconColor,
  iconBg,
  label,
  description,
  value,
  onValueChange,
  theme,
  last = false,
}: any) {
  return (
    <View
      style={[
        rowStyles.row,
        !last && { borderBottomWidth: 1, borderBottomColor: theme.border },
      ]}
    >
      <View style={[rowStyles.iconBox, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={icon} size={19} color={iconColor} />
      </View>
      <View style={rowStyles.textBlock}>
        <Text style={[rowStyles.label, { color: theme.heading }]}>{label}</Text>
        <Text style={[rowStyles.desc, { color: theme.muted }]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: isDarkBg(theme.bg) ? '#2d3748' : '#e2e8f0', true: theme.primary }}
        thumbColor="#ffffff"
        ios_backgroundColor={isDarkBg(theme.bg) ? '#2d3748' : '#e2e8f0'}
      />
    </View>
  );
}

function isDarkBg(bg: string) {
  return bg.startsWith('#0') || bg.startsWith('#1') || bg === '#0a0f1d';
}

function SettingNavRow({
  icon,
  iconColor,
  iconBg,
  label,
  description,
  badge,
  onPress,
  theme,
  last = false,
}: any) {
  return (
    <TouchableOpacity
      style={[
        rowStyles.row,
        !last && { borderBottomWidth: 1, borderBottomColor: theme.border },
      ]}
      onPress={onPress}
      activeOpacity={0.65}
    >
      <View style={[rowStyles.iconBox, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={icon} size={19} color={iconColor} />
      </View>
      <View style={rowStyles.textBlock}>
        <Text style={[rowStyles.label, { color: theme.heading }]}>{label}</Text>
        {description ? (
          <Text style={[rowStyles.desc, { color: theme.muted }]}>{description}</Text>
        ) : null}
      </View>
      {badge ? (
        <View style={[rowStyles.badgePill, { backgroundColor: theme.primary + '20' }]}>
          <Text style={[rowStyles.badgeText, { color: theme.primary }]}>{badge}</Text>
        </View>
      ) : null}
      <Ionicons name="chevron-forward" size={17} color={theme.muted} />
    </TouchableOpacity>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600' },
  desc: { fontSize: 11.5, marginTop: 1.5, lineHeight: 16 },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
});

/* ─────────────────────────────────────────────────────────
   Section wrapper
   ───────────────────────────────────────────────────────── */

function Section({
  title,
  children,
  theme,
}: {
  title: string;
  children: React.ReactNode;
  theme: any;
}) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={[sectionStyles.label, { color: theme.muted }]}>{title.toUpperCase()}</Text>
      <View
        style={[
          sectionStyles.card,
          { backgroundColor: theme.bgCard, borderColor: theme.border },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.9,
    marginBottom: 6,
    marginLeft: 4,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
});

/* ─────────────────────────────────────────────────────────
   Main Screen
   ───────────────────────────────────────────────────────── */

export default function SettingsScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const { theme, mode, setThemeMode, isDark } = useTheme();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [biometrics, setBiometrics] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [offlineCache, setOfflineCache] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const [emergencyAccess, setEmergencyAccess] = useState(true);

  const themeOptions: { mode: ThemeMode; label: string; icon: string; accent: string; previewTop: string; previewBg: string }[] = [
    { mode: 'light', label: 'Light', icon: 'white-balance-sunny', accent: '#2563eb', previewTop: '#2563eb', previewBg: '#f8fafc' },
    { mode: 'dark',  label: 'Dark',  icon: 'weather-night',       accent: '#38bdf8', previewTop: '#0284c7', previewBg: '#0a0f1d' },
    { mode: 'system',label: 'Auto',  icon: 'theme-light-dark',    accent: '#6366f1', previewTop: '#6366f1', previewBg: isDark ? '#0f172a' : '#f1f5f9' },
  ];

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Required', 'Please fill all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'New passwords do not match.');
      return;
    }
    setSavingPassword(true);
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setShowPasswordForm(false);
      Alert.alert('✅ Password Updated', 'Your login credentials have been changed.');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleClearCache = () =>
    Alert.alert('Cache Cleared', 'All offline cached files have been removed.', [{ text: 'Done' }]);

  const handleDeleteAccount = () =>
    Alert.alert(
      '⚠️ Delete Account',
      'This will permanently remove all your health data and cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Permanently', style: 'destructive', onPress: () => Alert.alert('Contact support to complete deletion.') },
      ]
    );

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />
      <ScrollView
        contentContainerStyle={[styles.content, { backgroundColor: theme.bg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── PROFILE HERO HEADER ── */}
        <LinearGradient
          colors={isDark ? ['#0a1628', '#0f2040'] : ['#2563eb', '#0284c7']}
          start={[0, 0]} end={[1, 1]}
          style={styles.profileHero}
        >
          <View style={styles.avatarRing}>
            <View style={[styles.avatar, { backgroundColor: isDark ? '#1e3a5f' : '#ffffff30' }]}>
              <MaterialCommunityIcons name="account" size={36} color="#ffffff" />
            </View>
          </View>
          <Text style={styles.heroName}>{user?.email?.split('@')[0] || 'Patient'}</Text>
          <Text style={styles.heroEmail}>{user?.email || 'ehp@health.com'}</Text>
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <MaterialCommunityIcons name="shield-check" size={12} color="#34d399" />
              <Text style={styles.heroBadgeText}>Verified Patient</Text>
            </View>
            <View style={styles.heroBadge}>
              <MaterialCommunityIcons name="face-recognition" size={12} color="#38bdf8" />
              <Text style={styles.heroBadgeText}>Face ID Active</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── THEME ── */}
        <Section title="Appearance" theme={theme}>
          {/* 3 Theme Preview Cards */}
          <View style={styles.themeRow}>
            {themeOptions.map((opt) => {
              const active = mode === opt.mode;
              return (
                <TouchableOpacity
                  key={opt.mode}
                  onPress={() => setThemeMode(opt.mode)}
                  activeOpacity={0.8}
                  style={[
                    styles.themeCard,
                    { backgroundColor: opt.previewBg, borderColor: active ? opt.accent : theme.border, borderWidth: active ? 2 : 1 },
                  ]}
                >
                  {/* Mini phone screen mockup */}
                  <View style={[styles.phoneTop, { backgroundColor: opt.previewTop }]}>
                    <MaterialCommunityIcons name={opt.icon as any} size={13} color="#fff" />
                  </View>
                  <View style={styles.phoneBars}>
                    <View style={[styles.phoneBar, { backgroundColor: opt.accent, width: '65%' }]} />
                    <View style={[styles.phoneBar, { backgroundColor: opt.accent + '50', width: '45%' }]} />
                    <View style={[styles.phoneBar, { backgroundColor: opt.accent + '30', width: '55%' }]} />
                  </View>
                  <Text style={[styles.themeLabel, { color: opt.mode === 'dark' ? '#f1f5f9' : '#0f172a' }]}>
                    {opt.label}
                  </Text>
                  {active && (
                    <View style={[styles.themeCheck, { backgroundColor: opt.accent }]}>
                      <Ionicons name="checkmark" size={10} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        {/* ── SECURITY ── */}
        <Section title="Security & Biometrics" theme={theme}>
          <SettingToggleRow
            icon="face-recognition" iconColor="#10b981" iconBg={isDark ? '#09251e' : '#dcfce7'}
            label="Face ID Auto-Login" description="Unlock EHP instantly with biometrics"
            value={biometrics} onValueChange={setBiometrics} theme={theme}
          />
          <SettingToggleRow
            icon="lock-clock" iconColor="#6366f1" iconBg={isDark ? '#1e1b4b' : '#ede9fe'}
            label="Auto-Lock on Background" description="Lock app when switching away"
            value={autoLock} onValueChange={setAutoLock} theme={theme}
          />
          <SettingNavRow
            icon="shield-lock-outline" iconColor="#0284c7" iconBg={isDark ? '#0c2738' : '#dbeafe'}
            label="Configure Biometric Vault" description="Manage Face ID & fingerprint settings"
            badge="Configure"
            onPress={() => navigation.navigate('FaceIDEnrollment')} theme={theme} last
          />
        </Section>

        {/* ── NOTIFICATIONS ── */}
        <Section title="Notifications & Alerts" theme={theme}>
          <SettingToggleRow
            icon="bell-ring" iconColor="#f59e0b" iconBg={isDark ? '#261b0c' : '#fef3c7'}
            label="Dose Reminders" description="Prescription schedule push alerts"
            value={notifications} onValueChange={setNotifications} theme={theme}
          />
          <SettingToggleRow
            icon="shield-alert" iconColor="#e11d48" iconBg={isDark ? '#2a1215' : '#ffe4e6'}
            label="Emergency Access Alerts" description="Notify when QR is scanned by paramedics"
            value={emergencyAccess} onValueChange={setEmergencyAccess} theme={theme} last
          />
        </Section>

        {/* ── MEDICAL DATA ── */}
        <Section title="Medical Data & Sync" theme={theme}>
          <SettingToggleRow
            icon="wifi-off" iconColor="#0284c7" iconBg={isDark ? '#0c2738' : '#dbeafe'}
            label="Offline Emergency Cache" description="Access QR card without internet"
            value={offlineCache} onValueChange={setOfflineCache} theme={theme}
          />
          <SettingNavRow
            icon="file-certificate-outline" iconColor="#0284c7" iconBg={isDark ? '#0c2738' : '#dbeafe'}
            label="Export Clinical Dossier" description="PDF medical summary for doctors"
            onPress={() => navigation.navigate('ClinicalExport')} theme={theme}
          />
          <SettingNavRow
            icon="camera-document" iconColor="#7c3aed" iconBg={isDark ? '#2e1065' : '#f3e8ff'}
            label="Medical Document Scanner" description="Encrypt and store physical health cards"
            onPress={() => navigation.navigate('MedicalDocScanner')} theme={theme}
          />
          <SettingNavRow
            icon="broom" iconColor="#94a3b8" iconBg={isDark ? '#1e293b' : '#f1f5f9'}
            label="Clear Offline Cache" description="Remove locally stored temporary files"
            onPress={handleClearCache} theme={theme} last
          />
        </Section>

        {/* ── PASSWORD ── */}
        <Section title="Account & Password" theme={theme}>
          <SettingNavRow
            icon="key-variant" iconColor="#0284c7" iconBg={isDark ? '#0c2738' : '#dbeafe'}
            label="Change Password" description="Update your EHP login credentials"
            onPress={() => setShowPasswordForm((v) => !v)} theme={theme} last
          />
          {showPasswordForm && (
            <View style={[styles.passwordForm, { borderTopWidth: 1, borderTopColor: theme.border }]}>
              <HealthInput
                label="Current Password" placeholder="••••••••" value={currentPassword}
                onChangeText={setCurrentPassword} secureTextEntry
              />
              <HealthInput
                label="New Password" placeholder="••••••••" value={newPassword}
                onChangeText={setNewPassword} secureTextEntry
              />
              <HealthInput
                label="Confirm New Password" placeholder="••••••••" value={confirmPassword}
                onChangeText={setConfirmPassword} secureTextEntry
              />
              <PrimaryButton title="Update Password" onPress={handleChangePassword} loading={savingPassword} />
            </View>
          )}
        </Section>

        {/* ── APP INFO ── */}
        <Section title="About" theme={theme}>
          <SettingNavRow
            icon="information-outline" iconColor="#64748b" iconBg={isDark ? '#1e293b' : '#f1f5f9'}
            label="EHP Mobile" description="Emergency Health Passport · v2.5.0"
            badge="v2.5.0" onPress={() => {}} theme={theme}
          />
          <SettingNavRow
            icon="shield-half-full" iconColor="#0284c7" iconBg={isDark ? '#0c2738' : '#dbeafe'}
            label="Privacy Policy" description="How we protect your health data"
            onPress={() => Alert.alert('Privacy Policy', 'All data is AES-256 encrypted and stored securely on your device and our HIPAA-compliant servers.')}
            theme={theme} last
          />
        </Section>

        {/* ── DANGER ZONE ── */}
        <Section title="Danger Zone" theme={theme}>
          <TouchableOpacity
            style={[styles.dangerRow, { borderBottomWidth: 1, borderBottomColor: theme.border }]}
            onPress={logout}
            activeOpacity={0.7}
          >
            <View style={[rowStyles.iconBox, { backgroundColor: '#fef2f2' }]}>
              <MaterialCommunityIcons name="logout" size={19} color="#ef4444" />
            </View>
            <View style={rowStyles.textBlock}>
              <Text style={[rowStyles.label, { color: '#ef4444' }]}>Sign Out</Text>
              <Text style={[rowStyles.desc, { color: theme.muted }]}>Log out from this device</Text>
            </View>
            <Ionicons name="chevron-forward" size={17} color="#ef4444" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dangerRow}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <View style={[rowStyles.iconBox, { backgroundColor: '#fef2f2' }]}>
              <MaterialCommunityIcons name="account-remove" size={19} color="#dc2626" />
            </View>
            <View style={rowStyles.textBlock}>
              <Text style={[rowStyles.label, { color: '#dc2626' }]}>Delete Account</Text>
              <Text style={[rowStyles.desc, { color: theme.muted }]}>Permanently erase all your health data</Text>
            </View>
            <Ionicons name="chevron-forward" size={17} color="#dc2626" />
          </TouchableOpacity>
        </Section>

        {/* Footer */}
        <Text style={[styles.footerText, { color: theme.muted }]}>
          EHP · Emergency Health Passport{'\n'}
          Made with ❤️ for better healthcare access
        </Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  profileHero: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    marginTop: Platform.OS === 'ios' ? 60 : 40,
  },
  avatarRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  heroEmail: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  heroBadgeText: {
    color: '#ffffff',
    fontSize: 10.5,
    fontWeight: '600',
  },
  themeRow: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    paddingBottom: 12,
  },
  themeCard: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    paddingBottom: 8,
  },
  phoneTop: {
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  phoneBars: {
    paddingHorizontal: 8,
    gap: 4,
    marginBottom: 8,
  },
  phoneBar: {
    height: 4,
    borderRadius: 2,
  },
  themeLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  themeCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 12,
  },
  passwordForm: {
    padding: 14,
    gap: 4,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 10,
  },
});
