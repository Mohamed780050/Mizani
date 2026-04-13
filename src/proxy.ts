import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  apiWebhookPrefix,
  DEFAULT_LOGIN_REDIRECT,
} from "@/routes";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const i18nMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow API Auth & Webhook routes to pass through without internationalization
  if (
    pathname.startsWith(apiAuthPrefix) ||
    pathname.startsWith(apiWebhookPrefix)
  ) {
    return NextResponse.next();
  }

  // 2. Handle i18n routing (Redirects to /ar or /en automatically)
  const response = i18nMiddleware(request);

  // 3. Get Session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 4. Strip locale for route matching (e.g., "/ar/dashboard" -> "/dashboard")
  const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, "") || "/";

  // 5. Extract locale
  const segment = pathname.split("/")[1];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const locale = routing.locales.includes(segment as any)
    ? segment
    : routing.defaultLocale;

  // 6. Routes evaluation
  const isPublicRoute = publicRoutes.includes(pathWithoutLocale);
  const isAuthRoute = authRoutes.includes(pathWithoutLocale);

  // 7. Redirect logged-in users away from auth pages (e.g. sign-in, sign-up)
  if (isAuthRoute && session) {
    return NextResponse.redirect(
      new URL(`/${locale}${DEFAULT_LOGIN_REDIRECT}`, request.nextUrl.origin)
    );
  }

  // 8. Allow access to public and auth routes without an active session
  if (isPublicRoute || isAuthRoute) {
    return response;
  }

  // 9. Protect routes: if the user lacks a session, redirect to the sign-in page
  if (!session) {
    return NextResponse.redirect(
      new URL(`/${locale}/sign-in`, request.nextUrl.origin)
    );
  }

  // 10. Trap new users in Onboarding flow
  // BetterAuth injects onboardingComplete via additionalFields configuration
  const isOnboardingComplete = (session.user as any).onboardingComplete === true;
  const isOnboardingRoute = pathWithoutLocale.startsWith("/onboarding");

  if (!isOnboardingComplete && !isOnboardingRoute) {
    return NextResponse.redirect(new URL(`/${locale}/onboarding`, request.nextUrl.origin));
  }

  // 11. Prevent fully onboarded users from accessing onboarding
  if (isOnboardingComplete && isOnboardingRoute) {
    return NextResponse.redirect(new URL(`/${locale}${DEFAULT_LOGIN_REDIRECT}`, request.nextUrl.origin));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)",
    "/(api|trpc)(.*)",
  ],
};
