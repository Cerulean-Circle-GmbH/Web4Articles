/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Scenario } from './Scenario.interface.js';
import { OwnerParams } from './OwnerParams.interface.js';

export interface User {
  
  init(scenario: Scenario): this;

  
  generateOwnerData(params: OwnerParams): Promise<string>;

  
  toScenario(): Promise<Scenario>;
}


