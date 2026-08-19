import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Vibration,
  Platform,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Card, SectionHeader, Badge, PrimaryButton } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function FirstAidGuidesScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [cprRunning, setCprRunning] = useState(false);
  const [cprBpm] = useState(110);
  const heartAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let interval: any;
    if (cprRunning) {
      interval = setInterval(() => {
        Animated.sequence([
          Animated.timing(heartAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
          Animated.timing(heartAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();

        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          Vibration.vibrate(40);
        }
      }, (60 / cprBpm) * 1000);
    }
    return () => clearInterval(interval);
  }, [cprRunning]);

  const GUIDES = [
    {
      title: 'Adult CPR (Cardiopulmonary Resuscitation)',
      icon: 'heart-pulse',
      steps: [
        '1. Check responsiveness and call 108 immediately.',
        '2. Place hands in center of chest between nipples.',
        '3. Push hard and fast at 100-120 beats per minute (use metronome below).',
        '4. Allow chest to fully recoil between each compression.',
      ],
    },
    {
      title: 'Choking (Heimlich Maneuver)',
      icon: 'account-alert',
      steps: [
        '1. Stand behind the person and lean them slightly forward.',
        '2. Make a fist with one hand above their navel.',
        '3. Grasp your fist with the other hand and perform quick upward thrusts.',
        '4. Repeat until the foreign airway object is expelled.',
      ],
    },
    {
      title: 'Severe Bleeding & Hemorrhage Control',
      icon: 'water-alert',
      steps: [
        '1. Apply direct firm pressure with a clean cloth or bandage.',
        '2. Elevate the injured limb above heart level if no fracture.',
        '3. Do not remove saturated bandages—add more layers on top.',
        '4. Apply a tourniquet 2-3 inches above the wound if bleeding is uncontrollable.',
      ],
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      <SectionHeader
        title="First Aid & CPR Metronome"
        subtitle="Offline lifesaving emergency protocols"
        icon={<MaterialCommunityIcons name="medical-bag" size={24} color={theme.danger} />}
      />

      {/* CPR Metronome Interactive Card */}
      <Card style={styles.cprCard}>
        <View style={styles.cprTop}>
          <Text style={[styles.cprTitle, { color: theme.heading }]}>CPR Compression Rhythm Metronome</Text>
          <Badge label="110 BPM Tempo" color="red" />
        </View>

        <Animated.View style={[styles.cprHeart, { transform: [{ scale: heartAnim }] }]}>
          <MaterialCommunityIcons name="heart-flash" size={60} color="#e11d48" />
        </Animated.View>

        <Text style={[styles.cprBeatLabel, { color: theme.muted }]}>
          {cprRunning ? 'Compress on every beat • 2 inches deep' : 'Press Start to begin 110 BPM compression tempo'}
        </Text>

        <PrimaryButton
          title={cprRunning ? 'Stop Metronome' : 'Start 110 BPM CPR Metronome'}
          onPress={() => setCprRunning(!cprRunning)}
          style={{ backgroundColor: cprRunning ? '#0f172a' : '#e11d48' }}
        />
      </Card>

      {/* Emergency First Aid Guides */}
      {GUIDES.map((g, i) => (
        <Card key={i} style={styles.guideCard}>
          <View style={styles.guideTop}>
            <MaterialCommunityIcons name={g.icon as any} size={24} color={theme.primary} />
            <Text style={[styles.guideTitle, { color: theme.heading }]}>{g.title}</Text>
          </View>
          {g.steps.map((s, idx) => (
            <Text key={idx} style={[styles.stepText, { color: theme.body }]}>
              {s}
            </Text>
          ))}
        </Card>
      ))}
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
  cprCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderColor: '#fecdd3',
  },
  cprTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cprTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  cprHeart: {
    marginVertical: spacing.md,
  },
  cprBeatLabel: {
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  guideCard: {
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  guideTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  guideTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  stepText: {
    fontSize: fontSize.xs,
    lineHeight: 18,
    marginBottom: 4,
  },
});
