import { debugLog } from './debug';

/**
 * Get the API URL
 * @returns The base API URL for direct API calls
 */
export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || '';
}

export function buildApiUrl(path: string): string {
  // Ensure path starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiUrl()}${cleanPath}`;
}

export const getImageUrl = (path: string) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return buildApiUrl(path);
};