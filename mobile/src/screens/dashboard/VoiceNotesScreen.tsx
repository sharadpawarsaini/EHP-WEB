import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Card, SectionHeader, Badge, PrimaryButton, SecondaryButton, EmptyState } from '../../components/ui';
import { radius, spacing, fontSize, fontWeight } from '../../utils/theme';

export default function VoiceNotesScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [memos, setMemos] = useState<any[]>([
    {
      id: '1',
      title: 'Cardiologist Follow-up Instructions',
      duration: '0:42',
      date: 'Aug 18, 2026',
      tag: 'Doctor Memo',
      transcription: 'Continue 50mg Metoprolol morning dose. Keep monitoring resting HR.',
    },
    {
      id: '2',
      title: 'Night Sudden Chest Ache Incident',
      duration: '0:18',
      date: 'Aug 14, 2026',
      tag: 'Symptom Note',
      transcription: 'Mild tightness felt at 2 AM after exertion, resolved within 5 mins.',
    },
  ]);

  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordDuration((d) => d + 1);
      }, 1000);
    } else {
      setRecordDuration(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      const newMemo = {
        id: Date.now().toString(),
        title: `Audio Memo #${memos.length + 1}`,
        duration: `0:${recordDuration < 10 ? '0' : ''}${recordDuration}`,
        date: 'Today',
        tag: 'Patient Audio',
        transcription: 'Voice recording saved locally in encrypted audio storage.',
      };
      setMemos([newMemo, ...memos]);
      Alert.alert('Saved', 'Encrypted voice memo recorded and saved to vault.');
    }
  };

  const deleteMemo = (id: string) => {
    setMemos(memos.filter((m) => m.id !== id));
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      <SectionHeader
        title="Voice Health Memos"
        subtitle="Record doctor notes & verbal symptoms"
        icon={<MaterialCommunityIcons name="microphone" size={24} color={theme.primary} />}
      />

      {/* Record Voice Note Card */}
      <Card style={styles.recorderCard}>
        <TouchableOpacity
          style={[
            styles.micCircle,
            {
              backgroundColor: isRecording ? '#e11d48' : theme.primary,
              borderColor: isRecording ? '#fecdd3' : theme.border,
            },
          ]}
          onPress={toggleRecording}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons
            name={isRecording ? 'stop' : 'microphone'}
            size={40}
            color="#ffffff"
          />
        </TouchableOpacity>

        <Text style={[styles.recordStatus, { color: theme.heading }]}>
          {isRecording ? `RECORDING: 0:${recordDuration < 10 ? '0' : ''}${recordDuration}` : 'Tap Mic to Record Health Note'}
        </Text>
        <Text style={[styles.recordSub, { color: theme.muted }]}>
          {isRecording ? 'Tap the red button when finished speaking' : 'Encrypted audio memo stored directly on device'}
        </Text>
      </Card>

      {/* Saved Voice Memos List */}
      <SectionHeader title="Saved Memos" subtitle="Encrypted audio logs" style={{ marginTop: spacing.lg }} />

      {memos.map((memo) => (
        <Card key={memo.id} style={styles.memoCard}>
          <View style={styles.memoTop}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.memoTitle, { color: theme.heading }]}>{memo.title}</Text>
              <Text style={[styles.memoDate, { color: theme.muted }]}>
                📅 {memo.date} • ⏱️ {memo.duration}
              </Text>
            </View>
            <Badge label={memo.tag} color="blue" />
          </View>

          <Text style={[styles.transcriptionText, { color: theme.body }]}>
            "{memo.transcription}"
          </Text>

          <View style={styles.memoActionRow}>
            <TouchableOpacity style={styles.playBtn}>
              <Ionicons name="play" size={16} color={theme.primary} />
              <Text style={[styles.playBtnText, { color: theme.primary }]}>Play Audio</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteMemo(memo.id)}>
              <Ionicons name="trash-outline" size={18} color={theme.danger} />
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
  recorderCard: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: 8,
  },
  micCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    elevation: 6,
    marginBottom: spacing.xs,
  },
  recordStatus: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
  },
  recordSub: {
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
  memoCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  memoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  memoTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  memoDate: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  transcriptionText: {
    fontSize: fontSize.xs,
    fontStyle: 'italic',
    lineHeight: 16,
    marginVertical: spacing.sm,
  },
  memoActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: spacing.xs,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playBtnText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
});
