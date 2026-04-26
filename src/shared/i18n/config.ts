export const LOCALES = ['ko', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ko';

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
};

export const HTML_LANG: Record<Locale, string> = {
  ko: 'ko',
  en: 'en',
};

export const OG_LOCALE: Record<Locale, string> = {
  ko: 'ko_KR',
  en: 'en_US',
};

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);
