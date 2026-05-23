import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../src/store';
import { setCredentials } from '../src/store/authSlice';
import { useLoginMutation } from '../src/api/authApi';
import { useTheme } from '../src/hooks/useTheme';

import { useTranslate } from '../src/hooks/useTranslate';
import { Text } from '../src/components/Text';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { Select, SelectOption } from '../src/components/Select';
import { Redirect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../src/components/Header';
import {
  User,
  Lock,
  LogIn,
  SquaresExclude,
  Sun,
  Moon,
  Languages,
  UserPlus,
} from 'lucide-react-native';
import { UserRole } from '../src/context/PermissionContext';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { colors, toggleTheme, isDark } = useTheme();
  const { t, locale, setLocale } = useTranslate();

  
  const [loginTrigger] = useLoginMutation();

  
  const [username, setUsername] = useState('mateus@gmail.com');
  const [password, setPassword] = useState('198022');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  
  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError(t('requiredFieldsError'));
      return;
    }

    setError(null);
    setLoading(true);

    try {
      
      const response = await loginTrigger({
        username: username.trim(),
        password: password.trim(),
      }).unwrap();

      const userRole = response.role || 'user';

      dispatch(
        setCredentials({
          user: response.user,
          token: response.token,
          role: userRole,
        })
      );
    } catch (err: any) {
      console.error('API login failed:', err);
      const errMsg = err?.data?.message || err?.message || t('apiStatusError');
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const languageOptions: SelectOption<'en' | 'pt'>[] = [
    { label: 'English', value: 'en', icon: Languages },
    { label: 'Português', value: 'pt', icon: Languages },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      
      <Header variant="auth-utility" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          <Header variant="auth-logo" />

        
        <Card style={styles.loginCard}>
          <Text tx="loginTitle" variant="h2" style={styles.cardTitle} />
          <Text tx="loginSubtitle" variant="muted" style={styles.cardSubtitle} />

          {error && (
            <View style={[styles.errorContainer, { backgroundColor: colors.accent, borderColor: colors.error }]}>
              <Text style={{ color: colors.error, fontSize: 13, fontWeight: '500' }}>
                {error}
              </Text>
            </View>
          )}

          
          <Input
            labelTx="usernameLabel"
            placeholder="e.g. mateusdev"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (error) setError(null);
            }}
            icon={User}
            autoCapitalize="none"
          />

          
          <Input
            labelTx="passwordLabel"
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError(null);
            }}
            icon={Lock}
            secureTextEntry
          />

          
          <Button
            tx="loginButton"
            icon={LogIn}
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          
          <Button
            tx="dontHaveAccount"
            variant="ghost"
            icon={UserPlus}
            onPress={() => router.push('/register')}
            style={styles.signUpBtn}
          />
        </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  utilityHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 32,
    position: 'absolute',
    top: 16,
    right: 24,
    left: 24,
    zIndex: 10,
  },
  langHeaderBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 64,
  },
  logoIconBg: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  logoText: {
    marginTop: 12,
    fontWeight: '800',
  },
  loginCard: {
    padding: 20,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSubtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
  },
  signUpBtn: {
    marginTop: 12,
    height: 40,
  },
});
