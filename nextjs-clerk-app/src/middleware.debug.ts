import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Debug logging for Clerk domain issues
  console.log('======= MIDDLEWARE DEBUG INFO =======');
  console.log('Request URL:', request.url);
  console.log('Hostname:', request.nextUrl.hostname);
  console.log('Host:', request.headers.get('host'));
  console.log('Origin:', request.headers.get('origin'));
  console.log('Referer:', request.headers.get('referer'));
  console.log('User-Agent:', request.headers.get('user-agent'));
  
  // Check if this is a Clerk request
  if (request.nextUrl.pathname.includes('/clerk') || 
      request.nextUrl.pathname.includes('clerk-js') ||
      request.headers.get('referer')?.includes('/clerk')) {
    console.log('CLERK REQUEST DETECTED');
    console.log('Pathname:', request.nextUrl.pathname);
    
    // If this is trying to access clerk.www.verdan.io, redirect to clerk.verdan.io
    if (request.nextUrl.hostname === 'clerk.www.verdan.io') {
      console.log('Redirecting from clerk.www.verdan.io to clerk.verdan.io');
      const newUrl = request.nextUrl.clone();
      newUrl.hostname = 'clerk.verdan.io';
      return NextResponse.redirect(newUrl);
    }
  }
  
  // Don't forget to call the original middleware
  // We'll import and use the original Clerk middleware
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!.*\\.[\\w]+$|_next).*)", // Match all paths except static files
    "/",                           // Match root
    "/(api|trpc)(.*)",            // Match API routes
  ],
};