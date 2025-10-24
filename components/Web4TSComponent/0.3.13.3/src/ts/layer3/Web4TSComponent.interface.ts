/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Component } from './Component.interface.js';
import { Scenario } from './Scenario.interface.js';
import { Web4TSComponentModel } from './Web4TSComponentModel.interface.js';

export interface Web4TSComponent extends Component<Web4TSComponentModel> {
  // Web4 standard methods (from Component)
  // init(scenario: Scenario): this; - inherited
  // test(scope?: string, ...references: string[]): Promise<this>; - inherited
  // build(): Promise<this>; - inherited
  // clean(): Promise<this>; - inherited
  // tree?(depth?: string, showHidden?: string): Promise<this>; - inherited
  
  transform(data?: unknown): this;
  validate(object?: any): this;
  // process() - REMOVED: placebo method with no value
  
  // Component-specific methods
  generateLocationResilientCLI(componentName: string, version: string): Promise<string>;
  
  // Configuration methods
  setTargetDirectory(directory: string): void;
}