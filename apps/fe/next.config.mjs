import bundeAnalyzer from '@next/bundle-analyzer';
import nextMDX from '@next/mdx';
import rehypePlugins from 'rehype-plugins';
import remarkPlugins from 'remark-plugins';

/** @type {import('next').NextConfig} */
const nextConfig = {
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
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Enable modern JavaScript features
    legacyBrowsers: false,
    browsersListForSwc: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Performance optimizations
  swcMinify: true,
  webpack: (config, { dev, isServer }) => {
    // Enable modern JavaScript features for better performance
    if (!dev && !isServer) {
      config.target = ['web', 'es2020'];
      config.resolve.alias = {
        ...config.resolve.alias,
        // Ensure modern builds
        '@babel/runtime': '@babel/runtime',
      };
    }
    return config;
  },
  modularizeImports: {
    'framer-motion': {
      transform: 'framer-motion/dist/es/{{member}}',
    },
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
