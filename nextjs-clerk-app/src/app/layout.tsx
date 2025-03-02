import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

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
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#0F172A',
        },
      }}
      // Explicitly setting the Clerk domains
      clerkJSUrl="https://clerk.verdan.io/npm/@clerk/clerk-js@4/dist/clerk.browser.js"
      clerkJSVariant="headless"
      frontendApi="clerk.verdan.io"
      proxyUrl="https://www.verdan.io"
    >
      <html lang="en" className="h-full bg-gray-100">
        <head>
          <link 
            rel="stylesheet" 
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
          />
        </head>
        <body className={`${inter.className} h-full`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
