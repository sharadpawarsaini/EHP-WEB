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

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppointment = async () => {
    if (!doctorName.trim() || !date.trim()) {
      Alert.alert('Required', 'Please fill doctor name and date.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/appointments', {
        doctorName: doctorName.trim(),
        specialty: specialty.trim(),
        clinicName: clinicName.trim(),
        date: date.trim(),
        time: time.trim(),
        status: 'Scheduled',
      });

      setDoctorName('');
      setSpecialty('');
      setClinicName('');
      setDate('');
      setTime('');
      setShowAdd(false);
      fetchAppointments();
      Alert.alert('Saved', 'Doctor appointment booked.');
    } catch (e) {
      Alert.alert('Error', 'Failed to book appointment.');
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
        title="Appointments"
        subtitle="Bookings, doctor visits & reminders"
        icon={<MaterialCommunityIcons name="calendar-clock" size={24} color={colors.primary} />}
      />

      <TouchableOpacity
        style={styles.toggleAddBtn}
        onPress={() => setShowAdd(!showAdd)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name={showAdd ? 'close' : 'calendar-plus'} size={20} color="#ffffff" />
        <Text style={styles.toggleAddText}>{showAdd ? 'Close' : 'Book New Appointment'}</Text>
      </TouchableOpacity>

      {showAdd && (
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Schedule Consultation</Text>
          <HealthInput
            label="Doctor Name"
            placeholder="e.g. Dr. Ananya Verma"
            value={doctorName}
            onChangeText={setDoctorName}
          />
          <HealthInput
            label="Specialty / Department"
            placeholder="e.g. Cardiologist, Dermatologist"
            value={specialty}
            onChangeText={setSpecialty}
          />
          <HealthInput
            label="Clinic / Hospital Location"
            placeholder="e.g. Max Healthcare, Room 204"
            value={clinicName}
            onChangeText={setClinicName}
          />
          <HealthInput
            label="Appointment Date"
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
          />
          <HealthInput
            label="Appointment Time"
            placeholder="e.g. 10:30 AM"
            value={time}
            onChangeText={setTime}
          />
          <PrimaryButton title="Confirm Appointment" onPress={handleAddAppointment} loading={submitting} />
        </Card>
      )}

      {appointments.length > 0 ? (
        appointments.map((apt) => (
          <Card key={apt._id} style={styles.aptCard}>
            <View style={styles.aptTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.aptDoc}>{apt.doctorName}</Text>
                <Text style={styles.aptSpec}>{apt.specialty || 'General Physician'} • {apt.clinicName || 'Clinic'}</Text>
              </View>
              <Badge label={apt.status || 'Scheduled'} color="blue" />
            </View>
            <View style={styles.aptTimeRow}>
              <MaterialCommunityIcons name="clock-outline" size={16} color={colors.primary} />
              <Text style={styles.aptTimeText}>
                {apt.date} at {apt.time || '10:00 AM'}
              </Text>
            </View>
          </Card>
        ))
      ) : (
        <EmptyState
          icon={<MaterialCommunityIcons name="calendar-blank" size={48} color={colors.muted} />}
          title="No Upcoming Appointments"
          subtitle="Keep your schedule organized and get reminded before your next doctor checkup."
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
  aptCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  aptTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  aptDoc: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.black,
    color: colors.heading,
  },
  aptSpec: {
    fontSize: fontSize.xs,
    color: colors.muted,
    marginTop: 2,
  },
  aptTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  aptTimeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
});
