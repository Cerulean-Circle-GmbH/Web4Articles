/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Scenario } from './Scenario.interface.js';

export interface Unit {
  /**
   * Initialize from scenario - Web4 pattern
   */
  init(scenario: Scenario): this;

  /**
   * Transform data directly - no Input/Output protocol
   */
  transform(data: unknown): unknown;

  /**
   * Validate object directly - no Input/Output protocol
   */
  validate(object: any): boolean;

  /**
   * Process unit logic directly - no Input/Output protocol
   */
  process(): void;

  /**
   * Convert to scenario for hibernation
   */
  toScenario(name?: string): Promise<Scenario>;
}