/**
 * Storage Interface - Web4 compliant storage for Unit component
 * Web4 principle: Single interface per file
 */

import { Scenario } from './Scenario.interface.js';

export interface Storage {
  /**
   * Initialize from scenario - Web4 pattern
   */
  init(scenario: Scenario): this;

  /**
   * Save scenario to storage with LD links
   */
  saveScenario(uuid: string, scenario: Scenario, symlinkPaths: string[]): Promise<StorageResult>;

  /**
   * Load scenario from storage
   */
  loadScenario(uuid: string): Promise<StorageResult>;

  /**
   * Convert to scenario for hibernation
   */
  toScenario(): Promise<Scenario>;
}

export interface StorageResult {
  success: boolean;
  message: string;
  scenario?: Scenario;
  scenarioPath?: string;
  symlinkPaths?: string[];
}