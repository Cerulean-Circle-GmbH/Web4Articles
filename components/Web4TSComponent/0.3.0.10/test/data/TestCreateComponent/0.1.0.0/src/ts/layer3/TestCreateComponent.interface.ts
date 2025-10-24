/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Scenario } from './Scenario.interface.js';
import { TestCreateComponentModel } from './TestCreateComponentModel.interface.js';

export interface TestCreateComponent {
  init(scenario: Scenario<TestCreateComponentModel>): this;
  toScenario(name?: string): Promise<Scenario<TestCreateComponentModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}