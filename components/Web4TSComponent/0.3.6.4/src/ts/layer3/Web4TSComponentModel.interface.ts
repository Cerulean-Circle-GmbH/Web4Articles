/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Model } from './Model.interface.js';
import { ComponentStandard } from './ComponentStandard.interface.js';
import { ValidationRule } from './ValidationRule.interface.js';
import { ScaffoldingTemplate } from './ScaffoldingTemplate.interface.js';

export interface Web4TSComponentModel extends Model {
  // uuid inherited from Model - don't redeclare
  name: string;
  origin: string;
  definition: string;
  
  // Single source of truth: component identity
  component: string;  // Component name (e.g., 'Web4TSComponent')
  version: string;    // Version from directory name (e.g., X.Y.Z.W format)
  
  // Web4TSComponent-specific properties
  projectRoot: string;        // Discovered once at init, used for all absolute path operations
  targetDirectory: string;    // Can be overridden (e.g., test/data for test isolation)
  componentStandards: ComponentStandard[];
  validationRules: ValidationRule[];
  scaffoldingTemplates: ScaffoldingTemplate[];
  
  // Note: createdAt/updatedAt removed per Web4 principle - these belong in ChangeEvent
}
