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

export default function FamilyScreen() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Child');
  const [bloodGroup, setBloodGroup] = useState('');
  const [age, setAge] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFamily();
  }, []);

  const fetchFamily = async () => {
    try {
      const res = await api.get('/family');
      setMembers(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter member name.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/family', {
        name: name.trim(),
        relation,
        bloodGroup: bloodGroup.trim().toUpperCase(),
        age: age ? Number(age) : undefined,
      });

      setName('');
      setBloodGroup('');
      setAge('');
      setShowAdd(false);
      fetchFamily();
      Alert.alert('Saved', 'Family member profile linked.');
    } catch (e) {
      Alert.alert('Error', 'Failed to add family member.');
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
        title="Family Members Hub"
        subtitle="Manage dependent children & elderly profiles"
        icon={<MaterialCommunityIcons name="account-group" size={24} color={colors.primary} />}
      />

      <TouchableOpacity
        style={styles.toggleAddBtn}
        onPress={() => setShowAdd(!showAdd)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name={showAdd ? 'close' : 'account-plus'} size={20} color="#ffffff" />
        <Text style={styles.toggleAddText}>{showAdd ? 'Close' : 'Add Dependent Profile'}</Text>
      </TouchableOpacity>

      {showAdd && (
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>New Family Member</Text>
          <HealthInput
            label="Full Name"
            placeholder="e.g. Aarav Saini"
            value={name}
            onChangeText={setName}
          />
          <HealthInput
            label="Relationship"
            placeholder="e.g. Son, Daughter, Mother, Father"
            value={relation}
            onChangeText={setRelation}
          />
          <HealthInput
            label="Blood Group"
            placeholder="e.g. B+, O-"
            value={bloodGroup}
            onChangeText={setBloodGroup}
            autoCapitalize="characters"
          />
          <HealthInput
            label="Age"
            placeholder="e.g. 8"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
          <PrimaryButton title="Save Family Member" onPress={handleAddMember} loading={submitting} />
        </Card>
      )}

      {members.length > 0 ? (
        members.map((mem) => (
          <Card key={mem._id} style={styles.memberCard}>
            <View style={styles.memberRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>{mem.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.memberName}>{mem.name}</Text>
                <Text style={styles.memberRelation}>{mem.relation} {mem.age ? `• ${mem.age} yrs` : ''}</Text>
              </View>
              {mem.bloodGroup && <Badge label={mem.bloodGroup} color="red" />}
            </View>
          </Card>
        ))
      ) : (
        <EmptyState
          icon={<MaterialCommunityIcons name="account-group-outline" size={48} color={colors.muted} />}
          title="No Family Members Linked"
          subtitle="Manage healthcare records and emergency cards for your family from one master account."
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
  memberCard: {
    padding: spacing.md,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.black,
    color: colors.primary,
  },
  memberName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.black,
    color: colors.heading,
  },
  memberRelation: {
    fontSize: fontSize.xs,
    color: colors.muted,
  },
});
