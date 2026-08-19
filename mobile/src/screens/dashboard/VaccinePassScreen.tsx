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

export default function VaccinePassScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();

  const [vaccines] = useState([
    {
      name: 'COVID-19 mRNA Booster',
      manufacturer: 'Pfizer-BioNTech',
      date: 'Feb 12, 2025',
      dose: '3rd Dose (Booster)',
      batch: 'PFZ-99812A',
      status: 'Valid Immunity',
      validColor: 'green',
    },
    {
      name: 'Tetanus Toxoid (TT)',
      manufacturer: 'Serum Institute',
      date: 'Jun 20, 2023',
      dose: '1st Booster',
      batch: 'TT-44109',
      status: 'Valid until 2033',
      validColor: 'green',
    },
    {
      name: 'Hepatitis B Recombinant',
      manufacturer: 'Bharat Biotech',
      date: 'Nov 15, 2021',
      dose: 'Complete Series',
      batch: 'HBV-1200',
      status: 'Lifelong Immunity',
      validColor: 'blue',
    },
    {
      name: 'Seasonal Influenza (Flu)',
      manufacturer: 'Sanofi Pasteur',
      date: 'Oct 10, 2024',
      dose: 'Annual Dose',
      batch: 'FLU-2024X',
      status: 'Booster Due Soon',
      validColor: 'amber',
    },
  ]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      <SectionHeader
        title="Immunity Passport"
        subtitle="Verified vaccine records & booster alerts"
        icon={<MaterialCommunityIcons name="needle" size={24} color={theme.primary} />}
      />

      {/* Vaccine Pass Card */}
      {vaccines.map((v, i) => (
        <Card key={i} style={styles.vaccineCard}>
          <View style={styles.vaxTop}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.vaxName, { color: theme.heading }]}>{v.name}</Text>
              <Text style={[styles.vaxMfg, { color: theme.muted }]}>
                {v.manufacturer} • Batch #{v.batch}
              </Text>
            </View>
            <Badge label={v.status} color={v.validColor as any} />
          </View>

          <View style={[styles.vaxDetails, { backgroundColor: theme.bgSecondary }]}>
            <View style={styles.detailCol}>
              <Text style={[styles.detailLabel, { color: theme.muted }]}>DOSE</Text>
              <Text style={[styles.detailVal, { color: theme.heading }]}>{v.dose}</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={[styles.detailLabel, { color: theme.muted }]}>ADMINISTERED</Text>
              <Text style={[styles.detailVal, { color: theme.heading }]}>{v.date}</Text>
            </View>
          </View>
        </Card>
      ))}
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
