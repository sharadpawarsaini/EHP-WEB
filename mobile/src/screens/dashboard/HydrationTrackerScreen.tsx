import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../../context/ThemeContext';
import { Card, SectionHeader, Badge, PrimaryButton, SecondaryButton } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function HydrationTrackerScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const todayKey = `ehp_hydration_${new Date().toISOString().split('T')[0]}`;
  const [currentMl, setCurrentMl] = useState(0);
  const goalMl = 2500;

  useEffect(() => {
    (async () => {
      try {
        const val = await SecureStore.getItemAsync(todayKey);
        if (val) {
          setCurrentMl(parseInt(val, 10) || 0);
        }
      } catch (e) {
        console.log('Error reading hydration:', e);
      }
    })();
  }, []);

  const saveHydration = async (amount: number) => {
    setCurrentMl(amount);
    try {
      await SecureStore.setItemAsync(todayKey, amount.toString());
    } catch (e) {
      console.log('Error saving hydration:', e);
    }
  };

  const addWater = (amount: number) => {
    const nextVal = Math.min(currentMl + amount, 5000);
    saveHydration(nextVal);
  };

  const resetWater = () => {
    saveHydration(0);
  };

  const percentage = Math.min(Math.round((currentMl / goalMl) * 100), 100);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      <SectionHeader
        title="Hydration & Vitals Balance"
        subtitle="Daily fluid intake telemetry"
        icon={<MaterialCommunityIcons name="water" size={24} color="#0284c7" />}
      />

      {/* Main Hydration Progress Circle */}
      <Card style={styles.hydrationCard}>
        <View style={styles.waterCircle}>
          <MaterialCommunityIcons name="cup-water" size={48} color="#0284c7" />
          <Text style={[styles.progressNumber, { color: theme.heading }]}>{currentMl} ml</Text>
          <Text style={[styles.goalSub, { color: theme.muted }]}>Goal: {goalMl} ml ({percentage}%)</Text>
        </View>

        {/* Quick Log Buttons */}
        <View style={styles.quickBtnRow}>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: theme.bgSecondary, borderColor: theme.border }]}
            onPress={() => addWater(250)}
          >
            <Text style={[styles.quickBtnText, { color: theme.primary }]}>+250 ml (Glass)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: theme.bgSecondary, borderColor: theme.border }]}
            onPress={() => addWater(500)}
          >
            <Text style={[styles.quickBtnText, { color: theme.primary }]}>+500 ml (Bottle)</Text>
          </TouchableOpacity>
        </View>

        <SecondaryButton
          title="Reset Today's Intake"
          onPress={resetWater}
          style={{ marginTop: spacing.sm }}
        />
      </Card>
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
  hydrationCard: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  waterCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(2, 132, 199, 0.1)',
    borderWidth: 4,
    borderColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressNumber: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    marginTop: 4,
  },
  goalSub: {
    fontSize: fontSize.xs,
  },
  quickBtnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  quickBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  quickBtnText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
});
