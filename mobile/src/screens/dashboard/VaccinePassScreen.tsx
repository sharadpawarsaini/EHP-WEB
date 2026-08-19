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
import { Card, SectionHeader, Badge, PrimaryButton, EmptyState } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function VaccinePassScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [vaccines, setVaccines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVaccines = async () => {
    try {
      const res = await api.get('/vaccinations');
      setVaccines(res.data || []);
    } catch (e) {
      console.log('Error fetching vaccinations for vaccine pass:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVaccines();
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
      <SectionHeader
        title="Immunity Passport"
        subtitle="Verified vaccine records & booster alerts"
        icon={<MaterialCommunityIcons name="needle" size={24} color={theme.primary} />}
      />

      {vaccines.length === 0 ? (
        <View style={styles.emptyBox}>
          <EmptyState
            icon={<MaterialCommunityIcons name="needle" size={56} color={theme.border} />}
            title="No Vaccinations Logged"
            subtitle="You have not added any vaccination or booster records to your health pass yet."
          />
          <PrimaryButton
            title="Log Your First Vaccination"
            onPress={() => navigation.navigate('Vaccinations')}
            icon={<MaterialCommunityIcons name="plus" size={18} color="#ffffff" />}
            style={{ marginTop: spacing.md }}
          />
        </View>
      ) : (
        vaccines.map((v, i) => (
          <Card key={v._id || i} style={styles.vaccineCard}>
            <View style={styles.vaxTop}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.vaxName, { color: theme.heading }]}>{v.vaccineName || v.name}</Text>
                <Text style={[styles.vaxMfg, { color: theme.muted }]}>
                  {v.provider || v.hospitalName || 'Verified Provider'} • Dose #{v.doseNumber || 1}
                </Text>
              </View>
              <Badge label={v.nextDueDate ? `Due ${new Date(v.nextDueDate).toLocaleDateString()}` : 'Administered'} color="green" />
            </View>

            <View style={[styles.vaxDetails, { backgroundColor: theme.bgSecondary }]}>
              <View style={styles.detailCol}>
                <Text style={[styles.detailLabel, { color: theme.muted }]}>DATE ADMINISTERED</Text>
                <Text style={[styles.detailVal, { color: theme.heading }]}>
                  {v.dateAdministered ? new Date(v.dateAdministered).toLocaleDateString() : 'Recorded'}
                </Text>
              </View>
              {v.batchNumber ? (
                <View style={styles.detailCol}>
                  <Text style={[styles.detailLabel, { color: theme.muted }]}>BATCH NUMBER</Text>
                  <Text style={[styles.detailVal, { color: theme.heading }]}>{v.batchNumber}</Text>
                </View>
              ) : null}
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 80,
  },
  emptyBox: {
    paddingVertical: spacing.xl,
  },
  vaccineCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  vaxTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  vaxName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  vaxMfg: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  vaxDetails: {
    flexDirection: 'row',
    padding: spacing.sm,
    borderRadius: radius.lg,
  },
  detailCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: fontWeight.bold,
  },
  detailVal: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    marginTop: 2,
  },
});
