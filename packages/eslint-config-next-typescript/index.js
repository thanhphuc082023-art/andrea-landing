/** @type {import('eslint').Linter.Config} */
module.exports = {
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@next/next/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-nested-ternary': 'off',
    '@next/next/no-html-link-for-pages': ['error', 'apps/fe/src/pages/'],
    'no-underscore-dangle': ['error', { allow: ['_count', '_sum'] }],
    'import/extensions': 'off',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'react/require-default-props': ['error', { functions: 'defaultArguments' }],
    'react/function-component-definition': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'react/jsx-props-no-spreading': [
      'error',
      {
        html: 'ignore',
      },
    ],
  },
  ignorePatterns: [
    '.next',
    '.turbo',
    'node_modules',
    '**/*.js',
    '**/*.mjs',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.ts',
  ],
};
