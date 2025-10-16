/**
 * WODAAnalyzerModel - WODA Analyzer Model Interface
 * Web4 principle: Single interface per file, minimal Model extension
 * Purpose: Component model for branch analysis and WODA generation
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

