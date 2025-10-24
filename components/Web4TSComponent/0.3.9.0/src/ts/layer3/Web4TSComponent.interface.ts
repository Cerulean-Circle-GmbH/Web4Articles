/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Scenario } from './Scenario.interface.js';

export interface Web4TSComponent {
  // Web4 standard methods
  init(scenario: Scenario): this;
  transform(data?: unknown): this;
  validate(object?: any): this;
  process(): this;
  
  // Component-specific methods
  generateLocationResilientCLI(componentName: string, version: string): Promise<string>;
  
  // Configuration methods
  setTargetDirectory(directory: string): void;
}