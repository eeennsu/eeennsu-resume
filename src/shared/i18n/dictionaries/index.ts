import { DEFAULT_LOCALE, isLocale, type Locale } from '@shared/i18n/config';

import { en } from './en';
import { ko } from './ko';

const dictionaries = { ko, en } as const;

export const getDictionary = (locale: Locale) => dictionaries[locale];

export const resolveDictionary = (value: string | string[] | undefined) => {
  const candidate = Array.isArray(value) ? value[0] : value;
  const locale: Locale = candidate && isLocale(candidate) ? candidate : DEFAULT_LOCALE;
  return { locale, dict: dictionaries[locale] };
};

export type { Dictionary } from './ko';
