'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { buildApiUrl } from '@/utils/urls';

interface DebugInfo {
  window?: {
    location: string;
    hostname: string;
    origin: string;
    href: string;
  };
  env: {
    NEXT_PUBLIC_API_URL?: string;
    NEXT_PUBLIC_CLERK_DOMAIN?: string;
    NODE_ENV?: string;
  };
  request?: {
    url: string;
    finalUrl: string;
    headers: Record<string, string>;
    response?: any;
  };
}

export default function TestPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_CLERK_DOMAIN: process.env.NEXT_PUBLIC_CLERK_DOMAIN,
      NODE_ENV: process.env.NODE_ENV,
    }
  });
  const [accounts, setAccounts] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    // Collect window information
    setDebugInfo(prev => ({
      ...prev,
      window: {
        location: window.location.toString(),
        hostname: window.location.hostname,
        origin: window.location.origin,
        href: window.location.href,
      }
    }));

    // Make API call
    const fetchAccounts = async () => {
      try {
        const token = await getToken();
        const url = buildApiUrl('/admin/accounts');
        
        console.log('Making request to:', url);
        
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        // Update debug info with request details
        setDebugInfo(prev => ({
          ...prev,
          request: {
            url: url,
            finalUrl: url,
            headers: headers,
          }
        }));

        const response = await fetch(url, { headers });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Update debug info with response
        setDebugInfo(prev => ({
          ...prev,
          request: {
            ...prev.request!,
            response: {
              status: response.status,
              headers: Object.fromEntries(response.headers.entries()),
              data: data
            }
          }
        }));

        setAccounts(Array.isArray(data) ? data.length : null);
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchAccounts();
  }, [getToken]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      {/* Environment Information */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(debugInfo.env, null, 2)}
        </pre>
      </section>

      {/* Window Information */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Window Information</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(debugInfo.window, null, 2)}
        </pre>
      </section>

      {/* Request Information */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Request Information</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(debugInfo.request, null, 2)}
        </pre>
      </section>

      {/* Results */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Results</h2>
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        ) : accounts !== null ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Number of accounts: {accounts}
          </div>
        ) : (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            Loading...
          </div>
        )}
      </section>
    </div>
  );
} 