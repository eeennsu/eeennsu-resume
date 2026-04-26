'use client';

import { useTheme, type Theme } from '@shared/components/ThemeProvider';
import { resolveDictionary } from '@shared/i18n/dictionaries';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState, type FC } from 'react';

const NEXT_THEME: Record<Theme, Theme> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

const ThemeIcon: FC<{ theme: Theme; size?: number }> = ({ theme, size = 18 }) => {
  if (theme === 'dark') return <Moon size={size} />;
  if (theme === 'light') return <Sun size={size} />;
  return <Monitor size={size} />;
};

const BUTTON_CLASS =
  'inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-200/60 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white';

const ThemeToggle: FC = () => {
  const { locale } = useParams<{ locale: string }>();
  const { dict } = resolveDictionary(locale);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button type='button' aria-label={dict.theme.ariaLabel} className={BUTTON_CLASS}>
        <ThemeIcon theme='system' />
      </button>
    );
  }

  const next = NEXT_THEME[theme];
  const label = dict.theme.currentTemplate
    .replace('{{current}}', dict.theme[theme])
    .replace('{{next}}', dict.theme[next]);

  return (
    <button
      type='button'
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      className={BUTTON_CLASS}
    >
      <ThemeIcon theme={theme} />
    </button>
  );
};

export default ThemeToggle;
