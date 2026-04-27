import {
  auth,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
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

  if (userId && isPublicRoute(req) && !isHomepage) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }
  //notlogged in
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
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
