'use client';

import { resolveDictionary } from '@shared/i18n/dictionaries';
import { useParams } from 'next/navigation';
import { useEffect, useState, type FC } from 'react';

import apiGetLatestTag from '@features/github/apis/getLatestTag';

const DEFAULT_VERSION = 'v.2.2.4';

const Footer: FC = () => {
  const { locale } = useParams<{ locale: string }>();
  const { dict } = resolveDictionary(locale);
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    const fetchLatestTag = async () => {
      try {
        const latestTag = await apiGetLatestTag();

        setVersion(latestTag || DEFAULT_VERSION);
      } catch (error) {
        console.error(error);
        setVersion(DEFAULT_VERSION);
      }
    };

    fetchLatestTag();
  }, []);

  return (
    <footer className='mt-12 w-full border-t border-gray-100 py-8 text-center md:mt-16 md:py-10 dark:border-gray-800'>
      <div className='flex flex-col items-center justify-center gap-1.5'>
        <p className='text-[13px] tracking-tight text-gray-500 md:text-sm dark:text-gray-400'>
          {dict.footer.thanks}
        </p>
        <div className='flex h-4 items-center justify-center'>
          {version ? (
            <p className='text-[11px] font-medium tracking-[0.14em] text-gray-400 uppercase tabular-nums dark:text-gray-500'>
              {version}
            </p>
          ) : (
            <span
              aria-hidden='true'
              className='h-3 w-16 animate-pulse rounded bg-gray-200/70 dark:bg-gray-800/70'
            />
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
