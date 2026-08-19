import React from 'react';
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
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function EmergencyContactSupportScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();

  const HELPLINES = [
    { name: 'Ambulance Emergency (India)', num: '108', icon: 'ambulance', color: '#e11d48', bg: isDark ? '#2a1215' : '#ffe4e6' },
    { name: 'National Emergency Helpline', num: '112', icon: 'shield-alert', color: '#f59e0b', bg: isDark ? '#261b0c' : '#fef3c7' },
    { name: 'Police Control Room', num: '100', icon: 'car-emergency', color: '#2563eb', bg: isDark ? '#0c2738' : '#dbeafe' },
    { name: 'Fire & Rescue Service', num: '101', icon: 'fire-truck', color: '#ea580c', bg: isDark ? '#2e1409' : '#ffedd5' },
    { name: 'Women Helpline', num: '1091', icon: 'human-female', color: '#c026d3', bg: isDark ? '#2e0e4a' : '#fae8ff' },
  ];

  const dialNumber = (num: string) => {
    Alert.alert('Emergency Speed Dial', `Direct dial ${num}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call Now', style: 'destructive', onPress: () => Alert.alert('Dialing', `Connecting to ${num}...`) },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={isDark ? ['#0a1628', '#0f2040'] : ['#2563eb', '#0284c7']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.hero}
      >
        <MaterialCommunityIcons name="phone-classic" size={36} color="#ffffff" style={{ marginBottom: 6 }} />
        <Text style={styles.heroTitle}>Helpline & Support Center</Text>
        <Text style={styles.heroSub}>1-Tap emergency speed dialers and patient assistance</Text>
      </LinearGradient>

      <Text style={[styles.sectionLabel, { color: theme.muted }]}>EMERGENCY HELPLINE SPEED-DIAL</Text>

      {HELPLINES.map((h, i) => (
        <Card key={i} style={styles.helpCard}>
          <TouchableOpacity
            style={styles.helpRow}
            onPress={() => dialNumber(h.num)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: h.bg }]}>
              <MaterialCommunityIcons name={h.icon as any} size={22} color={h.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.helpName, { color: theme.heading }]}>{h.name}</Text>
              <Text style={[styles.helpNum, { color: h.color }]}>{h.num}</Text>
            </View>
            <View style={[styles.callPill, { backgroundColor: h.color }]}>
              <MaterialCommunityIcons name="phone" size={14} color="#ffffff" />
              <Text style={styles.callText}>DIAL</Text>
            </View>
          </TouchableOpacity>
        </Card>
      ))}

      <Card style={{ marginTop: spacing.md }}>
        <Text style={[styles.supportTitle, { color: theme.heading }]}>Technical & Account Support</Text>
        <Text style={[styles.supportDesc, { color: theme.muted }]}>
          Need assistance with your biometric configuration, NFC writer, or medical vault? Reach our patient support team.
        </Text>
        <Text style={[styles.supportEmail, { color: theme.primary }]}>📧 support@ehp-health.org</Text>
      </Card>
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
  heroTitle: {
    color: '#ffffff',
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  heroSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  helpCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  helpNum: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    marginTop: 2,
  },
  callPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  callText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  supportTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    marginBottom: 4,
  },
  supportDesc: {
    fontSize: fontSize.xs,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  supportEmail: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
});
