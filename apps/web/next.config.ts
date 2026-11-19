import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@palbpearl/api-contract', '@palbpearl/mocks'],
};

export default nextConfig;