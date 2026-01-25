import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n/config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'never', // No locale prefix since we only support Portuguese
});

// Routes that should skip i18n (API routes, static files)
const skipIntlRoutes = [
  '/api',
  '/_next',
  '/favicon.ico',
  '/manifest.json',
  '/sw.js',
  '/icons',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip for API routes and static files
  if (skipIntlRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Apply i18n middleware for all other routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all paths except static files and API
    '/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)',
  ],
};
