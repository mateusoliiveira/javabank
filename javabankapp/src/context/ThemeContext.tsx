import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  error: string;
  success: string;
}

export const lightTheme: ThemeColors = {
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#0F172A',
  textMuted: '#64748B',
  primary: '#EA580C',
  primaryForeground: '#FFFFFF',
  secondary: '#E2E8F0',
  secondaryForeground: '#334155',
  accent: '#EEF2F6',
  accentForeground: '#EA580C',
  border: '#E2E8F0',
  error: '#EF4444',
  success: '#10B981',
};

export const darkTheme: ThemeColors = {
  background: '#09090B',
  card: '#18181B',
  text: '#FAFAFA',
  textMuted: '#A1A1AA',
  primary: '#F97316',
  primaryForeground: '#FFFFFF',
  secondary: '#27272A',
  secondaryForeground: '#E4E4E7',
  accent: '#202023',
  accentForeground: '#F97316',
  border: '#27272A',
  error: '#F87171',
  success: '#34D399',
};

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('system');

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const resolvedTheme = theme === 'system' ? (systemColorScheme || 'dark') : theme;

  const colors = resolvedTheme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, colors, resolvedTheme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
