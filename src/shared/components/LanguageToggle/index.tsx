'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import type { FC } from 'react';

import { DEFAULT_LOCALE, isLocale, LOCALE_LABELS, LOCALES, type Locale } from '@shared/i18n/config';
import { resolveDictionary } from '@shared/i18n/dictionaries';
import { cn } from '@shared/shadcn-ui/utils';

const LOCALE_SHORT: Record<Locale, string> = {
  ko: 'KO',
  en: 'EN',
};

const LanguageToggle: FC = () => {
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname() || `/${DEFAULT_LOCALE}`;
  const { dict } = resolveDictionary(locale);

  const currentLocale: Locale = isLocale(locale) ? locale : DEFAULT_LOCALE;

  const buildHref = (target: Locale) =>
    pathname === `/${currentLocale}`
      ? `/${target}`
      : pathname.replace(`/${currentLocale}/`, `/${target}/`);

  return (
    <div
      role='group'
      aria-label={dict.languageToggle.label}
      className='flex rounded-lg border border-gray-200 bg-gray-100/60 p-0.5 dark:border-gray-800 dark:bg-gray-900/60'
    >
      {LOCALES.map(target => {
        const isActive = target === currentLocale;
        return (
          <Link
            key={target}
            href={buildHref(target)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`${dict.languageToggle.label}: ${LOCALE_LABELS[target]}`}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-center text-xs font-semibold tracking-wide uppercase transition-colors',
              'focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-blue-400/60',
              isActive
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-100'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
            )}
          >
            {LOCALE_SHORT[target]}
          </Link>
        );
      })}
    </div>
  );
};

export default LanguageToggle;
