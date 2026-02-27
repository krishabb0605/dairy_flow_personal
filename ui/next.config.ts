import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows any hostname
      },
      {
        protocol: 'http', // Consider if you truly need HTTP or only HTTPS
        hostname: '**',
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
