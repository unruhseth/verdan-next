import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: ["/api/public"],

  // Ensure admin routes are protected
  afterAuth(auth, req, evt) {
    // Handle admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // Redirect if not authenticated
      if (!auth.userId) {
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('redirect_url', req.url);
        return Response.redirect(signInUrl);
      }
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 