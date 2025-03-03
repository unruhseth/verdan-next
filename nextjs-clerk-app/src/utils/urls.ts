import { debugLog } from './debug';

/**
 * Get the API URL
 * @returns The base API URL
 */
export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  debugLog.env('NEXT_PUBLIC_API_URL:', apiUrl);

  if (!apiUrl) {
    const error = new Error('NEXT_PUBLIC_API_URL environment variable is not set');
    debugLog.error('API URL Error:', error);
    throw error;
  }

  // Remove trailing slash if present
  return apiUrl.replace(/\/$/, '');
}

export function buildApiUrl(path: string): string {
  const baseUrl = getApiUrl();
  
  // Ensure path starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${cleanPath}`;
}

export const getImageUrl = (path: string) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return buildApiUrl(path);
};