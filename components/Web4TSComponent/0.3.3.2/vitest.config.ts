/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['test/**/*.test.ts'],
    exclude: ['test/data/**', '**/node_modules/**'],  // Exclude test data and node_modules
    testTimeout: 5000,     // Reduced from 10s to 5s to catch hangs faster
    hookTimeout: 5000,     // Reduced from 10s to 5s
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
    maxConcurrency: 1
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});