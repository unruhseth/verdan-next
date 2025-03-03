'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getApiUrl } from '@/utils/urls';
import { debugFetch } from '@/utils/debug';

export default function DebugPage() {
  const [apiUrl, setApiUrl] = useState<string>('');
  const [testResponse, setTestResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { getToken } = useAuth();

  useEffect(() => {
    // Test getApiUrl
    try {
      const url = getApiUrl();
      setApiUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get API URL');
    }
  }, []);

  const testEndpoint = async (endpoint: string) => {
    try {
      const token = await getToken();
      const response = await debugFetch(`${getApiUrl()}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      const data = await response.text();
      setTestResponse(`Status: ${response.status}\nResponse: ${data}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test endpoint');
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
          <p><strong>Constructed URL:</strong> {apiUrl}</p>
          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Test API Endpoints</h2>
          <div className="space-y-4">
            <button
              onClick={() => testEndpoint('/admin/accounts')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test /admin/accounts
            </button>
            
            <button
              onClick={() => testEndpoint('/health')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
            >
              Test /health
            </button>

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
              userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server Side',
              host: typeof window !== 'undefined' ? window.location.host : 'Server Side',
              hostname: typeof window !== 'undefined' ? window.location.hostname : 'Server Side',
              protocol: typeof window !== 'undefined' ? window.location.protocol : 'Server Side',
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}