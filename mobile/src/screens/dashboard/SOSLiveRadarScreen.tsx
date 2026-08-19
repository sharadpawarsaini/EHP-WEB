import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { Card, Badge, PrimaryButton } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function SOSLiveRadarScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.25, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const ACTIVE_BEACONS = [
    { id: '1', name: 'Patient Beacon #8492', distance: '0.8 km away', eta: '4 mins', status: 'En Route', type: 'Cardiac Alert' },
    { id: '2', name: 'Elderly Fall Beacon #1029', distance: '2.1 km away', eta: '8 mins', status: 'Dispatched', type: 'Trauma Fall' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Radar */}
      <LinearGradient
        colors={isDark ? ['#1e1b4b', '#0f172a'] : ['#2563eb', '#1d4ed8']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.hero}
      >
        <Animated.View style={[styles.radarCircle, { transform: [{ scale: pulseAnim }] }]}>
          <MaterialCommunityIcons name="radar" size={48} color="#38bdf8" />
        </Animated.View>
        <Text style={styles.heroTitle}>Live Paramedic Radar</Text>
        <Text style={styles.heroSub}>
          Real-time GPS geofence monitoring & emergency responder telemetry
        </Text>
      </LinearGradient>

      <Text style={[styles.sectionLabel, { color: theme.muted }]}>ACTIVE AMBULANCE & DISPATCH RADAR</Text>

      {ACTIVE_BEACONS.map((beacon) => (
        <Card key={beacon.id} style={styles.beaconCard}>
          <View style={styles.beaconTop}>
            <View style={styles.beaconLeft}>
              <Text style={[styles.beaconName, { color: theme.heading }]}>{beacon.name}</Text>
              <Text style={[styles.beaconType, { color: theme.danger }]}>🚨 {beacon.type}</Text>
            </View>
            <Badge label={beacon.status} color="green" />
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="map-marker-distance" size={16} color={theme.muted} />
              <Text style={[styles.metaText, { color: theme.muted }]}>{beacon.distance}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="timer-sand" size={16} color={theme.primary} />
              <Text style={[styles.metaText, { color: theme.primary, fontWeight: 'bold' }]}>
                ETA: {beacon.eta}
              </Text>
            </View>
          </View>
        </Card>
      ))}

      <Card style={{ marginTop: spacing.md }}>
        <Text style={[styles.cardTitle, { color: theme.heading }]}>Personal Geofence Boundary</Text>
        <Text style={[styles.cardSub, { color: theme.muted }]}>
          Radius: 5.0 km • Coordinates: 12.9716° N, 77.5946° E • Status: Protected
        </Text>
        <PrimaryButton
          title="Open SOS Emergency Beacon"
          onPress={() => navigation.navigate('SOSBeacon')}
          style={{ backgroundColor: '#e11d48', marginTop: spacing.sm }}
        />
      </Card>
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
  radarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 2,
    borderColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
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
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  beaconCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  beaconTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  beaconLeft: { gap: 2 },
  beaconName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  beaconType: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
    paddingTop: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: { fontSize: fontSize.xs },
  cardTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: fontSize.xs,
    lineHeight: 18,
  },
});
