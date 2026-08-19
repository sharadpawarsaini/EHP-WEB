import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Share,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Card, SectionHeader, Badge, PrimaryButton, SecondaryButton } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight, shadows } from '../../utils/theme';

const { width } = Dimensions.get('window');

export default function DigitalWalletCardScreen({ navigation }: any) {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();

  const [profile, setProfile] = useState<any>(null);
  const [medical, setMedical] = useState<any>(null);
  const [emergencySlug, setEmergencySlug] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  // 3D Flip Animation
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      try {
        const [profRes, medRes, linkRes] = await Promise.allSettled([
          api.get('/profile'),
          api.get('/medical'),
          api.get('/emergency/link'),
        ]);

        if (profRes.status === 'fulfilled') setProfile(profRes.value.data);
        if (medRes.status === 'fulfilled') setMedical(medRes.value.data);
        if (linkRes.status === 'fulfilled') {
          setEmergencySlug(linkRes.value.data?.slug || linkRes.value.data?.publicUrl || '');
        }
      } catch (e) {
        console.log('Wallet card fetch error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const flipCard = () => {
    if (isFlipped) {
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setIsFlipped(false);
    } else {
      Animated.spring(animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setIsFlipped(true);
    }
  };

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = animatedValue.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity = animatedValue.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  const emergencyUrl = `https://ehp.health/em/${emergencySlug || 'user_token'}`;

  const shareCard = () => {
    Share.share({
      title: 'EHP Digital Medical Wallet Card',
      message: `🪪 EHP Emergency Health Card for ${profile?.fullName || 'Patient'}\nBlood Type: ${profile?.bloodGroup || 'UNK'}\nEmergency URL: ${emergencyUrl}`,
      url: emergencyUrl,
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      <SectionHeader
        title="Digital Wallet Card"
        subtitle="Tap card to flip front / back"
        icon={<MaterialCommunityIcons name="wallet-membership" size={24} color={theme.primary} />}
      />

      {/* Interactive 3D Flippable Wallet Pass */}
      <TouchableOpacity activeOpacity={0.95} onPress={flipCard} style={styles.cardContainer}>
        {/* FRONT OF CARD */}
        <Animated.View
          style={[
            styles.cardFace,
            shadows.lg,
            {
              transform: [{ rotateY: frontInterpolate }],
              opacity: frontOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={isDark ? ['#1e293b', '#0f172a', '#0a0f1d'] : ['#2563eb', '#1d4ed8', '#0284c7']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.cardGradient}
          >
            {/* Holographic Header */}
            <View style={styles.cardTop}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialCommunityIcons name="shield-cross" size={28} color="#ffffff" />
                <View>
                  <Text style={styles.cardBrand}>EHP EMERGENCY ID</Text>
                  <Text style={styles.cardSubBrand}>NATIONAL HEALTH LIFE-LINK</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="contactless-payment" size={32} color="rgba(255,255,255,0.8)" />
            </View>

            {/* Patient Identity Section */}
            <View style={styles.cardBody}>
              <View style={styles.avatarBox}>
                <Text style={styles.avatarInitial}>
                  {(profile?.fullName || user?.email || 'P')[0].toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.patientName} numberOfLines={1}>
                  {profile?.fullName || 'Valued Patient'}
                </Text>
                <Text style={styles.patientId}>
                  ID: EHP-{(profile?._id || '987654').slice(-8).toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Critical Telemetry Footer */}
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.footerLabel}>BLOOD GROUP</Text>
                <Text style={styles.footerVal}>{profile?.bloodGroup || 'UNKNOWN'}</Text>
              </View>

              <View>
                <Text style={styles.footerLabel}>PRIMARY CONTACT</Text>
                <Text style={styles.footerVal}>
                  {profile?.emergencyContact ? `📞 ${profile.emergencyContact}` : 'Not listed'}
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.footerLabel}>TAP TO FLIP</Text>
                <MaterialCommunityIcons name="rotate-3d-variant" size={20} color="#ffffff" />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* BACK OF CARD */}
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardBack,
            shadows.lg,
            {
              transform: [{ rotateY: backInterpolate }],
              opacity: backOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={isDark ? ['#0f172a', '#131d31', '#1e293b'] : ['#0284c7', '#0369a1', '#1e40af']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.cardGradient}
          >
            {/* Back Header */}
            <View style={styles.cardTop}>
              <Text style={styles.cardBrand}>PARAMEDIC EMERGENCY QR</Text>
              <Badge label="AES-256 Verified" color="green" />
            </View>

            {/* Back Body: QR & Medical Directive */}
            <View style={styles.backBody}>
              <View style={styles.backQrBox}>
                <QRCode value={emergencyUrl} size={88} color="#0f172a" backgroundColor="#ffffff" />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.backSectionHeading}>🚨 SEVERE ALLERGIES</Text>
                <Text style={styles.backSectionText} numberOfLines={2}>
                  {medical?.allergies && medical.allergies.length > 0
                    ? medical.allergies.join(', ')
                    : 'No severe allergies reported'}
                </Text>

                <Text style={[styles.backSectionHeading, { marginTop: 4 }]}>🩺 CONDITIONS</Text>
                <Text style={styles.backSectionText} numberOfLines={2}>
                  {medical?.conditions && medical.conditions.length > 0
                    ? medical.conditions.join(', ')
                    : 'None logged'}
                </Text>
              </View>
            </View>

            {/* Back Footer */}
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.footerLabel}>ORGAN DONOR</Text>
                <Text style={styles.footerVal}>{medical?.organDonor ? 'YES (PLEDGED)' : 'NO'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.footerLabel}>TAP TO FLIP</Text>
                <MaterialCommunityIcons name="rotate-3d-variant" size={20} color="#ffffff" />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>

      {/* Card Instruction Note */}
      <Text style={[styles.flipHint, { color: theme.muted }]}>
        👆 Tap the card above to flip between Identity & Medical QR sides
      </Text>

      {/* Action Buttons */}
      <View style={styles.actionStack}>
        <PrimaryButton
          title="Share Digital Health Pass"
          onPress={shareCard}
          icon={<Ionicons name="share-social" size={18} color="#ffffff" />}
        />

        <SecondaryButton
          title="Write to NFC Smart Band"
          onPress={() => navigation.navigate('NFCTag')}
          icon={<MaterialCommunityIcons name="nfc" size={18} color={theme.primary} />}
        />

        <SecondaryButton
          title="Configure Face ID Vault Lock"
          onPress={() => navigation.navigate('FaceIDEnrollment')}
          icon={<MaterialCommunityIcons name="face-recognition" size={18} color={theme.primary} />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 80,
  },
  cardContainer: {
    height: 240,
    marginVertical: spacing.md,
  },
  cardFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius['3xl'],
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
    top: 0,
  },
  cardGradient: {
    flex: 1,
    borderRadius: radius['3xl'],
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrand: {
    color: '#ffffff',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.5,
  },
  cardSubBrand: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 8,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.xs,
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#ffffff',
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  patientName: {
    color: '#ffffff',
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  patientId: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: spacing.xs,
  },
  footerLabel: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 8,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
  },
  footerVal: {
    color: '#ffffff',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    marginTop: 2,
  },
  backBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backQrBox: {
    backgroundColor: '#ffffff',
    padding: 6,
    borderRadius: radius.lg,
  },
  backSectionHeading: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
  },
  backSectionText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    lineHeight: 14,
  },
  flipHint: {
    textAlign: 'center',
    fontSize: fontSize.xs,
    marginBottom: spacing.lg,
    fontWeight: fontWeight.bold,
  },
  actionStack: {
    gap: spacing.sm,
  },
});
