import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'velog.velcdn.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.velog.io', pathname: '/**' },
    ],
  },
};

export default nextConfig;
