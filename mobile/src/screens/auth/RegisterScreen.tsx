import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { HealthInput, PrimaryButton, Card } from '../../components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '../../utils/theme';

export default function RegisterScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required', 'Please provide an email and password.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Security', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        email: email.trim().toLowerCase(),
        password,
        fullName: fullName.trim(),
        bloodGroup: bloodGroup.trim().toUpperCase(),
        phone: phone.trim(),
      });

      if (response.data) {
        await login(response.data);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#2563eb', '#0284c7']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.logoBadge}
          >
            <MaterialCommunityIcons name="account-plus" size={36} color="#ffffff" />
          </LinearGradient>
          <Text style={styles.title}>Join EHP Network</Text>
          <Text style={styles.subtitle}>Create your Life-Link Emergency Profile</Text>
        </View>

        <Card style={styles.authCard}>
          <Text style={styles.cardHeader}>New Member Registration</Text>
          <Text style={styles.cardSubtext}>Store vital records & generate your instant QR code</Text>

          <HealthInput
            label="Full Name"
            placeholder="e.g. Sharad Saini"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          <HealthInput
            label="Email Address"
            placeholder="name@domain.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.rowInputs}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <HealthInput
                label="Blood Group"
                placeholder="e.g. O+, A-, B+"
                value={bloodGroup}
                onChangeText={setBloodGroup}
                autoCapitalize="characters"
              />
            </View>
            <View style={{ flex: 1 }}>
              <HealthInput
                label="Phone Number"
                placeholder="+91 9876543210"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <HealthInput
            label="Create Password"
            placeholder="Minimum 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <HealthInput
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <PrimaryButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerBtn}
          />
        </Card>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already registered? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Log in here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoBadge: {
    width: 70,
    height: 70,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    elevation: 4,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.heading,
  },
  subtitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.muted,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  authCard: {
    padding: spacing.xl,
    borderRadius: radius['3xl'],
  },
  cardHeader: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.heading,
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: fontSize.xs,
    color: colors.body,
    marginBottom: spacing.lg,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  registerBtn: {
    marginTop: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.body,
  },
  loginLink: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
});
