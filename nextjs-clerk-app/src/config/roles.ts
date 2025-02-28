export type Role = 'org:master_admin' | 'org:account_admin' | 'org:user';

export interface RoleDefinition {
  name: string;
  level: number;
  description: string;
  permissions: string[];
}

export const ROLES: Record<Role, RoleDefinition> = {
  'org:master_admin': {
    name: 'Master Admin',
    level: 3,
    description: 'Super administrator with full system access',
    permissions: [
      'access_admin_routes',
      'manage_accounts',
      'manage_roles',
      'view_audit_logs',
      'manage_system_settings',
      'view_analytics',
      'manage_users',
      'manage_apps',
      'view_profile',
      'edit_profile',
      'org:sys_domains:manage',
      'org:sys_domains:read',
      'org:sys_memberships:manage',
      'org:sys_memberships:read',
      'org:sys_profile:manage',
      'org:sys_profile:delete'
    ]
  },
  'org:account_admin': {
    name: 'Account Admin',
    level: 2,
    description: 'Administrator for a specific account',
    permissions: [
      'access_admin_routes',
      'manage_account_users',
      'manage_account_apps',
      'manage_apps',
      'view_account_analytics',
      'manage_account_settings',
      'view_profile',
      'edit_profile',
      'org:sys_domains:read',
      'org:sys_memberships:read',
      'org:sys_profile:manage'
    ]
  },
  'org:user': {
    name: 'User',
    level: 1,
    description: 'Standard user with access to account apps',
    permissions: [
      'access_account_routes',
      'view_account_apps',
      'use_account_apps',
      'view_profile',
      'edit_profile',
      'org:sys_memberships:read'
    ]
  }
};

export const DEFAULT_ROLE: Role = 'org:user';

export const hasPermission = (userRole: Role, permission: string): boolean => {
  return ROLES[userRole]?.permissions.includes(permission) ?? false;
};

export const isRoleAtLeast = (userRole: Role, requiredRole: Role): boolean => {
  return (ROLES[userRole]?.level ?? 0) >= (ROLES[requiredRole]?.level ?? 0);
};

export const getHighestRole = (roles: Role[]): Role => {
  return roles.reduce((highest, current) => {
    return (ROLES[current]?.level ?? 0) > (ROLES[highest]?.level ?? 0) ? current : highest;
  }, DEFAULT_ROLE);
};

export const ROLE_ROUTES = {
  'org:user': '/dashboard',
  'org:account_admin': '/admin/dashboard',
  'org:master_admin': '/admin/dashboard'
} as const;

export const getDefaultRouteForRole = (role: Role): string => {
  return ROLE_ROUTES[role] || ROLE_ROUTES['org:user'];
};