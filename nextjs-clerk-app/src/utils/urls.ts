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

  // Remove any trailing slashes
  let cleanUrl = apiUrl.replace(/\/+$/, '');
  debugLog.url('After removing trailing slashes:', cleanUrl);

  // If the URL doesn't include a protocol, add https://
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = `https://${cleanUrl}`;
    debugLog.url('After adding protocol:', cleanUrl);
  }

  // Remove www prefix from API domain
  if (cleanUrl.includes('www.api.verdan.io')) {
    cleanUrl = cleanUrl.replace('www.api.verdan.io', 'api.verdan.io');
    debugLog.url('After removing www prefix:', cleanUrl);
  }

  debugLog.url('Final API URL:', cleanUrl);
  return cleanUrl;
}

export const getImageUrl = (path: string) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const url = `${getApiUrl()}${path}`;
  debugLog.url('Image URL:', url);
  return url;
}; 