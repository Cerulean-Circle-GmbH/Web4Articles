/**
 * CLI Interface - Base CLI component interface with static start pattern
 * Web4 principle: Single interface per file, radical OOP static methods
 * Purpose: Foundation interface for all CLI implementations with Scenario pattern
 */

import { Scenario } from './Scenario.interface.js';
import { CLIModel } from './CLIModel.interface.js';

export interface CLI {
  // Note: Static methods cannot be in TypeScript interfaces
  // Static start() method implemented directly in classes
  
  /**
   * Initialize CLI with Scenario
   * Web4 pattern: Components ALWAYS init with Scenario
   */
  init(scenario: Scenario<CLIModel>): this;
  
  /**
   * Execute CLI commands
   */
  execute(args: string[]): Promise<void>;
  
  /**
   * Show usage information
   */
  showUsage(): void;
}