module.exports = {
  ...require('@etf-analyzer/config-eslint-ts-nuxt'),
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
};

