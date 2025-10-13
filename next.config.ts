import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 't.me' },
      { protocol: 'https', hostname: 'coin-images.coingecko.com' },
    ],
    unoptimized: false,
  },
  serverExternalPackages: ['pg'],
  webpack: (config) => {
    config.externals.push({
      'pg-native': 'pg-native',
    });
    return config;
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
