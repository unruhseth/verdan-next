/**
 * Get the API URL
 * @returns The base API URL
 */
export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
  }

  // If the URL doesn't have a protocol, add https://
  if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
    return `https://${apiUrl}`;
  }

  // Remove trailing slash if present
  return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
}

export const getImageUrl = (path: string) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${getApiUrl()}${path}`;
}; 