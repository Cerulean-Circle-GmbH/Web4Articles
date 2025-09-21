/**
 * Storage Interface - Web4 compliant storage for Unit component
 * Web4 principle: Single interface per file
 * Purpose: UUID index system with LD links for scenarios
 */

import { StorageScenario } from './StorageScenario.interface.js';
import { Scenario } from './Scenario.interface.js';

export interface Storage {
  /**
   * Initialize from scenario - Web4 pattern
   */
  init(scenario: StorageScenario): this;

  /**
   * Save scenario to UUID index with LD links
   */
  saveScenario(uuid: string, scenario: Scenario, symlinkPaths: string[]): Promise<void>;

  /**
   * Load scenario from UUID index
   */
  loadScenario(uuid: string): Promise<Scenario>;

  /**
   * Convert to scenario for hibernation
   */
  toScenario(): Promise<StorageScenario>;
}