import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  debug: process.env.NODE_ENV !== 'production', // Only enable debug in development
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

export const config = {
  matcher: [
    "/((?!.*\\.[\\w]+$|_next).*)", // Match all paths except static files
    "/",                           // Match root
    "/(api|trpc)(.*)",            // Match API routes
  ],
};