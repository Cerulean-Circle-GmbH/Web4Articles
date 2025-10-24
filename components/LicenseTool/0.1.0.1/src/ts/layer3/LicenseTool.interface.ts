/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

/**
 * LicenseTool - LicenseTool Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { LicenseToolModel } from './LicenseToolModel.interface.js';

export interface LicenseTool {
  init(scenario: Scenario<LicenseToolModel> | { targetPath?: string }): Promise<this>;
  toScenario(name?: string): Promise<Scenario<LicenseToolModel>>;
  check(targetPath?: string): Promise<this>;
  apply(targetPath?: string, dryRun?: boolean | string): Promise<this>;
  test(): Promise<this>;
}
