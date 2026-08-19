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
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Card, SectionHeader, Badge, PrimaryButton, SecondaryButton } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function FamilyEmergencyHubScreen({ navigation }: any) {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [medical, setMedical] = useState<any>(null);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('primary');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRealData = async () => {
    try {
      const [profRes, medRes, pillsRes, famRes] = await Promise.allSettled([
        api.get('/profile'),
        api.get('/medical'),
        api.get('/medicines'),
        api.get('/family'),
      ]);

      if (profRes.status === 'fulfilled') setProfile(profRes.value.data);
      if (medRes.status === 'fulfilled') setMedical(medRes.value.data);
      if (pillsRes.status === 'fulfilled') setMedicines(pillsRes.value.data || []);
      if (famRes.status === 'fulfilled') setFamilyMembers(famRes.value.data || []);
    } catch (e) {
      console.log('Error fetching family hub telemetry:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRealData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRealData();
  };

  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // Combine primary profile with real family members
  const allProfiles = [
    {
      id: 'primary',
      name: profile?.fullName || user?.email?.split('@')[0] || 'Primary Account',
      relation: 'Self (Primary)',
      blood: profile?.bloodGroup || 'Not Set',
      allergies: medical?.allergies || [],
      conditions: medical?.conditions || [],
      meds: medicines.filter((m) => m.active !== false).length,
      emergencyContact: profile?.emergencyContact || 'Not Set',
    },
    ...familyMembers.map((fm) => ({
      id: fm._id,
      name: fm.name || fm.fullName,
      relation: fm.relationship || 'Dependent',
      blood: fm.bloodGroup || 'UNK',
      allergies: fm.allergies || [],
      conditions: fm.conditions || [],
      meds: 0,
      emergencyContact: fm.emergencyContact || 'Inherited',
    })),
  ];

  const selected = allProfiles.find((p) => p.id === activeTab) || allProfiles[0];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
    >
      <SectionHeader
        title="Family Emergency Hub"
        subtitle="Real-time multi-profile dependent switcher"
        icon={<MaterialCommunityIcons name="account-group" size={24} color={theme.primary} />}
      />

      {/* Member Selector Horizontal Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memberPillsScroll}>
        <View style={styles.memberPills}>
          {allProfiles.map((m) => {
            const isSel = m.id === activeTab;
            return (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.memberPill,
                  {
                    backgroundColor: isSel ? (isDark ? '#0284c7' : '#2563eb') : theme.bgCard,
                    borderColor: isSel ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setActiveTab(m.id)}
                activeOpacity={0.75}
              >
                <Text style={[styles.memberPillText, { color: isSel ? '#ffffff' : theme.heading }]}>
                  {m.relation}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Active Selected Member Emergency Profile Card */}
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>{selected.name[0]?.toUpperCase() || 'P'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.profileName, { color: theme.heading }]}>{selected.name}</Text>
            <Text style={[styles.profileRelation, { color: theme.muted }]}>{selected.relation}</Text>
          </View>
          <Badge label={selected.blood} color="red" />
        </View>

        <View style={[styles.sectionDivider, { backgroundColor: theme.border }]} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.muted }]}>Severe Allergies:</Text>
          <Text style={[styles.detailVal, { color: selected.allergies.length > 0 ? '#e11d48' : theme.muted, fontWeight: fontWeight.bold }]}>
            {selected.allergies.length > 0 ? selected.allergies.join(', ') : 'None Documented'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.muted }]}>Chronic Conditions:</Text>
          <Text style={[styles.detailVal, { color: theme.heading }]}>
            {selected.conditions.length > 0 ? selected.conditions.join(', ') : 'None Reported'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.muted }]}>Active Prescriptions:</Text>
          <Text style={[styles.detailVal, { color: theme.heading }]}>
            {selected.meds} Daily Medications
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.muted }]}>Emergency Contact:</Text>
          <Text style={[styles.detailVal, { color: theme.primary, fontWeight: fontWeight.bold }]}>
            {selected.emergencyContact}
          </Text>
        </View>

        <PrimaryButton
          title={`View ${selected.name}'s Digital Emergency Card`}
          onPress={() => navigation.navigate('DigitalWalletCard')}
          style={{ marginTop: spacing.md }}
        />

        <SecondaryButton
          title="+ Add Another Family Member"
          onPress={() => navigation.navigate('Family')}
          style={{ marginTop: spacing.sm }}
        />
      </Card>
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
  memberPillsScroll: {
    marginBottom: spacing.md,
  },
  memberPills: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  memberPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  memberPillText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  profileCard: {
    padding: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  profileName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  profileRelation: {
    fontSize: fontSize.xs,
  },
  sectionDivider: {
    height: 1,
    marginVertical: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  detailVal: {
    fontSize: fontSize.xs,
    flex: 1,
    textAlign: 'right',
  },
});
