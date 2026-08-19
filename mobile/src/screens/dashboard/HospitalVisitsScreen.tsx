import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import api from '../../api/api';
import { useTheme } from '../../context/ThemeContext';
import { HealthInput, PrimaryButton } from '../../components/ui';
import { fontSize, fontWeight, radius, spacing } from '../../utils/theme';

const VISIT_TYPES = [
  { key: 'OP', label: 'Outpatient', short: 'OP', color: '#2563eb', bg: '#dbeafe' },
  { key: 'IP', label: 'Inpatient', short: 'IP', color: '#059669', bg: '#d1fae5' },
  { key: 'ER', label: 'Emergency', short: 'ER', color: '#e11d48', bg: '#ffe4e6' },
];

const DEPARTMENTS = [
  'General','Cardiology','Orthopaedics','Neurology',
  'Gastroenterology','Pulmonology','Dermatology','Paediatrics','Oncology','ENT',
];

export default function HospitalVisitsScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();

  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  /* Form fields */
  const [hospitalName, setHospitalName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [department, setDepartment] = useState('General');
  const [visitType, setVisitType] = useState<'OP' | 'IP' | 'ER'>('OP');
  const [diagnosis, setDiagnosis] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [dischargeDate, setDischargeDate] = useState('');
  const [notes, setNotes] = useState('');
  const [followUp, setFollowUp] = useState('');

  useEffect(() => { fetchVisits(); }, []);

  const fetchVisits = async () => {
    try {
      const res = await api.get('/visits');
      setVisits(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setHospitalName(''); setDoctorName(''); setDepartment('General');
    setVisitType('OP'); setDiagnosis(''); setVisitDate(new Date().toISOString().split('T')[0]);
    setDischargeDate(''); setNotes(''); setFollowUp('');
  };

  const handleAddVisit = async () => {
    if (!hospitalName.trim() || !diagnosis.trim()) {
      Alert.alert('Required', 'Hospital name and diagnosis are required.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/visits', {
        hospitalName: hospitalName.trim(),
        doctorName: doctorName.trim(),
        department,
        visitType,
        diagnosis: diagnosis.trim(),
        date: visitDate,
        dischargeDate: visitType === 'IP' ? dischargeDate : undefined,
        notes: notes.trim(),
        followUp: followUp.trim(),
      });
      resetForm();
      setShowForm(false);
      fetchVisits();
      Alert.alert('✅ Saved', 'Hospital visit recorded successfully.');
    } catch { Alert.alert('Error', 'Failed to save visit.'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = (id: string, hospital: string) => {
    Alert.alert('Delete Visit', `Remove record for ${hospital}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/visits/${id}`);
            setVisits((v) => v.filter((x) => x._id !== id));
          } catch { Alert.alert('Error', 'Could not delete this record.'); }
        },
      },
    ]);
  };

  const filteredVisits = visits.filter(
    (v) =>
      v.hospitalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.doctorName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lastVisit = visits.length > 0
    ? new Date(visits[0].date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'None';

  const mostVisited = visits.length > 0
    ? (() => {
        const cnt: Record<string, number> = {};
        visits.forEach((v) => { cnt[v.hospitalName] = (cnt[v.hospitalName] || 0) + 1; });
        return Object.entries(cnt).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
      })()
    : '—';

  const getTypeMeta = (key: string) =>
    VISIT_TYPES.find((t) => t.key === key) || VISIT_TYPES[0];

  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />
      <ScrollView
        contentContainerStyle={[styles.content, { backgroundColor: theme.bg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO BANNER ── */}
        <LinearGradient
          colors={isDark ? ['#0a1628', '#0d2040'] : ['#1d4ed8', '#0284c7']}
          start={[0, 0]} end={[1, 1]}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <View style={styles.heroIconBox}>
              <MaterialCommunityIcons name="hospital-building" size={28} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Hospital Visits</Text>
              <Text style={styles.heroSub}>Clinical admissions & ER history</Text>
            </View>
            <TouchableOpacity
              style={styles.heroAddBtn}
              onPress={() => setShowForm((v) => !v)}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name={showForm ? 'close' : 'plus'} size={18} color="#2563eb" />
              <Text style={styles.heroAddBtnText}>{showForm ? 'Close' : 'Log Visit'}</Text>
            </TouchableOpacity>
          </View>

          {/* Stats strip */}
          <View style={styles.statsStrip}>
            <View style={styles.statItem}>
              <Text style={styles.statBig}>{visits.length}</Text>
              <Text style={styles.statLabel}>Total Visits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statBig, { fontSize: 13 }]}>{lastVisit}</Text>
              <Text style={styles.statLabel}>Last Visit</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statBig, { fontSize: 12 }]} numberOfLines={1}>{mostVisited}</Text>
              <Text style={styles.statLabel}>Most Visited</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── ADD FORM ── */}
        {showForm && (
          <View style={[styles.formCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <Text style={[styles.formTitle, { color: theme.heading }]}>Record New Visit</Text>

            {/* Visit Type Tabs */}
            <View style={styles.tabRow}>
              {VISIT_TYPES.map((t) => (
                <TouchableOpacity
                  key={t.key}
                  style={[
                    styles.tabBtn,
                    { backgroundColor: visitType === t.key ? t.color : theme.bgSecondary, borderColor: visitType === t.key ? t.color : theme.border },
                  ]}
                  onPress={() => setVisitType(t.key as any)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, { color: visitType === t.key ? '#ffffff' : theme.muted }]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <HealthInput label="Hospital / Clinic Name *" placeholder="e.g. City General Hospital" value={hospitalName} onChangeText={setHospitalName} />
            <HealthInput label="Attending Doctor" placeholder="e.g. Dr. Rajesh Sharma" value={doctorName} onChangeText={setDoctorName} />

            {/* Department chips */}
            <Text style={[styles.chipSectionLabel, { color: theme.muted }]}>DEPARTMENT / SPECIALTY</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.sm }}>
              <View style={styles.chipRow}>
                {DEPARTMENTS.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.chip,
                      { backgroundColor: department === d ? theme.primary : theme.bgSecondary, borderColor: department === d ? theme.primary : theme.border },
                    ]}
                    onPress={() => setDepartment(d)}
                  >
                    <Text style={[styles.chipText, { color: department === d ? '#ffffff' : theme.heading }]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <HealthInput label="Primary Diagnosis *" placeholder="e.g. Acute Bronchitis, Fracture" value={diagnosis} onChangeText={setDiagnosis} />
            <HealthInput label="Date of Visit" placeholder="YYYY-MM-DD" value={visitDate} onChangeText={setVisitDate} />
            {visitType === 'IP' && (
              <HealthInput label="Discharge Date" placeholder="YYYY-MM-DD" value={dischargeDate} onChangeText={setDischargeDate} />
            )}
            <HealthInput label="Follow-up Date" placeholder="YYYY-MM-DD (optional)" value={followUp} onChangeText={setFollowUp} />
            <HealthInput label="Clinical Notes / Doctor Advice" placeholder="e.g. Rest for 5 days, follow up next week" value={notes} onChangeText={setNotes} multiline numberOfLines={3} />

            <PrimaryButton title={submitting ? 'Saving…' : 'Save Visit Record'} onPress={handleAddVisit} loading={submitting} />
          </View>
        )}

        {/* ── SEARCH BAR ── */}
        <View style={[styles.searchBar, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Ionicons name="search" size={18} color={theme.muted} />
          <TextInput
            style={[styles.searchInput, { color: theme.heading }]}
            placeholder="Search hospital, doctor or diagnosis…"
            placeholderTextColor={theme.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.muted} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── VISIT CARDS ── */}
        {filteredVisits.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="hospital-building" size={56} color={theme.border} />
            <Text style={[styles.emptyTitle, { color: theme.heading }]}>No Visits Yet</Text>
            <Text style={[styles.emptySub, { color: theme.muted }]}>
              Keep a history of admissions, diagnoses{'\n'}and attending physicians.
            </Text>
            <TouchableOpacity
              style={[styles.emptyAddBtn, { backgroundColor: theme.primary }]}
              onPress={() => setShowForm(true)}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#ffffff" />
              <Text style={styles.emptyAddText}>Log First Visit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredVisits.map((v) => {
            const typeMeta = getTypeMeta(v.visitType || 'OP');
            return (
              <View
                key={v._id}
                style={[styles.visitCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
              >
                {/* Card header */}
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.cardTitleRow}>
                      <Text style={[styles.hospitalName, { color: theme.heading }]} numberOfLines={1}>
                        {v.hospitalName}
                      </Text>
                      <View style={[styles.typeBadge, { backgroundColor: typeMeta.color + '20' }]}>
                        <Text style={[styles.typeBadgeText, { color: typeMeta.color }]}>{typeMeta.short}</Text>
                      </View>
                    </View>
                    {v.doctorName ? (
                      <View style={styles.doctorRow}>
                        <MaterialCommunityIcons name="stethoscope" size={13} color={theme.muted} />
                        <Text style={[styles.doctorText, { color: theme.muted }]}>{v.doctorName}</Text>
                      </View>
                    ) : null}
                  </View>
                  {/* Delete */}
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(v._id, v.hospitalName)}
                  >
                    <MaterialCommunityIcons name="trash-can-outline" size={18} color={theme.danger} />
                  </TouchableOpacity>
                </View>

                {/* Department chip */}
                {v.department ? (
                  <View style={[styles.deptChip, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
                    <MaterialCommunityIcons name="hospital-marker" size={12} color={theme.primary} />
                    <Text style={[styles.deptText, { color: theme.primary }]}>{v.department}</Text>
                  </View>
                ) : null}

                {/* Diagnosis */}
                <View style={[styles.diagRow, { backgroundColor: isDark ? '#0c2738' : '#eff6ff' }]}>
                  <MaterialCommunityIcons name="clipboard-pulse" size={14} color={theme.primary} />
                  <Text style={[styles.diagText, { color: theme.primary }]}>{v.diagnosis}</Text>
                </View>

                {/* Dates */}
                <View style={styles.dateRow}>
                  <View style={styles.dateItem}>
                    <MaterialCommunityIcons name="calendar" size={13} color={theme.muted} />
                    <Text style={[styles.dateText, { color: theme.muted }]}>
                      {v.date ? new Date(v.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                    </Text>
                  </View>
                  {v.followUp ? (
                    <View style={styles.dateItem}>
                      <MaterialCommunityIcons name="calendar-check" size={13} color="#10b981" />
                      <Text style={[styles.dateText, { color: '#10b981' }]}>Follow-up: {v.followUp}</Text>
                    </View>
                  ) : null}
                </View>

                {/* Notes */}
                {v.notes ? (
                  <Text style={[styles.notesText, { color: theme.muted, borderTopColor: theme.border }]}>
                    "{v.notes}"
                  </Text>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Hero */
  hero: {
    borderRadius: 24, padding: 20,
    marginTop: Platform.OS === 'ios' ? 60 : 40, marginBottom: 16,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  heroIconBox: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: { color: '#ffffff', fontSize: 20, fontWeight: '700' },
  heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  heroAddBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#ffffff', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
  },
  heroAddBtnText: { color: '#2563eb', fontSize: 12, fontWeight: '700' },
  statsStrip: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16, paddingVertical: 12, paddingHorizontal: 16, justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  statBig: { color: '#ffffff', fontSize: 20, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '600', marginTop: 2 },

  /* Form */
  formCard: {
    borderRadius: 20, borderWidth: 1, padding: 16, marginBottom: 16,
  },
  formTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  tabBtn: { flex: 1, paddingVertical: 9, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  tabText: { fontSize: 12, fontWeight: '700' },
  chipSectionLabel: { fontSize: 10.5, fontWeight: '700', letterSpacing: 0.6, marginBottom: 6 },
  chipRow: { flexDirection: 'row', gap: 8, paddingRight: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: '600' },

  /* Search */
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 16, borderWidth: 1, marginBottom: 14,
  },
  searchInput: { flex: 1, fontSize: 14 },

  /* Visit cards */
  visitCard: {
    borderRadius: 20, borderWidth: 1, padding: 16, marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  hospitalName: { fontSize: 15, fontWeight: '700', flexShrink: 1 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  typeBadgeText: { fontSize: 11, fontWeight: '800' },
  doctorRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  doctorText: { fontSize: 12 },
  deleteBtn: { padding: 4 },
  deptChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
    alignSelf: 'flex-start', marginBottom: 10,
  },
  deptText: { fontSize: 11, fontWeight: '600' },
  diagRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 10, borderRadius: 12, marginBottom: 10,
  },
  diagText: { fontSize: 13, fontWeight: '700', flex: 1 },
  dateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 4 },
  dateItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 12 },
  notesText: {
    fontSize: 12, fontStyle: 'italic', marginTop: 10,
    paddingTop: 10, borderTopWidth: 1,
  },

  /* Empty */
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  emptyAddBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20, marginTop: 8,
  },
  emptyAddText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
});
