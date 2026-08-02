'use client';

import { Github, Settings, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { FC } from 'react';

import { useJdMatch } from '@features/jd-match/model/JdMatchContext';

import LanguageToggle from '@shared/components/LanguageToggle';
import ThemeToggle from '@shared/components/ThemeToggle';
import { MY_PROFILE } from '@shared/consts/commons';
import { resolveDictionary } from '@shared/i18n/dictionaries';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/shadcn-ui/ui/popover';
import { cn } from '@shared/shadcn-ui/utils';

interface Props {
  isHeaderVisible: boolean;
  isNewVelogPost: boolean;
}

const iconButtonClass =
  'inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-200/60 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-blue-400/60 dark:focus-visible:ring-offset-gray-950';

const navLinkClass =
  'relative cursor-pointer inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200/60 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-blue-400/60 dark:focus-visible:ring-offset-gray-950';

const Header: FC<Props> = ({ isHeaderVisible, isNewVelogPost }) => {
  const { locale } = useParams<{ locale: string }>();
  const { dict } = resolveDictionary(locale);
  const { openModal: openJdMatch } = useJdMatch();

  return (
    <header
      className={cn(
        'fixed top-0 left-0 z-50 w-full transition-all duration-300 ease-out',
        isHeaderVisible
          ? 'bg-white/30 shadow-md backdrop-blur-lg dark:bg-gray-950/40 dark:shadow-black/40'
          : 'pointer-events-none bg-transparent',
      )}
    >
      <div className='mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6'>
        <div
          className={cn(
            'flex items-end gap-2 transition-opacity duration-300',
            isHeaderVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <p className='font-pretendard text-xl font-semibold tracking-tight text-gray-800 sm:text-2xl dark:text-gray-100'>
            {dict.jsonLd.name}
          </p>
          <span className='hidden text-sm text-gray-700 sm:inline dark:text-gray-400'>
            {MY_PROFILE.BIRTHDAY}
          </span>
        </div>

        <div className='pointer-events-auto flex items-center gap-1 p-1 backdrop-blur-md'>
          <Link href={`/${locale}/writings`} className={navLinkClass}>
            {dict.writings.nav.link}
            {isNewVelogPost && (
              <span
                aria-hidden
                className='absolute top-1 right-1 size-1.5 rounded-full bg-rose-500 dark:bg-rose-400'
              />
            )}
            {isNewVelogPost && <span className='sr-only'>{dict.writings.recent.badge}</span>}
          </Link>

          <button type='button' onClick={openJdMatch} className={navLinkClass}>
            <Sparkles aria-hidden='true' className='size-3.5 text-blue-500 dark:text-blue-400' />
            {dict.header.jdMatchLink}
          </button>

          <div className='h-4 w-px bg-gray-300 dark:bg-gray-600' />

          <Popover>
            <PopoverTrigger aria-label={dict.header.settingsAriaLabel} className={iconButtonClass}>
              <Settings size={18} aria-hidden='true' />
            </PopoverTrigger>
            <PopoverContent align='end' className='w-64'>
              <div className='flex flex-col gap-3 p-1'>
                <div className='flex flex-col gap-1.5'>
                  <span className='px-1 text-[11px] font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400'>
                    {dict.header.settingsLanguage}
                  </span>
                  <LanguageToggle />
                </div>
                <div className='flex flex-col gap-1.5'>
                  <span className='px-1 text-[11px] font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400'>
                    {dict.header.settingsTheme}
                  </span>
                  <ThemeToggle />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className='h-4 w-px bg-gray-300 dark:bg-gray-600' />

          <Link
            href='https://github.com/eeennsu'
            target='_blank'
            rel='noopener noreferrer'
            aria-label={`${dict.header.githubAriaLabel} (${dict.externalLink.newTab})`}
            className={iconButtonClass}
          >
            <Github size={18} aria-hidden='true' />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
