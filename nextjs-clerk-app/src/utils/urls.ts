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
  
  // Clean the path by removing any domain references
  let cleanPath = path;
  
  // Remove any domain references from the path
  cleanPath = cleanPath.replace(/(https?:\/\/)?(www\.)?(api\.)?verdan\.io\/?/g, '');
  
  // Ensure path starts with a slash and remove duplicate slashes
  cleanPath = '/' + cleanPath.split('/').filter(Boolean).join('/');
  
  return `${baseUrl}${cleanPath}`;
}

export const getImageUrl = (path: string) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return buildApiUrl(path);
};