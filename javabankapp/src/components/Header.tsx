import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import { useTheme } from '../hooks/useTheme';
import { useTranslate } from '../hooks/useTranslate';

import { Text } from './Text';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { SquaresExclude, Sun, Moon, ArrowLeft, Settings, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { TranslationKeys } from '../services/seeder.service';

export interface HeaderProps {
  variant?: 'dashboard' | 'auth-utility' | 'auth-logo';
  titleTx?: keyof TranslationKeys;
  onBack?: () => void;
}

export const Header = ({ variant = 'dashboard', titleTx, onBack }: HeaderProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { colors, toggleTheme, isDark } = useTheme();
  const { locale, setLocale } = useTranslate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'pt' : 'en');
  };

  if (variant === 'auth-utility') {
    return (
      <View style={[styles.utilityHeader, (titleTx || onBack) ? { justifyContent: 'space-between' } : { justifyContent: 'flex-end' }]}>
        <View style={styles.leftActions}>
          {onBack && (
            <IconButton
              icon={ArrowLeft}
              onPress={onBack}
              style={{ marginRight: 12 }}
              size={40}
              iconSize={18}
            />
          )}
          {titleTx && (
            <Text
              tx={titleTx}
              variant="h2"
              style={{ fontWeight: '700', flexShrink: 1 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            />
          )}
        </View>
      </View>
    );
  }

  if (variant === 'auth-logo') {
    return (
      <View style={styles.logoContainer}>
        <View style={[styles.logoIconBg, { backgroundColor: colors.primary }]}>
          <SquaresExclude size={36} color={colors.primaryForeground} />
        </View>
        <Text tx="appName" variant="h1" style={styles.logoText} />
      </View>
    );
  }


  return (
    <View style={styles.headerContainer}>
      <View style={styles.titleWrapper}>
        <SquaresExclude size={28} color={colors.primary} style={styles.squaresExcludeIcon} />
        <Text tx="appName" variant="h1" />
      </View>
      <View style={styles.headerActions}>
        {isAuthenticated && (
          <IconButton
            variant="ghost"
            icon={LogOut}
            onPress={() => {
              dispatch(logout());
            }}
            style={styles.logoutBtn}
            size={40}
            iconSize={20}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  squaresExcludeIcon: {
    marginRight: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 0,
  },
  langHeaderBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtn: {
    marginLeft: 8,
    height: 40,
    paddingHorizontal: 12,
  },

  utilityHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    width: '100%',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: 16,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
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
});
