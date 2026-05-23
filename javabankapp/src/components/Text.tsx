import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTranslate } from '../hooks/useTranslate';
import { TranslationKeys } from '../services/seeder.service';

export interface TextProps extends RNTextProps {
  tx?: keyof TranslationKeys;
  txValues?: Record<string, string | number>;
  variant?: 'h1' | 'h2' | 'body' | 'bodySemibold' | 'caption' | 'muted';
  children?: React.ReactNode;
}

export const Text = ({ tx, txValues, variant = 'body', style, children, ...props }: TextProps) => {
  const { colors } = useTheme();
  const { t } = useTranslate();

  const content = tx ? t(tx, txValues) : children;

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: 26,
          fontWeight: '800',
          color: colors.text,
          lineHeight: 34,
        };
      case 'h2':
        return {
          fontSize: 18,
          fontWeight: '700',
          color: colors.text,
          lineHeight: 24,
        };
      case 'bodySemibold':
        return {
          fontSize: 15,
          fontWeight: '600',
          color: colors.text,
          lineHeight: 22,
        };
      case 'caption':
        return {
          fontSize: 12,
          fontWeight: '500',
          color: colors.textMuted,
          lineHeight: 16,
        };
      case 'muted':
        return {
          fontSize: 14,
          fontWeight: '400',
          color: colors.textMuted,
          lineHeight: 20,
        };
      case 'body':
      default:
        return {
          fontSize: 15,
          fontWeight: '400',
          color: colors.text,
          lineHeight: 22,
        };
    }
  };

  return (
    <RNText style={[styles.base, getVariantStyle(), style]} {...props}>
      {content}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System',
  },
});
