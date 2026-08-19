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
import { useTheme } from '../../context/ThemeContext';
import { Card, Badge, DangerButton, PrimaryButton } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function LockdownScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [lockdownActive, setLockdownActive] = useState(false);

  const toggleLockdown = () => {
    Alert.alert(
      lockdownActive ? 'Deactivate Lockdown' : '🚨 Activate Emergency Lockdown',
      lockdownActive
        ? 'Resume normal QR card sharing and health record availability?'
        : 'This will instantly sever all public QR scan paths, revoke third-party API keys, and freeze local biometric keys.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: lockdownActive ? 'Restore System' : 'CONFIRM LOCKDOWN',
          style: 'destructive',
          onPress: () => {
            setLockdownActive(!lockdownActive);
            Alert.alert(
              lockdownActive ? 'System Restored' : 'Lockdown Engaged',
              lockdownActive
                ? 'All health passes and paramedic fast-paths are active.'
                : 'Emergency blackout active. All external access paths are frozen.'
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <LinearGradient
        colors={lockdownActive ? ['#991b1b', '#dc2626'] : isDark ? ['#0a1628', '#0f2040'] : ['#2563eb', '#0284c7']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.hero}
      >
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons
            name={lockdownActive ? 'lock-alert' : 'shield-check'}
            size={40}
            color="#ffffff"
          />
        </View>
        <Text style={styles.heroTitle}>
          {lockdownActive ? 'EMERGENCY LOCKDOWN ACTIVE' : 'System Defense & Lockdown'}
        </Text>
        <Text style={styles.heroSub}>
          {lockdownActive
            ? 'All external paramedic fast-paths, QR tokens, and API sessions are temporarily frozen.'
            : 'Protect your medical identity during cyber threats or personal security concerns.'}
        </Text>
      </LinearGradient>

      {/* Status Grid */}
      <Text style={[styles.sectionLabel, { color: theme.muted }]}>SYSTEM TELEMETRY</Text>
      <View style={styles.statusGrid}>
        {[
          { label: 'Patient Portal', status: lockdownActive ? 'FROZEN' : 'ACTIVE', color: lockdownActive ? '#ef4444' : '#10b981' },
          { label: 'QR Token Rotation', status: lockdownActive ? 'PAUSED' : 'ACTIVE', color: lockdownActive ? '#ef4444' : '#10b981' },
          { label: 'NFC Emergency Tag', status: lockdownActive ? 'OFFLINE' : 'ONLINE', color: lockdownActive ? '#ef4444' : '#10b981' },
          { label: 'Paramedic Fast-Path', status: lockdownActive ? 'RESTRICTED' : 'READY', color: lockdownActive ? '#f59e0b' : '#3b82f6' },
        ].map((item, i) => (
          <View
            key={i}
            style={[styles.statusBox, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
          >
            <Text style={[styles.statusLabel, { color: theme.muted }]}>{item.label}</Text>
            <Text style={[styles.statusVal, { color: item.color }]}>{item.status}</Text>
          </View>
        ))}
      </View>

      {/* Action Card */}
      <Card style={{ marginTop: spacing.md }}>
        <Text style={[styles.cardTitle, { color: theme.heading }]}>
          {lockdownActive ? 'Deactivate Lockdown' : 'Emergency Action'}
        </Text>
        <Text style={[styles.cardDesc, { color: theme.muted }]}>
          {lockdownActive
            ? 'You can lift the emergency blackout and resume normal hospital scan operations at any time.'
            : 'If your device is lost or compromised, activate lockdown to prevent unauthorized viewing of your records.'}
        </Text>

        {lockdownActive ? (
          <PrimaryButton title="Lift Lockdown & Restore Services" onPress={toggleLockdown} />
        ) : (
          <DangerButton title="🚨 Engage Emergency Lockdown" onPress={toggleLockdown} />
        )}
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
  sectionLabel: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBox: {
    width: '48%',
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  statusVal: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    marginTop: 4,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: fontSize.xs,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
});
