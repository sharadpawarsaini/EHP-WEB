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
import { useTheme } from '../../context/ThemeContext';
import { Card, SectionHeader, Badge, PrimaryButton } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function FamilyEmergencyHubScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [activeMember, setActiveMember] = useState('1');

  const [members] = useState([
    {
      id: '1',
      name: 'Myself (Primary)',
      relation: 'Self',
      blood: 'O+ Positive',
      allergies: ['Penicillin'],
      conditions: ['Hypertension'],
      meds: 2,
    },
    {
      id: '2',
      name: 'Sarah (Spouse)',
      relation: 'Spouse',
      blood: 'A+ Positive',
      allergies: ['Sulfa Drugs'],
      conditions: ['Asthma'],
      meds: 1,
    },
    {
      id: '3',
      name: 'Leo (Child - 8 yrs)',
      relation: 'Child',
      blood: 'O+ Positive',
      allergies: ['Peanuts'],
      conditions: ['None'],
      meds: 0,
    },
    {
      id: '4',
      name: 'Robert (Father - 68 yrs)',
      relation: 'Elderly Parent',
      blood: 'B+ Positive',
      allergies: ['Aspirin'],
      conditions: ['Type 2 Diabetes', 'Coronary Artery Disease'],
      meds: 4,
    },
  ]);

  const selected = members.find((m) => m.id === activeMember) || members[0];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      <SectionHeader
        title="Family Emergency Hub"
        subtitle="Manage dependent emergency profiles"
        icon={<MaterialCommunityIcons name="account-group" size={24} color={theme.primary} />}
      />

      {/* Member Selector Horizontal Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memberPillsScroll}>
        <View style={styles.memberPills}>
          {members.map((m) => {
            const isSel = m.id === activeMember;
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
                onPress={() => setActiveMember(m.id)}
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
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{selected.name[0]}</Text>
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
          <Text style={[styles.detailVal, { color: '#e11d48', fontWeight: fontWeight.bold }]}>
            {selected.allergies.join(', ')}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.muted }]}>Chronic Conditions:</Text>
          <Text style={[styles.detailVal, { color: theme.heading }]}>
            {selected.conditions.join(', ')}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.muted }]}>Active Prescriptions:</Text>
          <Text style={[styles.detailVal, { color: theme.heading }]}>
            {selected.meds} Daily Medications
          </Text>
        </View>

        <PrimaryButton
          title={`View ${selected.relation}'s Emergency QR Card`}
          onPress={() => navigation.navigate('DigitalWalletCard')}
          style={{ marginTop: spacing.md }}
        />
      </Card>
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
    backgroundColor: '#2563eb',
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
