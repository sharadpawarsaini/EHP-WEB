import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import BottomTabNavigator from './BottomTabNavigator';
import QRScannerScreen from '../screens/emergency/QRScannerScreen';
import EmergencyCardScreen from '../screens/emergency/EmergencyCardScreen';
import { colors } from '../utils/theme';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bgLight }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Authenticated Patient Flow
        <>
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />
          <Stack.Screen name="EmergencyCard" component={EmergencyCardScreen} />
        </>
      ) : (
        // Auth & Public Responder Flow
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />
          <Stack.Screen name="EmergencyCard" component={EmergencyCardScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
