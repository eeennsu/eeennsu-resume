import type { Metadata, Viewport } from 'next';
import { Open_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';

import AiChat from '@widgets/AiChat';
import Footer from '@widgets/Footer';
import JdMatch from '@widgets/JdMatch';

import { JdMatchProvider } from '@features/jd-match/model/JdMatchContext';

import ThemeProvider, { THEME_STORAGE_KEY } from '@shared/components/ThemeProvider';
import { SITE_URL } from '@shared/consts/commons';
import { pretendard } from '@shared/font/fonts';
import {
  DEFAULT_LOCALE,
  HTML_LANG,
  isLocale,
  LOCALES,
  OG_LOCALE,
  type Locale,
} from '@shared/i18n/config';
import { getDictionary } from '@shared/i18n/dictionaries';
import { TooltipProvider } from '@shared/shadcn-ui/ui/tooltip';

import '../globals.css';

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
});

export const generateStaticParams = () => LOCALES.map(locale => ({ locale }));

const buildLanguageAlternates = () =>
  Object.fromEntries([
    ...LOCALES.map(l => [l, `${SITE_URL}/${l}`] as const),
    ['x-default', `${SITE_URL}/${DEFAULT_LOCALE}`] as const,
  ]);

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const dict = getDictionary(safeLocale);
  const url = `${SITE_URL}/${safeLocale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.title,
      template: dict.meta.titleTemplate,
    },
    description: dict.meta.description,
    authors: [
      {
        name: dict.jsonLd.name,
        url: 'https://github.com/eeennsu',
      },
    ],
    creator: dict.jsonLd.name,
    publisher: dict.jsonLd.name,
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.title,
      description: dict.meta.twitterDescription,
      images: ['/images/profile.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        'index': true,
        'follow': true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
      languages: buildLanguageAlternates(),
    },
    openGraph: {
      type: 'website',
      url,
      siteName: dict.meta.siteName,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: OG_LOCALE[safeLocale],
      alternateLocale: LOCALES.filter(l => l !== safeLocale).map(l => OG_LOCALE[l]),
      images: [
        {
          url: '/images/profile.jpg',
          width: 800,
          height: 800,
          alt: dict.meta.profileAlt,
        },
      ],
    },
    keywords: [...dict.meta.keywords],
    icons: {
      icon: '/favicon.ico',
    },
    verification: {
      google: 'OaYKYfrRLPAqCUlI4N9byUHRsCKrHGoxyLq7yneX5-E',
    },
    other: {
      'naver-site-verification': '3d91b29e70c4f78a0504a15b80638f0e9fa45c79',
    },
  };
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0e1a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

const themeInitScript = `(function(){try{var k='${THEME_STORAGE_KEY}';var s=localStorage.getItem(k);var t=(s==='light'||s==='dark'||s==='system')?s:'system';var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;if(r==='dark')e.classList.add('dark');e.style.colorScheme=r;}catch(_){}})();`;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const url = `${SITE_URL}/${locale}`;

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': dict.jsonLd.name,
    'alternateName': dict.jsonLd.alternateName,
    'jobTitle': dict.jsonLd.jobTitle,
    'description': dict.jsonLd.description,
    'url': url,
    'image': `${SITE_URL}/images/profile.jpg`,
    'email': 'mailto:xxx9901@naver.com',
    'sameAs': [
      'https://github.com/eeennsu',
      'https://velog.io/@diso592/posts',
      'https://eunstory.eunsu.pro',
    ],
    'knowsAbout': ['TypeScript', 'React.js', 'Next.js', 'React Native', 'JavaScript'],
  };

  return (
    <html
      lang={HTML_LANG[locale]}
      className={`${openSans.variable} ${pretendard.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className='bg-background text-foreground font-pretendard antialiased'>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider>
          <TooltipProvider>
            <JdMatchProvider>
              <div className='flex min-h-screen flex-col'>
                <div className='3xl:max-w-[1500px] mx-auto max-w-(--breakpoint-xl) grow px-3 xl:px-0'>
                  {children}
                </div>
                <Footer />
              </div>
              <AiChat locale={locale} labels={dict.aiChat} />
              <JdMatch locale={locale} labels={dict.jdMatch} />
            </JdMatchProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
