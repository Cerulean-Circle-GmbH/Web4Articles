/**
 * User Interface - Clean user component interface
 * 
 * Web4 principle: Single interface per file
 * User component for user identification and management
 * 
 * @pdca 2025-10-31-UTC-1045.template-sync-path-authority.pdca.md - Removed OwnerParams (obsolete after User service migration)
 */

import { Scenario } from './Scenario.interface.js';

export interface User {
  /**
   * Initialize from scenario - Web4 pattern
   */
  init(scenario: Scenario): this;

  /**
   * Convert to scenario for hibernation
   */
  toScenario(): Promise<Scenario>;
}


