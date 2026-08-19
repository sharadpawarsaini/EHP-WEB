import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../api/api';
import { Card, SectionHeader, EmptyState, Badge } from '../../components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '../../utils/theme';

export default function AccessLogsScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/emergency/logs');
      setLogs(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionHeader
        title="Emergency Access Logs"
        subtitle="Audit trail of who viewed your medical card"
        icon={<MaterialCommunityIcons name="shield-search" size={24} color={colors.primary} />}
      />

      {logs.length > 0 ? (
        logs.map((log, index) => (
          <Card key={log._id || index} style={styles.logCard}>
            <View style={styles.logTop}>
              <View style={styles.ipBox}>
                <MaterialCommunityIcons name="radar" size={16} color={colors.danger} />
                <Text style={styles.ipText}>{log.ip || 'Anonymous IP'}</Text>
              </View>
              <Badge label="Scanned" color="red" />
            </View>
            <Text style={styles.deviceText}>📱 {log.userAgent || 'Mobile Web Browser'}</Text>
            <Text style={styles.timestampText}>
              🕒 {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent access'}
            </Text>
          </Card>
        ))
      ) : (
        <EmptyState
          icon={<MaterialCommunityIcons name="shield-check" size={48} color={colors.success} />}
          title="No Unauthorized Scans"
          subtitle="Every time someone scans your QR code or NFC card, their IP and timestamp will appear here."
        />
      )}
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
  logCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  logTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  ipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ipText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.black,
    color: colors.heading,
  },
  deviceText: {
    fontSize: fontSize.xs,
    color: colors.body,
    marginTop: 2,
  },
  timestampText: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: fontWeight.bold,
    marginTop: 4,
  },
});
