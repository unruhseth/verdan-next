import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';

// Debug middleware function to diagnose domain issues
function debugMiddleware(req: NextRequest) {
  // Log detailed information about requests
  console.log('========== CLERK DOMAIN DEBUG ==========');
  console.log('URL:', req.url);
  console.log('Hostname:', req.nextUrl.hostname);
  console.log('Origin:', req.headers.get('origin'));
  
  // Look specifically for problematic clerk.www requests
  if (req.nextUrl.hostname.includes('clerk.www')) {
    console.log('PROBLEMATIC DOMAIN DETECTED: clerk.www');
    console.log('This usually happens when NEXT_PUBLIC_CLERK_DOMAIN includes "www"');
    console.log('The correct setting should be NEXT_PUBLIC_CLERK_DOMAIN=verdan.io (no www)');
  }
  
  // Get any Clerk JS environment variables that might be set
  console.log('CLERK ENV VARIABLES:');
  console.log('NEXT_PUBLIC_CLERK_DOMAIN:', process.env.NEXT_PUBLIC_CLERK_DOMAIN);
  
  // Continue to the next middleware
  return null;
}

// Create and export the combined middleware
const clerkMiddleware = authMiddleware({
  debug: true, // Enable Clerk's debug mode for troubleshooting
  // Public routes that don't require login
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/unauthorized",
    "/_next(.*)",
    "/fonts(.*)",
    "/images(.*)",
    "/favicon.ico",
    "/api(.*)",
    "/clerk(.*)", // Allow Clerk's own routes
    "/test", // Allow access to the test page for diagnostics
    "/debug", // Allow access to the debug page
    "/dns-check", // Allow access to the DNS check page
    "/api-test", // Allow access to the API test page
    "/api-config", // Allow access to the API configuration page
    "/api-direct-fix", // Allow access to the direct API fix page
  ],
  
  // For all other routes, check auth and roles
  afterAuth(auth, req) {
    // Debug logging
    console.log('Middleware executing for path:', req.nextUrl.pathname);
    console.log('Auth state:', {
      isPublicRoute: auth.isPublicRoute,
      userId: auth.userId,
      sessionId: auth.sessionId,
      sessionClaims: auth.sessionClaims
    });

    // Let Clerk handle the auth flow
    if (!auth.userId && !auth.isPublicRoute) {
      console.log('Redirecting to sign-in, no userId and not public route');
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Get the role and normalize it
    const role = auth.sessionClaims?.org_role as string;
    const normalizedRole = role?.replace('-', '_');
    console.log('User role:', { role, normalizedRole });

    // Handle role-based routing for authenticated users
    if (auth.userId && !auth.isPublicRoute) {
      const segments = req.nextUrl.pathname.split('/').filter(Boolean);
      const firstSegment = segments[0];
      console.log('Path segments:', { segments, firstSegment });

      switch(normalizedRole) {
        case 'org:master_admin':
          if (firstSegment !== 'admin') {
            console.log('Redirecting master admin to admin dashboard');
            return NextResponse.redirect(new URL('/admin/dashboard', req.url));
          }
          break;
        case 'org:account_admin':
          if (firstSegment !== 'account-admin') {
            console.log('Redirecting account admin to account-admin dashboard');
            return NextResponse.redirect(new URL('/account-admin/dashboard', req.url));
          }
          break;
        case 'org:user':
          if (firstSegment !== 'user') {
            console.log('Redirecting user to user dashboard');
            return NextResponse.redirect(new URL('/user/dashboard', req.url));
          }
          break;
        default:
          console.log('Unknown role, redirecting to unauthorized');
          return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    console.log('Allowing request to proceed');
    return NextResponse.next();
  },
});

// Combine the debug middleware with the Clerk middleware
export default function middleware(request: NextRequest) {
  // First, run our debug middleware that may fix domain issues
  const debugResponse = debugMiddleware(request);
  if (debugResponse) return debugResponse;
  
  // Then, run the Clerk middleware for authentication
  // @ts-ignore - The authMiddleware returns a function that takes a request
  return clerkMiddleware(request);
}

// Export the same matcher configuration
export const config = {
  matcher: [
    "/((?!.*\\.[\\w]+$|_next).*)", // Match all paths except static files
    "/",                           // Match root
    "/(api|trpc)(.*)",            // Match API routes
  ],
};