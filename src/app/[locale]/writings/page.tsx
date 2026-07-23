import { SITE_URL } from '@shared/consts/commons';
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type FC } from 'react';

import VelogArchiveWidget from '@widgets/VelogArchive';

import type { WritingsView } from '@features/velog/ui/TabTriggers';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ view?: string | string[]; tag?: string | string[] }>;
}

const resolveView = (raw: string | string[] | undefined): WritingsView =>
  (Array.isArray(raw) ? raw[0] : raw) === 'timeline' ? 'timeline' : 'tag';

const resolveTag = (raw: string | string[] | undefined): string | null => {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value?.trim() ? value : null;
};

export const generateStaticParams = () => LOCALES.map(locale => ({ locale }));

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const dict = getDictionary(safeLocale);

  const t = dict.writings;
  const url = `${SITE_URL}/${safeLocale}/writings`;

  return {
    title: t.pageTitle,
    description: t.pageDescription,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/writings`] as const)),
    },
    openGraph: {
      title: `${t.pageTitle} | ${dict.meta.siteName}`,
      description: t.pageDescription,
      url,
      type: 'website',
    },
  };
};

const WritingsPage: FC<Props> = async ({ params, searchParams }) => {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const search = await searchParams;
  const currentView = resolveView(search.view);
  const activeTag = resolveTag(search.tag);

  return <VelogArchiveWidget locale={locale} currentView={currentView} activeTag={activeTag} />;
};

export default WritingsPage;
