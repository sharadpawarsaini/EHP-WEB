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
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../api/api';
import { Card, SectionHeader, HealthInput, PrimaryButton, EmptyState } from '../../components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '../../utils/theme';

export default function ReportsScreen() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [reportType, setReportType] = useState('Blood Test');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports');
      setReports(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReport = async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a report title.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/reports', {
        title: title.trim(),
        type: reportType,
        createdAt: new Date().toISOString(),
      });

      setTitle('');
      setShowAdd(false);
      fetchReports();
      Alert.alert('Saved', 'Report entry created.');
    } catch (e) {
      Alert.alert('Error', 'Failed to add report.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/reports/${id}`);
      setReports(reports.filter((r) => r._id !== id));
    } catch (e) {
      Alert.alert('Error', 'Failed to delete report.');
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
        title="Medical Reports Vault"
        subtitle="Lab results, scans & prescriptions"
        icon={<MaterialCommunityIcons name="file-document-outline" size={24} color={colors.primary} />}
      />

      <TouchableOpacity
        style={styles.toggleAddBtn}
        onPress={() => setShowAdd(!showAdd)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name={showAdd ? 'close' : 'cloud-upload'} size={20} color="#ffffff" />
        <Text style={styles.toggleAddText}>{showAdd ? 'Close' : 'Add New Lab Report'}</Text>
      </TouchableOpacity>

      {showAdd && (
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Add Diagnostic Report</Text>
          <HealthInput
            label="Report Title"
            placeholder="e.g. Complete Blood Count, Chest X-Ray"
            value={title}
            onChangeText={setTitle}
          />
          <HealthInput
            label="Report Category"
            placeholder="e.g. Blood Test, Radiology, Cardiology"
            value={reportType}
            onChangeText={setReportType}
          />
          <PrimaryButton title="Save to Vault" onPress={handleAddReport} loading={submitting} />
        </Card>
      )}

      {reports.length > 0 ? (
        reports.map((report) => (
          <Card key={report._id} style={styles.reportCard}>
            <View style={styles.reportRow}>
              <View style={styles.fileIcon}>
                <MaterialCommunityIcons name="file-pdf-box" size={28} color={colors.danger} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDate}>
                  {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Recent'} • {report.type || 'General'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(report._id)}>
                <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </Card>
        ))
      ) : (
        <EmptyState
          icon={<MaterialCommunityIcons name="file-document-outline" size={48} color={colors.muted} />}
          title="No Lab Reports Saved"
          subtitle="Keep your diagnostic tests, MRI, and blood tests stored safely in your cloud vault."
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
  reportCard: {
    padding: spacing.md,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  fileIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: '#fff1f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.heading,
  },
  reportDate: {
    fontSize: fontSize.xs,
    color: colors.muted,
    marginTop: 2,
  },
});
