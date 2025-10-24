/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Model } from './Model.interface.js';

export interface WODAAnalyzerModel extends Model {
  // Component identity
  component: string;  // 'WODAAnalyzer'
  version: string;    // Version from directory name
  
  // Project context
  projectRoot: string;
  gitRemote: string;
  targetBranch: string;  // e.g., 'origin/release/dev'
  
  // Analysis configuration
  outputPath: string;
  maxBranches: number;
  priorityThresholds: {
    critical: number;    // Branch index for CRITICAL (1)
    high: number;        // Branch index for HIGH (1-9)
    medium: number;      // Branch index for MEDIUM (1-24)
  };
}

