/**
 * Application configuration
 */
import { getApiUrl } from './urls';

// API configuration
export const API_CONFIG = {
  // Get the API URL from the centralized getApiUrl function
  BASE_URL: getApiUrl(),
    
  // Common API endpoints
  ENDPOINTS: {
    ACCOUNTS: '/accounts',
    USERS: '/users',
    DEVICES: '/devices',
    APPS: '/apps',
  }
};

/**
 * Check if the application is properly configured
 */
export function checkConfig(): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  try {
    // This will throw if API URL is not set
    getApiUrl();
  } catch (e) {
    issues.push(e instanceof Error ? e.message : 'Failed to get API URL');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}