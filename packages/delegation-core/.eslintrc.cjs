/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['../../shared/config/library.eslint.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['artifacts/*'],
};
