/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

// @ts-ignore - Cross-component import
import { Scenario } from '../../../../Scenario/0.3.0.2/dist/ts/Scenario.js';
import { UnitInput, UnitOutput } from './UnitModel.interface.js';

export interface Unit {
  init(scenario: Scenario): this;
  execute(input: UnitInput): Promise<UnitOutput>;
  toScenario(): Scenario;
}