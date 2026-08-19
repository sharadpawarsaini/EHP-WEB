import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  sky: string;
  skyLight: string;

  bg: string;
  bgSecondary: string;
  bgCard: string;
  bgCardHover: string;
  
  border: string;
  borderSecondary: string;
  
  heading: string;
  body: string;
  muted: string;

  danger: string;
  dangerBg: string;
  dangerBorder: string;
  
  success: string;
  successBg: string;
  successBorder: string;

  warning: string;
  warningBg: string;
  warningBorder: string;

  info: string;
  infoBg: string;

  inputBg: string;
  inputBorder: string;
  inputFocus: string;

  tabBarBg: string;
  tabBarBorder: string;
  
  headerBg: string;
  statusBarStyle: 'light' | 'dark';
}

const lightColors: ThemeColors = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primaryLight: '#3b82f6',
  sky: '#0284c7',
  skyLight: '#38bdf8',

  bg: '#f8fafc',
  bgSecondary: '#eff6ff',
  bgCard: '#ffffff',
  bgCardHover: '#f1f5f9',

  border: '#dbeafe',
  borderSecondary: '#e2e8f0',

  heading: '#0f172a',
  body: '#475569',
  muted: '#64748b',

  danger: '#e11d48',
  dangerBg: '#fff1f2',
  dangerBorder: '#fecdd3',

  success: '#10b981',
  successBg: '#ecfdf5',
  successBorder: '#a7f3d0',

  warning: '#f59e0b',
  warningBg: '#fffbeb',
  warningBorder: '#fde68a',

  info: '#0284c7',
  infoBg: '#eff6ff',

  inputBg: '#ffffff',
  inputBorder: '#cbd5e1',
  inputFocus: '#2563eb',

  tabBarBg: '#ffffff',
  tabBarBorder: '#e2e8f0',

  headerBg: '#ffffff',
  statusBarStyle: 'dark',
};

const darkColors: ThemeColors = {
  primary: '#38bdf8',
  primaryDark: '#0284c7',
  primaryLight: '#7dd3fc',
  sky: '#0ea5e9',
  skyLight: '#bae6fd',

  bg: '#0a0f1d',
  bgSecondary: '#0f172a',
  bgCard: '#131d31',
  bgCardHover: '#1e293b',

  border: '#1e2d4a',
  borderSecondary: '#243556',

  heading: '#f8fafc',
  body: '#cbd5e1',
  muted: '#94a3b8',

  danger: '#f43f5e',
  dangerBg: '#2a1215',
  dangerBorder: '#4c1d24',

  success: '#10b981',
  successBg: '#09251e',
  successBorder: '#064e3b',

  warning: '#fbbf24',
  warningBg: '#261b0c',
  warningBorder: '#451a03',

  info: '#38bdf8',
  infoBg: '#0c2738',

  inputBg: '#131d31',
  inputBorder: '#1e2d4a',
  inputFocus: '#38bdf8',

  tabBarBg: '#0f172a',
  tabBarBorder: '#1e2d4a',

  headerBg: '#0f172a',
  statusBarStyle: 'light',
};

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  theme: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'ehp_theme_mode_pref';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  useEffect(() => {
    // Load saved theme
    (async () => {
      try {
        const saved = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
        if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
          setMode(saved as ThemeMode);
        }
      } catch (e) {
        console.log('Error reading theme preference:', e);
      }
    })();
  }, []);

  const setThemeMode = async (newMode: ThemeMode) => {
    setMode(newMode);
    try {
      await SecureStore.setItemAsync(THEME_STORAGE_KEY, newMode);
    } catch (e) {
      console.log('Error saving theme preference:', e);
    }
  };

  const isDark = mode === 'system' ? systemColorScheme === 'dark' : mode === 'dark';
  const theme = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    const nextMode: ThemeMode = isDark ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        isDark,
        theme,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
