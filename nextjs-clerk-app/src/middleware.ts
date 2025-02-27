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
    "/apps(.*)",
    "/favicon.ico",
    "/_next/static/(.*)",
    "/_next/image(.*)",
    "/api/webhook(.*)"
  ],
  
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    "/api/health",
    "/_next/static/(.*)",
    "/favicon.ico",
    "/api/webhook(.*)"
  ],

  // For all other routes, check auth and roles
  afterAuth(auth, req) {
    try {
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
      
      // Allow access to API routes
      if (path.startsWith('/api/')) {
        return NextResponse.next();
      }

      // If no role is set, allow access to public routes only
      if (!normalizedRole && !auth.isPublicRoute) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      // If user is authenticated and it's a public route or matches their role, allow access
      if (auth.userId && (auth.isPublicRoute || path.includes(normalizedRole))) {
        return NextResponse.next();
      }

      // Default to next() for any other case
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      // In case of any error, allow the request to proceed
      return NextResponse.next();
    }
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