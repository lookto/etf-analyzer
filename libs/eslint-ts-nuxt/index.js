/** @type {import('@typescript-eslint/utils').TSESLint.Linter.Config} **/
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-airbnb-with-typescript',
    'prettier',
  ],
  plugins: ['prettier'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['./server/**/*.ts'],
      rules: {
        'no-console': [
          'error',
          {
            allow: ['info', 'warn', 'trace', 'error'],
          },
        ],
      },
    },
  ],
  ignorePatterns: ['.eslintrc.js'],
};
