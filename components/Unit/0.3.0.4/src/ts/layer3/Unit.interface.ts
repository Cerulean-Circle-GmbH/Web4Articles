/**
 * Unit Interface - Simple atomic execution element
 * Web4 principle: Single interface per file
 */

import { Scenario } from './Scenario.interface.js';

export interface Unit {
  /**
   * Initialize from scenario - Web4 pattern
   */
  init(scenario: Scenario): this;

  /**
   * Execute unit logic
   */
  execute(input: UnitInput): Promise<UnitOutput>;

  /**
   * Convert to scenario for hibernation
   */
  toScenario(): Promise<Scenario>;
}

export interface UnitInput {
  data: unknown;
  metadata?: Record<string, unknown>;
}

export interface UnitOutput {
  result: unknown;
  metadata?: Record<string, unknown>;
}