'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getApiUrl, buildApiUrl } from '@/utils/urls';
import { debugFetch, debugLog } from '@/utils/debug';

export default function DebugPage() {
  const [apiUrl, setApiUrl] = useState<string>('');
  const [testResponse, setTestResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { getToken } = useAuth();

  useEffect(() => {
    // Test URL construction
    try {
      const baseUrl = getApiUrl();
      const testUrls = {
        base: baseUrl,
        accounts: buildApiUrl('/admin/accounts'),
        health: buildApiUrl('/health'),
      };
      setApiUrl(JSON.stringify(testUrls, null, 2));
      
      // Log window location information
      debugLog.env('Window Location:', {
        href: window.location.href,
        origin: window.location.origin,
        pathname: window.location.pathname,
        host: window.location.host
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get API URL');
    }
  }, []);

  const testEndpoint = async (endpoint: string) => {
    try {
      setError('');
      setTestResponse('Testing...');
      
      const token = await getToken();
      const url = buildApiUrl(endpoint);
      debugLog.api('Testing endpoint:', { url, endpoint });
      
      const response = await debugFetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      const data = await response.text();
      setTestResponse(`Status: ${response.status}\nResponse: ${data}`);
    } catch (err) {
      console.error('Test error:', err);
      setError(err instanceof Error ? err.message : 'Failed to test endpoint');
      setTestResponse('');
    }
  };

  const testDirectFetch = async () => {
    try {
      setError('');
      setTestResponse('Testing direct fetch...');
      
      const token = await getToken();
      const response = await fetch('https://api.verdan.io/admin/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      const data = await response.text();
      setTestResponse(`Direct fetch status: ${response.status}\nResponse: ${data}`);
    } catch (err) {
      console.error('Direct fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed direct fetch');
      setTestResponse('');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API Debug Page</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify({
              NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
              NODE_ENV: process.env.NODE_ENV,
            }, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">API URL Construction</h2>
          <pre className="whitespace-pre-wrap">{apiUrl}</pre>
          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Test API Endpoints</h2>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={() => testEndpoint('/admin/accounts')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Test /admin/accounts
              </button>
              
              <button
                onClick={() => testEndpoint('/health')}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Test /health
              </button>

              <button
                onClick={testDirectFetch}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Test Direct Fetch
              </button>
            </div>

            {testResponse && (
              <pre className="mt-4 p-4 bg-gray-200 rounded whitespace-pre-wrap">
                {testResponse}
              </pre>
            )}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Browser Information</h2>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify({
              userAgent: window.navigator.userAgent,
              host: window.location.host,
              hostname: window.location.hostname,
              protocol: window.location.protocol,
              origin: window.location.origin,
              pathname: window.location.pathname,
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}