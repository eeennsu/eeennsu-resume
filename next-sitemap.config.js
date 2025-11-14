/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://eunsu-resume.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 5000,
  outDir: './public',
};

export default config;
