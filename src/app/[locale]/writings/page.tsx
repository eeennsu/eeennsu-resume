import { SITE_URL } from '@shared/consts/commons';
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type FC } from 'react';

import VelogArchiveWidget from '@widgets/VelogArchive';

interface Props {
  params: Promise<{ locale: string }>;
}

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

const WritingsPage: FC<Props> = async ({ params }) => {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <VelogArchiveWidget locale={locale} />;
};

export default WritingsPage;
