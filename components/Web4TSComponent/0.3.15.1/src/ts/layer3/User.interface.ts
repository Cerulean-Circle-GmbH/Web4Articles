/**
 * User Interface - Clean user component interface
 * 
 * Web4 principle: Single interface per file
 * User component for user identification and management
 * 
 * NOTE: Copied from components/User/0.3.0.4/src/ts/layer3/User.interface.ts
 * to prevent build dependency on User component
 */

import { Scenario } from './Scenario.interface.js';
import { OwnerParams } from './OwnerParams.interface.js';

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


