/**
 * Vitest configuration for Web4TSComponent 0.3.17.0
 * @pdca 2025-10-28-UTC-0934.pdca.md:494 - Phase 0: Test infrastructure
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
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000,
    globals: false,
  },
});
