import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { LucideIcon } from 'lucide-react-native';

export interface IconButtonProps {
  icon: LucideIcon;
  onPress?: () => void;
  size?: number;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export const IconButton = ({
  icon: Icon,
  onPress,
  size = 44,
  iconSize = 20,
  style,
  variant = 'outline',
}: IconButtonProps) => {
  const { colors } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          color: colors.primaryForeground,
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          borderColor: colors.secondary,
          color: colors.secondaryForeground,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          color: colors.primary,
        };
      case 'outline':
      default:
        return {
          backgroundColor: 'transparent',
          borderColor: colors.border,
          color: colors.text,
        };
    }
  };

  const { backgroundColor, borderColor, color } = getVariantStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          borderColor,
          borderWidth: 1,
        },
        style,
      ]}
    >
      <Icon size={iconSize} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
