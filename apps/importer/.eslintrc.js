module.exports = {
  ...require('@etf-analyzer/config-eslint-ts'),
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
};
