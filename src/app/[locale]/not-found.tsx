import { DEFAULT_LOCALE } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FC } from 'react';

const dict = getDictionary(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: dict.notFoundMeta.title,
  robots: { index: false, follow: false },
};

const NotFound: FC = () => {
  return (
    <div className='flex flex-col items-center justify-center pt-10 text-center'>
      <h2 className='mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100'>
        {dict.notFound.heading}
      </h2>
      <p className='mb-4 text-gray-500 dark:text-gray-400'>{dict.notFound.description}</p>
      <Link
        href={`/${DEFAULT_LOCALE}`}
        className='text-blue-500 hover:underline dark:text-blue-400'
      >
        {dict.notFound.home}
      </Link>
    </div>
  );
};

export default NotFound;
