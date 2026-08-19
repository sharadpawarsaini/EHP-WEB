import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import api from '../../api/api';
import { Card, SectionHeader, Badge } from '../../components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '../../utils/theme';

export default function EmergencyCardScreen({ route, navigation }: any) {
  const { slug } = route.params || {};
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmergencyData();
  }, [slug]);

  const fetchEmergencyData = async () => {
    if (!slug) {
      setError('Invalid emergency token.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/emergency/public/${slug}`);
      setData(response.data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setData(err.response.data);
      } else {
        setError('Emergency profile not found or expired.');
      }
    } finally {
      setLoading(false);
    }
  };

  const callContact = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.danger} />
        <Text style={styles.decryptingText}>Decrypting Life-Link Protocol...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons name="shield-alert" size={56} color={colors.danger} />
        <Text style={styles.errorTitle}>Emergency Link Unavailable</Text>
        <Text style={styles.errorSub}>{error}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const profile = data.profile || {};
  const medical = data.medical || {};
  const contacts = data.contacts || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Emergency Header Bar */}
      <LinearGradient
        colors={['#e11d48', '#be123c']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.emergencyHeader}
      >
        <View style={styles.headerTop}>
          <MaterialCommunityIcons name="alert-decagram" size={24} color="#ffffff" />
          <Text style={styles.headerProtocol}>EHP LIFE-LINK EMERGENCY</Text>
        </View>
        <Text style={styles.patientName}>{profile.fullName || 'Unknown Patient'}</Text>
        <Text style={styles.tokenSub}>Token: {slug}</Text>
      </LinearGradient>

      {/* Critical Vitals Banner */}
      <View style={styles.bloodTypeCard}>
        <View style={styles.bloodTypeIcon}>
          <MaterialCommunityIcons name="water" size={32} color={colors.danger} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bloodGroupLabel}>Blood Group</Text>
          <Text style={styles.bloodGroupVal}>{profile.bloodGroup || 'UNKNOWN'}</Text>
        </View>
        {medical.organDonor && <Badge label="Organ Donor" color="red" />}
      </View>

      {/* Severe Allergies */}
      <Card style={styles.medicalCard}>
        <Text style={styles.cardSectionHeading}>🚨 Severe Allergies</Text>
        {medical.allergies && medical.allergies.length > 0 ? (
          <View style={styles.tagGrid}>
            {medical.allergies.map((a: string, i: number) => (
              <Badge key={i} label={a} color="red" />
            ))}
          </View>
        ) : (
          <Text style={styles.emptyNote}>No known allergies</Text>
        )}
      </Card>

      {/* Chronic Conditions */}
      <Card style={styles.medicalCard}>
        <Text style={styles.cardSectionHeading}>🩺 Chronic Conditions</Text>
        {medical.conditions && medical.conditions.length > 0 ? (
          <View style={styles.tagGrid}>
            {medical.conditions.map((c: string, i: number) => (
              <Badge key={i} label={c} color="blue" />
            ))}
          </View>
        ) : (
          <Text style={styles.emptyNote}>No chronic conditions logged</Text>
        )}
      </Card>

      {/* Emergency Contacts with 1-Tap Dial */}
      <SectionHeader title="Emergency Contacts" subtitle="One-tap priority calling" />
      {contacts.length > 0 ? (
        contacts.map((contact: any, i: number) => (
          <Card key={i} style={styles.contactCard}>
            <View style={styles.contactRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRel}>{contact.relation || 'Emergency Contact'}</Text>
                <Text style={styles.contactPhone}>📞 {contact.phone}</Text>
              </View>
              <TouchableOpacity
                style={styles.callNowBtn}
                onPress={() => callContact(contact.phone)}
              >
                <Ionicons name="call" size={18} color="#ffffff" />
                <Text style={styles.callNowText}>Call</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))
      ) : profile.emergencyContact ? (
        <Card style={styles.contactCard}>
          <View style={styles.contactRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>Primary Emergency Contact</Text>
              <Text style={styles.contactPhone}>📞 {profile.emergencyContact}</Text>
            </View>
            <TouchableOpacity
              style={styles.callNowBtn}
              onPress={() => callContact(profile.emergencyContact)}
            >
              <Ionicons name="call" size={18} color="#ffffff" />
              <Text style={styles.callNowText}>Call</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ) : (
        <Text style={styles.emptyNote}>No emergency contacts listed</Text>
      )}

      {/* Special Medical Directive */}
      {medical.digitalDirective ? (
        <Card style={styles.directiveCard}>
          <Text style={styles.directiveHeading}>Special Medical Instructions / DNR</Text>
          <Text style={styles.directiveContent}>"{medical.digitalDirective}"</Text>
        </Card>
      ) : null}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgLight,
    padding: spacing.xl,
  },
  decryptingText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.danger,
    marginTop: spacing.md,
  },
  errorTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.heading,
    marginTop: spacing.md,
  },
  errorSub: {
    fontSize: fontSize.xs,
    color: colors.muted,
    marginTop: 4,
    textAlign: 'center',
  },
  backBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl,
  },
  backBtnText: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  emergencyHeader: {
    borderRadius: radius['3xl'],
    padding: spacing.xl,
    marginBottom: spacing.md,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  headerProtocol: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.5,
  },
  patientName: {
    color: '#ffffff',
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
  },
  tokenSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 4,
  },
  bloodTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: '#fecdd3',
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    gap: spacing.md,
  },
  bloodTypeIcon: {
    width: 54,
    height: 54,
    borderRadius: radius.xl,
    backgroundColor: '#fff1f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodGroupLabel: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.muted,
    textTransform: 'uppercase',
  },
  bloodGroupVal: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.danger,
  },
  medicalCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardSectionHeading: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.heading,
    marginBottom: spacing.sm,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  emptyNote: {
    fontSize: fontSize.xs,
    color: colors.muted,
    fontStyle: 'italic',
  },
  contactCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.heading,
  },
  contactRel: {
    fontSize: fontSize.xs,
    color: colors.muted,
  },
  contactPhone: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginTop: 2,
  },
  callNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    gap: 4,
  },
  callNowText: {
    color: '#ffffff',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  directiveCard: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  directiveHeading: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.warning,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  directiveContent: {
    fontSize: fontSize.sm,
    color: colors.heading,
    fontStyle: 'italic',
  },
});
