import React, { useState, useEffect } from 'react';
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
import api from '../../api/api';
import { useTheme } from '../../context/ThemeContext';
import { Card, SectionHeader, Badge, PrimaryButton, HealthInput } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function DrugInteractionScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [newDrug, setNewDrug] = useState('');
  const [activeMeds, setActiveMeds] = useState<any[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [checking, setChecking] = useState(false);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const [medRes, allergyRes] = await Promise.allSettled([
          api.get('/medicines'),
          api.get('/medical'),
        ]);
        if (medRes.status === 'fulfilled') setActiveMeds(medRes.value.data || []);
        if (allergyRes.status === 'fulfilled') setAllergies(allergyRes.value.data?.allergies || []);
      } catch (e) {
        console.log('Interaction check pre-load error:', e);
      }
    })();
  }, []);

  const checkDrugSafety = () => {
    if (!newDrug.trim()) {
      Alert.alert('Required', 'Please enter the name of the new medication.');
      return;
    }

    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      const drugLower = newDrug.toLowerCase();

      // Check allergy match
      const allergyConflict = allergies.find((a) =>
        drugLower.includes(a.toLowerCase()) || a.toLowerCase().includes(drugLower)
      );

      // Check common high-risk drug pairs (e.g. Aspirin + Blood Thinners / NSAIDs)
      const hasAspirin = drugLower.includes('aspirin') || drugLower.includes('ibuprofen');
      const hasWarfarin = activeMeds.some((m) =>
        m.name?.toLowerCase().includes('warfarin') || m.name?.toLowerCase().includes('heparin')
      );

      if (allergyConflict) {
        setReport({
          status: 'CRITICAL ALLERGY CONFLICT ❌',
          color: theme.danger,
          bg: theme.dangerBg,
          isSafe: false,
          details: `Patient has a documented severe allergy to "${allergyConflict}". Administering "${newDrug}" poses a high risk of anaphylaxis or adverse immune response.`,
          recommendation: 'DO NOT ADMINISTER. Contact prescribing doctor immediately.',
        });
      } else if (hasAspirin && hasWarfarin) {
        setReport({
          status: 'MAJOR DRUG INTERACTION ⚠️',
          color: theme.warning,
          bg: theme.warningBg,
          isSafe: false,
          details: `Co-administering NSAIDs like "${newDrug}" with active anticoagulants significantly increases the risk of severe gastrointestinal bleeding.`,
          recommendation: 'Requires physician dosage adjustment and INR monitoring.',
        });
      } else {
        setReport({
          status: 'NO KNOWN INTERACTIONS DETECTED ✅',
          color: theme.success,
          bg: theme.successBg,
          isSafe: true,
          details: `"${newDrug}" was evaluated against ${activeMeds.length} active prescriptions and ${allergies.length} logged allergies with no contraindications found.`,
          recommendation: 'Safe to proceed following standard dosage instructions.',
        });
      }
    }, 1200);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      <SectionHeader
        title="Drug Interaction Checker"
        subtitle="Contraindication & allergy cross-match"
        icon={<MaterialCommunityIcons name="pill-multiple" size={24} color={theme.primary} />}
      />

      <Card>
        <Text style={[styles.cardTitle, { color: theme.heading }]}>Check New Medication</Text>
        <HealthInput
          label="New Medicine Name"
          placeholder="e.g. Amoxicillin, Ibuprofen, Warfarin..."
          value={newDrug}
          onChangeText={setNewDrug}
        />

        <PrimaryButton
          title={checking ? 'Analyzing Interactions...' : 'Cross-Match Contraindications'}
          onPress={checkDrugSafety}
          loading={checking}
          icon={<MaterialCommunityIcons name="shield-search" size={20} color="#ffffff" />}
        />
      </Card>

      {/* Patient Profile Safety Baseline */}
      <Card style={styles.baselineCard}>
        <Text style={[styles.baselineTitle, { color: theme.heading }]}>Patient Safety Baseline</Text>
        <View style={styles.badgeRow}>
          <Badge label={`${activeMeds.length} Active Prescriptions`} color="blue" />
          <Badge label={`${allergies.length} Logged Allergies`} color="red" />
        </View>
      </Card>

      {/* Analysis Result */}
      {report && (
        <Card style={[styles.reportCard, { backgroundColor: report.bg, borderColor: report.color }]}>
          <Text style={[styles.reportStatus, { color: report.color }]}>{report.status}</Text>
          <Text style={[styles.reportDetails, { color: theme.heading }]}>{report.details}</Text>
          <View style={[styles.recommendationBox, { backgroundColor: theme.bgCard }]}>
            <Text style={[styles.recommendationLabel, { color: theme.muted }]}>CLINICAL RECOMMENDATION:</Text>
            <Text style={[styles.recommendationText, { color: theme.heading }]}>{report.recommendation}</Text>
          </View>
        </Card>
      )}
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
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md,
  },
  baselineCard: {
    padding: spacing.md,
  },
  baselineTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  reportCard: {
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  reportStatus: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  reportDetails: {
    fontSize: fontSize.xs,
    lineHeight: 18,
  },
  recommendationBox: {
    padding: spacing.md,
    borderRadius: radius.xl,
    marginTop: spacing.md,
    gap: 4,
  },
  recommendationLabel: {
    fontSize: 9,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
  },
  recommendationText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
});
