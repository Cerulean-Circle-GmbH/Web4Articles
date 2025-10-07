import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['test/**/*.test.ts'],
    exclude: ['test/data/**', 'test/logs/**', '**/node_modules/**'],  // Exclude test data, logs, and node_modules
    testTimeout: 180000,   // 180s per test (3 minutes) - standardized timeout
    hookTimeout: 30000,    // 30s for setup/teardown
    teardownTimeout: 10000, // 10s for cleanup
    bail: 1,               // Stop on first failure to prevent cascade hangs
    // CRITICAL: Run tests sequentially to prevent race conditions
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    // Run tests in sequence, not parallel
    fileParallelism: false,
    maxConcurrency: 1,
    // Multi-reporter: console + JSON for structured output
    reporters: ['default', 'json'],
    outputFile: './test/test-results.json'
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});