/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Scenario } from './Scenario.interface.js';
import { BranchAnalysis } from './BranchAnalysis.interface.js';

export interface WODAAnalyzer {
  // Web4 standard methods
  init(scenario: Scenario): this;
  transform(data?: unknown): this;
  validate(object?: any): this;
  process(): Promise<this>;
  
  // Component-specific methods
  analyzeBranches(): Promise<BranchAnalysis[]>;
  generateWODADocument(analyses: BranchAnalysis[]): Promise<string>;
  writeDocument(content: string): Promise<void>;
  
  // Configuration
  setProjectRoot(root: string): void;
  setOutputPath(path: string): void;
}

