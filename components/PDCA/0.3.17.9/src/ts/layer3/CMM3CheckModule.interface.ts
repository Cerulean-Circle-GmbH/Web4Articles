/**
 * CMM3CheckModule - CMM3 Compliance Checking Interface
 * Radical OOP: Model-driven compliance checking
 */

import { Scenario } from './Scenario.interface.js';

export interface CMM3CheckModule {
  model: CMM3CheckModuleModel;
  init(scenario?: Scenario): this;
  checkFile(filePath: string): Promise<this>;
  checkSession(sessionPath?: string): Promise<this>;
}

export interface CMM3CheckModuleModel {
  projectRoot: string;
  currentFile?: {
    path: string;
    fileName: string;
    content: string;
    violations: string[];
  };
  sessionFiles: Map<string, string[]>;  // fileName -> violations
  summary: {
    total: number;
    cmm3: number;
    cmm2: number;
    cmm1: number;
  };
  output: string[];
  
  // Violation details for specific checks
  violationDetails: Map<string, string[]>;  // violation code -> details
}

export interface ViolationRule {
  code: string;
  description: string;
  check: (content: string, fileName?: string, filePath?: string) => boolean | Promise<boolean>;
}

