import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { radius, fontSize, fontWeight, spacing } from '../utils/theme';

const { width, height } = Dimensions.get('window');

export default function ModernSplashScreen({ onFinish }: { onFinish: () => void }) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Intro zoom & fade-in
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse loop for Life-Link glow
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    // Fade out after 2 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeOutAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        pulse.stop();
        onFinish();
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeOutAnim }]}>
      <LinearGradient
        colors={['#0a0f1d', '#0f172a', '#1e293b']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.gradient}
      >
        {/* Glow Ring Behind Shield */}
        <Animated.View
          style={[
            styles.glowRing,
            {
              transform: [{ scale: pulseAnim }],
              opacity: 0.35,
            },
          ]}
        />

        {/* Animated Main Shield Logo */}
        <Animated.View
          style={[
            styles.logoBox,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#2563eb', '#38bdf8']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.shieldGradient}
          >
            <MaterialCommunityIcons name="shield-cross" size={64} color="#ffffff" />
          </LinearGradient>
        </Animated.View>

        {/* Brand Titles */}
        <Animated.View style={[styles.textBlock, { opacity: opacityAnim }]}>
          <Text style={styles.brandTitle}>EHP</Text>
          <Text style={styles.brandSubtitle}>EMERGENCY HEALTH PROFILE</Text>
          <View style={styles.pillBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.pillText}>LIFE-LINK MEDICAL PROTOCOL</Text>
          </View>
        </Animated.View>

        {/* Bottom Decryption Telemetry */}
        <Animated.View style={[styles.bottomBar, { opacity: opacityAnim }]}>
          <Text style={styles.decryptionNote}>
            AES-256 Encrypted • Zero-Latency Paramedic Decryption
          </Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  glowRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#0284c7',
  },
  logoBox: {
    marginBottom: spacing.xl,
  },
  shieldGradient: {
    width: 120,
    height: 120,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
  },
  textBlock: {
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    letterSpacing: 4,
  },
  brandSubtitle: {
    color: '#94a3b8',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 2,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderColor: '#38bdf8',
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    gap: 6,
    marginTop: spacing.sm,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34d399',
  },
  pillText: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  decryptionNote: {
    color: '#64748b',
    fontSize: 10,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
