import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: ["/api/public"],

  // Ensure admin routes are protected
  afterAuth(auth, req, evt) {
    // Log request information
    console.log('Middleware processing:', {
      pathname: req.nextUrl.pathname,
      userId: auth.userId,
      isPublicRoute: req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/sign-in' || req.nextUrl.pathname === '/sign-up',
      host: req.headers.get('host'),
    });

    // Handle admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // If not authenticated, redirect to sign in
      if (!auth.userId) {
        console.log('Redirecting unauthenticated user to sign in');
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('redirect_url', req.url);
        return Response.redirect(signInUrl);
      }

      // User is authenticated, allow access
      console.log('Allowing authenticated access to admin route');
      return NextResponse.next();
    }

    // For all other routes, continue
    return NextResponse.next();
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 