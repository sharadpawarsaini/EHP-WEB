import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Card, SectionHeader, StatCard, Badge, PrimaryButton, ThemeToggle } from '../../components/ui';
import { fontSize, fontWeight, radius, spacing } from '../../utils/theme';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [medical, setMedical] = useState<any>(null);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [vitals, setVitals] = useState<any[]>([]);
  const [streakDays, setStreakDays] = useState(5);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [profRes, medRes, pillsRes, vitRes] = await Promise.allSettled([
        api.get('/profile'),
        api.get('/medical'),
        api.get('/medicines'),
        api.get('/vitals'),
      ]);

      if (profRes.status === 'fulfilled') setProfile(profRes.value.data);
      if (medRes.status === 'fulfilled') setMedical(medRes.value.data);
      if (pillsRes.status === 'fulfilled') setMedicines(pillsRes.value.data || []);
      if (vitRes.status === 'fulfilled') setVitals(vitRes.value.data || []);
    } catch (e) {
      console.error('Home fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const calculateScore = () => {
    let score = 20;
    if (profile?.fullName) score += 20;
    if (profile?.bloodGroup) score += 20;
    if (profile?.emergencyContact) score += 15;
    if (medical?.allergies?.length > 0) score += 15;
    if (vitals.length > 0) score += 10;
    return Math.min(score, 100);
  };

  const healthScore = calculateScore();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
    >
      {/* Top Welcome Bar with Dark/Light Switcher */}
      <View style={styles.topBar}>
        {/* Tappable greeting → Profile */}
        <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('ProfileTab')} activeOpacity={0.75}>
          <Text style={[styles.greetingText, { color: theme.muted }]}>Welcome Back 👋</Text>
          <Text style={[styles.userName, { color: theme.heading }]} numberOfLines={1}>
            {profile?.fullName || user?.email || 'Valued Patient'}
          </Text>
        </TouchableOpacity>

        {/* Quick Theme Switcher */}
        <ThemeToggle style={{ marginRight: spacing.xs }} />

        {/* Settings Gear */}
        <TouchableOpacity
          style={[styles.topIconBtn, { backgroundColor: theme.bgSecondary, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="cog-outline" size={20} color={theme.heading} />
        </TouchableOpacity>

        {/* SOS Quick Beacon Icon */}
        <TouchableOpacity
          style={styles.sosQuickBtn}
          onPress={() => navigation.navigate('SOSBeacon')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="broadcast" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Emergency Hero Banner */}
      <LinearGradient
        colors={isDark ? ['#0369a1', '#0284c7'] : ['#2563eb', '#0284c7']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.emergencyHero}
      >
        <View style={styles.heroContent}>
          <View style={styles.heroLeft}>
            <View style={styles.emergencyPill}>
              <View style={styles.livePulse} />
              <Text style={styles.emergencyPillText}>Life-Link Armed & Protected</Text>
            </View>
            <Text style={styles.heroTitle}>Paramedic Fast-Path Active</Text>
            <Text style={styles.heroSubtitle}>
              First responders can scan your QR or NFC tag to immediately view blood type, allergies, and contacts.
            </Text>
          </View>
          
          <View style={styles.heroActionRow}>
            <TouchableOpacity
              style={styles.viewQrBtn}
              onPress={() => navigation.navigate('DigitalWalletCard')}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="wallet-membership" size={16} color="#2563eb" />
              <Text style={styles.viewQrBtnText}>Wallet Card</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nfcHeroBtn}
              onPress={() => navigation.navigate('NFCTag')}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="nfc" size={16} color="#ffffff" />
              <Text style={styles.nfcHeroBtnText}>NFC Tag</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nfcHeroBtn}
              onPress={() => navigation.navigate('QRCard')}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="qrcode" size={16} color="#ffffff" />
              <Text style={styles.nfcHeroBtnText}>QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Health Score & Quick Metrics */}
      <View style={styles.statsRow}>
        <StatCard
          label="Profile Score"
          value={`${healthScore}%`}
          icon={<MaterialCommunityIcons name="shield-check" size={22} color={theme.primary} />}
          color={theme.primary}
          onPress={() => navigation.navigate('Profile')}
        />
        <StatCard
          label="Blood Type"
          value={profile?.bloodGroup || 'UNK'}
          icon={<MaterialCommunityIcons name="water" size={22} color={theme.danger} />}
          color={theme.danger}
          bg={theme.dangerBg}
          onPress={() => navigation.navigate('Medical')}
        />
        <StatCard
          label="Active Meds"
          value={medicines.filter((m) => m.active !== false).length}
          icon={<MaterialCommunityIcons name="pill" size={22} color={theme.success} />}
          color={theme.success}
          bg={theme.successBg}
          onPress={() => navigation.navigate('Medicines')}
        />
      </View>

      {/* Comprehensive 10-Feature Quick Actions Hub */}
      <SectionHeader title="Mobile Health & Safety Hub" subtitle="10+ Specialized tools & emergency features" />
      <View style={styles.shortcutsGrid}>
        {[
          { label: 'AI Symptom', icon: 'robot', color: '#38bdf8', bg: isDark ? '#0c2738' : '#eff6ff', screen: 'AISymptomChecker' },
          { label: 'Drug Safety', icon: 'pill-multiple', color: '#10b981', bg: isDark ? '#09251e' : '#ecfdf5', screen: 'DrugInteraction' },
          { label: 'CPR & First Aid', icon: 'heart-pulse', color: '#e11d48', bg: isDark ? '#2a1215' : '#fff1f2', screen: 'FirstAidGuides' },
          { label: 'Voice Notes', icon: 'microphone', color: '#a855f7', bg: isDark ? '#24103a' : '#f5f3ff', screen: 'VoiceNotes' },
          { label: 'Clinical PDF', icon: 'file-certificate', color: '#2563eb', bg: isDark ? '#0c2738' : '#eff6ff', screen: 'ClinicalExport' },
          { label: 'Doc Scanner', icon: 'camera-document', color: '#0284c7', bg: isDark ? '#0c2738' : '#eff6ff', screen: 'MedicalDocScanner' },
          { label: 'Hydration', icon: 'water', color: '#06b6d4', bg: isDark ? '#082f49' : '#ecfeff', screen: 'HydrationTracker' },
          { label: 'Vaccine Pass', icon: 'needle', color: '#f59e0b', bg: isDark ? '#261b0c' : '#fffbeb', screen: 'VaccinePass' },
          { label: 'Family Hub', icon: 'account-group', color: '#10b981', bg: isDark ? '#09251e' : '#ecfdf5', screen: 'FamilyEmergencyHub' },
          { label: 'Silent SOS', icon: 'shield-alert', color: '#f43f5e', bg: isDark ? '#2a1215' : '#fff1f2', screen: 'CovertSOS' },
          { label: 'Night Strobe', icon: 'car-emergency', color: '#e11d48', bg: isDark ? '#2a1215' : '#fff1f2', screen: 'EmergencyStrobe' },
          { label: 'Face ID Lock', icon: 'face-recognition', color: '#38bdf8', bg: isDark ? '#0c2738' : '#eff6ff', screen: 'FaceIDEnrollment' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.shortcutItem,
              { backgroundColor: theme.bgCard, borderColor: theme.border },
            ]}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <View style={[styles.shortcutIconBox, { backgroundColor: item.bg }]}>
              <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
            </View>
            <Text style={[styles.shortcutLabel, { color: theme.heading }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── RECORDS HUB (navigates to full screens) ── */}
      <SectionHeader title="Health Records Hub" subtitle="Full history & clinical data" />
      <View style={styles.recordsGrid}>
        {[
          { label: 'Hospital Visits', icon: 'hospital-building', color: '#2563eb', bg: isDark ? '#0c2738' : '#dbeafe', screen: 'HospitalVisits', desc: 'Admissions & ER logs' },
          { label: 'Appointments', icon: 'calendar-clock', color: '#7c3aed', bg: isDark ? '#2e1065' : '#f3e8ff', screen: 'Appointments', desc: 'Scheduled doctor visits' },
          { label: 'Lab Reports', icon: 'test-tube', color: '#0891b2', bg: isDark ? '#082f49' : '#cffafe', screen: 'Reports', desc: 'Blood tests & scans' },
          { label: 'Vaccinations', icon: 'needle', color: '#d97706', bg: isDark ? '#261b0c' : '#fef3c7', screen: 'Vaccinations', desc: 'Immunisation records' },
          { label: 'Insurance', icon: 'shield-check', color: '#059669', bg: isDark ? '#09251e' : '#d1fae5', screen: 'Insurance', desc: 'Policy & claims' },
          { label: 'Family', icon: 'account-group', color: '#c026d3', bg: isDark ? '#2e0e4a' : '#fae8ff', screen: 'Family', desc: 'Dependants & members' },
        ].map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={[styles.recordCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.75}
          >
            <View style={[styles.recordIconBox, { backgroundColor: item.bg }]}>
              <MaterialCommunityIcons name={item.icon as any} size={22} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.recordLabel, { color: theme.heading }]}>{item.label}</Text>
              <Text style={[styles.recordDesc, { color: theme.muted }]}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.muted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Critical Medical Summary Card */}
      <Card style={styles.medicalOverviewCard}>
        <View style={styles.cardTopRow}>
          <Text style={[styles.cardHeaderTitle, { color: theme.heading }]}>Medical Quick Sheet</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Medical')}>
            <Text style={[styles.editLink, { color: theme.primary }]}>Edit All</Text>
          </TouchableOpacity>
        </View>

        {/* Severe Allergies */}
        <View style={styles.infoSection}>
          <Text style={[styles.infoLabel, { color: theme.muted }]}>Known Allergies</Text>
          {medical?.allergies && medical.allergies.length > 0 ? (
            <View style={styles.tagContainer}>
              {medical.allergies.map((allergy: string, i: number) => (
                <Badge key={i} label={allergy} color="red" />
              ))}
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: theme.muted }]}>No severe allergies logged</Text>
          )}
        </View>

        {/* Chronic Conditions */}
        <View style={[styles.infoSection, { marginTop: spacing.md }]}>
          <Text style={[styles.infoLabel, { color: theme.muted }]}>Chronic Conditions</Text>
          {medical?.conditions && medical.conditions.length > 0 ? (
            <View style={styles.tagContainer}>
              {medical.conditions.map((cond: string, i: number) => (
                <Badge key={i} label={cond} color="blue" />
              ))}
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: theme.muted }]}>No chronic conditions reported</Text>
          )}
        </View>
      </Card>

      {/* Daily Dose Adherence Card */}
      <Card style={styles.adherenceCard}>
        <View style={styles.adherenceTop}>
          <View style={[styles.adherenceIcon, { backgroundColor: theme.successBg }]}>
            <MaterialCommunityIcons name="calendar-check" size={24} color={theme.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.adherenceTitle, { color: theme.heading }]}>Daily Dose Streak</Text>
            <Text style={[styles.adherenceSub, { color: theme.muted }]}>Keep your medication schedule on track</Text>
          </View>
          <Badge label={`${streakDays} Days 🔥`} color="green" />
        </View>
        <PrimaryButton
          title="Manage Prescriptions"
          onPress={() => navigation.navigate('Medicines')}
          style={{ marginTop: spacing.md }}
        />
      </Card>

      {/* Hospital Finder CTA */}
      <TouchableOpacity
        style={[styles.finderCta, { backgroundColor: isDark ? '#0c2738' : '#dbeafe', borderColor: isDark ? '#1e3a5f' : '#bfdbfe' }]}
        onPress={() => navigation.navigate('HospitalFinder')}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="map-marker-plus" size={26} color="#0284c7" />
        <View style={{ flex: 1 }}>
          <Text style={[styles.finderCtaTitle, { color: theme.heading }]}>Find Nearest Hospital</Text>
          <Text style={[styles.finderCtaSub, { color: theme.muted }]}>ER bed tracker & real-time distance</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#0284c7" />
      </TouchableOpacity>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  greetingText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  sosQuickBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: '#e11d48',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  topIconBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyHero: {
    borderRadius: radius['3xl'],
    padding: spacing.xl,
    marginBottom: spacing.lg,
    elevation: 4,
  },
  heroContent: {
    gap: spacing.md,
  },
  heroLeft: {
    gap: 6,
  },
  emergencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    gap: 6,
  },
  livePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34d399',
  },
  emergencyPillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: fontSize.xs,
    lineHeight: 18,
  },
  heroActionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  viewQrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    gap: 6,
  },
  viewQrBtnText: {
    color: '#2563eb',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  nfcHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    gap: 6,
  },
  nfcHeroBtnText: {
    color: '#ffffff',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  shortcutItem: {
    width: '31%',
    borderRadius: radius['2xl'],
    borderWidth: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
    elevation: 2,
  },
  shortcutIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  shortcutLabel: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
  medicalOverviewCard: {
    padding: spacing.lg,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardHeaderTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  editLink: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  infoSection: {
    gap: 6,
  },
  infoLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  emptyText: {
    fontSize: fontSize.xs,
    fontStyle: 'italic',
  },
  adherenceCard: {
    padding: spacing.lg,
  },
  adherenceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  adherenceIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adherenceTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  adherenceSub: {
    fontSize: fontSize.xs,
  },
  recordsGrid: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    gap: spacing.sm,
  },
  recordIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  recordDesc: {
    fontSize: fontSize.xs,
    marginTop: 1,
  },
  finderCta: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  finderCtaTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  finderCtaSub: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
});

