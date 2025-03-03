import { debugLog } from './debug';

/**
 * Get the API URL
 * @returns The base API URL for direct API calls
 */
export function getApiUrl(): string {
  // In development, use the local API
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // In production, use the relative path (handled by Next.js rewrites)
  return '';
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