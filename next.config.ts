// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: { remotePatterns: [{ protocol: 'https', hostname: 't.me' }, {protocol: 'https', hostname: 'coin-images.coingecko.com'}] }

// };

// export default nextConfig;


import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 't.me' },
      { protocol: 'https', hostname: 'coin-images.coingecko.com' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['pg'],
  },
  webpack: (config) => {
    config.externals.push({
      'pg-native': 'pg-native',
    });
    return config;
  },
};

export default nextConfig;
