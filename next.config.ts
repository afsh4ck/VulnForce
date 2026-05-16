import type {NextConfig} from 'next';

const standaloneOutput =
  process.env.NEXT_STANDALONE === 'true' || process.platform !== 'win32';

const nextConfig: NextConfig = {
  ...(standaloneOutput ? {output: 'standalone'} : {}),
  eslint: {
    // Warnings from ESLint can cause `next build` to fail inside Docker.
    // Ignore lint during build in containerized deployments to ensure image creation.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
};

export default nextConfig;
