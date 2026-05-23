import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Text } from './Text';
import { LucideIcon, Eye, EyeOff } from 'lucide-react-native';
import { TranslationKeys } from '../services/seeder.service';

export interface InputProps extends TextInputProps {
  labelTx?: keyof TranslationKeys;
  label?: string;
  error?: string;
  icon?: LucideIcon;
  containerStyle?: ViewStyle;
}

export const Input = ({
  labelTx,
  label,
  error,
  icon: Icon,
  secureTextEntry,
  style,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}: InputProps) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const isSecure = secureTextEntry && !isPasswordVisible;

  const getInputStyle = (): ViewStyle => {
    return {
      borderColor: error
        ? colors.error
        : isFocused
        ? colors.primary
        : colors.border,
      backgroundColor: colors.card,
    };
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {(label || labelTx) && (
        <Text tx={labelTx} variant="bodySemibold" style={styles.label}>
          {label}
        </Text>
      )}

      <View style={[styles.inputWrapper, getInputStyle()]}>
        {Icon && (
          <Icon
            size={20}
            color={error ? colors.error : isFocused ? colors.primary : colors.textMuted}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[
            styles.textInput,
            { color: colors.text },
            style,
          ]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isSecure}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={colors.textMuted} />
            ) : (
              <Eye size={20} color={colors.textMuted} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
  },
  inputWrapper: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  leftIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
