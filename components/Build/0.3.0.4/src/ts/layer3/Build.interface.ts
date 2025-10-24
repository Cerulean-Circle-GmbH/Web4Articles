/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Scenario } from './Scenario.interface.js';

export interface Build {
  /**
   * Initialize from scenario - Web4 pattern
   */
  init(scenario: Scenario): this;

  /**
   * Convert to scenario for hibernation
   */
  toScenario(): Promise<Scenario>;

  /**
   * Build component with dependency resolution (CLI method naming convention v0.1.2.2)
   */
  component(componentPath: string): Promise<boolean>;

  /**
   * Resolve dependencies for component (CLI method naming convention v0.1.2.2)
   */
  resolve(componentPath: string): Promise<boolean>;

  /**
   * Validate component build state (CLI method naming convention v0.1.2.2)
   */
  validate(componentPath: string): Promise<boolean>;

  /**
   * Clean component build artifacts (CLI method naming convention v0.1.2.2)
   */
  clean(componentPath: string): Promise<boolean>;

  /**
   * Show build system info (CLI method naming convention v0.1.2.2)
   */
  info(): Promise<void>;

  /**
   * Show help message (CLI method naming convention v0.1.2.2)
   */
  help(): void;
}