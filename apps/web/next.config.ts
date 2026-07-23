import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@sajilo/types',
    '@sajilo/api',
    '@sajilo/validation',
    '@sajilo/config',
  ],
};

export default nextConfig;
