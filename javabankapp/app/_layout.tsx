import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor, RootState } from '../src/store';
import { ThemeProvider } from '../src/context/ThemeContext';
import { TranslationProvider } from '../src/context/TranslationContext';
import { PermissionProvider } from '../src/context/PermissionContext';
import { Stack } from 'expo-router';


import { useEffect } from 'react';
import { useTheme } from '../src/hooks/useTheme';
import { useTranslate } from '../src/hooks/useTranslate';

const AppContent = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { setTheme } = useTheme();
  const { setLocale } = useTranslate();

  useEffect(() => {
    if (currentUser?.settings) {
      const langSetting = currentUser.settings.find((s) => s.key === 'LANGUAGE')?.value;
      const themeSetting = currentUser.settings.find((s) => s.key === 'THEME')?.value;

      if (langSetting === 'en' || langSetting === 'pt') {
        setLocale(langSetting);
      }
      if (themeSetting === 'light' || themeSetting === 'dark' || themeSetting === 'system') {
        setTheme(themeSetting);
      }
    }
  }, [currentUser]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
};

const AppProviders = () => {
  const userRole = useSelector((state: RootState) => state.auth.role);

  return (
    <ThemeProvider>
      <TranslationProvider>
        <PermissionProvider userRole={userRole}>
          <AppContent />
        </PermissionProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        }
        persistor={persistor}
      >
        <AppProviders />
      </PersistGate>
    </Provider>
  );
}
