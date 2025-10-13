import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 't.me' },
      { protocol: 'https', hostname: 'coin-images.coingecko.com' },
    ],
  },
  serverExternalPackages: ['pg'],
};

export default nextConfig;
