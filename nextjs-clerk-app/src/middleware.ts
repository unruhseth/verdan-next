import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Only check if user is logged in - let the API handle authorization
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/health",
    "/apps(.*)"],
  
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    "/api/health",
    "/_next/static/(.*)",
    "/favicon.ico",
  ],

  // For all other routes, check auth and roles
  afterAuth(auth, req) {
    // Handle public routes
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Get the role and normalize it
    const role = auth.sessionClaims?.org_role as string;
    const normalizedRole = role?.replace('-', '_');

    // Get the current path segments
    const path = req.nextUrl.pathname;
    const segments = path.split('/').filter(Boolean);
    const firstSegment = segments[0];

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
      else if (!auth.isPublicRoute) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    return NextResponse.next();
  },
});

// Update config to match Clerk's requirements
export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ]
};