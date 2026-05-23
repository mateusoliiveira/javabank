import { usePermissionContext, PermissionKey, UserRole } from '../context/PermissionContext';

export const usePermission = () => {
  const { role, permissions, hasPermission } = usePermissionContext();

  return {
    role,
    permissions,
    hasPermission: (permission: PermissionKey) => hasPermission(permission),
    isAdmin: role === 'admin',
  };
};
