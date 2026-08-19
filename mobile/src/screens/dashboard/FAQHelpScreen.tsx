import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function FAQHelpScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const FAQS = [
    {
      q: 'How do first responders access my data in an emergency?',
      a: 'Paramedics and ER staff can scan your physical NFC card, digital wallet pass, or emergency QR code without needing your phone password. Only life-critical details (blood group, allergies, donor status, emergency contacts) are shown.',
    },
    {
      q: 'Is my health information stored securely?',
      a: 'Yes. All data is encrypted using military-grade AES-256 encryption both in transit and at rest. Your private documents are stored in zero-knowledge client-side encrypted vaults.',
    },
    {
      q: 'How does Face ID biometric login work on mobile?',
      a: 'When you scan your face or fingerprint, your session token is bound to your phone’s secure hardware enclave (SecureStore). Once enrolled, you can enter the app in milliseconds without retyping passwords.',
    },
    {
      q: 'What should I do if my phone is lost or stolen?',
      a: 'Log in from another device or web browser and navigate to Settings → Lockdown to instantly freeze all QR fast-paths and prevent unauthorized access to your records.',
    },
    {
      q: 'Can I manage health records for my entire family?',
      a: 'Yes! The Family Emergency Hub allows you to create separate profiles for your children, spouse, and elderly parents with individual QR emergency codes.',
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={isDark ? ['#0a1628', '#0f2040'] : ['#2563eb', '#0284c7']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.hero}
      >
        <MaterialCommunityIcons name="help-circle-outline" size={36} color="#ffffff" style={{ marginBottom: 6 }} />
        <Text style={styles.heroTitle}>Help Center & FAQ</Text>
        <Text style={styles.heroSub}>Frequently asked questions about EHP emergency protocols</Text>
      </LinearGradient>

      {FAQS.map((faq, index) => {
        const isExpanded = expandedIndex === index;
        return (
          <Card key={index} style={styles.faqCard}>
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => setExpandedIndex(isExpanded ? null : index)}
              activeOpacity={0.7}
            >
              <Text style={[styles.faqQuestion, { color: theme.heading }]}>{faq.q}</Text>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={theme.primary}
              />
            </TouchableOpacity>
            {isExpanded && (
              <Text style={[styles.faqAnswer, { color: theme.muted }]}>{faq.a}</Text>
            )}
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 80,
  },
  hero: {
    borderRadius: radius['3xl'],
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  heroSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: 4,
  },
  faqCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  faqQuestion: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    flex: 1,
    lineHeight: 20,
  },
  faqAnswer: {
    fontSize: fontSize.xs,
    lineHeight: 18,
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
  },
});
