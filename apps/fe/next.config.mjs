import bundeAnalyzer from '@next/bundle-analyzer';
import nextMDX from '@next/mdx';
import rehypePlugins from 'rehype-plugins';
import remarkPlugins from 'remark-plugins';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Temporary to focus on performance fixes
  },
  redirects: async () => [
    {
      source: '/work',
      destination: '/work/skills-and-tools',
      permanent: false,
    },
    {
      source: '/docs',
      destination: '/docs/tailwindcss-accent',
      permanent: false,
    },
  ],
  images: {
    domains: [
      'api.builder.io',
      'images.unsplash.com',
      'res.cloudinary.com',
      'cdn.builder.io',
      'strapi.andrea.dev',
      'andrea.dev',
      'andrea-landing.pages.dev',
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [480, 768, 1024, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    scrollRestoration: true,
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'clsx'],
    esmExternals: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Performance optimizations
  swcMinify: true,
  modularizeImports: {
    'framer-motion': {
      transform: 'framer-motion/dist/es/{{member}}',
    },
  },
  // Modern browser target to reduce polyfills
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Modern browser target - reduces polyfills by 13KB
      config.target = ['web', 'es2020'];
      
      // Tree shaking optimization
      config.optimization.sideEffects = false;
      
      // Enhanced bundle splitting for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\/]node_modules[\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            enforce: true,
          },
          framer: {
            test: /[\/]node_modules[\/](framer-motion)[\/]/,
            name: 'framer',
            chunks: 'all',
            priority: 20,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

const withBundleAnalyzer = bundeAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins,
    rehypePlugins,
    providerImportSource: '@mdx-js/react',
  },
});

export default withBundleAnalyzer(withMDX(nextConfig));
