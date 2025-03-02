/**
 * React hook for making API calls
 */
import { useState, useCallback } from 'react';
import { API_CONFIG } from '../utils/config';

type ApiHookState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

type ApiHookResult<T> = ApiHookState<T> & {
  fetchData: (endpoint: string, options?: RequestInit) => Promise<void>;
  fetchFromEndpoint: (options?: RequestInit) => Promise<void>;
};

/**
 * Hook for making API requests with proper URL handling
 * @param initialEndpoint - Optional default endpoint to use
 */
export function useApi<T>(initialEndpoint?: string): ApiHookResult<T> {
  const [state, setState] = useState<ApiHookState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const createApiUrl = useCallback((endpoint: string): string => {
    // Get base URL, ensuring it has protocol
    let baseUrl = API_CONFIG.BASE_URL;
    
    // If baseUrl is empty, throw an error
    if (!baseUrl) {
      throw new Error('API URL not configured. Please set NEXT_PUBLIC_API_URL environment variable.');
    }
    
    // Remove trailing slash from baseUrl if it exists
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }
    
    // Make sure endpoint starts with a slash
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Return the full URL
    return `${baseUrl}${formattedEndpoint}`;
  }, []);

  const fetchData = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Make sure we have a valid URL before making the request
      const url = createApiUrl(endpoint);
      
      // Make the request
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(options.headers || {}),
        },
      });
      
      // Handle error responses
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      // Parse the response
      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      console.error('API request error:', error);
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error : new Error(String(error)) 
      });
    }
  }, [createApiUrl]);

  const fetchFromEndpoint = useCallback(async (options: RequestInit = {}) => {
    if (!initialEndpoint) {
      throw new Error('No endpoint provided');
    }
    await fetchData(initialEndpoint, options);
  }, [fetchData, initialEndpoint]);

  return {
    ...state,
    fetchData,
    fetchFromEndpoint,
  };
}

/**
 * Create a hook for a specific API endpoint
 * @param endpoint - The API endpoint
 */
export function createApiHook<T>(endpoint: string) {
  return () => useApi<T>(endpoint);
}

// Create hooks for common endpoints
export const useAccounts = createApiHook(API_CONFIG.ENDPOINTS.ACCOUNTS);
export const useUsers = createApiHook(API_CONFIG.ENDPOINTS.USERS);
export const useDevices = createApiHook(API_CONFIG.ENDPOINTS.DEVICES);
export const useApps = createApiHook(API_CONFIG.ENDPOINTS.APPS);