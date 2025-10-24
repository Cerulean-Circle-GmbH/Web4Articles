/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

// @ts-ignore - Cross-component import
import { Scenario } from '../../../../Scenario/0.1.3.0/dist/ts/Scenario.js';
import { AuthCredentials } from './UserModel.interface.js';

export interface User {
  init(scenario: Scenario): this;
  authenticate(credentials: AuthCredentials): Promise<boolean>;
  toScenario(): Scenario;
}