// EHP Mobile — Design Tokens (White & Sky-Blue Healthcare Theme)
// Mirrors the website's Tailwind CSS palette exactly
import { Platform } from 'react-native';

export const colors = {
  // ── Brand Palette ──────────────────────────────────────────────────────────
  primary: '#2563eb',       // Royal Blue (primary actions, buttons)
  primaryDark: '#1d4ed8',   // Hover state
  sky: '#0284c7',           // Sky Blue (gradients)
  skyLight: '#38bdf8',      // Light accent

  // ── Backgrounds ───────────────────────────────────────────────────────────
  bgLight: '#f8fafc',       // Page background (light)
  bgMid: '#eff6ff',         // Subtle blue tint
  bgDark: '#0f172a',        // Dark mode page background

  // ── Cards ─────────────────────────────────────────────────────────────────
  card: '#ffffff',
  cardBorder: '#dbeafe',    // Blue-100
  cardDark: '#1e293b',
  cardBorderDark: '#1e3a5f',

  // ── Text ──────────────────────────────────────────────────────────────────
  heading: '#0f172a',       // Slate-900
  body: '#475569',          // Slate-600
  muted: '#94a3b8',         // Slate-400
  headingDark: '#f1f5f9',
  bodyDark: '#94a3b8',

  // ── Semantic ───────────────────────────────────────────────────────────────
  danger: '#e11d48',        // Rose-600 (SOS, danger, delete)
  dangerLight: '#fff1f2',
  success: '#10b981',       // Emerald-500 (active, done)
  successLight: '#ecfdf5',
  warning: '#f59e0b',       // Amber-500 (caution)
  warningLight: '#fffbeb',
  info: '#0284c7',

  // ── Input ─────────────────────────────────────────────────────────────────
  inputBg: '#f8fafc',
  inputBorder: '#bfdbfe',   // Blue-200
  inputFocus: '#2563eb',

  // ── White ─────────────────────────────────────────────────────────────────
  white: '#ffffff',
  black: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

export const fontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

export const fontWeight = {
  normal: 'normal' as const,
  medium: 'normal' as const,
  semibold: 'bold' as const,
  bold: 'bold' as const,
  black: 'bold' as const,
};

export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#2563eb',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#2563eb',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#2563eb',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 20,
    },
    android: {
      elevation: 6,
    },
    default: {},
  }),
};
