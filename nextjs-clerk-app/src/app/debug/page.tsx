'use client';

import { useEffect, useState } from 'react';

type DebugInfo = {
  url: string;
  hostname: string;
  protocol: string;
  env: Record<string, string | undefined>;
  headers: Record<string, string>;
  clerk: {
    available: boolean;
    frontendApi?: string;
    domain?: string;
  };
  networkRequests: string[];
};

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Collect debug information
      const info: DebugInfo = {
        url: window.location.href,
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        env: {
          NODE_ENV: process.env.NODE_ENV,
          NEXT_PUBLIC_CLERK_DOMAIN: process.env.NEXT_PUBLIC_CLERK_DOMAIN,
          NEXT_PUBLIC_CLERK_FRONTEND_API: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
        },
        headers: {},
        clerk: {
          available: !!(window as any).Clerk,
          frontendApi: (window as any).__clerk_frontend_api,
          domain: (window as any).__clerk_domain,
        },
        networkRequests: [],
      };

      // Try to fetch headers
      fetch('/api/debug-headers')
        .then(res => res.json())
        .catch(() => ({}))
        .then(headers => {
          info.headers = headers || {};
          setDebugInfo(info);
          setLoading(false);
        });

      // Monitor for Clerk-related network requests
      const originalFetch = window.fetch;
      window.fetch = function(url, options) {
        if (typeof url === 'string' && url.includes('clerk')) {
          info.networkRequests.push(url.toString());
          setDebugInfo({...info});
        }
        return originalFetch.apply(this, arguments as any);
      };

      // Check DOM for Clerk script tags
      setTimeout(() => {
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
          if (script.src && script.src.includes('clerk')) {
            info.networkRequests.push(`SCRIPT SRC: ${script.src}`);
            setDebugInfo({...info});
          }
        });
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="p-8">Loading debug information...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Clerk Debug Information</h1>
      
      <div className="mb-8 bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Location</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="font-medium">URL:</div>
          <div>{debugInfo?.url}</div>
          <div className="font-medium">Hostname:</div>
          <div>{debugInfo?.hostname}</div>
          <div className="font-medium">Protocol:</div>
          <div>{debugInfo?.protocol}</div>
        </div>
      </div>

      <div className="mb-8 bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <pre className="bg-black text-green-400 p-4 rounded overflow-auto">
          {JSON.stringify(debugInfo?.env, null, 2)}
        </pre>
      </div>

      <div className="mb-8 bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Headers</h2>
        <pre className="bg-black text-green-400 p-4 rounded overflow-auto">
          {JSON.stringify(debugInfo?.headers, null, 2)}
        </pre>
      </div>

      <div className="mb-8 bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Clerk Status</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="font-medium">Clerk Available:</div>
          <div>{debugInfo?.clerk.available ? 'Yes' : 'No'}</div>
          <div className="font-medium">Frontend API:</div>
          <div>{debugInfo?.clerk.frontendApi || 'Not set'}</div>
          <div className="font-medium">Domain:</div>
          <div>{debugInfo?.clerk.domain || 'Not set'}</div>
        </div>
      </div>

      <div className="mb-8 bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Clerk Network Requests</h2>
        {debugInfo?.networkRequests.length === 0 ? (
          <div className="italic text-gray-500">No Clerk network requests detected</div>
        ) : (
          <ul className="list-disc pl-5">
            {debugInfo?.networkRequests.map((req, idx) => (
              <li key={idx} className="mb-2">{req}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-sm text-gray-500 mt-8">
        This information can help debug Clerk authentication issues. 
        Take a screenshot or copy this information when reporting issues.
      </div>
    </div>
  );
}