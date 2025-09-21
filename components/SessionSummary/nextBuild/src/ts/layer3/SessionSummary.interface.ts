/**
 * SessionSummary Interface - Web4 Component Architecture
 * Purpose: Define contract for PDCA session analysis with TRON extraction and decisions tracking
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
  
  // NEW: Automated update methods
  onSessionSummaryGenerated(sessionPath: string, analyses: PDCAAnalysis[]): Promise<void>;
}

export interface ComponentWork {
  sessionFile: string;
  components: string[];
  achievement: string;
  timestamp: string;
}