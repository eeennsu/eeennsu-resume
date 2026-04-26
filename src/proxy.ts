import { DEFAULT_LOCALE, LOCALES, isLocale } from '@shared/i18n/config';
import { NextResponse, type NextRequest } from 'next/server';

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

  const locale = detectLocaleFromHeader(request.headers.get('accept-language'));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

  return NextResponse.redirect(url);
};

export const config = {
  matcher: ['/((?!_next|api|images|.*\\..*).*)'],
};
