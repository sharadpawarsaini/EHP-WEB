import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Platform, ActivityIndicator, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import api from '../../api/api';
import { useTheme } from '../../context/ThemeContext';
import { HealthInput, PrimaryButton } from '../../components/ui';
import { fontSize, fontWeight, radius, spacing } from '../../utils/theme';

const FEEDBACK_TYPES = ['General', 'Bug Report', 'Feature Request', 'Compliment', 'Concern'];
const RATINGS = ['😞', '😕', '😐', '🙂', '😁'];

export default function FeedbackScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState('General');
  const [rating, setRating] = useState(4);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(true);

  useEffect(() => { fetchFeedback(); }, []);

  const fetchFeedback = async () => {
    try {
      const res = await api.get('/feedback');
      setFeedbacks(res.data || []);
    } catch { }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Required', 'Please fill subject and message.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/feedback', { type, rating: rating + 1, subject, message });
      setSubject(''); setMessage(''); setType('General'); setRating(4);
      fetchFeedback();
      Alert.alert('🙏 Thank You', 'Your feedback has been submitted successfully!');
    } catch { Alert.alert('Error', 'Failed to submit feedback.'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <View style={[styles.loader, { backgroundColor: theme.bg }]}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={isDark ? ['#0a1628','#0d2040'] : ['#7c3aed','#6366f1']}
          start={[0,0]} end={[1,1]} style={styles.hero}>
          <MaterialCommunityIcons name="message-star" size={32} color="#fff" style={{marginBottom:8}} />
          <Text style={styles.heroTitle}>Share Your Feedback</Text>
          <Text style={styles.heroSub}>Help us improve EHP for better healthcare access</Text>
        </LinearGradient>

        {/* Rating */}
        <View style={[styles.ratingCard, {backgroundColor: theme.bgCard, borderColor: theme.border}]}>
          <Text style={[styles.ratingTitle, {color: theme.heading}]}>How would you rate EHP?</Text>
          <View style={styles.emojiRow}>
            {RATINGS.map((e, i) => (
              <TouchableOpacity key={i} style={[styles.emojiBtn,
                rating===i && {backgroundColor: theme.primary, transform:[{scale:1.15}]}]}
                onPress={() => setRating(i)}>
                <Text style={styles.emojiText}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.ratingLabel, {color: theme.muted}]}>
            {['Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
          </Text>
        </View>

        {/* Form */}
        <View style={[styles.formCard, {backgroundColor: theme.bgCard, borderColor: theme.border}]}>
          <Text style={[styles.formTitle, {color: theme.heading}]}>Feedback Details</Text>

          <View style={styles.typeRow}>
            {FEEDBACK_TYPES.map(t => (
              <TouchableOpacity key={t} style={[styles.typePill,
                {backgroundColor: type===t ? theme.primary : theme.bgSecondary,
                 borderColor: type===t ? theme.primary : theme.border}]}
                onPress={() => setType(t)}>
                <Text style={[styles.typeText, {color: type===t ? '#fff' : theme.muted}]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <HealthInput label="Subject" placeholder="Brief summary of your feedback"
            value={subject} onChangeText={setSubject} />
          <HealthInput label="Message" placeholder="Tell us more…"
            value={message} onChangeText={setMessage} multiline numberOfLines={5} />

          <PrimaryButton title={saving ? 'Submitting…' : 'Submit Feedback'} onPress={handleSubmit} loading={saving} />
        </View>

        {/* Past feedback */}
        {feedbacks.length > 0 && (
          <View style={{marginTop:8}}>
            <Text style={[styles.sectionLabel, {color: theme.muted}]}>YOUR PREVIOUS FEEDBACK</Text>
            {feedbacks.slice(0,3).map((f) => (
              <View key={f._id} style={[styles.fbCard, {backgroundColor: theme.bgCard, borderColor: theme.border}]}>
                <View style={styles.fbTop}>
                  <Text style={[styles.fbSubject, {color: theme.heading}]}>{f.subject}</Text>
                  <Text style={styles.fbEmoji}>{RATINGS[Math.min((f.rating||5)-1, 4)]}</Text>
                </View>
                <Text style={[styles.fbMsg, {color: theme.muted}]}>{f.message}</Text>
                <Text style={[styles.fbType, {color: theme.primary}]}>{f.type}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {flex:1, justifyContent:'center', alignItems:'center'},
  content: {paddingHorizontal:16, paddingTop:Platform.OS==='ios'?60:40, paddingBottom:100},
  hero: {borderRadius:22, padding:24, marginBottom:16, alignItems:'center'},
  heroTitle: {color:'#fff', fontSize:20, fontWeight:'800', textAlign:'center'},
  heroSub: {color:'rgba(255,255,255,0.75)', fontSize:13, textAlign:'center', marginTop:4},
  ratingCard: {borderRadius:18, borderWidth:1, padding:20, marginBottom:14, alignItems:'center'},
  ratingTitle: {fontSize:15, fontWeight:'700', marginBottom:14},
  emojiRow: {flexDirection:'row', gap:12, marginBottom:10},
  emojiBtn: {width:46, height:46, borderRadius:23, alignItems:'center', justifyContent:'center'},
  emojiText: {fontSize:26},
  ratingLabel: {fontSize:13, fontWeight:'600'},
  formCard: {borderRadius:18, borderWidth:1, padding:16, marginBottom:14},
  formTitle: {fontSize:16, fontWeight:'700', marginBottom:12},
  typeRow: {flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:12},
  typePill: {paddingHorizontal:12, paddingVertical:6, borderRadius:20, borderWidth:1},
  typeText: {fontSize:11, fontWeight:'700'},
  sectionLabel: {fontSize:11, fontWeight:'700', letterSpacing:0.8, marginBottom:8, marginLeft:4},
  fbCard: {borderRadius:14, borderWidth:1, padding:14, marginBottom:10},
  fbTop: {flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:4},
  fbSubject: {fontSize:14, fontWeight:'700', flex:1},
  fbEmoji: {fontSize:18},
  fbMsg: {fontSize:12, lineHeight:18, marginBottom:4},
  fbType: {fontSize:11, fontWeight:'700'},
});
