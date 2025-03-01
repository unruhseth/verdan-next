'use client';

import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Role, hasPermission as checkPermission, isRoleAtLeast as checkRoleAtLeast, DEFAULT_ROLE, ROLES } from '@/config/roles';
import useApi from './useApi';

// Global state to prevent multiple syncs
let globalSyncPromise: Promise<any> | null = null;
const MAX_RETRIES = 2;
const RETRY_DELAY = 2000;
const DEBOUNCE_DELAY = 1000; // 1 second debounce

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: Role | null;
  accountId: string | null;
  hasRole: (requiredRoles: Role[]) => boolean;
  hasPermission: (permission: string) => boolean;
  isRoleAtLeast: (requiredRole: Role) => boolean;
  error: string | null;
}

const useAuth = (): UseAuthReturn => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { isLoaded: isAuthLoaded } = useClerkAuth();
  const { syncUserWithBackend, getUserRole } = useApi();

  const [userRole, setUserRole] = useState<Role | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add refs for sync control
  const isSyncingRef = useRef(false);
  const retryCountRef = useRef(0);
  const lastSyncedRoleRef = useRef<Role | null>(null);
  const lastSyncTimeRef = useRef<number>(0);

  const hasRole = useCallback((requiredRoles: Role[]): boolean => {
    if (!userRole) return false;
    console.log('Checking role:', { 
      userRole, 
      requiredRoles, 
      result: requiredRoles.includes(userRole),
      normalizedUserRole: userRole.replace('-', '_'),
      normalizedRequiredRoles: requiredRoles.map(r => r.replace('-', '_'))
    });
    // Normalize roles by replacing hyphens with underscores
    const normalizedUserRole = userRole.replace('-', '_');
    const normalizedRequiredRoles = requiredRoles.map(r => r.replace('-', '_'));
    return normalizedRequiredRoles.includes(normalizedUserRole);
  }, [userRole]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!userRole) return false;
    const result = checkPermission(userRole, permission);
    console.log('Checking permission:', { 
      userRole, 
      permission, 
      result,
      normalizedRole: userRole.replace('-', '_'),
      permissions: userRole ? ROLES[userRole.replace('-', '_') as Role]?.permissions : []
    });
    return result;
  }, [userRole]);

  const isRoleAtLeast = useCallback((requiredRole: Role): boolean => {
    if (!userRole) return false;
    const result = checkRoleAtLeast(userRole, requiredRole);
    console.log('Checking role level:', { userRole, requiredRole, result });
    return result;
  }, [userRole]);

  const syncUser = useCallback(async () => {
    // Prevent syncing if already in progress
    if (isSyncingRef.current) {
      return;
    }

    // Prevent rapid re-syncs
    const now = Date.now();
    if (now - lastSyncTimeRef.current < 1000) { // 1 second minimum between syncs
      return;
    }

    setIsLoadingRole(true);
    setError(null);
    isSyncingRef.current = true;
    lastSyncTimeRef.current = now;

    try {
      // First sync the user with the backend
      const syncResult = await syncUserWithBackend();
      if (syncResult.error) {
        setError('Failed to sync with backend services');
        return;
      }
      
      // Then get their role
      const { data, error: roleError } = await getUserRole();
      if (data) {
        const role = data.role.replace('-', '_') as Role;
        setUserRole(role);
        setAccountId(data.account_id);
        lastSyncedRoleRef.current = role;
        retryCountRef.current = 0;
      } else if (roleError) {
        setError('Failed to fetch user role');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoadingRole(false);
      isSyncingRef.current = false;
    }
  }, [syncUserWithBackend, getUserRole]);

  useEffect(() => {
    if (isLoaded && isAuthLoaded && isSignedIn && user) {
      // Get role from Clerk token directly
      const clerkRole = user.organizationMemberships?.[0]?.role || DEFAULT_ROLE;
      const normalizedRole = clerkRole.replace('-', '_') as Role;
      
      // Only sync with backend if:
      // 1. We haven't synced before
      // 2. The role has actually changed
      if (!lastSyncedRoleRef.current || lastSyncedRoleRef.current !== normalizedRole) {
        syncUser();
      } else {
        // Otherwise just use the role we have
        setUserRole(normalizedRole);
      }
    } else if (!isSignedIn) {
      // Reset state when signed out
      setUserRole(null);
      setAccountId(null);
      lastSyncedRoleRef.current = null;
    }
  }, [isSignedIn, user, isLoaded, isAuthLoaded, syncUser]);

  return {
    isAuthenticated: !!isSignedIn,
    isLoading: !isLoaded || !isAuthLoaded || isLoadingRole,
    userRole,
    accountId,
    hasRole,
    hasPermission,
    isRoleAtLeast,
    error
  };
};

export default useAuth;