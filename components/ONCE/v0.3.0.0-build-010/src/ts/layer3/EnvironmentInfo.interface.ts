/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface EnvironmentInfo {
  /**
   * Platform type where ONCE kernel is running
   */
  platform: 'node' | 'browser' | 'worker' | 'pwa' | 'iframe';

  /**
   * Platform version information
   */
  version: string;

  /**
   * Available platform capabilities
   */
  capabilities: string[];

  /**
   * Whether platform is online/connected
   */
  isOnline: boolean;

  /**
   * Host information where kernel is running
   */
  hostname: string;

  /**
   * IP address information
   */
  ip: string;
}