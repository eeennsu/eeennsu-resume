import { NextResponse, type NextRequest } from 'next/server';

import { DEFAULT_LOCALE, isLocale, LOCALES } from '@shared/i18n/config';

const SEARCH_BOT_PATTERN = /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|naver|yeti/i;

const detectLocaleFromHeader = (acceptLanguage: string | null) => {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const candidates = acceptLanguage
    .split(',')
    .map(part => part.split(';')[0]?.trim().toLowerCase())
    .filter(Boolean) as string[];

  for (const candidate of candidates) {
    const base = candidate.split('-')[0];
    if (isLocale(base)) return base;
  }

  return DEFAULT_LOCALE;
};

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = LOCALES.some(
    locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) return NextResponse.next();

  const userAgent = request.headers.get('user-agent') ?? '';
  const isSearchBot = SEARCH_BOT_PATTERN.test(userAgent);

  const locale = isSearchBot
    ? DEFAULT_LOCALE
    : detectLocaleFromHeader(request.headers.get('accept-language'));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

  return NextResponse.redirect(url, 308);
};

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images|.*\\..*).*)',
  ],
};
