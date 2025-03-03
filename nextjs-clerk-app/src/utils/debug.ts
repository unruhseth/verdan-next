const DEBUG_PREFIX = '[VERDAN-DEBUG]';

export const debugLog = {
  url: (message: string, data?: any) => {
    console.log(`${DEBUG_PREFIX} URL: ${message}`, data || '');
  },
  api: (message: string, data?: any) => {
    console.log(`${DEBUG_PREFIX} API: ${message}`, data || '');
  },
  env: (message: string, data?: any) => {
    console.log(`${DEBUG_PREFIX} ENV: ${message}`, data || '');
  },
  error: (message: string, error?: any) => {
    console.error(`${DEBUG_PREFIX} ERROR: ${message}`, error || '');
  }
};

export const debugFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = input.toString();
  debugLog.api('Fetch Request:', {
    url,
    method: init?.method || 'GET',
    headers: init?.headers,
  });

  try {
    const response = await fetch(input, init);
    debugLog.api('Fetch Response:', {
      url,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });
    return response;
  } catch (error) {
    debugLog.error('Fetch Error:', error);
    throw error;
  }
}; 