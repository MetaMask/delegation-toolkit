import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 120_000,
    hookTimeout: 120_000,
    // External integration tests don't need environment setup or shared deployer
    fileParallelism: true,
    // No setup files - external tests are self-contained
    include: ['external-integration-tests/**/*.test.ts'],
    exclude: ['contracts/**', 'test/**'],
  },
});
