'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Collect environment info
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 10) + '...',
      NEXT_PUBLIC_CLERK_DOMAIN: process.env.NEXT_PUBLIC_CLERK_DOMAIN,
      host: window.location.host,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      fullUrl: window.location.href,
    };

    // Check what Clerk variables are available globally
    const clerkInfo = {
      Clerk: typeof (window as any).Clerk !== 'undefined',
      __clerk_frontend_api: (window as any).__clerk_frontend_api,
      __clerk_domain: (window as any).__clerk_domain,
    };

    setConfig({
      env: envInfo,
      clerk: clerkInfo,
      time: new Date().toISOString(),
    });

    // Try to detect Clerk script elements
    const scripts = document.querySelectorAll('script');
    const clerkScripts: string[] = [];
    
    scripts.forEach(script => {
      if (script.src && script.src.includes('clerk')) {
        clerkScripts.push(script.src);
      }
    });

    setConfig((prev: any) => ({ ...prev, clerkScripts }));
    setLoading(false);
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Clerk Domain Test Page</h1>
      
      {loading ? (
        <p>Loading configuration...</p>
      ) : (
        <div>
          <h2>Environment Info</h2>
          <pre style={{ background: '#f0f0f0', padding: '1rem', overflow: 'auto' }}>
            {JSON.stringify(config.env, null, 2)}
          </pre>
          
          <h2>Clerk Configuration</h2>
          <pre style={{ background: '#f0f0f0', padding: '1rem', overflow: 'auto' }}>
            {JSON.stringify(config.clerk, null, 2)}
          </pre>
          
          <h2>Clerk Scripts</h2>
          {config.clerkScripts?.length ? (
            <ul>
              {config.clerkScripts.map((script: string, i: number) => (
                <li key={i}>{script}</li>
              ))}
            </ul>
          ) : (
            <p>No Clerk scripts detected.</p>
          )}
          
          <h2>Troubleshooting</h2>
          <p>
            If you see <code>clerk.www.verdan.io</code> in any URLs, this is the issue.
            The domain should be <code>clerk.verdan.io</code> (without the www in the middle).
          </p>
          <p>
            Set <code>NEXT_PUBLIC_CLERK_DOMAIN=verdan.io</code> (without www) in your Vercel environment variables.
          </p>
        </div>
      )}
    </div>
  );
}