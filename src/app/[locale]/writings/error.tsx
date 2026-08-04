'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, type FC } from 'react';

import { DEFAULT_LOCALE, isLocale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

const WritingsError: FC<Props> = ({ error, reset }) => {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale && isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const t = dict.error;

  useEffect(() => {
    console.error('[writings/error]', error);
  }, [error]);

  return (
    <main className='flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center'>
      <h1 className='text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100'>
        {t.heading}
      </h1>
      <p className='max-w-md text-sm text-gray-600 dark:text-gray-400'>{t.description}</p>
      <div className='mt-2 flex gap-3'>
        <button
          type='button'
          onClick={reset}
          className='rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800'
        >
          {t.retry}
        </button>
        <Link
          href={`/${locale}`}
          className='rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:bg-blue-500/20'
        >
          {t.home}
        </Link>
      </div>
    </main>
  );
};

export default WritingsError;
