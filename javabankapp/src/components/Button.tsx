import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Text } from './Text';
import { LucideIcon } from 'lucide-react-native';
import { TranslationKeys } from '../services/seeder.service';

export interface ButtonProps extends TouchableOpacityProps {
  tx?: keyof TranslationKeys;
  txValues?: Record<string, string | number>;
  title?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export const Button = ({
  tx,
  txValues,
  title,
  variant = 'primary',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  style,
  disabled,
  ...props
}: ButtonProps) => {
  const { colors, isDark } = useTheme();

  const getStyles = () => {
    let buttonStyle: ViewStyle = {};
    let textStyle: TextStyle = {};
    let iconColor = '';

    switch (variant) {
      case 'secondary':
        buttonStyle = {
          backgroundColor: colors.secondary,
        };
        textStyle = {
          color: colors.secondaryForeground,
        };
        iconColor = colors.secondaryForeground;
        break;
      case 'outline':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
        textStyle = {
          color: colors.text,
        };
        iconColor = colors.text;
        break;
      case 'ghost':
        buttonStyle = {
          backgroundColor: 'transparent',
        };
        textStyle = {
          color: colors.primary,
        };
        iconColor = colors.primary;
        break;
      case 'primary':
      default:
        buttonStyle = {
          backgroundColor: colors.primary,
        };
        textStyle = {
          color: colors.primaryForeground,
        };
        iconColor = colors.primaryForeground;
        break;
    }

    if (disabled || loading) {
      buttonStyle.opacity = 0.5;
    }

    return { buttonStyle, textStyle, iconColor };
  };

  const { buttonStyle, textStyle, iconColor } = getStyles();

  return (
    <TouchableOpacity
      style={[styles.base, buttonStyle, style]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <View style={styles.contentContainer}>
          {Icon && iconPosition === 'left' && (
            <Icon size={18} color={iconColor} style={styles.leftIcon} />
          )}

          <Text
            tx={tx}
            txValues={txValues}
            style={[styles.text, textStyle]}
          >
            {title}
          </Text>

          {Icon && iconPosition === 'right' && (
            <Icon size={18} color={iconColor} style={styles.rightIcon} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
