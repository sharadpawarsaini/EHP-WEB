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
import { Card, SectionHeader, HealthInput, PrimaryButton, SecondaryButton, Badge, EmptyState } from '../../components/ui';
import { fontSize, fontWeight, radius, spacing } from '../../utils/theme';

export default function MedicinesScreen() {
  const { theme, isDark } = useTheme();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [takenToday, setTakenToday] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [times, setTimes] = useState('Morning, Night');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await api.get('/medicines');
      setMedicines(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = async () => {
    if (!name.trim() || !dosage.trim()) {
      Alert.alert('Required', 'Please fill medicine name and dosage.');
      return;
    }

    setSubmitting(true);
    try {
      const timeArray = times.split(',').map((t) => t.trim()).filter(Boolean);
      await api.post('/medicines', {
        name: name.trim(),
        dosage: dosage.trim(),
        frequency,
        times: timeArray,
        active: true,
      });

      setName('');
      setDosage('');
      setShowAdd(false);
      fetchMedicines();
      Alert.alert('Success', 'Prescription logged successfully.');
    } catch (e) {
      Alert.alert('Error', 'Failed to save medication.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTaken = (id: string) => {
    setTakenToday((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) {
        Alert.alert('Dose Logged 🎉', 'Marked as taken for today. Keep up your streak!');
      }
      return next;
    });
  };

  const deleteMedicine = async (id: string) => {
    Alert.alert('Delete Medication', 'Are you sure you want to remove this prescription?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/medicines/${id}`);
            fetchMedicines();
          } catch (e) {
            Alert.alert('Error', 'Failed to delete.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      <SectionHeader
        title="Medication Vault"
        subtitle="Prescriptions & daily dose schedule"
        icon={<MaterialCommunityIcons name="pill" size={24} color={theme.primary} />}
        action={
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: theme.primary }]}
            onPress={() => setShowAdd(!showAdd)}
          >
            <Ionicons name={showAdd ? 'close' : 'add'} size={20} color="#ffffff" />
            <Text style={styles.addBtnText}>{showAdd ? 'Cancel' : 'Add Med'}</Text>
          </TouchableOpacity>
        }
      />

      {/* Add Medicine Form */}
      {showAdd && (
        <Card style={styles.addCard}>
          <Text style={[styles.formTitle, { color: theme.heading }]}>Add New Prescription</Text>
          <HealthInput label="Medicine Name" placeholder="e.g. Metformin, Atorvastatin" value={name} onChangeText={setName} />
          <HealthInput label="Dosage & Unit" placeholder="e.g. 500mg, 1 tablet" value={dosage} onChangeText={setDosage} />
          <HealthInput label="Frequency" placeholder="e.g. Once Daily, Twice Daily" value={frequency} onChangeText={setFrequency} />
          <HealthInput label="Times (Comma separated)" placeholder="e.g. 8:00 AM, 8:00 PM" value={times} onChangeText={setTimes} />
          <PrimaryButton title="Save Medication" onPress={handleAddMedicine} loading={submitting} />
        </Card>
      )}

      {/* Active Prescription List */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
      ) : medicines.length === 0 ? (
        <EmptyState
          icon={<MaterialCommunityIcons name="pill-off" size={48} color={theme.muted} />}
          title="No Prescriptions Added"
          subtitle="Add your current daily medications to enable dose reminders and paramedic visibility."
        />
      ) : (
        medicines.map((med, index) => {
          const isTaken = !!takenToday[med._id || index];
          return (
            <Card key={med._id || index} style={styles.medCard}>
              <View style={styles.medRow}>
                <View style={[styles.medIconBox, { backgroundColor: isTaken ? theme.successBg : theme.bgSecondary }]}>
                  <MaterialCommunityIcons
                    name={isTaken ? 'check-decagram' : 'pill'}
                    size={24}
                    color={isTaken ? theme.success : theme.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.medName, { color: theme.heading }]}>{med.name}</Text>
                  <Text style={[styles.medDosage, { color: theme.muted }]}>
                    {med.dosage} • {med.frequency || 'Daily'}
                  </Text>
                  {med.times && med.times.length > 0 && (
                    <View style={styles.timeTags}>
                      {med.times.map((t: string, i: number) => (
                        <Badge key={i} label={`⏰ ${t}`} color="purple" />
                      ))}
                    </View>
                  )}
                </View>

                {/* 1-Tap Take Dose Button */}
                <TouchableOpacity
                  style={[
                    styles.doseBtn,
                    {
                      backgroundColor: isTaken ? theme.successBg : theme.bgSecondary,
                      borderColor: isTaken ? theme.successBorder : theme.border,
                    },
                  ]}
                  onPress={() => toggleTaken(med._id || index)}
                >
                  <Text style={[styles.doseBtnText, { color: isTaken ? theme.success : theme.primary }]}>
                    {isTaken ? 'Taken ✓' : 'Take Dose'}
                  </Text>
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity onPress={() => deleteMedicine(med._id || index)} style={{ padding: 4 }}>
                  <Ionicons name="trash-outline" size={18} color={theme.danger} />
                </TouchableOpacity>
              </View>
            </Card>
          );
        })
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
  addCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  formTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md,
  },
  medCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  medIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  medDosage: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  timeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  doseBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  doseBtnText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
});
