import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // API 라우트가 런타임에 동적 경로로 subject YAML을 읽으므로, Next 파일 트레이서가
  // 못 따라가 Vercel에서 ENOENT가 날 수 있다. 명시적으로 번들에 포함시킨다.
  outputFileTracingIncludes: {
    '/api/chat': ['./src/subjects/**'],
    '/api/jd-match': ['./src/subjects/**'],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'eunsu-resume.vercel.app' }],
        destination: 'https://resume.eunsu.pro/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
