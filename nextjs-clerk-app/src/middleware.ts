import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/(api|trpc)(.*)", "/_next(.*)", "/favicon.ico", "/sign-in(.*)", "/sign-up(.*)", "/apps(.*)"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};