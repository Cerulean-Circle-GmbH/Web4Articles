/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { PDCAAnalysis, SessionAnalysisOptions, SessionSummaryResult } from './PDCAAnalysis.interface.js';

export interface ISessionSummary {
  findPDCAFiles(sessionPath: string): string[];
  extractTRONQuotes(content: string): string;
  extractQADecisions(content: string): string;
  extractAchievement(content: string, filename: string): string;
  getGitInfo(filename: string): { sha: string; timestamp: string; message: string; utcTime: string };
  analyzePDCA(filename: string): PDCAAnalysis | null;
  generateSummary(options: SessionAnalysisOptions): SessionSummaryResult;
}