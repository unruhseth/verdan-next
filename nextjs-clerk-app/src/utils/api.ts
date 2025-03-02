/**
 * API utility functions for the Verdan Platform
 */

/**
 * Gets the base API URL, ensuring it has the proper protocol prefix
 */
export function getApiUrl(): string {
  // Get the API URL from environment variable
  let apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  // If the API URL doesn't have a protocol, add https://
  if (apiUrl && !apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
    apiUrl = `https://${apiUrl}`;
  }
  
  // Remove trailing slash if present
  if (apiUrl.endsWith('/')) {
    apiUrl = apiUrl.slice(0, -1);
  }
  
  return apiUrl;
}

/**
 * Create a full API URL by combining the base URL with an endpoint
 */
export function createApiUrl(endpoint: string): string {
  const baseUrl = getApiUrl();
  
  // If no base URL is set, throw an error
  if (!baseUrl) {
    throw new Error('API URL not configured. Please set NEXT_PUBLIC_API_URL environment variable.');
  }
  
  // Make sure endpoint starts with a slash
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Combine base URL and endpoint
  return `${baseUrl}${formattedEndpoint}`;
}

/**
 * Fetch data from the API with proper error handling
 */
export async function fetchFromApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = createApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {}),
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw new Error(`Failed to fetch ${endpoint}`);
  }
}