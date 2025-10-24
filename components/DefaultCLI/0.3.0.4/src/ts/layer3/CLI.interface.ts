/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Scenario } from './Scenario.interface.js';

export interface CLI {
  /**
   * Initialize CLI with scenario - Web4 pattern
   */
  init(scenario: Scenario): this;

  /**
   * Convert to scenario for hibernation
   */
  toScenario(): Promise<Scenario>;

  /**
   * Run CLI with command line arguments
   */
  run(args: string[]): Promise<void>;

  /**
   * Show usage information with terminal rendering
   */
  showUsage(): void;
}