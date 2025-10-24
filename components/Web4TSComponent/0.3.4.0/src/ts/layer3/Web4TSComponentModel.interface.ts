/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Model } from './Model.interface.js';

export interface Web4TSComponentModel extends Model {
  uuid: string;
  name: string;
  origin: string;
  definition: string;
  
  // Web4TSComponent-specific properties
  targetDirectory: string;
  componentStandards: ComponentStandard[];
  validationRules: ValidationRule[];
  scaffoldingTemplates: ScaffoldingTemplate[];
  
  createdAt: string;
  updatedAt: string;
}

export interface ComponentStandard {
  name: string;
  version: string;
  description: string;
  requirements: string[];
  validationRules: string[];
}

export interface ValidationRule {
  name: string;
  pattern: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export interface ScaffoldingTemplate {
  name: string;
  type: 'file' | 'directory';
  path: string;
  content?: string;
  conditions?: string[];
}