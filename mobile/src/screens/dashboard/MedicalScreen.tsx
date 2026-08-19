import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../api/api';
import { Card, SectionHeader, HealthInput, PrimaryButton, Badge } from '../../components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '../../utils/theme';

export default function MedicalScreen() {
  const [medical, setMedical] = useState<any>({
    allergies: [],
    conditions: [],
    organDonor: false,
    digitalDirective: '',
  });
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMedical();
  }, []);

  const fetchMedical = async () => {
    try {
      const res = await api.get('/medical');
      if (res.data) setMedical(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addAllergy = () => {
    if (!newAllergy.trim()) return;
    setMedical({
      ...medical,
      allergies: [...(medical.allergies || []), newAllergy.trim()],
    });
    setNewAllergy('');
  };

  const removeAllergy = (index: number) => {
    setMedical({
      ...medical,
      allergies: medical.allergies.filter((_: any, i: number) => i !== index),
    });
  };

  const addCondition = () => {
    if (!newCondition.trim()) return;
    setMedical({
      ...medical,
      conditions: [...(medical.conditions || []), newCondition.trim()],
    });
    setNewCondition('');
  };

  const removeCondition = (index: number) => {
    setMedical({
      ...medical,
      conditions: medical.conditions.filter((_: any, i: number) => i !== index),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/medical', medical);
      Alert.alert('Saved', 'Your medical parameters have been safely synchronized.');
    } catch (e) {
      Alert.alert('Error', 'Failed to save medical records.');
    } finally {
      setSaving(false);
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
        title="Medical Details"
        subtitle="Critical emergency parameters"
        icon={<MaterialCommunityIcons name="stethoscope" size={24} color={colors.primary} />}
      />

      {/* Severe Allergies Section */}
      <Card>
        <Text style={styles.cardTitle}>Severe Allergies</Text>
        <Text style={styles.cardDesc}>
          Paramedics will be warned about these before administering medication.
        </Text>

        <View style={styles.inputRow}>
          <View style={{ flex: 1, marginRight: spacing.sm }}>
            <HealthInput
              placeholder="e.g. Penicillin, Peanuts, Latex"
              value={newAllergy}
              onChangeText={setNewAllergy}
            />
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={addAllergy}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.badgeList}>
          {medical.allergies && medical.allergies.length > 0 ? (
            medical.allergies.map((allergy: string, i: number) => (
              <TouchableOpacity key={i} onPress={() => removeAllergy(i)}>
                <View style={styles.removableBadge}>
                  <Badge label={allergy} color="red" />
                  <Text style={styles.removeX}> ✕</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyNote}>No allergies recorded</Text>
          )}
        </View>
      </Card>

      {/* Chronic Conditions Section */}
      <Card>
        <Text style={styles.cardTitle}>Chronic Conditions</Text>
        <Text style={styles.cardDesc}>
          Long-term ailments (Asthma, Diabetes, Hypertension, Epilepsy).
        </Text>

        <View style={styles.inputRow}>
          <View style={{ flex: 1, marginRight: spacing.sm }}>
            <HealthInput
              placeholder="e.g. Type 2 Diabetes, Asthma"
              value={newCondition}
              onChangeText={setNewCondition}
            />
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={addCondition}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.badgeList}>
          {medical.conditions && medical.conditions.length > 0 ? (
            medical.conditions.map((cond: string, i: number) => (
              <TouchableOpacity key={i} onPress={() => removeCondition(i)}>
                <View style={styles.removableBadge}>
                  <Badge label={cond} color="blue" />
                  <Text style={styles.removeX}> ✕</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyNote}>No chronic conditions recorded</Text>
          )}
        </View>
      </Card>

      {/* Organ Donor & Directive */}
      <Card>
        <Text style={styles.cardTitle}>Organ Donation & Directives</Text>

        <TouchableOpacity
          style={[styles.toggleBox, medical.organDonor && styles.toggleBoxActive]}
          onPress={() => setMedical({ ...medical, organDonor: !medical.organDonor })}
        >
          <MaterialCommunityIcons
            name={medical.organDonor ? 'heart-pulse' : 'heart-outline'}
            size={24}
            color={medical.organDonor ? colors.danger : colors.muted}
          />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.toggleTitle}>Registered Organ Donor</Text>
            <Text style={styles.toggleSub}>Pledge to donate organs in case of tragedy</Text>
          </View>
          <Badge
            label={medical.organDonor ? 'Pledged' : 'Opt-Out'}
            color={medical.organDonor ? 'red' : 'amber'}
          />
        </TouchableOpacity>

        <HealthInput
          label="Emergency Directive (Special Instructions)"
          placeholder="e.g. DNR, Contact Dr. Sharma first, Deaf in left ear"
          value={medical.digitalDirective || ''}
          onChangeText={(text) => setMedical({ ...medical, digitalDirective: text })}
          multiline
          numberOfLines={3}
        />
      </Card>

      <PrimaryButton title="Save Medical Changes" onPress={handleSave} loading={saving} />
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
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.black,
    color: colors.heading,
  },
  cardDesc: {
    fontSize: fontSize.xs,
    color: colors.body,
    marginBottom: spacing.md,
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderRadius: radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  badgeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  removableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeX: {
    color: colors.danger,
    fontSize: 10,
    fontWeight: fontWeight.bold,
    marginLeft: 2,
  },
  emptyNote: {
    fontSize: fontSize.xs,
    color: colors.muted,
    fontStyle: 'italic',
  },
  toggleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    backgroundColor: '#ffffff',
    marginBottom: spacing.md,
  },
  toggleBoxActive: {
    borderColor: '#fecdd3',
    backgroundColor: '#fff1f2',
  },
  toggleTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.heading,
  },
  toggleSub: {
    fontSize: fontSize.xs,
    color: colors.muted,
  },
});
