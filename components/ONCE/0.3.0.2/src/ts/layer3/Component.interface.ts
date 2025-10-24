/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { IOR } from '../../../../IOR/0.3.0.3/dist/index.js';
import { Scenario } from '../../../../Scenario/0.3.0.2/dist/ts/Scenario.js';

export interface Component {
  /**
   * Initialize component from scenario
   * Web4 Pattern: Scenario-based initialization using unified Scenario component
   */
  init(scenario: Scenario): this;

  /**
   * Start component execution
   */
  start(): Promise<void>;

  /**
   * Stop component execution  
   */
  stop(): Promise<void>;

  /**
   * Get component IOR for reference
   */
  getIOR(): IOR;

  /**
   * Save component state as scenario
   * Web4 Pattern: State hibernation returns actual Scenario component instance
   */
  toScenario(): Promise<Scenario>;

  /**
   * Check if component is running
   */
  isRunning(): boolean;
}