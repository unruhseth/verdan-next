import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

// Debug helper to log environment and configuration
const debugConfig = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_CLERK_DOMAIN: process.env.NEXT_PUBLIC_CLERK_DOMAIN,
  NEXT_PUBLIC_CLERK_FRONTEND_API: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
  host: typeof window !== 'undefined' ? window.location.host : 'server-side',
};

export const metadata = {
  title: 'Verdan Platform',
  description: 'Enterprise IoT Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClerkProvider
        appearance={{
          baseTheme: undefined,
          variables: {
            colorPrimary: '#0F172A',
          },
        }}
        // CRITICAL FIX: Use the environment variable for the domain
        // Make sure NEXT_PUBLIC_CLERK_DOMAIN=verdan.io is set in Vercel
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        domain={process.env.NEXT_PUBLIC_CLERK_DOMAIN}
      >
        <html lang="en" className="h-full bg-gray-100">
          <head>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
            />
            {/* Client-side debug script */}
            <Script id="clerk-debug" strategy="afterInteractive">
              {`
                console.log('===== CLERK DEBUG INFO =====');
                console.log('Document URL:', document.URL);
                console.log('Window location:', window.location.toString());
                console.log('Hostname:', window.location.hostname);
                console.log('ENV:', ${JSON.stringify(debugConfig)});
                
                // Print any Clerk global object
                document.addEventListener('DOMContentLoaded', () => {
                  console.log('Clerk global object:', window.Clerk ? 'Available' : 'Not available');
                  console.log('Clerk config:', window.__clerk_frontend_api, window.__clerk_domain);
                });
              `}
            </Script>
          </head>
          <body className={`${inter.className} h-full`}>
            {children}
            
            {/* Development mode debug panel */}
            {process.env.NODE_ENV !== 'production' && (
              <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: '#000',
                color: '#fff',
                padding: '10px',
                fontSize: '12px',
                zIndex: 9999,
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                <h4>Debug Info:</h4>
                <pre>{JSON.stringify(debugConfig, null, 2)}</pre>
              </div>
            )}
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
