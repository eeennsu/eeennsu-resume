'use client';

import LanguageToggle from '@shared/components/LanguageToggle';
import ThemeToggle from '@shared/components/ThemeToggle';
import { MY_PROFILE } from '@shared/consts/commons';
import { resolveDictionary } from '@shared/i18n/dictionaries';
import { Github } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  isHeaderVisible: boolean;
}

const Header: FC<Props> = ({ isHeaderVisible }) => {
  const { locale } = useParams<{ locale: string }>();
  const { dict } = resolveDictionary(locale);

  return (
    <header
      className={twMerge(
        'fixed top-0 left-0 z-50 w-full bg-white/30 shadow-md backdrop-blur-lg transition-opacity duration-300 ease-out dark:bg-gray-950/40 dark:shadow-black/40',
        isHeaderVisible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4'>
        <div className='flex items-end gap-2'>
          <p className='font-pretendard text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-100'>
            {dict.jsonLd.name}
          </p>
          <span className='text-sm text-gray-700 dark:text-gray-400'>{MY_PROFILE.BIRTHDAY}</span>
        </div>

        <div className='flex items-center gap-1'>
          <LanguageToggle />
          <ThemeToggle />
          <Link
            href='https://github.com/eeennsu'
            target='_blank'
            rel='noopener noreferrer'
            aria-label={dict.header.githubAriaLabel}
            className='inline-flex size-9 items-center justify-center rounded-md text-gray-800 transition-colors hover:bg-gray-200/60 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-blue-400'
          >
            <Github size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
