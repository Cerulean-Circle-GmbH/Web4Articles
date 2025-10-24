/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['test/**/*.test.ts'],
    exclude: ['test/data/**', 'test/logs/**', '**/node_modules/**'],
    testTimeout: 180000,   // 180s per test (3 minutes)
    hookTimeout: 30000,    // 30s for setup/teardown
    teardownTimeout: 10000, // 10s for cleanup
    bail: 1,               // Stop on first failure
    // CRITICAL: Run tests sequentially to prevent race conditions
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    fileParallelism: false,
    maxConcurrency: 1,
    // Multi-reporter: console + JSON for promotion verification
    reporters: ['default', 'json'],
    outputFile: './test/test-results.json'
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
