import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import api from '../../api/api';
import { useTheme } from '../../context/ThemeContext';
import { Card, Badge, EmptyState } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function NotificationsCenterScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRealNotifications = async () => {
    try {
      const [logsRes, medsRes] = await Promise.allSettled([
        api.get('/access-logs'),
        api.get('/medicines'),
      ]);

      const notifList: any[] = [];

      // Add real paramedic / QR scan logs
      if (logsRes.status === 'fulfilled' && Array.isArray(logsRes.value.data)) {
        logsRes.value.data.forEach((log: any, i: number) => {
          notifList.push({
            id: log._id || `log_${i}`,
            title: log.accessorRole ? `Emergency Access by ${log.accessorRole}` : 'Paramedic QR Scanned',
            message: log.reason || log.location ? `Scanned at ${log.location || 'Hospital Location'}` : 'Your Emergency Health Card was viewed by emergency responders.',
            time: log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent Scan',
            type: 'emergency',
            read: false,
          });
        });
      }

      // Add real prescription alerts
      if (medsRes.status === 'fulfilled' && Array.isArray(medsRes.value.data)) {
        medsRes.value.data.filter((m: any) => m.active !== false).forEach((med: any, i: number) => {
          notifList.push({
            id: `med_${med._id || i}`,
            title: `Medication Dose: ${med.name}`,
            message: `Scheduled dosage: ${med.dosage || 'Standard dose'} (${med.frequency || 'Daily'}).`,
            time: 'Active Schedule',
            type: 'meds',
            read: true,
          });
        });
      }

      setNotifications(notifList);
    } catch (e) {
      console.log('Error loading notifications:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRealNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRealNotifications();
  };

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

  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
    >
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.pageTitle, { color: theme.heading }]}>Notification Center</Text>
          <Text style={[styles.pageSub, { color: theme.muted }]}>Live safety alerts & scan events</Text>
        </View>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={markAllRead} style={[styles.markReadBtn, { borderColor: theme.border }]}>
            <Text style={[styles.markReadText, { color: theme.primary }]}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            icon={<MaterialCommunityIcons name="bell-check-outline" size={56} color={theme.border} />}
            title="All Caught Up!"
            subtitle="No emergency scan alerts or pending notifications on your account."
          />
        </View>
      ) : (
        notifications.map((n) => {
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
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  emptyWrap: {
    paddingVertical: spacing.xl,
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
