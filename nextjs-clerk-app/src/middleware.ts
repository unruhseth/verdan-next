import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Only check if user is logged in - let the API handle authorization
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/(.*)",
    "/apps(.*)",
    "/_next/(.*)",
    "/favicon.ico",
  ],
  
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    "/api/(.*)",
    "/_next/(.*)",
    "/favicon.ico",
  ],

  // For all other routes, check auth and roles
  afterAuth(auth, req) {
    // Allow public routes and authenticated users
    if (auth.isPublicRoute || auth.userId) {
      return NextResponse.next();
    }

    // Redirect to sign-in if not authenticated
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
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