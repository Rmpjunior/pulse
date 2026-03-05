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
  '/assets',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip for API routes and static files
  if (skipIntlRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Skip any request for static files in /public (e.g. .png, .jpg, .svg, .webp, .ico)
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // Apply i18n middleware for all other routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match app routes only (skip API, Next internals and static/public files)
    '/((?!api|_next|.*\\..*|favicon.ico|icons|assets|manifest.json|sw.js).*)',
  ],
};
