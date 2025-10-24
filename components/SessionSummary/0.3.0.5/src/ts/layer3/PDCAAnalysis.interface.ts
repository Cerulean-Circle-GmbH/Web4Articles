/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface PDCAAnalysis {
  sha: string;
  filename: string;
  relativePath: string;
  tronQuotes: string;
  qaDecisions: string;
  achievement: string;
  timestamp: string;
  commitMessage: string;
  utcTime: string;
}

export interface SessionAnalysisOptions {
  sessionPath: string;
  outputFile?: string;
  branch?: string;
  includeDecisions?: boolean;
  format?: 'table' | 'json' | 'csv';
}

export interface SessionSummaryResult {
  sessionName: string;
  totalPDCAs: number;
  analyses: PDCAAnalysis[];
  generatedPath: string;
  timestamp: string;
}