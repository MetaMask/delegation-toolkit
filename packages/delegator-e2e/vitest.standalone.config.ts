import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 120_000,
    hookTimeout: 120_000,
    // Standalone tests don't need environment setup or shared deployer
    fileParallelism: true,
    // No setup files - standalone tests are self-contained
    include: ['standalone-tests/**/*.test.ts'],
    exclude: ['contracts/**', 'test/**'],
  },
});
