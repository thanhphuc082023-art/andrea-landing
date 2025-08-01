/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  rules: {
    'import/extensions': 'off',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'react/function-component-definition': 'off',
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
