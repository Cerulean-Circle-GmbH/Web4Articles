/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { StorageScenario } from './StorageScenario.interface.js';
import { Scenario } from './Scenario.interface.js';

export interface Storage {
  /**
   * Initialize from scenario - Web4 pattern
   */
  init(scenario: StorageScenario): this;

  /**
   * Save scenario to UUID index with LD links
   */
  saveScenario(uuid: string, scenario: Scenario, symlinkPaths: string[]): Promise<void>;

  /**
   * Load scenario from UUID index
   */
  loadScenario(uuid: string): Promise<Scenario>;

  /**
   * Convert to scenario for hibernation
   */
  toScenario(): Promise<StorageScenario>;
}