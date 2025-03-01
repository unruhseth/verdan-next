import { getApiUrl } from './urls';

export function getImageUrl(path: string | null): string | null {
  if (!path) return null;
  
  // If the URL is already absolute, return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Otherwise, assume it's a relative path and prepend the API URL
  return `${getApiUrl()}/admin/static/uploads/${path}`;
} 