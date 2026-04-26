import { SITE_URL } from '@shared/consts/commons';
import { DEFAULT_LOCALE, LOCALES } from '@shared/i18n/config';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const languages = Object.fromEntries(LOCALES.map(locale => [locale, `${SITE_URL}/${locale}`]));

  return LOCALES.map(locale => ({
    url: `${SITE_URL}/${locale}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: locale === DEFAULT_LOCALE ? 1.0 : 0.9,
    alternates: { languages },
  }));
}
