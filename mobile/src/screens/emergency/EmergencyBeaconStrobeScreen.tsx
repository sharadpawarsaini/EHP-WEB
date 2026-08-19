import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Vibration,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function EmergencyBeaconStrobeScreen({ navigation }: any) {
  const [strobeActive, setStrobeActive] = useState(true);
  const [strobeColor, setStrobeColor] = useState('#ffffff');
  const [pattern, setPattern] = useState<'SOS' | 'FAST' | 'SOLID'>('SOS');
  const flashAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let interval: any;
    if (strobeActive) {
      let count = 0;
      interval = setInterval(() => {
        count = (count + 1) % 4;
        const color = count % 2 === 0 ? '#e11d48' : '#ffffff';
        setStrobeColor(color);

        Animated.sequence([
          Animated.timing(flashAnim, {
            toValue: 0.1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(flashAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();

        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          Vibration.vibrate(50);
        }
      }, pattern === 'FAST' ? 150 : pattern === 'SOS' ? 300 : 800);
    }
    return () => clearInterval(interval);
  }, [strobeActive, pattern]);

  const callAmbulance = () => {
    Linking.openURL('tel:108');
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: strobeColor, opacity: flashAnim }]}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🚨 EMERGENCY VISUAL BEACON</Text>
      </View>

      {/* Main Flash Center */}
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons name="car-emergency" size={90} color="#0f172a" />
        <Text style={styles.strobeStatus}>
          {strobeActive ? 'VISUAL STROBE SIGNALING' : 'STROBE PAUSED'}
        </Text>
        <Text style={styles.strobeDesc}>
          Hold phone facing oncoming traffic or rescue helicopters to mark your accident location.
        </Text>
      </View>

      {/* Pattern Selector Pills */}
      <View style={styles.pillRow}>
        {(['SOS', 'FAST', 'SOLID'] as const).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.pill, pattern === p && styles.pillActive]}
            onPress={() => setPattern(p)}
          >
            <Text style={[styles.pillText, pattern === p && styles.pillTextActive]}>
              {p} MODE
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Emergency Speed Dial */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.strobeToggleBtn, { backgroundColor: strobeActive ? '#0f172a' : '#2563eb' }]}
          onPress={() => setStrobeActive(!strobeActive)}
        >
          <Text style={styles.strobeToggleText}>
            {strobeActive ? 'PAUSE STROBE' : 'START STROBE'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.call108Btn} onPress={callAmbulance}>
          <Ionicons name="call" size={20} color="#ffffff" />
          <Text style={styles.call108Text}>CALL 108 AMBULANCE</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  headerTitle: {
    color: '#0f172a',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  centerContainer: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  strobeStatus: {
    color: '#0f172a',
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  strobeDesc: {
    color: '#334155',
    fontSize: fontSize.xs,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: fontWeight.bold,
  },
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
  },
  pillActive: {
    backgroundColor: '#0f172a',
  },
  pillText: {
    color: '#0f172a',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  pillTextActive: {
    color: '#ffffff',
  },
  bottomBar: {
    gap: spacing.sm,
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  strobeToggleBtn: {
    paddingVertical: 14,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  strobeToggleText: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  call108Btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e11d48',
    paddingVertical: 14,
    borderRadius: radius.xl,
    gap: spacing.xs,
    elevation: 4,
  },
  call108Text: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
});
