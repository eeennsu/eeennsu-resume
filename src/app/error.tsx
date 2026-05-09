'use client';

import { DEFAULT_LOCALE, isLocale } from '@shared/i18n/config';
import { resolveDictionary } from '@shared/i18n/dictionaries';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC, useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage: FC<Props> = ({ error, reset }) => {
  const params = useParams<{ locale?: string }>();
  const localeParam = params?.locale;
  const locale = localeParam && isLocale(localeParam) ? localeParam : DEFAULT_LOCALE;
  const { dict } = resolveDictionary(locale);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className='flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center'>
      <h2 className='mb-2 text-2xl font-bold text-gray-900 md:text-3xl dark:text-gray-100'>
        {dict.error.heading}
      </h2>
      <p className='mb-6 max-w-md text-sm leading-relaxed text-gray-500 md:text-base dark:text-gray-400'>
        {dict.error.description}
      </p>
      {process.env.NODE_ENV !== 'production' && error?.message && (
        <pre className='mb-6 max-w-xl overflow-auto rounded-md bg-gray-100 px-3 py-2 text-left text-xs text-gray-700 dark:bg-gray-900 dark:text-gray-300'>
          {error.message}
          {error.digest ? `\n\ndigest: ${error.digest}` : ''}
        </pre>
      )}
      <div className='flex items-center gap-2.5'>
        <button
          type='button'
          onClick={() => reset()}
          className='inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400'
        >
          {dict.error.retry}
        </button>
        <Link
          href={`/${locale}`}
          className='inline-flex h-10 items-center justify-center rounded-md border border-gray-200 px-4 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-900'
        >
          {dict.error.home}
        </Link>
      </div>
    </main>
  );
};

export default ErrorPage;
