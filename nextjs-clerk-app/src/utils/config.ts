/**
 * Application configuration
 */

// API configuration
export const API_CONFIG = {
  // Get the API URL, ensuring it has the proper protocol
  BASE_URL: process.env.NEXT_PUBLIC_API_URL 
    ? (process.env.NEXT_PUBLIC_API_URL.startsWith('http') 
      ? process.env.NEXT_PUBLIC_API_URL 
      : `https://${process.env.NEXT_PUBLIC_API_URL}`)
    : '',
    
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
  
  // Check API URL
  if (!API_CONFIG.BASE_URL) {
    issues.push('NEXT_PUBLIC_API_URL environment variable is not set');
  } else if (!API_CONFIG.BASE_URL.startsWith('http')) {
    issues.push('NEXT_PUBLIC_API_URL should start with http:// or https://');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}