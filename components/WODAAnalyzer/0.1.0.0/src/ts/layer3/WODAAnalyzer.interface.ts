/**
 * WODAAnalyzer - WODA Analysis Component Interface
 * Web4 pattern: Component interface with standard Web4 methods + domain-specific methods
 */

import { Scenario } from './Scenario.interface.js';
import { BranchAnalysis } from './BranchAnalysis.interface.js';

export interface WODAAnalyzer {
  // Web4 standard methods
  init(scenario: Scenario): this;
  transform(data?: unknown): this;
  validate(object?: any): this;
  process(): Promise<this>;
  
  // Component-specific methods
  analyzeBranches(): Promise<BranchAnalysis[]>;
  generateWODADocument(analyses: BranchAnalysis[]): Promise<string>;
  writeDocument(content: string): Promise<void>;
  
  // Configuration
  setProjectRoot(root: string): void;
  setOutputPath(path: string): void;
}

