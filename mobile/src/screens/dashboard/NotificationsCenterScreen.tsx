import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { Card, Badge } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function NotificationsCenterScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Paramedic Fast-Path QR Scanned',
      message: 'Your emergency health pass was viewed by Apollo Hospital ER Staff.',
      time: '12 mins ago',
      type: 'emergency',
      read: false,
    },
    {
      id: '2',
      title: 'Medication Dose Reminder',
      message: 'Time to take Metformin (500mg) with your evening meal.',
      time: '1 hour ago',
      type: 'meds',
      read: false,
    },
    {
      id: '3',
      title: 'Face ID Hardware Lock Updated',
      message: 'New biometric token saved with hardware AES-256 encryption.',
      time: 'Yesterday',
      type: 'security',
      read: true,
    },
    {
      id: '4',
      title: 'Vaccine Booster Due Alert',
      message: 'Tetanus booster vaccination is recommended in 14 days.',
      time: '3 days ago',
      type: 'health',
      read: true,
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return { name: 'shield-alert', color: '#e11d48', bg: isDark ? '#2a1215' : '#ffe4e6' };
      case 'meds':
        return { name: 'pill', color: '#10b981', bg: isDark ? '#09251e' : '#d1fae5' };
      case 'security':
        return { name: 'lock-check', color: '#6366f1', bg: isDark ? '#1e1b4b' : '#ede9fe' };
      default:
        return { name: 'bell-ring', color: '#0284c7', bg: isDark ? '#0c2738' : '#dbeafe' };
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.pageTitle, { color: theme.heading }]}>Notification Center</Text>
          <Text style={[styles.pageSub, { color: theme.muted }]}>Safety alerts & clinical updates</Text>
        </View>
        <TouchableOpacity onPress={markAllRead} style={[styles.markReadBtn, { borderColor: theme.border }]}>
          <Text style={[styles.markReadText, { color: theme.primary }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {notifications.map((n) => {
        const iconData = getIcon(n.type);
        return (
          <Card
            key={n.id}
            style={[
              styles.notifCard,
              !n.read && { borderColor: theme.primary, borderWidth: 1.5 },
            ]}
          >
            <View style={styles.notifRow}>
              <View style={[styles.iconBox, { backgroundColor: iconData.bg }]}>
                <MaterialCommunityIcons name={iconData.name as any} size={22} color={iconData.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={[styles.notifTitle, { color: theme.heading }]}>{n.title}</Text>
                  {!n.read && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
                </View>
                <Text style={[styles.notifMsg, { color: theme.muted }]}>{n.message}</Text>
                <Text style={[styles.notifTime, { color: theme.muted }]}>{n.time}</Text>
              </View>
            </View>
          </Card>
        );
      })}
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  pageTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  pageSub: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  markReadBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  markReadText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  notifCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  notifRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 6,
  },
  notifMsg: {
    fontSize: fontSize.xs,
    lineHeight: 16,
    marginTop: 2,
  },
  notifTime: {
    fontSize: 10,
    marginTop: 6,
  },
});
