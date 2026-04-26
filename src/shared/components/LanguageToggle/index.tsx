'use client';

import { DEFAULT_LOCALE, LOCALE_LABELS, type Locale, isLocale } from '@shared/i18n/config';
import { resolveDictionary } from '@shared/i18n/dictionaries';
import { Languages } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import type { FC } from 'react';

const LanguageToggle: FC = () => {
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname() || `/${DEFAULT_LOCALE}`;
  const { dict } = resolveDictionary(locale);

  const currentLocale: Locale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const otherLocale: Locale = currentLocale === 'ko' ? 'en' : 'ko';

  const targetPath =
    pathname === `/${currentLocale}`
      ? `/${otherLocale}`
      : pathname.replace(`/${currentLocale}/`, `/${otherLocale}/`);

  const label = `${dict.languageToggle.label}: ${LOCALE_LABELS[otherLocale]}`;

  return (
    <Link
      href={targetPath}
      aria-label={label}
      title={label}
      className='inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-[12px] font-semibold tracking-wide text-gray-700 uppercase transition-colors hover:bg-gray-200/60 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white'
    >
      <Languages size={16} />
      {otherLocale.toUpperCase()}
    </Link>
  );
};

export default LanguageToggle;
