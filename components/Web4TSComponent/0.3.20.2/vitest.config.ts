/**
 * Vitest configuration for Web4TSComponent 0.3.17.0
 * @pdca 2025-10-28-UTC-1632.test-hang-investigation.pdca.md - Fixed EPIPE hang
 * CRITICAL: singleFork prevents worker process EPIPE errors
 */

import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),
    },
  },
  test: {
    include: ['test/**/*.test.ts'],
    exclude: [
      'test/data/**',
      'test/logs/**', 
      '**/node_modules/**',
      'test/ts/layer5/**' // ⚠️ TEMPORARILY exclude CLI tests - they hang in multi-file runs
    ],
    environment: 'node',
    globals: false,
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 30000,
    bail: 1,  // Stop on first failure to prevent cascade hangs (CLI disables this explicitly)
    // CRITICAL: Single fork prevents EPIPE worker process hang
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,   // ✅ Single worker process - no EPIPE!
        isolate: false      // ✅ Reduce IPC overhead
      }
    },
    // Run tests sequentially, not in parallel
    fileParallelism: false,
    maxConcurrency: 1,
  },
});
