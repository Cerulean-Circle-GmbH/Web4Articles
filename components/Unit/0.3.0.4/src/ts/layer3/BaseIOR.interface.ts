/**
 * BaseIOR Interface - Base Interoperable Object Reference class interface
 * Web4 principle: Single interface per file
 * Purpose: Foundation interface for all IOR implementation classes
 */

export interface BaseIOR {
  /**
   * Initialize from scenario - Web4 pattern
   */
  init(scenario: any): this;

  /**
   * Convert to scenario for hibernation
   */
  toScenario(): Promise<any>;

  /**
   * Validate reference format
   */
  validate(): boolean;

  /**
   * Get reference as string representation
   */
  toString(): string;
}