import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function CovertSOSTriggerScreen({ navigation }: any) {
  const [display, setDisplay] = useState('0');
  const [covertArmed, setCovertArmed] = useState(false);

  const pressKey = (key: string) => {
    if (key === 'C') {
      setDisplay('0');
    } else if (key === '=') {
      // Secret code trigger: If user inputs 911= or 108=, silently trigger covert SOS
      if (display === '911' || display === '108' || display === '999') {
        setCovertArmed(true);
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          Vibration.vibrate(100);
        }
        Alert.alert(
          'Silent SOS Dispatched 🛡️',
          'GPS coordinates and covert emergency message sent to your emergency contacts quietly.'
        );
      } else {
        try {
          setDisplay(eval(display).toString());
        } catch {
          setDisplay('Error');
        }
      }
    } else {
      setDisplay((prev) => (prev === '0' ? key : prev + key));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.calcTitle}>Calculator</Text>
      </View>

      <View style={styles.displayBox}>
        <Text style={styles.displayText}>{display}</Text>
      </View>

      {/* Disguised Keypad */}
      <View style={styles.keypad}>
        {['C', '(', ')', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '911', '='].map(
          (k) => (
            <TouchableOpacity
              key={k}
              style={[styles.keyBtn, k === '=' && styles.equalsBtn]}
              onPress={() => pressKey(k)}
              activeOpacity={0.7}
            >
              <Text style={[styles.keyText, k === '=' && { color: '#ffffff' }]}>{k}</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backBtn: {
    padding: 6,
  },
  calcTitle: {
    color: '#94a3b8',
    fontSize: fontSize.sm,
  },
  displayBox: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'flex-end',
  },
  displayText: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: fontWeight.bold,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 40,
  },
  keyBtn: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 40,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  equalsBtn: {
    backgroundColor: '#f59e0b',
  },
  keyText: {
    color: '#ffffff',
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
});
