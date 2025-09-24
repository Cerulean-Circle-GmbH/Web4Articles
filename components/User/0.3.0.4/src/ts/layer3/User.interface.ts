/**
 * User Interface - Clean user component interface
 * 
 * Web4 principle: Single interface per file
 * User component for user identification and management
 */

import { Scenario } from './Scenario.interface.js';

export interface User {
  /**
   * Initialize from scenario - Web4 pattern
   */
  init(scenario: Scenario): this;

  /**
   * Generate owner data for scenarios
   */
  generateOwnerData(params: OwnerParams): Promise<string>;

  /**
   * Convert to scenario for hibernation
   */
  toScenario(): Promise<Scenario>;
}

export interface OwnerParams {
  user: string;
  hostname: string;
  uuid?: string;
}