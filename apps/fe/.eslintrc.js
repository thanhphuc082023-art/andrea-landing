/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['next-typescript'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-boolean-value': 'off',
    'react/no-array-index-key': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    'react/require-default-props': 'off',
    'consistent-return': 'off',
  },
};
