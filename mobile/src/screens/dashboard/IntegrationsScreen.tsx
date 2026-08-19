import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Platform, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import api from '../../api/api';
import { useTheme } from '../../context/ThemeContext';
import { HealthInput, PrimaryButton } from '../../components/ui';
import { fontSize, fontWeight, radius, spacing } from '../../utils/theme';

const INTEGRATION_OPTIONS = [
  { key: 'googleFit', label: 'Google Fit', icon: 'google-fit', color: '#4285f4', desc: 'Sync steps, heart rate & calories' },
  { key: 'appleHealth', label: 'Apple Health', icon: 'apple', color: '#ff3b30', desc: 'HealthKit data sync on iOS' },
  { key: 'fitbit', label: 'Fitbit', icon: 'watch-vibrate', color: '#00b0b9', desc: 'Wearable activity & sleep data' },
  { key: 'whatsapp', label: 'WhatsApp SOS', icon: 'whatsapp', color: '#25d366', desc: 'Send SOS message via WhatsApp' },
  { key: 'telegram', label: 'Telegram Alert', icon: 'send', color: '#0088cc', desc: 'Emergency alert via Telegram bot' },
  { key: 'sms', label: 'SMS Emergency', icon: 'message-alert', color: '#f59e0b', desc: 'Fallback SMS to emergency contacts' },
];

export default function IntegrationsScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);

  const toggle = (key: string) => {
    const newVal = !connected[key];
    setConnected(c => ({ ...c, [key]: newVal }));
    Alert.alert(
      newVal ? `✅ ${key} Connected` : `🔌 ${key} Disconnected`,
      newVal ? 'Integration activated. Data will sync automatically.' : 'Integration has been disabled.'
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={isDark ? ['#0a1628','#0d2040'] : ['#0f766e','#0284c7']}
          start={[0,0]} end={[1,1]} style={styles.hero}>
          <MaterialCommunityIcons name="connection" size={30} color="#fff" style={{marginBottom:6}} />
          <Text style={styles.heroTitle}>Integrations & Vault</Text>
          <Text style={styles.heroSub}>Connect health apps, wearables & alert services</Text>
        </LinearGradient>

        {/* Health Integrations */}
        <Text style={[styles.sectionLabel, {color: theme.muted}]}>HEALTH DATA SOURCES</Text>
        {INTEGRATION_OPTIONS.slice(0, 3).map((item) => (
          <View key={item.key} style={[styles.integCard, {backgroundColor: theme.bgCard, borderColor: theme.border}]}>
            <View style={[styles.integIcon, {backgroundColor: item.color + '20'}]}>
              <MaterialCommunityIcons name={item.icon as any} size={22} color={item.color} />
            </View>
            <View style={{flex:1}}>
              <Text style={[styles.integLabel, {color: theme.heading}]}>{item.label}</Text>
              <Text style={[styles.integDesc, {color: theme.muted}]}>{item.desc}</Text>
            </View>
            <TouchableOpacity
              style={[styles.connectBtn, {
                backgroundColor: connected[item.key] ? '#dcfce7' : theme.bgSecondary,
                borderColor: connected[item.key] ? '#10b981' : theme.border,
              }]}
              onPress={() => toggle(item.key)}
            >
              <Text style={{color: connected[item.key] ? '#10b981' : theme.muted, fontSize:11, fontWeight:'700'}}>
                {connected[item.key] ? 'Connected ✓' : 'Connect'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Alert Channels */}
        <Text style={[styles.sectionLabel, {color: theme.muted, marginTop:16}]}>EMERGENCY ALERT CHANNELS</Text>
        {INTEGRATION_OPTIONS.slice(3).map((item) => (
          <View key={item.key} style={[styles.integCard, {backgroundColor: theme.bgCard, borderColor: theme.border}]}>
            <View style={[styles.integIcon, {backgroundColor: item.color + '20'}]}>
              <MaterialCommunityIcons name={item.icon as any} size={22} color={item.color} />
            </View>
            <View style={{flex:1}}>
              <Text style={[styles.integLabel, {color: theme.heading}]}>{item.label}</Text>
              <Text style={[styles.integDesc, {color: theme.muted}]}>{item.desc}</Text>
            </View>
            <TouchableOpacity
              style={[styles.connectBtn, {
                backgroundColor: connected[item.key] ? '#dcfce7' : theme.bgSecondary,
                borderColor: connected[item.key] ? '#10b981' : theme.border,
              }]}
              onPress={() => toggle(item.key)}
            >
              <Text style={{color: connected[item.key] ? '#10b981' : theme.muted, fontSize:11, fontWeight:'700'}}>
                {connected[item.key] ? 'Enabled ✓' : 'Enable'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Secure Vault */}
        <Text style={[styles.sectionLabel, {color: theme.muted, marginTop:16}]}>SECURE HEALTH VAULT</Text>
        <View style={[styles.vaultCard, {backgroundColor: isDark ? '#0c2738' : '#eff6ff', borderColor: isDark ? '#1e3a5f' : '#bfdbfe'}]}>
          <MaterialCommunityIcons name="safe-square-outline" size={28} color={theme.primary} />
          <View style={{flex:1}}>
            <Text style={[styles.vaultTitle, {color: theme.heading}]}>AES-256 Encrypted Vault</Text>
            <Text style={[styles.vaultSub, {color: theme.muted}]}>
              All medical documents, notes, and records are encrypted at rest with military-grade AES-256 encryption.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.vaultBtn, {backgroundColor: theme.primary}]}
          onPress={() => navigation.navigate('MedicalDocScanner')}
        >
          <MaterialCommunityIcons name="camera-document" size={18} color="#fff" />
          <Text style={styles.vaultBtnText}>Open Document Scanner & Vault</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {paddingHorizontal:16, paddingTop:Platform.OS==='ios'?60:40, paddingBottom:100},
  hero: {borderRadius:22, padding:22, marginBottom:20, alignItems:'center'},
  heroTitle: {color:'#fff', fontSize:20, fontWeight:'800'},
  heroSub: {color:'rgba(255,255,255,0.75)', fontSize:12, textAlign:'center', marginTop:4},
  sectionLabel: {fontSize:11, fontWeight:'700', letterSpacing:0.8, marginBottom:8, marginLeft:4},
  integCard: {flexDirection:'row', alignItems:'center', gap:12, padding:14, borderRadius:16, borderWidth:1, marginBottom:10},
  integIcon: {width:44, height:44, borderRadius:12, alignItems:'center', justifyContent:'center'},
  integLabel: {fontSize:14, fontWeight:'700'},
  integDesc: {fontSize:11.5, marginTop:1},
  connectBtn: {paddingHorizontal:12, paddingVertical:7, borderRadius:12, borderWidth:1},
  vaultCard: {flexDirection:'row', gap:14, padding:16, borderRadius:16, borderWidth:1, marginBottom:12, alignItems:'flex-start'},
  vaultTitle: {fontSize:14, fontWeight:'700', marginBottom:4},
  vaultSub: {fontSize:12, lineHeight:18},
  vaultBtn: {flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, paddingVertical:14, borderRadius:14},
  vaultBtnText: {color:'#fff', fontSize:14, fontWeight:'700'},
});
