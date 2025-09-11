/**
 * Unit Interface - Protocol-less radical OOP atomic element
 * Web4 principle: Single interface per file
 * No Input/Output constructs - direct object methods only
 */

import { Scenario } from './Scenario.interface.js';

export interface Unit {
  /**
   * Initialize from scenario - Web4 pattern with command chaining
   */
  init(scenario: Scenario): this;

  /**
   * Transform data with command chaining support - fluent interface
   */
  transform(data?: unknown): this;

  /**
   * Validate object with command chaining support - fluent interface
   */
  validate(object?: any): this;

  /**
   * Process unit logic with command chaining support - fluent interface
   */
  process(): this;

  /**
   * Convert to scenario for hibernation
   */
  toScenario(name?: string): Promise<Scenario>;

  /**
   * Execute complete command chain and finalize operations
   * Web4 pattern: Final execution method for fluent interface completion
   */
  execute(): Promise<void>;
}