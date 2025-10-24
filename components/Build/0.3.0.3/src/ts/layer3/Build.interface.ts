/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface Build {
  /**
   * Build a component by path
   */
  buildComponent(componentPath: string): Promise<boolean>;

  /**
   * Build ONCE component specifically
   */
  buildONCE(): Promise<boolean>;

  /**
   * Clean component build artifacts
   */
  cleanComponent(componentPath: string): Promise<boolean>;

  /**
   * Resolve component dependencies
   */
  resolveDependencies(componentPath: string): Promise<string[]>;

  /**
   * Check if component needs building
   */
  needsBuild(componentPath: string): boolean;
}