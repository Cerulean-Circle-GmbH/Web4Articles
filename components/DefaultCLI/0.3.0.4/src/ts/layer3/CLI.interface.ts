/**
 * CLI Interface - Base CLI component interface
 * Web4 principle: Single interface per file
 * Purpose: Foundation interface for all CLI implementations with scenario initialization
 */

import { Scenario } from './Scenario.interface.js';

export interface CLI {
  /**
   * Initialize CLI with scenario - Web4 pattern
   */
  init(scenario: Scenario): this;

  /**
   * Convert to scenario for hibernation
   */
  toScenario(): Promise<Scenario>;

  /**
   * Run CLI with command line arguments
   */
  run(args: string[]): Promise<void>;

  /**
   * Show usage information with terminal rendering
   */
  showUsage(): void;
}