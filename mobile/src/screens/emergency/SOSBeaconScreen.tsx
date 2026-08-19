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
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Card, Badge, PrimaryButton, SecondaryButton } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';
import api from '../../api/api';

export default function SOSBeaconScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [countdown, setCountdown] = useState(5);
  const [sosActive, setSosActive] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const [location, setLocation] = useState({
    lat: '28.6139° N',
    lng: '77.2090° E',
    accuracy: '±4 meters',
    timestamp: new Date().toLocaleTimeString(),
  });

  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for beacon siren
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Countdown timer
  useEffect(() => {
    let timer: any;
    if (countdown > 0 && !sosActive) {
      timer = setTimeout(() => {
        setCountdown((c) => c - 1);
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          Vibration.vibrate(100);
        }
      }, 1000);
    } else if (countdown === 0 && !sosActive) {
      triggerSOSDispatch();
    }
    return () => clearTimeout(timer);
  }, [countdown, sosActive]);

  const triggerSOSDispatch = async () => {
    setSosActive(true);
    setDispatched(true);
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      Vibration.vibrate([200, 300, 200, 500]);
    }
    try {
      await api.post('/emergency/sos-broadcast', {
        lat: location.lat,
        lng: location.lng,
        accuracy: location.accuracy,
      });
    } catch (e) {
      console.log('SOS simulated broadcast logged');
    }
  };

  const cancelCountdown = () => {
    setCountdown(-1);
    navigation.goBack();
  };

  const callAmbulance = () => {
    Linking.openURL('tel:108');
  };

  const callNationalEmergency = () => {
    Linking.openURL('tel:112');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      {/* Beacon Pulse Ring */}
      <View style={styles.beaconCenter}>
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: pulseAnim }],
              borderColor: sosActive ? '#f43f5e' : '#e11d48',
            },
          ]}
        />
        <LinearGradient
          colors={['#e11d48', '#9f1239']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.sosCore}
        >
          <MaterialCommunityIcons name="broadcast" size={48} color="#ffffff" />
          <Text style={styles.sosTitle}>
            {dispatched ? 'SOS ACTIVE' : `BROADCASTING IN ${countdown}s`}
          </Text>
        </LinearGradient>
      </View>

      {/* Status Warning Card */}
      <Card style={styles.alertCard}>
        <View style={styles.cardHeaderRow}>
          <MaterialCommunityIcons name="shield-alert" size={24} color={theme.danger} />
          <Text style={[styles.alertTitle, { color: theme.danger }]}>
            {dispatched ? 'Emergency Broadcast Dispatched' : 'Life-Link Alert Countdown'}
          </Text>
        </View>
        <Text style={[styles.alertDescription, { color: theme.body }]}>
          {dispatched
            ? 'Your GPS location, emergency medical profile, blood type, and allergy alerts have been broadcasted to local emergency networks and priority contacts.'
            : 'Tap Cancel immediately if this was triggered accidentally. Paramedics and emergency contacts will receive your location automatically.'}
        </Text>
      </Card>

      {/* Live GPS Telemetry Box */}
      <Card style={styles.telemetryCard}>
        <Text style={[styles.telemetryHeader, { color: theme.muted }]}>
          📡 Live Emergency Telemetry
        </Text>
        <View style={styles.telemetryRow}>
          <View style={styles.telemetryCol}>
            <Text style={[styles.telemetryLabel, { color: theme.muted }]}>LATITUDE</Text>
            <Text style={[styles.telemetryVal, { color: theme.heading }]}>{location.lat}</Text>
          </View>
          <View style={styles.telemetryCol}>
            <Text style={[styles.telemetryLabel, { color: theme.muted }]}>LONGITUDE</Text>
            <Text style={[styles.telemetryVal, { color: theme.heading }]}>{location.lng}</Text>
          </View>
        </View>
        <View style={[styles.telemetryRow, { marginTop: spacing.sm }]}>
          <View style={styles.telemetryCol}>
            <Text style={[styles.telemetryLabel, { color: theme.muted }]}>ACCURACY</Text>
            <Text style={[styles.telemetryVal, { color: theme.success }]}>{location.accuracy}</Text>
          </View>
          <View style={styles.telemetryCol}>
            <Text style={[styles.telemetryLabel, { color: theme.muted }]}>TIMESTAMP</Text>
            <Text style={[styles.telemetryVal, { color: theme.heading }]}>{location.timestamp}</Text>
          </View>
        </View>
      </Card>

      {/* Speed Dial Buttons */}
      <View style={styles.actionsBox}>
        <TouchableOpacity
          style={styles.call108Btn}
          onPress={callAmbulance}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#e11d48', '#be123c']}
            start={[0, 0]}
            end={[1, 0]}
            style={styles.callGradient}
          >
            <Ionicons name="call" size={22} color="#ffffff" />
            <Text style={styles.callText}>Call Ambulance (108)</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.call112Btn}
          onPress={callNationalEmergency}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#0284c7', '#0369a1']}
            start={[0, 0]}
            end={[1, 0]}
            style={styles.callGradient}
          >
            <MaterialCommunityIcons name="police-badge" size={22} color="#ffffff" />
            <Text style={styles.callText}>National Emergency (112)</Text>
          </LinearGradient>
        </TouchableOpacity>

        {!dispatched && countdown > 0 && (
          <SecondaryButton
            title="Cancel Broadcast"
            onPress={cancelCountdown}
            style={{ marginTop: spacing.sm }}
          />
        )}

        {dispatched && (
          <SecondaryButton
            title="Back to Dashboard"
            onPress={() => navigation.navigate('HomeMain')}
            style={{ marginTop: spacing.sm }}
          />
        )}
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
    paddingBottom: 60,
    alignItems: 'center',
  },
  beaconCenter: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
  },
  pulseRing: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 2,
    opacity: 0.4,
  },
  sosCore: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    gap: 6,
  },
  sosTitle: {
    color: '#ffffff',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
    textAlign: 'center',
  },
  alertCard: {
    width: '100%',
    borderColor: '#fecdd3',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  alertTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  alertDescription: {
    fontSize: fontSize.xs,
    lineHeight: 18,
  },
  telemetryCard: {
    width: '100%',
  },
  telemetryHeader: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  telemetryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  telemetryCol: {
    flex: 1,
  },
  telemetryLabel: {
    fontSize: 9,
    fontWeight: fontWeight.bold,
  },
  telemetryVal: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    marginTop: 2,
  },
  actionsBox: {
    width: '100%',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  call108Btn: {
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  call112Btn: {
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  callGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: spacing.sm,
  },
  callText: {
    color: '#ffffff',
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
