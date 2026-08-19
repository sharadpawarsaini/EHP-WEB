import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import api from '../../api/api';
import { useTheme } from '../../context/ThemeContext';
import { Card, SectionHeader, HealthInput, PrimaryButton, EmptyState, StatCard, Badge } from '../../components/ui';
import { fontSize, fontWeight, radius, spacing } from '../../utils/theme';

export default function VitalsScreen() {
  const { theme, isDark } = useTheme();
  const [vitals, setVitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [bp, setBp] = useState('');
  const [hr, setHr] = useState('');
  const [spo2, setSpo2] = useState('');
  const [glucose, setGlucose] = useState('');
  const [temp, setTemp] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    try {
      const res = await api.get('/vitals');
      setVitals(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVitals = async () => {
    if (!bp && !hr && !spo2 && !glucose && !temp) {
      Alert.alert('Required', 'Please enter at least one vital sign reading.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/vitals', {
        bloodPressure: bp || undefined,
        heartRate: hr ? Number(hr) : undefined,
        spO2: spo2 ? Number(spo2) : undefined,
        glucose: glucose ? Number(glucose) : undefined,
        temperature: temp ? Number(temp) : undefined,
        date: new Date().toISOString(),
      });

      setBp('');
      setHr('');
      setSpo2('');
      setGlucose('');
      setTemp('');
      setShowAdd(false);
      fetchVitals();
      Alert.alert('Logged', 'New vital metrics recorded.');
    } catch (e) {
      Alert.alert('Error', 'Failed to save vital readings.');
    } finally {
      setSubmitting(false);
    }
  };

  const latest = vitals[0] || {};

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      <SectionHeader
        title="Biometric Vitals Hub"
        subtitle="Live telemetry & health readings"
        icon={<MaterialCommunityIcons name="heart-pulse" size={24} color={theme.danger} />}
        action={
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: theme.primary }]}
            onPress={() => setShowAdd(!showAdd)}
          >
            <Ionicons name={showAdd ? 'close' : 'add'} size={20} color="#ffffff" />
            <Text style={styles.addBtnText}>{showAdd ? 'Cancel' : 'Log Reading'}</Text>
          </TouchableOpacity>
        }
      />

      {/* Latest Vitals Overview Grid */}
      <View style={styles.vitalsGrid}>
        <StatCard
          label="Blood Pressure"
          value={latest.bloodPressure || '--/--'}
          icon={<MaterialCommunityIcons name="heart-flash" size={20} color={theme.danger} />}
          color={theme.danger}
          bg={theme.dangerBg}
        />
        <StatCard
          label="Heart Rate"
          value={latest.heartRate ? `${latest.heartRate} bpm` : '-- bpm'}
          icon={<MaterialCommunityIcons name="pulse" size={20} color="#e11d48" />}
          color="#e11d48"
          bg={theme.dangerBg}
        />
      </View>

      <View style={[styles.vitalsGrid, { marginTop: spacing.sm }]}>
        <StatCard
          label="Blood Oxygen (SpO2)"
          value={latest.spO2 ? `${latest.spO2}%` : '--%'}
          icon={<MaterialCommunityIcons name="water-percent" size={20} color={theme.info} />}
          color={theme.info}
          bg={theme.infoBg}
        />
        <StatCard
          label="Blood Glucose"
          value={latest.glucose ? `${latest.glucose} mg/dL` : '-- mg/dL'}
          icon={<MaterialCommunityIcons name="cube-outline" size={20} color={theme.warning} />}
          color={theme.warning}
          bg={theme.warningBg}
        />
      </View>

      {/* Log New Vitals Form */}
      {showAdd && (
        <Card style={styles.addCard}>
          <Text style={[styles.formTitle, { color: theme.heading }]}>Record New Vital Telemetry</Text>
          <HealthInput label="Blood Pressure (Systolic/Diastolic)" placeholder="120/80" value={bp} onChangeText={setBp} />
          <HealthInput label="Heart Rate (BPM)" placeholder="72" value={hr} onChangeText={setHr} keyboardType="numeric" />
          <HealthInput label="Oxygen Saturation SpO2 (%)" placeholder="98" value={spo2} onChangeText={setSpo2} keyboardType="numeric" />
          <HealthInput label="Blood Glucose (mg/dL)" placeholder="95" value={glucose} onChangeText={setGlucose} keyboardType="numeric" />
          <HealthInput label="Body Temp (°F)" placeholder="98.6" value={temp} onChangeText={setTemp} keyboardType="numeric" />
          <PrimaryButton title="Submit Reading" onPress={handleAddVitals} loading={submitting} />
        </Card>
      )}

      {/* History Log */}
      <SectionHeader title="Historical Log" subtitle="Timestamped telemetry records" style={{ marginTop: spacing.lg }} />

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
      ) : vitals.length === 0 ? (
        <EmptyState
          icon={<MaterialCommunityIcons name="chart-bell-curve" size={48} color={theme.muted} />}
          title="No Readings Logged"
          subtitle="Record your first vital sign entry using the Log Reading button above."
        />
      ) : (
        vitals.map((v, i) => (
          <Card key={v._id || i} style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Text style={[styles.historyDate, { color: theme.muted }]}>
                📅 {v.date ? new Date(v.date).toLocaleString() : 'Recent'}
              </Text>
              <Badge label="Validated" color="green" />
            </View>

            <View style={styles.historyMetrics}>
              {v.bloodPressure && (
                <View style={styles.metricPill}>
                  <Text style={[styles.metricLabel, { color: theme.muted }]}>BP:</Text>
                  <Text style={[styles.metricValue, { color: theme.heading }]}>{v.bloodPressure}</Text>
                </View>
              )}
              {v.heartRate && (
                <View style={styles.metricPill}>
                  <Text style={[styles.metricLabel, { color: theme.muted }]}>HR:</Text>
                  <Text style={[styles.metricValue, { color: theme.heading }]}>{v.heartRate} bpm</Text>
                </View>
              )}
              {v.spO2 && (
                <View style={styles.metricPill}>
                  <Text style={[styles.metricLabel, { color: theme.muted }]}>SpO2:</Text>
                  <Text style={[styles.metricValue, { color: theme.heading }]}>{v.spO2}%</Text>
                </View>
              )}
              {v.glucose && (
                <View style={styles.metricPill}>
                  <Text style={[styles.metricLabel, { color: theme.muted }]}>Glucose:</Text>
                  <Text style={[styles.metricValue, { color: theme.heading }]}>{v.glucose} mg/dL</Text>
                </View>
              )}
              {v.temperature && (
                <View style={styles.metricPill}>
                  <Text style={[styles.metricLabel, { color: theme.muted }]}>Temp:</Text>
                  <Text style={[styles.metricValue, { color: theme.heading }]}>{v.temperature}°F</Text>
                </View>
              )}
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
  content: {
    padding: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 80,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    gap: 4,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  vitalsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  addCard: {
    padding: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  formTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md,
  },
  historyCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  historyDate: {
    fontSize: fontSize.xs,
  },
  historyMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  metricValue: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
});
