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
      navigate={(to) => {
        // Handle navigation more gracefully
        if (to.startsWith('/')) {
          window.location.href = to;
        } else {
          window.location.href = `/${to}`;
        }
      }}
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
