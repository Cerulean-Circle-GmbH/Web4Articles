/**
 * PDCA Analysis Interfaces - Web4 Component Architecture
 * Purpose: Define data structures for PDCA session analysis
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