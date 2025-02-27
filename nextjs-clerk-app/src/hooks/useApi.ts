import { useAuth, useUser } from '@clerk/nextjs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const useApi = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchWithAuth = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      console.log(`Making request to ${API_BASE_URL}${endpoint}`, {
        method: options.method || 'GET',
        headers,
        body: options.body,
      });

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        mode: 'cors',
        credentials: 'include',
      });

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
        } catch (e) {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`Response from ${endpoint}:`, { status: response.status, data });
      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  };

  const syncUserWithBackend = async () => {
    if (!user) {
      return { error: 'No user found' };
    }

    try {
      const primaryEmail = user.primaryEmailAddress?.emailAddress;
      
      if (!primaryEmail) {
        return { error: 'No primary email found' };
      }

      // Get role from organization membership
      const orgMembership = user.organizationMemberships?.[0];
      const role = orgMembership?.role || 'org:user';
      console.log('Syncing user with role:', role);

      const result = await fetchWithAuth('/auth/users/sync', {
        method: 'POST',
        body: JSON.stringify({
          email: primaryEmail,
          first_name: user.firstName,
          last_name: user.lastName,
          role: role
        }),
      });

      console.log('Sync result:', result);
      return result;
    } catch (error) {
      console.error('Sync Error:', error);
      return { error: 'Failed to sync user with backend' };
    }
  };

  const getUserRole = async () => {
    try {
      const result = await fetchWithAuth<{ role: string; account_id: string }>('/auth/users/me');
      console.log('Get role result:', result);
      
      if (result.data) {
        // Ensure the role uses underscores and has org: prefix
        let role = result.data.role.replace('-', '_');
        if (!role.startsWith('org:')) {
          role = `org:${role}`;
        }
        result.data.role = role;
      }
      
      return result;
    } catch (error) {
      console.error('Get Role Error:', error);
      return { error: 'Failed to fetch user role' };
    }
  };

  const updateUserRole = async (userId: string, role: string, accountId: string) => {
    try {
      // Ensure role uses underscores and has org: prefix
      let normalizedRole = role.replace('-', '_');
      if (!normalizedRole.startsWith('org:')) {
        normalizedRole = `org:${normalizedRole}`;
      }

      const result = await fetchWithAuth(`/auth/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ 
          role: normalizedRole,
          account_id: accountId 
        }),
      });
      console.log('Update role result:', result);
      return result;
    } catch (error) {
      console.error('Update Role Error:', error);
      return { error: 'Failed to update user role' };
    }
  };

  return {
    fetchWithAuth,
    syncUserWithBackend,
    getUserRole,
    updateUserRole,
  };
};

export default useApi; 