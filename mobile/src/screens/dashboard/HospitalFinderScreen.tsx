import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Card, SectionHeader, Badge } from '../../components/ui';
import { fontSize, fontWeight, radius, spacing } from '../../utils/theme';

const MOCK_HOSPITALS = [
  {
    id: '1',
    name: 'City Apex Multi-Specialty Hospital',
    distance: '1.2 km away',
    erBeds: 6,
    icuBeds: 2,
    traumaLevel: 'Level 1 Trauma Center',
    address: 'Sector 14, Health Boulevard',
    phone: '+91 9811122334',
    lat: 28.6139,
    lng: 77.2090,
  },
  {
    id: '2',
    name: 'Metro Emergency & Cardiac Institute',
    distance: '2.8 km away',
    erBeds: 11,
    icuBeds: 5,
    traumaLevel: 'Cardiac Emergency Ready',
    address: 'Main Ring Road, Near Metro Pillar 84',
    phone: '+91 9822233445',
    lat: 28.6289,
    lng: 77.2180,
  },
  {
    id: '3',
    name: 'St. Jude Memorial Hospital',
    distance: '4.5 km away',
    erBeds: 3,
    icuBeds: 1,
    traumaLevel: 'Level 2 Trauma Center',
    address: 'Civil Lines, North Campus Road',
    phone: '+91 9833344556',
    lat: 28.6500,
    lng: 77.2300,
  },
];

export default function HospitalFinderScreen() {
  const { theme, isDark } = useTheme();
  const [hospitals] = useState(MOCK_HOSPITALS);

  const openNavigation = (lat: number, lng: number, name: string) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${name}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${name})`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });
    if (url) Linking.openURL(url);
  };

  const callHospital = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      <SectionHeader
        title="Hospital ER Bed Finder"
        subtitle="Real-time emergency room capacity"
        icon={<MaterialCommunityIcons name="hospital-building" size={24} color={theme.primary} />}
      />

      {/* Emergency GPS Banner */}
      <Card style={[styles.gpsBanner, { backgroundColor: theme.bgSecondary, borderColor: theme.border }]}>
        <View style={styles.gpsRow}>
          <View style={[styles.gpsDot, { backgroundColor: theme.success }]} />
          <Text style={[styles.gpsText, { color: theme.heading }]}>
            GPS Location Active • Showing Nearest Emergency Units
          </Text>
        </View>
      </Card>

      {/* Hospital Cards */}
      {hospitals.map((hosp) => (
        <Card key={hosp.id} style={styles.hospCard}>
          <View style={styles.hospTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.hospName, { color: theme.heading }]}>{hosp.name}</Text>
              <Text style={[styles.hospDistance, { color: theme.primary }]}>📍 {hosp.distance}</Text>
            </View>
            <Badge label={hosp.erBeds > 0 ? `${hosp.erBeds} ER Beds Free` : 'ER Full'} color={hosp.erBeds > 0 ? 'green' : 'red'} />
          </View>

          <Text style={[styles.hospAddress, { color: theme.muted }]}>{hosp.address}</Text>

          {/* Bed Availability Counter Chips */}
          <View style={styles.bedChipsRow}>
            <View style={[styles.bedChip, { backgroundColor: theme.bgSecondary, borderColor: theme.border }]}>
              <Text style={[styles.bedChipVal, { color: theme.primary }]}>{hosp.erBeds}</Text>
              <Text style={[styles.bedChipLabel, { color: theme.muted }]}>General ER</Text>
            </View>
            <View style={[styles.bedChip, { backgroundColor: theme.bgSecondary, borderColor: theme.border }]}>
              <Text style={[styles.bedChipVal, { color: hosp.icuBeds > 0 ? theme.success : theme.danger }]}>
                {hosp.icuBeds}
              </Text>
              <Text style={[styles.bedChipLabel, { color: theme.muted }]}>ICU Units</Text>
            </View>
            <View style={[styles.bedChip, { backgroundColor: theme.bgSecondary, borderColor: theme.border }]}>
              <Text style={[styles.bedChipVal, { color: theme.info }]}>24/7</Text>
              <Text style={[styles.bedChipLabel, { color: theme.muted }]}>Trauma Dept</Text>
            </View>
          </View>

          {/* Action Row: Map Directions & 1-Tap Call */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: theme.primary }]}
              onPress={() => openNavigation(hosp.lat, hosp.lng, hosp.name)}
              activeOpacity={0.85}
            >
              <Ionicons name="navigate" size={16} color="#ffffff" />
              <Text style={styles.actionBtnText}>Directions</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtnSecondary, { backgroundColor: theme.bgSecondary, borderColor: theme.border }]}
              onPress={() => callHospital(hosp.phone)}
              activeOpacity={0.85}
            >
              <Ionicons name="call" size={16} color={theme.primary} />
              <Text style={[styles.actionBtnSecondaryText, { color: theme.primary }]}>Call ER</Text>
            </TouchableOpacity>
          </View>
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
  gpsBanner: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  gpsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  gpsText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  hospCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  hospTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  hospName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  hospDistance: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    marginTop: 2,
  },
  hospAddress: {
    fontSize: fontSize.xs,
    marginTop: 4,
    lineHeight: 16,
  },
  bedChipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  bedChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  bedChipVal: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  bedChipLabel: {
    fontSize: 9,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.xl,
    gap: 6,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: 6,
  },
  actionBtnSecondaryText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
});
