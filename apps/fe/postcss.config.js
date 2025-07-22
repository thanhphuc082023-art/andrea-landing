module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    // Add CSS optimization for production
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true,
            },
            normalizeUnicode: false,
            reduceIdents: false,
            // Keep important optimizations while being safe
            mergeRules: true,
            minifySelectors: true,
            minifyParams: true,
          },
        ],
      },
    }),
  },
};
