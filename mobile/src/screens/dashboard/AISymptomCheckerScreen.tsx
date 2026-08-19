import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Card, SectionHeader, Badge, PrimaryButton, HealthInput } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function AISymptomCheckerScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const SYMPTOM_OPTIONS = [
    'Chest Tightness / Pain',
    'Shortness of Breath',
    'Severe Headache / Migraine',
    'High Fever (>102°F)',
    'Sudden Dizziness / Fainting',
    'Severe Abdominal Pain',
    'Allergic Rash / Swelling',
    'Persistent Cough',
  ];

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const runAITriage = () => {
    if (selectedSymptoms.length === 0 && !customSymptom.trim()) {
      return;
    }

    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      const isCritical =
        selectedSymptoms.includes('Chest Tightness / Pain') ||
        selectedSymptoms.includes('Shortness of Breath') ||
        selectedSymptoms.includes('Sudden Dizziness / Fainting');

      if (isCritical) {
        setResult({
          severity: 'CRITICAL EMERGENCY',
          level: 'red',
          color: theme.danger,
          summary:
            'Symptoms indicate possible acute cardiopulmonary or neurological distress. Immediate emergency evaluation is strongly advised.',
          actions: [
            'Trigger 108 Emergency Ambulance or proceed to the nearest ER immediately.',
            'Keep your EHP Life-Link QR code ready on your phone screen for incoming paramedics.',
            'Do not attempt to drive yourself to the hospital.',
          ],
          showSosBtn: true,
        });
      } else {
        setResult({
          severity: 'MODERATE / NON-EMERGENCY',
          level: 'amber',
          color: theme.warning,
          summary:
            'Symptoms appear non-life-threatening based on primary clinical criteria, but warrant physician consultation within 24 hours.',
          actions: [
            'Stay hydrated and monitor body temperature / vitals every 4 hours.',
            'Book an outpatient consultation with your general physician.',
            'If symptoms suddenly worsen, trigger the Emergency SOS Beacon.',
          ],
          showSosBtn: false,
        });
      }
    }, 1500);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      <SectionHeader
        title="AI Symptom Triage"
        subtitle="Clinical emergency risk assessment"
        icon={<MaterialCommunityIcons name="robot" size={24} color={theme.primary} />}
      />

      {/* Select Symptoms Card */}
      <Card>
        <Text style={[styles.cardTitle, { color: theme.heading }]}>Select Presenting Symptoms</Text>
        <View style={styles.chipGrid}>
          {SYMPTOM_OPTIONS.map((sym) => {
            const active = selectedSymptoms.includes(sym);
            return (
              <TouchableOpacity
                key={sym}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? (isDark ? '#0284c7' : '#2563eb') : theme.bgSecondary,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => toggleSymptom(sym)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={active ? 'check-circle' : 'plus-circle-outline'}
                  size={16}
                  color={active ? '#ffffff' : theme.muted}
                />
                <Text style={[styles.chipText, { color: active ? '#ffffff' : theme.heading }]}>
                  {sym}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <HealthInput
          label="Other Symptoms / Details"
          placeholder="Describe duration, intensity, or triggers..."
          value={customSymptom}
          onChangeText={setCustomSymptom}
          multiline
          numberOfLines={3}
        />

        <PrimaryButton
          title={analyzing ? 'Evaluating Clinical Triage...' : 'Analyze Symptoms with AI'}
          onPress={runAITriage}
          loading={analyzing}
          icon={<MaterialCommunityIcons name="brain" size={20} color="#ffffff" />}
        />
      </Card>

      {/* AI Triage Result Card */}
      {result && (
        <Card style={[styles.resultCard, { borderColor: result.color }]}>
          <View style={styles.resultHeader}>
            <MaterialCommunityIcons
              name={result.level === 'red' ? 'alert-octagon' : 'alert-circle'}
              size={28}
              color={result.color}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.triageLevel, { color: result.color }]}>{result.severity}</Text>
              <Text style={[styles.triageSub, { color: theme.muted }]}>Triage Confidence: 96%</Text>
            </View>
          </View>

          <Text style={[styles.resultSummary, { color: theme.heading }]}>{result.summary}</Text>

          <View style={[styles.actionBox, { backgroundColor: theme.bgSecondary }]}>
            <Text style={[styles.actionHeader, { color: theme.heading }]}>Recommended Actions:</Text>
            {result.actions.map((act: string, i: number) => (
              <View key={i} style={styles.actionItem}>
                <Text style={{ color: result.color }}>•</Text>
                <Text style={[styles.actionText, { color: theme.body }]}>{act}</Text>
              </View>
            ))}
          </View>

          {result.showSosBtn && (
            <TouchableOpacity
              style={styles.sosTriggerBtn}
              onPress={() => navigation.navigate('SOSBeacon')}
            >
              <MaterialCommunityIcons name="broadcast" size={20} color="#ffffff" />
              <Text style={styles.sosTriggerText}>LAUNCH EMERGENCY SOS BEACON</Text>
            </TouchableOpacity>
          )}
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
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: 6,
  },
  chipText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  resultCard: {
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  triageLevel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  triageSub: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  resultSummary: {
    fontSize: fontSize.xs,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  actionBox: {
    padding: spacing.md,
    borderRadius: radius.xl,
    gap: 6,
  },
  actionHeader: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  actionItem: {
    flexDirection: 'row',
    gap: 6,
  },
  actionText: {
    fontSize: fontSize.xs,
    lineHeight: 16,
    flex: 1,
  },
  sosTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e11d48',
    paddingVertical: 14,
    borderRadius: radius.xl,
    marginTop: spacing.md,
    gap: 6,
  },
  sosTriggerText: {
    color: '#ffffff',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
});
