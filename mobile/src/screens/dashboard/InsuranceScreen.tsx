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

export default function InsuranceScreen() {
  const [insurance, setInsurance] = useState<any>({
    provider: '',
    policyNumber: '',
    coverageAmount: '',
    expiryDate: '',
    tpaContact: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInsurance();
  }, []);

  const fetchInsurance = async () => {
    try {
      const res = await api.get('/profile');
      if (res.data?.insurance) {
        setInsurance(res.data.insurance);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/profile', { insurance });
      Alert.alert('Saved', 'Insurance policy details updated.');
    } catch (e) {
      Alert.alert('Error', 'Failed to update insurance.');
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
        title="Health Insurance"
        subtitle="Policy details & cashless TPA info"
        icon={<MaterialCommunityIcons name="shield-account" size={24} color={colors.primary} />}
      />

      <Card style={styles.policyCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.providerName}>{insurance.provider || 'No Provider Configured'}</Text>
          <Badge label={insurance.policyNumber ? 'Policy Active' : 'Not Set'} color={insurance.policyNumber ? 'green' : 'amber'} />
        </View>

        <HealthInput
          label="Insurance Provider Name"
          placeholder="e.g. Star Health, Care Health, HDFC ERGO"
          value={insurance.provider || ''}
          onChangeText={(t) => setInsurance({ ...insurance, provider: t })}
        />

        <HealthInput
          label="Policy / Member ID Number"
          placeholder="e.g. POL-98234-2024"
          value={insurance.policyNumber || ''}
          onChangeText={(t) => setInsurance({ ...insurance, policyNumber: t })}
        />

        <HealthInput
          label="Sum Insured / Coverage Amount"
          placeholder="e.g. ₹5,00,000 / $50,000"
          value={insurance.coverageAmount || ''}
          onChangeText={(t) => setInsurance({ ...insurance, coverageAmount: t })}
        />

        <HealthInput
          label="Policy Expiry Date"
          placeholder="YYYY-MM-DD"
          value={insurance.expiryDate || ''}
          onChangeText={(t) => setInsurance({ ...insurance, expiryDate: t })}
        />

        <HealthInput
          label="Cashless TPA Helpdesk Phone"
          placeholder="e.g. 1800-102-4477"
          value={insurance.tpaContact || ''}
          onChangeText={(t) => setInsurance({ ...insurance, tpaContact: t })}
          keyboardType="phone-pad"
        />

        <PrimaryButton title="Save Insurance Details" onPress={handleSave} loading={saving} />
      </Card>
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
  policyCard: {
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  providerName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.black,
    color: colors.heading,
  },
});
