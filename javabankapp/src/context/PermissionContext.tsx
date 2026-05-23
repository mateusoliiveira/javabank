import React, { createContext, useContext, ReactNode } from 'react';
import { useSelector } from 'react-redux';

export type UserRole = 'admin' | 'user';

export type PermissionKey = 'view_dashboard' | 'view_admin_panel' | 'perform_transactions' | 'edit_settings';

const ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  admin: ['view_dashboard', 'view_admin_panel', 'perform_transactions', 'edit_settings'],
  user: ['view_dashboard', 'perform_transactions'],
};

interface PermissionContextType {
  role: UserRole;
  permissions: PermissionKey[];
  hasPermission: (permission: PermissionKey) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  children: ReactNode;
  userRole?: UserRole;
}

export const PermissionProvider = ({ children, userRole = 'user' }: PermissionProviderProps) => {
  const permissions = ROLE_PERMISSIONS[userRole] || [];

  const hasPermission = (permission: PermissionKey): boolean => {
    return permissions.includes(permission);
  };

  return (
    <PermissionContext.Provider value={{ role: userRole, permissions, hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissionContext = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissionContext must be used within a PermissionProvider');
  }
  return context;
};
