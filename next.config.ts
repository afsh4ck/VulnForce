import type {NextConfig} from 'next';

// Standalone output is only needed for the Docker image (deploy.sh / Dockerfile
// set NEXT_STANDALONE=true). A local `pnpm build && pnpm start` uses the normal
// output so it works on macOS/Windows without the build-trace step failing.
const standaloneOutput = process.env.NEXT_STANDALONE === 'true';

const nextConfig: NextConfig = {
  ...(standaloneOutput ? {output: 'standalone'} : {}),
  // `pnpm dev` writes to `.next-dev`; `pnpm build` / `pnpm start` use `.next`.
  // Separate directories let a production build coexist with a dev server, so
  // you can switch between `pnpm dev` and `pnpm build && pnpm start` without
  // rebuilding. Docker/CI run `next build` (NODE_ENV=production) and use `.next`.
  distDir:
    process.env.NEXT_DIST_DIR ||
    (process.env.NODE_ENV === 'development' ? '.next-dev' : '.next'),
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
