/**
 * Get the API URL
 * @returns The base API URL
 */
export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
  }

  // Remove any trailing slashes
  let cleanUrl = apiUrl.replace(/\/+$/, '');

  // If the URL doesn't include a protocol, add https://
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = `https://${cleanUrl}`;
  }

  // Remove www prefix from API domain
  if (cleanUrl.includes('www.api.verdan.io')) {
    cleanUrl = cleanUrl.replace('www.api.verdan.io', 'api.verdan.io');
  }

  return cleanUrl;
}

export const getImageUrl = (path: string) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${getApiUrl()}${path}`;
}; 