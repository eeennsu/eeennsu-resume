import type { MetadataRoute } from 'next';

import { SITE_URL } from '@shared/consts/commons';

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.VERCEL_ENV === 'production';

  if (!isProd) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
