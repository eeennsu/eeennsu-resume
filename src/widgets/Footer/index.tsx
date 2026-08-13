'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, type FC } from 'react';

import apiGetLatestTag from '@features/github/apis/getLatestTag';

import { resolveDictionary } from '@shared/i18n/dictionaries';

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
      <div className='flex flex-col items-center justify-center gap-2'>
        <span
          aria-hidden='true'
          className='mb-1 h-px w-10 rounded-full bg-blue-400/40 dark:bg-blue-300/30'
        />
        <p className='text-body-s text-muted-foreground tracking-tight md:text-sm'>
          {dict.footer.thanks}
        </p>
        <p className='font-pretendard text-caption tracking-[0.02em] text-gray-400 md:text-xs dark:text-gray-500'>
          © {new Date().getFullYear()} · Bang Eunsu
        </p>
        <div className='mt-0.5 flex h-4 items-center justify-center'>
          {version ? (
            <p className='text-caption tracking-eyebrow font-medium text-gray-400 uppercase tabular-nums dark:text-gray-500'>
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
