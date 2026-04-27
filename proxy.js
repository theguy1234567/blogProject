import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)", // 👈 (.*) covers /sign-in/factor-one, /sign-in/sso-callback etc
  "/sign-up(.*)", // 👈 covers /sign-up/verify-email-address, /sign-up/continue etc
  "/",
  "/feed",
  "/healthcheck",
]);

const isPublicApiRoute = createRouteMatcher(["/api/feed", "/api/webhooks(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currenturl = new URL(req.url);
  const isHomepage = currenturl.pathname === "/feed";
  const isApireq = currenturl.pathname.startsWith("/api");

  // 👇 Don't redirect if they're in the middle of sign-up/sign-in flow
  const isAuthFlow =
    currenturl.pathname.startsWith("/sign-up") ||
    currenturl.pathname.startsWith("/sign-in");

  if (userId && isPublicRoute(req) && !isHomepage && !isAuthFlow) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  if (!userId) {
    if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  if (isApireq && !userId && !isPublicApiRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
