/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface EnvironmentCheckResult {
  /**
   * Node.js availability and version
   */
  node: {
    available: boolean;
    version?: string;
    path?: string;
  };

  /**
   * NPM availability and version
   */
  npm: {
    available: boolean;
    version?: string;
    path?: string;
  };

  /**
   * Overall environment readiness
   */
  ready: boolean;

  /**
   * Environment platform detection
   */
  platform: 'linux' | 'darwin' | 'win32' | 'unknown';

  /**
   * Architecture information
   */
  arch: string;

  /**
   * Check timestamp
   */
  checkedAt: string;
}