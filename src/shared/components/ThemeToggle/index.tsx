'use client';

import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState, type FC } from 'react';

import { useTheme, type Theme } from '@shared/components/ThemeProvider';
import { resolveDictionary } from '@shared/i18n/dictionaries';
import { cn } from '@shared/shadcn-ui/utils';

interface Option {
  value: Theme;
  Icon: LucideIcon;
}

const OPTIONS: Option[] = [
  { value: 'light', Icon: Sun },
  { value: 'dark', Icon: Moon },
  { value: 'system', Icon: Monitor },
];

const ThemeToggle: FC = () => {
  const { locale } = useParams<{ locale: string }>();
  const { dict } = resolveDictionary(locale);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme: Theme = mounted ? theme : 'system';

  return (
    <div
      role='group'
      aria-label={dict.theme.ariaLabel}
      className='flex rounded-lg border border-gray-200 bg-gray-100/60 p-0.5 dark:border-gray-800 dark:bg-gray-900/60'
    >
      {OPTIONS.map(({ value, Icon }) => {
        const isActive = value === currentTheme;
        return (
          <button
            key={value}
            type='button'
            aria-pressed={isActive}
            aria-label={dict.theme[value]}
            onClick={() => setTheme(value)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
              'focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-blue-400/60',
              isActive
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-100'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
            )}
          >
            <Icon className='size-3.5' aria-hidden />
            <span>{dict.theme[value]}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
