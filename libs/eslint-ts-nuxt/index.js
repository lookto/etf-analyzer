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
      files: ['.src/server/**/*.ts'],
      rules: {
        'no-console': [
          'error',
          {
            allow: ['info', 'warn', 'trace', 'error'],
          },
        ],
      },
    },
    {
      files: ['./src/layouts/**/*.vue'],
      rules: {
        'vue/multi-word-component-names': [
          'error',
          {
            ignores: ['default'],
          },
        ],
      },
    },
    {
      files: ['./src/pages/**/*.vue'],
      rules: {
        'vue/multi-word-component-names': 'off', 
      }
    }
  ],
  ignorePatterns: ['.eslintrc.js'],
};
