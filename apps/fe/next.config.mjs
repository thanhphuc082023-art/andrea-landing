import bundeAnalyzer from '@next/bundle-analyzer';
import nextMDX from '@next/mdx';
import rehypePlugins from 'rehype-plugins';
import remarkPlugins from 'remark-plugins';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Completely disable ESLint
    ignoreDuringBuilds: true,
    dirs: [], // Don't run ESLint on any directories
  },
  typescript: {
    // Ignore TypeScript errors during build (optional)
    ignoreBuildErrors: true,
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
      'joyful-basket-ea764d9c28.media.strapiapp.com',
      'api.builder.io',
      'images.unsplash.com',
      'res.cloudinary.com',
      'cdn.builder.io',
      'strapi.andrea.dev',
      'andrea.dev',
      'andrea-landing.pages.dev',
      'localhost',
      'localhost:1337',
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
    optimizePackageImports: [
      'framer-motion',
      'clsx',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
    ],
    // Tắt SSR cho các component sử dụng WebGL
    esmExternals: 'loose',
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
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

    // Handle PDF.js worker files
    config.module.rules.push({
      test: /\.worker\.(js|mjs)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/worker/[hash][ext][query]',
      },
    });

    // Support for Three.js and GLTF files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    });

    // Tránh bundle Three.js trên server
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        'three',
        '@react-three/fiber',
        '@react-three/drei',
      ];
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
      // Override X-Frame-Options cho embed routes
      {
        source: '/embed/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: 'frame-ancestors *;',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      // Cache optimization cho embed pages
      {
        source: '/embed/e-profile/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
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
