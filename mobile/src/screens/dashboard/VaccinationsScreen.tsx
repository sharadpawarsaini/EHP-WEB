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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../api/api';
import { Card, SectionHeader, HealthInput, PrimaryButton, EmptyState, Badge } from '../../components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '../../utils/theme';

export default function VaccinationsScreen() {
  const [vaccines, setVaccines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [vaccineName, setVaccineName] = useState('');
  const [disease, setDisease] = useState('');
  const [dateAdministered, setDateAdministered] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVaccines();
  }, []);

  const fetchVaccines = async () => {
    try {
      const res = await api.get('/vaccinations');
      setVaccines(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVaccine = async () => {
    if (!vaccineName.trim()) {
      Alert.alert('Required', 'Please enter vaccine name.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/vaccinations', {
        vaccineName: vaccineName.trim(),
        disease: disease.trim(),
        dateAdministered: dateAdministered || new Date().toISOString(),
      });

      setVaccineName('');
      setDisease('');
      setDateAdministered('');
      setShowAdd(false);
      fetchVaccines();
      Alert.alert('Saved', 'Vaccination record added.');
    } catch (e) {
      Alert.alert('Error', 'Failed to add vaccination.');
    } finally {
      setSubmitting(false);
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
        title="Vaccinations & Immunizations"
        subtitle="Immunization logs & booster records"
        icon={<MaterialCommunityIcons name="needle" size={24} color={colors.primary} />}
      />

      <TouchableOpacity
        style={styles.toggleAddBtn}
        onPress={() => setShowAdd(!showAdd)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name={showAdd ? 'close' : 'plus-circle'} size={20} color="#ffffff" />
        <Text style={styles.toggleAddText}>{showAdd ? 'Close' : 'Log New Vaccine'}</Text>
      </TouchableOpacity>

      {showAdd && (
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Add Immunization Entry</Text>
          <HealthInput
            label="Vaccine Name"
            placeholder="e.g. COVID-19 Booster, Hepatitis B, Tetanus"
            value={vaccineName}
            onChangeText={setVaccineName}
          />
          <HealthInput
            label="Target Disease / Protection"
            placeholder="e.g. Coronavirus, Tetanus"
            value={disease}
            onChangeText={setDisease}
          />
          <HealthInput
            label="Date Administered"
            placeholder="YYYY-MM-DD"
            value={dateAdministered}
            onChangeText={setDateAdministered}
          />
          <PrimaryButton title="Save Vaccination" onPress={handleAddVaccine} loading={submitting} />
        </Card>
      )}

      {vaccines.length > 0 ? (
        vaccines.map((v) => (
          <Card key={v._id} style={styles.vaxCard}>
            <View style={styles.vaxRow}>
              <View style={styles.vaxIconBox}>
                <MaterialCommunityIcons name="needle" size={24} color={colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.vaxName}>{v.vaccineName}</Text>
                <Text style={styles.vaxDisease}>{v.disease || 'Immunization'}</Text>
              </View>
              <Badge
                label={v.dateAdministered ? new Date(v.dateAdministered).toLocaleDateString() : 'Administered'}
                color="green"
              />
            </View>
          </Card>
        ))
      ) : (
        <EmptyState
          icon={<MaterialCommunityIcons name="needle" size={48} color={colors.muted} />}
          title="No Immunizations Logged"
          subtitle="Track your COVID-19, Flu, Hepatitis, and travel vaccines."
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
  toggleAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.xl,
    marginBottom: spacing.lg,
    gap: 6,
  },
  toggleAddText: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  formCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  formTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.black,
    color: colors.heading,
    marginBottom: spacing.md,
  },
  vaxCard: {
    padding: spacing.md,
  },
  vaxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  vaxIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vaxName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.black,
    color: colors.heading,
  },
  vaxDisease: {
    fontSize: fontSize.xs,
    color: colors.muted,
  },
});
