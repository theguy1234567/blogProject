import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/feed",
  "/healthcheck",
]);

const isPublicApiRoute = createRouteMatcher([
  "/api/feed",
  "/api/webhooks(.*)",
  "/api/healthcheck",
  "/api/debug",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  console.log("🔐 MIDDLEWARE userId:", userId, req.nextUrl.pathname);

  if (!userId && !isPublicRoute(req) && !isPublicApiRoute(req)) {
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
