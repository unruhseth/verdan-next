'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ApiDirectFix() {
  useEffect(() => {
    // Force update browser cache of environment variables and patch fetch
    if (typeof window !== 'undefined') {
      try {
        // Store the correct API URL
        const correctApiUrl = 'https://www.api.verdan.io';
        
        // Create a global variables store without TypeScript errors
        // @ts-ignore
        window._verdan_config = {
          apiUrl: correctApiUrl
        };
        
        // Monkey patch fetch to force correct URL construction
        const originalFetch = window.fetch;
        window.fetch = function(input, init) {
          if (typeof input === 'string') {
            // If input is a string and contains api.verdan.io without http/https
            if (input.includes('api.verdan.io') && !input.match(/^https?:\/\//)) {
              // Replace it with the correct URL
              input = `https://www.api.verdan.io${input.includes('/') ? input.substring(input.indexOf('/')) : ''}`;
              console.log('[API FIX] Corrected API URL to:', input);
            }
          }
          return originalFetch.call(this, input, init);
        };
        
        console.log('[API FIX] Applied fetch patch and environment override');
      } catch (e) {
        console.error('[API FIX] Error patching fetch:', e);
      }
    }
  }, []);

  // Force redirect to admin page to test fix
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/admin/accounts';
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-blue-100 border border-blue-300 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">API URL Direct Fix Applied</h1>
        
        <div className="mb-6">
          <p className="mb-2">This page is applying a direct fix to the API URL issue by:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>Patching the <code className="bg-blue-50 px-1">window.fetch</code> function to correctly format API URLs</li>
            <li>Ensuring environment variables are correctly applied at runtime</li>
            <li>Forcing a clean URL construction for API calls</li>
          </ul>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <h2 className="font-bold text-yellow-800 mb-2">Current Configuration:</h2>
          <p className="mb-2">These are the current environment settings detected:</p>
          <ul className="space-y-1 font-mono text-sm">
            <li><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || '(not set)'}</li>
            <li><strong>NEXT_PUBLIC_CLERK_DOMAIN:</strong> {process.env.NEXT_PUBLIC_CLERK_DOMAIN || '(not set)'}</li>
            <li><strong>NODE_ENV:</strong> {process.env.NODE_ENV || '(not set)'}</li>
          </ul>
        </div>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
          <h2 className="font-bold text-green-800 mb-2">Next Steps:</h2>
          <p className="mb-1">You will be automatically redirected to the admin/accounts page in 5 seconds to test if the fix works.</p>
          <p>If that doesn't work, try:</p>
          <ol className="list-decimal list-inside space-y-1 text-green-700 mt-2">
            <li>Clearing your browser cache or using an incognito window</li>
            <li>Redeploying the application from Vercel dashboard</li>
            <li>Checking browser console for any remaining errors</li>
          </ol>
        </div>
        
        <div className="flex space-x-4 mt-6">
          <Link href="/admin/accounts" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Go to Accounts Page Now
          </Link>
          <Link href="/" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}