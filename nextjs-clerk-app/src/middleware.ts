import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

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
    // Let Clerk handle the auth flow
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Get the role and normalize it
    const role = auth.sessionClaims?.org_role as string;
    const normalizedRole = role?.replace('-', '_');

    // Handle role-based routing for authenticated users
    if (auth.userId && !auth.isPublicRoute) {
      const segments = req.nextUrl.pathname.split('/').filter(Boolean);
      const firstSegment = segments[0];

      switch(normalizedRole) {
        case 'org:master_admin':
          if (firstSegment !== 'admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', req.url));
          }
          break;
        case 'org:account_admin':
          if (firstSegment !== 'account-admin') {
            return NextResponse.redirect(new URL('/account-admin/dashboard', req.url));
          }
          break;
        case 'org:user':
          if (firstSegment !== 'user') {
            return NextResponse.redirect(new URL('/user/dashboard', req.url));
          }
          break;
        default:
          return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

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