import { SITE_URL } from '@shared/consts/commons';
import { TooltipProvider } from '@shared/shadcn-ui/ui/tooltip';
import type { Metadata } from 'next';

import Footer from '@widgets/Footer';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '방은수 | 프론트엔드 개발자 이력서',
    template: '%s | 방은수',
  },
  description:
    'TypeScript, React.js, Next.js 기반 프론트엔드 개발자 방은수의 이력서입니다. 경력, 기술 스택, 프로젝트 포트폴리오를 확인하세요.',
  authors: [
    {
      name: '방은수',
      url: 'https://github.com/eeennsu',
    },
  ],
  creator: '방은수',
  publisher: '방은수',
  twitter: {
    card: 'summary_large_image',
    title: '방은수 | 프론트엔드 개발자 이력서',
    description: 'TypeScript, React.js, Next.js 기반 프론트엔드 개발자 방은수의 이력서입니다.',
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
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: '방은수 이력서',
    title: '방은수 | 프론트엔드 개발자 이력서',
    description:
      'TypeScript, React.js, Next.js 기반 프론트엔드 개발자 방은수의 이력서입니다. 경력, 기술 스택, 프로젝트 포트폴리오를 확인하세요.',
    locale: 'ko_KR',
    images: [
      {
        url: '/images/profile.jpg',
        width: 800,
        height: 800,
        alt: '방은수 프론트엔드 개발자',
      },
    ],
  },
  keywords: [
    '프론트엔드 개발자',
    '방은수',
    '이력서',
    '포트폴리오',
    'Bang Eunsu',
    'React.js',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'Frontend Developer',
    'Resume',
    'Portfolio',
    '웹 개발자',
  ],
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: 'OaYKYfrRLPAqCUlI4N9byUHRsCKrHGoxyLq7yneX5-E',
  },
  other: {
    'naver-site-verification': 'c7ebb4013211c995cee367b539af4523c49db4ff',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body className='font-noto-sans_KR md:font-nanum-gothic antialiased'>
        <TooltipProvider>
          <div className='flex min-h-screen flex-col'>
            <div className='3xl:max-w-[1500px] mx-auto max-w-(--breakpoint-xl) grow px-3 xl:px-0'>
              {children}
            </div>
            <Footer />
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
