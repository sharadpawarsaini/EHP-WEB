import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Platform, ActivityIndicator, TextInput, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import api from '../../api/api';
import { useTheme } from '../../context/ThemeContext';
import { HealthInput, PrimaryButton } from '../../components/ui';
import { fontSize, fontWeight, radius, spacing } from '../../utils/theme';

const CATEGORIES = ['General', 'Family', 'Work', 'Specialist', 'Emergency'];

export default function ContactsScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [category, setCategory] = useState('General');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/contacts');
      setContacts(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Required', 'Name and phone number are required.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/contacts', { name, phone, relationship, category, email, notes });
      setName(''); setPhone(''); setRelationship(''); setCategory('General');
      setEmail(''); setNotes('');
      setShowForm(false);
      fetchContacts();
      Alert.alert('✅ Saved', 'Contact added successfully.');
    } catch { Alert.alert('Error', 'Failed to save contact.'); }
    finally { setSaving(false); }
  };

  const handleDelete = (id: string, n: string) => {
    Alert.alert('Delete', `Remove ${n}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.delete(`/contacts/${id}`); setContacts(c => c.filter(x => x._id !== id)); }
        catch { Alert.alert('Error', 'Could not delete.'); }
      }},
    ]);
  };

  const filtered = contacts.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.relationship?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <View style={[styles.loader, { backgroundColor: theme.bg }]}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );

  const catColor: Record<string, string> = {
    General: '#0284c7', Family: '#10b981', Work: '#7c3aed',
    Specialist: '#f59e0b', Emergency: '#e11d48',
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={isDark ? ['#0a1628','#0d2040'] : ['#1d4ed8','#0284c7']}
          start={[0,0]} end={[1,1]} style={styles.hero}>
          <View style={styles.heroRow}>
            <View style={styles.heroIconBox}>
              <MaterialCommunityIcons name="contacts" size={26} color="#fff" />
            </View>
            <View style={{flex:1}}>
              <Text style={styles.heroTitle}>Emergency Contacts</Text>
              <Text style={styles.heroSub}>{contacts.length} contacts saved</Text>
            </View>
            <TouchableOpacity style={styles.heroBtn} onPress={() => setShowForm(v => !v)}>
              <MaterialCommunityIcons name={showForm ? 'close' : 'plus'} size={16} color="#2563eb" />
              <Text style={styles.heroBtnText}>{showForm ? 'Close' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Form */}
        {showForm && (
          <View style={[styles.formCard, {backgroundColor: theme.bgCard, borderColor: theme.border}]}>
            <Text style={[styles.formTitle, {color: theme.heading}]}>Add New Contact</Text>
            <View style={styles.catRow}>
              {CATEGORIES.map(c => (
                <TouchableOpacity key={c} style={[styles.catPill,
                  {backgroundColor: category===c ? catColor[c] : theme.bgSecondary,
                   borderColor: category===c ? catColor[c] : theme.border}]}
                  onPress={() => setCategory(c)}>
                  <Text style={[styles.catText, {color: category===c ? '#fff' : theme.muted}]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <HealthInput label="Full Name *" placeholder="e.g. Dr. Rajesh Sharma" value={name} onChangeText={setName} />
            <HealthInput label="Phone Number *" placeholder="+91 9876543210" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <HealthInput label="Relationship" placeholder="e.g. Father, Cardiologist" value={relationship} onChangeText={setRelationship} />
            <HealthInput label="Email (optional)" placeholder="contact@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <HealthInput label="Notes" placeholder="Additional info" value={notes} onChangeText={setNotes} multiline />
            <PrimaryButton title={saving ? 'Saving…' : 'Save Contact'} onPress={handleAdd} loading={saving} />
          </View>
        )}

        {/* Search */}
        <View style={[styles.searchBar, {backgroundColor: theme.bgCard, borderColor: theme.border}]}>
          <Ionicons name="search" size={17} color={theme.muted} />
          <TextInput style={[styles.searchInput, {color: theme.heading}]}
            placeholder="Search contacts…" placeholderTextColor={theme.muted}
            value={search} onChangeText={setSearch} />
          {search.length > 0 && <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={17} color={theme.muted} />
          </TouchableOpacity>}
        </View>

        {/* Cards */}
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <MaterialCommunityIcons name="contacts" size={52} color={theme.border} />
            <Text style={[styles.emptyTitle, {color: theme.heading}]}>No Contacts Yet</Text>
            <Text style={[styles.emptySub, {color: theme.muted}]}>Add emergency contacts, doctors{'\n'}and family members.</Text>
          </View>
        ) : filtered.map((c) => (
          <View key={c._id} style={[styles.card, {backgroundColor: theme.bgCard, borderColor: theme.border}]}>
            <View style={[styles.avatarCircle, {backgroundColor: (catColor[c.category] || '#0284c7') + '20'}]}>
              <Text style={[styles.avatarInitial, {color: catColor[c.category] || '#0284c7'}]}>
                {c.name?.[0]?.toUpperCase() || '?'}
              </Text>
            </View>
            <View style={{flex:1}}>
              <View style={styles.cardTop}>
                <Text style={[styles.cardName, {color: theme.heading}]}>{c.name}</Text>
                <View style={[styles.catBadge, {backgroundColor: (catColor[c.category]||'#0284c7') + '20'}]}>
                  <Text style={[styles.catBadgeText, {color: catColor[c.category]||'#0284c7'}]}>{c.category || 'General'}</Text>
                </View>
              </View>
              {c.relationship ? <Text style={[styles.cardSub, {color: theme.muted}]}>{c.relationship}</Text> : null}
              <View style={styles.cardActions}>
                <TouchableOpacity style={[styles.callBtn, {backgroundColor: '#dcfce7'}]}
                  onPress={() => Alert.alert('Call', `Calling ${c.phone}`)}>
                  <MaterialCommunityIcons name="phone" size={14} color="#10b981" />
                  <Text style={[styles.callBtnText, {color: '#10b981'}]}>{c.phone}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(c._id, c.name)}>
                  <MaterialCommunityIcons name="trash-can-outline" size={18} color={theme.danger} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {flex:1, justifyContent:'center', alignItems:'center'},
  content: {paddingHorizontal:16, paddingTop: Platform.OS==='ios'?60:40, paddingBottom:100},
  hero: {borderRadius:22, padding:18, marginBottom:14},
  heroRow: {flexDirection:'row', alignItems:'center', gap:12},
  heroIconBox: {width:48,height:48,borderRadius:14,backgroundColor:'rgba(255,255,255,0.2)',alignItems:'center',justifyContent:'center'},
  heroTitle: {color:'#fff',fontSize:18,fontWeight:'700'},
  heroSub: {color:'rgba(255,255,255,0.7)',fontSize:12,marginTop:2},
  heroBtn: {flexDirection:'row',alignItems:'center',gap:4,backgroundColor:'#fff',paddingVertical:7,paddingHorizontal:12,borderRadius:18},
  heroBtnText: {color:'#2563eb',fontSize:12,fontWeight:'700'},
  formCard: {borderRadius:18,borderWidth:1,padding:16,marginBottom:14},
  formTitle: {fontSize:16,fontWeight:'700',marginBottom:12},
  catRow: {flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:12},
  catPill: {paddingHorizontal:12,paddingVertical:6,borderRadius:20,borderWidth:1},
  catText: {fontSize:11,fontWeight:'700'},
  searchBar: {flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:14,paddingVertical:11,borderRadius:14,borderWidth:1,marginBottom:12},
  searchInput: {flex:1,fontSize:14},
  card: {flexDirection:'row',gap:12,padding:14,borderRadius:18,borderWidth:1,marginBottom:10,alignItems:'center'},
  avatarCircle: {width:46,height:46,borderRadius:23,alignItems:'center',justifyContent:'center'},
  avatarInitial: {fontSize:20,fontWeight:'800'},
  cardTop: {flexDirection:'row',alignItems:'center',gap:8,flexWrap:'wrap'},
  cardName: {fontSize:15,fontWeight:'700',flexShrink:1},
  catBadge: {paddingHorizontal:8,paddingVertical:2,borderRadius:8},
  catBadgeText: {fontSize:10,fontWeight:'700'},
  cardSub: {fontSize:12,marginTop:2,marginBottom:6},
  cardActions: {flexDirection:'row',alignItems:'center',gap:12},
  callBtn: {flexDirection:'row',alignItems:'center',gap:5,paddingHorizontal:10,paddingVertical:5,borderRadius:10},
  callBtnText: {fontSize:12,fontWeight:'600'},
  empty: {alignItems:'center',paddingVertical:52,gap:8},
  emptyTitle: {fontSize:17,fontWeight:'700'},
  emptySub: {fontSize:13,textAlign:'center',lineHeight:20},
});
