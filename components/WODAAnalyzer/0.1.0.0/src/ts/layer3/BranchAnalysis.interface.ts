/**
 * BranchAnalysis - Branch Analysis Data Interface
 * Represents analyzed data for a single Git branch
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

