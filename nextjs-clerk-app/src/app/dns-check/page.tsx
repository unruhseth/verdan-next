'use client';

import { useEffect, useState } from 'react';

export default function DnsCheckPage() {
  const [results, setResults] = useState<any>({
    status: 'checking',
    checks: []
  });

  useEffect(() => {
    const runChecks = async () => {
      const checks: any[] = [];
      let overallStatus = 'success';

      // Add basic domain info
      checks.push({
        name: 'Current Domain',
        result: window.location.hostname,
        status: 'info'
      });

      // Try to fetch from clerk.verdan.io
      try {
        const startTime = Date.now();
        const response = await fetch('https://clerk.verdan.io/npm/@clerk/clerk-js@4/dist/clerk.browser.js', {
          method: 'HEAD',
          mode: 'no-cors', // This will make the request succeed even if CORS isn't enabled
          cache: 'no-cache'
        });
        const endTime = Date.now();
        const timeMs = endTime - startTime;
        
        checks.push({
          name: 'Clerk Domain Accessibility',
          result: `clerk.verdan.io is reachable (${timeMs}ms)`,
          status: 'success'
        });
      } catch (error) {
        checks.push({
          name: 'Clerk Domain Accessibility',
          result: `Error: clerk.verdan.io unreachable - ${error instanceof Error ? error.message : String(error)}`,
          status: 'error'
        });
        overallStatus = 'error';
      }

      // Try loading the Clerk script directly
      const script = document.createElement('script');
      script.src = 'https://clerk.verdan.io/npm/@clerk/clerk-js@4/dist/clerk.browser.js';
      script.async = true;
      
      const scriptPromise = new Promise<string>((resolve, reject) => {
        script.onload = () => resolve('Script loaded successfully');
        script.onerror = () => reject(new Error('Failed to load Clerk script'));
        
        // Set a timeout in case the script is hanging
        setTimeout(() => reject(new Error('Timeout loading script')), 5000);
      });
      
      document.head.appendChild(script);
      
      try {
        const result = await scriptPromise;
        checks.push({
          name: 'Clerk Script Loading',
          result: result,
          status: 'success'
        });
        
        // Check if Clerk global object exists after script load
        setTimeout(() => {
          const clerkExists = typeof (window as any).Clerk !== 'undefined';
          checks.push({
            name: 'Clerk Global Object',
            result: clerkExists ? 'Clerk global object exists' : 'Clerk global object missing',
            status: clerkExists ? 'success' : 'error'
          });
          
          if (!clerkExists) overallStatus = 'error';
          
          setResults({
            status: overallStatus,
            checks: [...checks]
          });
        }, 1000);
        
      } catch (error) {
        checks.push({
          name: 'Clerk Script Loading',
          result: `Error: ${error instanceof Error ? error.message : String(error)}`,
          status: 'error'
        });
        overallStatus = 'error';
      }

      // Send a request to check DNS propagation
      try {
        const response = await fetch('/api/check-dns');
        const data = await response.json();
        
        if (data.dnsLookup) {
          checks.push({
            name: 'DNS Lookup',
            result: data.dnsLookup,
            status: data.dnsLookup.includes('failed') ? 'error' : 'success'
          });
          
          if (data.dnsLookup.includes('failed')) overallStatus = 'error';
        }
      } catch (error) {
        checks.push({
          name: 'DNS Lookup',
          result: `Error checking DNS: ${error instanceof Error ? error.message : String(error)}`,
          status: 'error'
        });
      }

      setResults({
        status: overallStatus,
        checks: checks
      });
    };

    runChecks();
  }, []);

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-6">Clerk DNS & Configuration Check</h1>
      
      <div className="mb-4">
        <span className="font-semibold">Overall Status: </span>
        <span className={`inline-block px-2 py-1 rounded text-white ${
          results.status === 'checking' ? 'bg-blue-500' : 
          results.status === 'success' ? 'bg-green-500' : 
          'bg-red-500'
        }`}>
          {results.status === 'checking' ? 'Checking...' : 
           results.status === 'success' ? 'All Checks Passed' : 
           'Issues Found'}
        </span>
      </div>

      <div className="border rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Check</th>
              <th className="p-3 text-left">Result</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.checks.map((check: any, i: number) => (
              <tr key={i} className="border-t">
                <td className="p-3 font-medium">{check.name}</td>
                <td className="p-3 font-mono text-sm">{check.result}</td>
                <td className="p-3">
                  <span className={`inline-block px-2 py-1 rounded text-white text-xs ${
                    check.status === 'info' ? 'bg-blue-500' :
                    check.status === 'success' ? 'bg-green-500' : 
                    'bg-red-500'
                  }`}>
                    {check.status}
                  </span>
                </td>
              </tr>
            ))}
            {results.checks.length === 0 && (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500">
                  Running checks...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Troubleshooting Actions:</h2>
        <ol className="list-decimal ml-6 space-y-2">
          <li>Verify you have a <strong>CNAME record</strong> for <code>clerk.verdan.io</code> pointing to <code>clerk.accounts.dev</code></li>
          <li>Ensure your Clerk dashboard has <code>verdan.io</code> (without www) as the domain</li>
          <li>Check that your Vercel environment variables match what's shown in <a href="/test" className="text-blue-600 underline">the test page</a></li>
          <li>If DNS is configured correctly but still failing, try clearing browser cache or using incognito mode</li>
        </ol>
      </div>
    </div>
  );
}