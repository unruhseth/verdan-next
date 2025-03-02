import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Only check if user is logged in - let the API handle authorization
export default authMiddleware({
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
    // Get the current path segments
    const path = req.nextUrl.pathname;
    const segments = path.split('/').filter(Boolean);
    const firstSegment = segments[0];

    // Skip auth check for public routes
    if (auth.isPublicRoute) {
      return NextResponse.next();
    }

    // If not authenticated or token expired, redirect to sign-in
    if (!auth.userId || !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Get the role and normalize it
    const role = auth.sessionClaims?.org_role as string;
    const normalizedRole = role?.replace('-', '_');

    // Handle role-based routing
    if (auth.userId) {
      // Master admin can only access admin routes
      if (normalizedRole === 'org:master_admin') {
        if (firstSegment !== 'admin' && !auth.isPublicRoute) {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }
      } 
      // Account admin can only access account-admin routes
      else if (normalizedRole === 'org:account_admin') {
        if (firstSegment !== 'account-admin' && !auth.isPublicRoute) {
          return NextResponse.redirect(new URL('/account-admin/dashboard', req.url));
        }
      }
      // Regular users can only access user routes
      else if (normalizedRole === 'org:user') {
        if (firstSegment !== 'user' && !auth.isPublicRoute) {
          return NextResponse.redirect(new URL('/user/dashboard', req.url));
        }
      }
      // Unknown roles go to unauthorized
      else {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    return NextResponse.next();
  },

  // Debug mode for development
  debug: true, // Enable debug mode to see what's happening
});

export const config = {
  matcher: [
    "/((?!.*\\.[\\w]+$|_next).*)", // Match all paths except static files
    "/",                           // Match root
    "/(api|trpc)(.*)",            // Match API routes
  ],
};