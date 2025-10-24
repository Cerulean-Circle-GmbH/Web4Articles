/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface BaseIOR {
  /**
   * Initialize from scenario - Web4 pattern
   */
  init(scenario: any): this;

  /**
   * Convert to scenario for hibernation
   */
  toScenario(): Promise<any>;

  /**
   * Validate reference format
   */
  validate(): boolean;

  /**
   * Get reference as string representation
   */
  toString(): string;
}