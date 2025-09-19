import { Noto_Sans_KR, Nanum_Gothic } from 'next/font/google';

export const notoSansKr = Noto_Sans_KR({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'fallback',
  subsets: ['latin'],
  style: 'normal',
  variable: '--font-noto-sans',
  fallback: ['system-ui'],
});

export const nanumGothic = Nanum_Gothic({
  weight: ['400', '700', '800'],
  display: 'fallback',
  subsets: ['latin'],
  style: 'normal',
  variable: '--font-nanum-gothic',
  fallback: ['system-ui'],
});
