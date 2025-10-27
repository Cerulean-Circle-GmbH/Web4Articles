/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Scenario } from './Scenario.interface.js';
import { Model } from './Model.interface.js';


export interface Component<TModel extends Model = Model> {
  // ========================================
  // LIFECYCLE METHODS (Web4 pattern)
  // ========================================
  
  
  init(scenario: Scenario<TModel>): this;
  
  
  toScenario(name?: string): Promise<Scenario<TModel>>;
  
  // ========================================
  // DEVELOPMENT METHODS (Delegated to Web4TSComponent)
  // ========================================
  
  
  test(scope?: string, ...references: string[]): Promise<this>;
  
  
  build(): Promise<this>;
  
  
  clean(): Promise<this>;
  
  // ========================================
  // INTROSPECTION METHODS (Optional but useful)
  // ========================================
  
  
  tree?(depth?: string, showHidden?: string): Promise<this>;
  
  
  links?(action?: string): Promise<this>;
}

