// Shared UI Components for EHP Mobile App
// Dynamically reactive to ThemeContext (White/Sky-Blue Light & Sleek Slate Dark)

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput as RNTextInput,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { radius, spacing, fontSize, fontWeight, shadows } from '../utils/theme';

// ─── Theme Switcher Component ────────────────────────────────────────────────
export const ThemeToggle = ({ style }: { style?: ViewStyle }) => {
  const { mode, setThemeMode, isDark, theme } = useTheme();

  const options: { mode: ThemeMode; label: string; icon: any }[] = [
    { mode: 'light', label: 'Light', icon: 'sunny-outline' },
    { mode: 'dark', label: 'Dark', icon: 'moon-outline' },
    { mode: 'system', label: 'Auto', icon: 'phone-portrait-outline' },
  ];

  return (
    <View
      style={[
        styles.themeToggleWrapper,
        { backgroundColor: theme.bgSecondary, borderColor: theme.border },
        style,
      ]}
    >
      {options.map((opt) => {
        const active = mode === opt.mode;
        return (
          <TouchableOpacity
            key={opt.mode}
            onPress={() => setThemeMode(opt.mode)}
            activeOpacity={0.8}
            style={[
              styles.themeToggleBtn,
              active && {
                backgroundColor: isDark ? '#2563eb' : '#ffffff',
                borderColor: isDark ? '#38bdf8' : '#bfdbfe',
                borderWidth: 1,
                elevation: 2,
              },
            ]}
          >
            <Ionicons
              name={opt.icon}
              size={15}
              color={active ? (isDark ? '#ffffff' : '#2563eb') : theme.muted}
            />
            <Text
              style={[
                styles.themeToggleLabel,
                { color: active ? (isDark ? '#ffffff' : '#0f172a') : theme.muted },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── Card ───────────────────────────────────────────────────────────────────
export const Card = ({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}) => {
  const { theme, isDark } = useTheme();

  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.bgCard,
          borderColor: theme.border,
        },
        shadows.sm,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

// ─── Section Header ──────────────────────────────────────────────────────────
export const SectionHeader = ({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.sectionHeaderRow}>
      <View style={styles.sectionHeader}>
        {icon && (
          <View
            style={[
              styles.sectionIcon,
              { backgroundColor: theme.bgSecondary, borderColor: theme.border },
            ]}
          >
            {icon}
          </View>
        )}
        <View>
          <Text style={[styles.sectionTitle, { color: theme.heading }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.sectionSubtitle, { color: theme.muted }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      {action && <View>{action}</View>}
    </View>
  );
};

// ─── Primary Button (Gradient) ──────────────────────────────────────────────
export const PrimaryButton = ({
  title,
  onPress,
  loading,
  disabled,
  icon,
  style,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: any;
  style?: ViewStyle;
}) => {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[{ borderRadius: radius.xl, overflow: 'hidden' }, style]}
    >
      <LinearGradient
        colors={isDark ? ['#0284c7', '#0369a1'] : ['#2563eb', '#0284c7']}
        start={[0, 0]}
        end={[1, 0]}
        style={[styles.primaryBtn, (disabled || loading) && { opacity: 0.6 }]}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {icon}
            <Text style={styles.primaryBtnText}>{title}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

// ─── Secondary Button ────────────────────────────────────────────────────────
export const SecondaryButton = ({
  title,
  onPress,
  icon,
  style,
}: {
  title: string;
  onPress: () => void;
  icon?: any;
  style?: ViewStyle;
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.secondaryBtn,
        {
          backgroundColor: theme.bgSecondary,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      {icon}
      <Text style={[styles.secondaryBtnText, { color: theme.primary }]}>{title}</Text>
    </TouchableOpacity>
  );
};

// ─── Danger Button ────────────────────────────────────────────────────────────
export const DangerButton = ({
  title,
  onPress,
  icon,
  style,
}: {
  title: string;
  onPress: () => void;
  icon?: any;
  style?: ViewStyle;
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.dangerBtn,
        { backgroundColor: theme.dangerBg, borderColor: theme.dangerBorder },
        style,
      ]}
    >
      {icon}
      <Text style={[styles.dangerBtnText, { color: theme.danger }]}>{title}</Text>
    </TouchableOpacity>
  );
};

// ─── Text Input ──────────────────────────────────────────────────────────────
export const HealthInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  label,
  multiline,
  numberOfLines,
  leftIcon,
}: {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  label?: string;
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: any;
}) => {
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: spacing.md }}>
      {label && <Text style={[styles.inputLabel, { color: theme.muted }]}>{label}</Text>}
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.inputBorder,
          },
        ]}
      >
        {leftIcon && <View style={{ marginRight: spacing.sm }}>{leftIcon}</View>}
        <RNTextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType || 'default'}
          autoCapitalize={autoCapitalize || 'none'}
          multiline={multiline}
          numberOfLines={numberOfLines}
          placeholderTextColor={theme.muted}
          style={[
            styles.input,
            { color: theme.heading },
            multiline ? { height: (numberOfLines || 3) * 24, textAlignVertical: 'top' } : null,
          ]}
        />
      </View>
    </View>
  );
};

// ─── Badge ────────────────────────────────────────────────────────────────────
export const Badge = ({
  label,
  color = 'blue',
}: {
  label: string;
  color?: 'blue' | 'red' | 'green' | 'amber' | 'purple';
}) => {
  const { isDark } = useTheme();

  const colorMap: Record<string, { bg: string; text: string; border: string }> = isDark
    ? {
        blue:   { bg: '#0c2738', text: '#38bdf8', border: '#1e3a5f' },
        red:    { bg: '#2a1215', text: '#f43f5e', border: '#4c1d24' },
        green:  { bg: '#09251e', text: '#34d399', border: '#064e3b' },
        amber:  { bg: '#261b0c', text: '#fbbf24', border: '#451a03' },
        purple: { bg: '#221138', text: '#c084fc', border: '#3b1c60' },
      }
    : {
        blue:   { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
        red:    { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' },
        green:  { bg: '#ecfdf5', text: '#10b981', border: '#a7f3d0' },
        amber:  { bg: '#fffbeb', text: '#f59e0b', border: '#fde68a' },
        purple: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
      };

  const c = colorMap[color] || colorMap.blue;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[styles.badgeText, { color: c.text }]}>{label.toUpperCase()}</Text>
    </View>
  );
};

// ─── Stats Card ──────────────────────────────────────────────────────────────
export const StatCard = ({
  label,
  value,
  icon,
  color,
  bg,
  onPress,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  bg?: string;
  onPress?: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const cardColor = color || theme.primary;
  const cardBg = bg || (isDark ? '#0c2738' : '#eff6ff');

  const content = (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: theme.bgCard,
          borderColor: theme.border,
        },
        shadows.sm,
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: cardBg }]}>{icon}</View>
      <Text style={[styles.statValue, { color: cardColor }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.muted }]}>{label}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{ flex: 1 }}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

// ─── Empty State ──────────────────────────────────────────────────────────────
export const EmptyState = ({
  icon,
  title,
  subtitle,
  actionButton,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.emptyState}>
      {icon}
      <Text style={[styles.emptyTitle, { color: theme.heading }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.emptySubtitle, { color: theme.muted }]}>{subtitle}</Text>
      )}
      {actionButton && <View style={{ marginTop: spacing.md }}>{actionButton}</View>}
    </View>
  );
};

// ─── Divider ─────────────────────────────────────────────────────────────────
export const Divider = () => {
  const { theme } = useTheme();
  return <View style={[styles.divider, { backgroundColor: theme.border }]} />;
};

// ─── StyleSheet ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  themeToggleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    padding: 3,
    gap: 2,
  },
  themeToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.full,
    gap: 4,
  },
  themeToggleLabel: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: radius['2xl'],
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  sectionSubtitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  primaryBtn: {
    paddingVertical: 15,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
    minHeight: 50,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  secondaryBtn: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 13,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
    borderWidth: 1,
    minHeight: 50,
  },
  secondaryBtnText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  dangerBtn: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 13,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
    borderWidth: 1,
    minHeight: 50,
  },
  dangerBtnText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  inputLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: fontSize.md,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
  },
  statCard: {
    flex: 1,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginTop: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.xs,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
  },
});
