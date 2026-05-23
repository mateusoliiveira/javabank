import React from 'react';
import { View, StyleSheet } from 'react-native';
import { usePermission } from '../hooks/usePermission';
import { PermissionKey } from '../context/PermissionContext';
import { Text } from './Text';
import { Lock } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';

export interface PermissionGuardProps {
  permission: PermissionKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showFallbackBox?: boolean;
}

export const PermissionGuard = ({
  permission,
  children,
  fallback,
  showFallbackBox = true,
}: PermissionGuardProps) => {
  const { hasPermission } = usePermission();
  const { colors } = useTheme();

  const allowed = hasPermission(permission);

  if (allowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showFallbackBox) {
    return (
      <View
        style={[
          styles.fallbackContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.error,
          },
        ]}
      >
        <Lock size={24} color={colors.error} style={styles.lockIcon} />
        <Text tx="noPermissionText" variant="bodySemibold" style={{ color: colors.error }} />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  fallbackContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  lockIcon: {
    marginRight: 12,
  },
});
