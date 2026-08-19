import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import { useTheme } from '../context/ThemeContext';

// Main Tabs
import HomeScreen from '../screens/dashboard/HomeScreen';
import MedicalScreen from '../screens/dashboard/MedicalScreen';
import MedicinesScreen from '../screens/dashboard/MedicinesScreen';
import VitalsScreen from '../screens/dashboard/VitalsScreen';
import ProfileScreen from '../screens/dashboard/ProfileScreen';

// Sub-Screens & Advanced Mobile Features
import ReportsScreen from '../screens/dashboard/ReportsScreen';
import HospitalVisitsScreen from '../screens/dashboard/HospitalVisitsScreen';
import AppointmentsScreen from '../screens/dashboard/AppointmentsScreen';
import FamilyScreen from '../screens/dashboard/FamilyScreen';
import VaccinationsScreen from '../screens/dashboard/VaccinationsScreen';
import HospitalFinderScreen from '../screens/dashboard/HospitalFinderScreen';
import InsuranceScreen from '../screens/dashboard/InsuranceScreen';
import AccessLogsScreen from '../screens/dashboard/AccessLogsScreen';
import QRCardScreen from '../screens/dashboard/QRCardScreen';
import SettingsScreen from '../screens/dashboard/SettingsScreen';
import SOSBeaconScreen from '../screens/emergency/SOSBeaconScreen';
import NFCTagScreen from '../screens/dashboard/NFCTagScreen';
import FaceIDEnrollmentScreen from '../screens/dashboard/FaceIDEnrollmentScreen';
import DigitalWalletCardScreen from '../screens/dashboard/DigitalWalletCardScreen';
import EmergencyBeaconStrobeScreen from '../screens/emergency/EmergencyBeaconStrobeScreen';

// Web Parity Screens
import ContactsScreen from '../screens/dashboard/ContactsScreen';
import FeedbackScreen from '../screens/dashboard/FeedbackScreen';
import IntegrationsScreen from '../screens/dashboard/IntegrationsScreen';
import LockdownScreen from '../screens/dashboard/LockdownScreen';
import PrivacyVaultScreen from '../screens/dashboard/PrivacyVaultScreen';
import NotificationsCenterScreen from '../screens/dashboard/NotificationsCenterScreen';
import FAQHelpScreen from '../screens/dashboard/FAQHelpScreen';
import EmergencyContactSupportScreen from '../screens/dashboard/EmergencyContactSupportScreen';
import SOSLiveRadarScreen from '../screens/dashboard/SOSLiveRadarScreen';

// 10 Advanced Mobile Health Features
import AISymptomCheckerScreen from '../screens/dashboard/AISymptomCheckerScreen';
import DrugInteractionScreen from '../screens/dashboard/DrugInteractionScreen';
import VoiceNotesScreen from '../screens/dashboard/VoiceNotesScreen';
import ClinicalExportScreen from '../screens/dashboard/ClinicalExportScreen';
import VaccinePassScreen from '../screens/dashboard/VaccinePassScreen';
import FamilyEmergencyHubScreen from '../screens/dashboard/FamilyEmergencyHubScreen';
import HydrationTrackerScreen from '../screens/dashboard/HydrationTrackerScreen';
import CovertSOSTriggerScreen from '../screens/emergency/CovertSOSTriggerScreen';
import FirstAidGuidesScreen from '../screens/dashboard/FirstAidGuidesScreen';
import MedicalDocScannerScreen from '../screens/dashboard/MedicalDocScannerScreen';

import { fontSize, fontWeight } from '../utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.headerBg },
        headerTitleStyle: { fontWeight: fontWeight.bold, color: theme.heading },
        headerTintColor: theme.primary,
        headerBackTitle: '',
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SOSBeacon" component={SOSBeaconScreen} options={{ title: 'Emergency SOS Beacon', headerShown: false }} />
      <Stack.Screen name="EmergencyStrobe" component={EmergencyBeaconStrobeScreen} options={{ title: 'Visual SOS Strobe', headerShown: false }} />
      <Stack.Screen name="CovertSOS" component={CovertSOSTriggerScreen} options={{ title: 'Covert Trigger', headerShown: false }} />
      <Stack.Screen name="DigitalWalletCard" component={DigitalWalletCardScreen} options={{ title: 'Digital Health Pass' }} />
      <Stack.Screen name="FaceIDEnrollment" component={FaceIDEnrollmentScreen} options={{ title: 'Face ID & Biometrics' }} />
      <Stack.Screen name="AISymptomChecker" component={AISymptomCheckerScreen} options={{ title: 'AI Symptom Triage' }} />
      <Stack.Screen name="DrugInteraction" component={DrugInteractionScreen} options={{ title: 'Drug Interaction Scan' }} />
      <Stack.Screen name="VoiceNotes" component={VoiceNotesScreen} options={{ title: 'Voice Health Memos' }} />
      <Stack.Screen name="ClinicalExport" component={ClinicalExportScreen} options={{ title: 'Clinical Summary Export' }} />
      <Stack.Screen name="VaccinePass" component={VaccinePassScreen} options={{ title: 'Immunity Passport' }} />
      <Stack.Screen name="FamilyEmergencyHub" component={FamilyEmergencyHubScreen} options={{ title: 'Family Emergency Hub' }} />
      <Stack.Screen name="HydrationTracker" component={HydrationTrackerScreen} options={{ title: 'Hydration Balance' }} />
      <Stack.Screen name="FirstAidGuides" component={FirstAidGuidesScreen} options={{ title: 'First Aid & CPR' }} />
      <Stack.Screen name="MedicalDocScanner" component={MedicalDocScannerScreen} options={{ title: 'Document Scanner' }} />
      <Stack.Screen name="NFCTag" component={NFCTagScreen} options={{ title: 'NFC Emergency Writer' }} />
      <Stack.Screen name="QRCard" component={QRCardScreen} options={{ title: 'Emergency QR & NFC' }} />
      <Stack.Screen name="HospitalFinder" component={HospitalFinderScreen} options={{ title: 'Hospital ER Bed Finder' }} />
      <Stack.Screen name="Reports" component={ReportsScreen} options={{ title: 'Lab Reports Vault' }} />
      <Stack.Screen name="HospitalVisits" component={HospitalVisitsScreen} options={{ title: 'Hospital Visits' }} />
      <Stack.Screen name="Appointments" component={AppointmentsScreen} options={{ title: 'Doctor Appointments' }} />
      <Stack.Screen name="Family" component={FamilyScreen} options={{ title: 'Family Members Hub' }} />
      <Stack.Screen name="Vaccinations" component={VaccinationsScreen} options={{ title: 'Immunizations' }} />
      <Stack.Screen name="Insurance" component={InsuranceScreen} options={{ title: 'Health Insurance' }} />
      <Stack.Screen name="Contacts" component={ContactsScreen} options={{ title: 'Emergency Contacts' }} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} options={{ title: 'Send Feedback' }} />
      <Stack.Screen name="Integrations" component={IntegrationsScreen} options={{ title: 'Integrations' }} />
      <Stack.Screen name="Lockdown" component={LockdownScreen} options={{ title: 'System Defense Lockdown' }} />
      <Stack.Screen name="PrivacyVault" component={PrivacyVaultScreen} options={{ title: 'Zero-Knowledge Privacy Vault' }} />
      <Stack.Screen name="NotificationsCenter" component={NotificationsCenterScreen} options={{ title: 'Notification Center' }} />
      <Stack.Screen name="FAQHelp" component={FAQHelpScreen} options={{ title: 'Help & FAQ' }} />
      <Stack.Screen name="EmergencyContactSupport" component={EmergencyContactSupportScreen} options={{ title: 'Helplines & Support' }} />
      <Stack.Screen name="SOSLiveRadar" component={SOSLiveRadarScreen} options={{ title: 'Paramedic Live Radar' }} />
      <Stack.Screen name="AccessLogs" component={AccessLogsScreen} options={{ title: 'Emergency Scan Logs' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings & Security' }} />
    </Stack.Navigator>
  );
}

export default function BottomTabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: {
          backgroundColor: theme.tabBarBg,
          borderTopColor: theme.tabBarBorder,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: fontWeight.bold,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MedicalTab"
        component={MedicalScreen}
        options={{
          tabBarLabel: 'Medical',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="stethoscope" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MedicinesTab"
        component={MedicinesScreen}
        options={{
          tabBarLabel: 'Meds',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="pill" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="VitalsTab"
        component={VitalsScreen}
        options={{
          tabBarLabel: 'Vitals',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart-pulse" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
