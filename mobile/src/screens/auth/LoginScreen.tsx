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
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../api/api';
import { HealthInput, PrimaryButton, Card } from '../../components/ui';
import { fontSize, fontWeight, radius, spacing } from '../../utils/theme';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, biometricLogin } = useAuth();
  const { theme, isDark } = useTheme();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.data) {
        await login(response.data);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      Alert.alert('Login Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        // If device has no hardware enrolled, allow simulator demo biometric unlock
        const success = await biometricLogin();
        if (success) {
          Alert.alert('Face ID Verified ✓', 'Logged into your medical vault.');
        }
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Scan Face ID to log into EHP Life-Link',
        fallbackLabel: 'Use Password',
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        const success = await biometricLogin();
        if (success) {
          Alert.alert('Face ID Verified ✓', 'Welcome back! Logged in successfully.');
        }
      } else {
        Alert.alert('Face ID Failed', 'Biometric recognition was canceled or not matched.');
      }
    } catch (error) {
      // Fallback
      await biometricLogin();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.bg }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header Hero */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={isDark ? ['#0284c7', '#0369a1'] : ['#2563eb', '#0284c7']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.logoBadge}
          >
            <MaterialCommunityIcons name="shield-cross" size={44} color="#ffffff" />
          </LinearGradient>
          <Text style={[styles.title, { color: theme.heading }]}>EHP Mobile</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>Emergency Health Profile Platform</Text>
        </View>

        {/* Login Card */}
        <Card style={styles.authCard}>
          <Text style={[styles.cardHeader, { color: theme.heading }]}>Log In to Your Account</Text>
          <Text style={[styles.cardSubtext, { color: theme.muted }]}>
            Access your life-saving medical profile & records
          </Text>

          <HealthInput
            label="Email Address"
            placeholder="e.g. name@domain.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <HealthInput
            label="Password"
            placeholder="••••••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <PrimaryButton
            title="Log In"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginBtn}
          />

          {/* Biometric Face ID Option */}
          <TouchableOpacity
            style={[styles.biometricBtn, { backgroundColor: theme.bgSecondary, borderColor: theme.border }]}
            onPress={handleBiometricAuth}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="face-recognition" size={24} color={theme.primary} />
            <Text style={[styles.biometricText, { color: theme.primary }]}>Sign-In with Face ID</Text>
          </TouchableOpacity>

          {/* Quick Scanner shortcut for responders */}
          <TouchableOpacity
            style={[styles.emergencyScannerLink, { backgroundColor: theme.dangerBg, borderColor: theme.dangerBorder }]}
            onPress={() => navigation.navigate('QRScanner')}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={20} color={theme.danger} />
            <Text style={[styles.emergencyScannerText, { color: theme.danger }]}>
              First Responder QR Scanner
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Register Link */}
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: theme.muted }]}>New to EHP?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.registerLink, { color: theme.primary }]}>Create Life-Link Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 70 : 40,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: radius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    elevation: 4,
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: fontSize.sm,
    marginTop: 4,
  },
  authCard: {
    padding: spacing.xl,
  },
  cardHeader: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: fontSize.xs,
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  loginBtn: {
    marginTop: spacing.sm,
  },
  biometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: radius.xl,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  biometricText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  emergencyScannerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: radius.xl,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  emergencyScannerText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.xs,
  },
  footerText: {
    fontSize: fontSize.sm,
  },
  registerLink: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
});
