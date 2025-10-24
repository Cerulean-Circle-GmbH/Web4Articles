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
    testTimeout: 10000,
    hookTimeout: 10000,
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