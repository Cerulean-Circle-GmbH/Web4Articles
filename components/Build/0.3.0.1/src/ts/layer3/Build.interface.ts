/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface Build {
  /**
   * Initialize from scenario (Web4 pattern)
   */
  init(scenario: any): this;

  /**
   * Check build environment
   */
  checkEnvironment(): Promise<any>;

  /**
   * Build specific component by name
   */
  buildComponent(componentName: string): Promise<any>;

  /**
   * Build all components in dependency order
   */
  buildAll(): Promise<any[]>;

  /**
   * Build self (bootstrap capability)
   */
  buildSelf(): Promise<any>;

  /**
   * Get build information
   */
  info(args: string[]): Promise<void>;

  /**
   * Show build help
   */
  help(args: string[]): Promise<void>;

  /**
   * Start build component
   */
  start(args: string[]): Promise<void>;
}