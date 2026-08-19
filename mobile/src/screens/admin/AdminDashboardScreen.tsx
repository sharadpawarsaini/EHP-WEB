import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../api/api';
import { Card, SectionHeader, StatCard, Badge } from '../../components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '../../utils/theme';

export default function AdminDashboardScreen({ navigation }: any) {
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    emergencyScans: 0,
    activeThreats: 0,
    systemStatus: 'Optimal',
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdminStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data) setStats(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAdminStats();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
    >
      <SectionHeader
        title="Admin SOC Command"
        subtitle="Live telemetry & security monitor"
        icon={<MaterialCommunityIcons name="shield-crown" size={24} color={colors.primary} />}
      />

      <View style={styles.statsGrid}>
        <StatCard
          label="Total Members"
          value={stats.totalUsers || 0}
          icon={<MaterialCommunityIcons name="account-group" size={22} color={colors.primary} />}
          color={colors.primary}
          bg="#eff6ff"
        />
        <StatCard
          label="Emergency Scans"
          value={stats.emergencyScans || 0}
          icon={<MaterialCommunityIcons name="qrcode-scan" size={22} color={colors.danger} />}
          color={colors.danger}
          bg="#fff1f2"
        />
      </View>

      <Card style={styles.statusCard}>
        <View style={styles.statusTop}>
          <View style={styles.statusPulse} />
          <Text style={styles.statusTitle}>Cyber Security Defense: ACTIVE</Text>
        </View>
        <Text style={styles.statusDesc}>
          AI Anomaly Threat Predictor, Rate Limiter & IP Blocklist are guarding all incoming paramedic scans.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
  },
  content: {
    padding: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statusCard: {
    padding: spacing.lg,
    borderColor: '#bfdbfe',
    backgroundColor: '#eff6ff',
  },
  statusTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  statusPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
  },
  statusTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.black,
    color: colors.primary,
  },
  statusDesc: {
    fontSize: fontSize.xs,
    color: colors.body,
    lineHeight: 18,
  },
});
