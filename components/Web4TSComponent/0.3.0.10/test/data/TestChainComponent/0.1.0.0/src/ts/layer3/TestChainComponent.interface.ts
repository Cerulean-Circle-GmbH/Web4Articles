/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Scenario } from './Scenario.interface.js';
import { TestChainComponentModel } from './TestChainComponentModel.interface.js';

export interface TestChainComponent {
  init(scenario: Scenario<TestChainComponentModel>): this;
  toScenario(name?: string): Promise<Scenario<TestChainComponentModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}