/**
 * Unit Interface - Protocol-less radical OOP atomic element
 * Web4 principle: Single interface per file
 * No Input/Output constructs - direct object methods only
 */

import { Scenario } from './Scenario.interface.js';

export interface Unit {
  /**
   * Initialize from scenario - Web4 pattern
   */
  init(scenario: Scenario): this;

  /**
   * Transform data directly - no Input/Output protocol
   */
  transform(data: unknown): unknown;

  /**
   * Validate object directly - no Input/Output protocol
   */
  validate(object: any): boolean;

  /**
   * Process unit logic directly - no Input/Output protocol
   */
  process(): void;

  /**
   * Convert to scenario for hibernation
   */
  toScenario(name?: string): Promise<Scenario>;
}