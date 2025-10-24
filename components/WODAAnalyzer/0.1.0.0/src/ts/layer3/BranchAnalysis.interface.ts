/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface BranchAnalysis {
  number: number;
  name: string;
  shortSha: string;
  date: string;
  message: string;
  age: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  githubLink: string;
  
  // Statistics
  commitsAhead: number;
  pdcaFiles: number;
  componentFiles: number;
  testFiles: number;
  
  // WODA sections
  what: string;
  overview: string[];
  details: string;
  action: string;
}

