import { debugLog } from './debug';

/**
 * Get the API URL
 * @returns The base API URL
 */
export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  debugLog.env('NEXT_PUBLIC_API_URL:', apiUrl);
  debugLog.env('Window Location:', typeof window !== 'undefined' ? window.location.href : 'server-side');

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

  // Ensure URL is treated as absolute by checking if it's a valid URL
  try {
    new URL(cleanUrl);
  } catch (e) {
    debugLog.error('Invalid URL format:', cleanUrl);
    throw new Error(`Invalid API URL format: ${cleanUrl}`);
  }

  debugLog.url('Final API URL:', cleanUrl);
  return cleanUrl;
}

export function buildApiUrl(path: string): string {
  const baseUrl = getApiUrl();
  debugLog.url('Building API URL from:', { baseUrl, path });

  // Split path and query parameters
  const [pathPart, ...queryParts] = path.split('?');
  const queryString = queryParts.length > 0 ? `?${queryParts.join('?')}` : '';
  debugLog.url('Split path and query:', { pathPart, queryString });

  // If the path is already a full URL, extract just the path portion
  let cleanPath = pathPart;
  try {
    const url = new URL(pathPart);
    cleanPath = url.pathname;
    debugLog.url('Extracted path from full URL:', cleanPath);
  } catch (e) {
    // Not a full URL, continue with path as is
    debugLog.url('Path is not a full URL, using as is');
  }

  // Remove any domain references from the path
  const domainPattern = /(https?:\/\/)?(www\.)?(api\.)?(www\.)?verdan\.io(\/|$)/g;
  cleanPath = cleanPath.replace(domainPattern, '');
  debugLog.url('After removing domain references:', cleanPath);

  // Clean up multiple slashes and ensure path starts with a single slash
  cleanPath = cleanPath.replace(/\/+/g, '/');
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`;
  }
  debugLog.url('After cleaning slashes:', cleanPath);

  // Remove duplicate path segments and handle edge cases
  const segments = cleanPath.split('/').filter(Boolean);
  const uniqueSegments = segments.filter((segment, index, array) => {
    // Skip segments that are part of the domain or duplicates
    if (segment.includes('verdan.io')) return false;
    if (segment === 'www' || segment === 'api') return false;
    const nextSegment = array[index + 1];
    return segment !== nextSegment;
  });
  cleanPath = '/' + uniqueSegments.join('/');
  debugLog.url('After removing duplicate segments:', cleanPath);

  // Remove trailing slash
  if (cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }

  const fullUrl = `${baseUrl}${cleanPath}${queryString}`;
  debugLog.url('Final built API URL:', fullUrl);
  return fullUrl;
}

export const getImageUrl = (path: string) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return buildApiUrl(path);
};