/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Model } from './Model.interface.js';

export interface PDCAModel extends Model {
  uuid: string;
  name: string;
  origin: string;
  definition: string;
  component: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  cmm3Violations?: { [key: string]: string[] }; // Store detailed violation info for cmm3check
  // Chain feature properties
  sessionDirectory?: string; // Directory where PDCAs are stored
  workingDirectory?: string; // Project root or working directory
  currentBranch?: string; // Git branch for GitHub URLs
  repoUrl?: string; // GitHub repository URL
  componentRoot?: string; // Component root directory (for tests - overrides workingDirectory)
}
