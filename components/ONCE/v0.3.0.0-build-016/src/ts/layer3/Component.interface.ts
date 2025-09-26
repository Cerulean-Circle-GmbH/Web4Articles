/**
 * Component Interface - General component loaded by ONCE kernel
 * 
 * Web4 principle: Single interface per file
 * UCP Unit-Component-Package: Defines what constitutes a loadable component
 */

import { IOR } from '../../../../IOR/0.3.0.0/dist/ts/layer3/IOR.interface.js';
import { Scenario } from '../../../../Scenario/0.1.3.0/dist/ts/layer2/DefaultScenario.js';

export interface Component {
  /**
   * Initialize component from scenario
   * Web4 Pattern: Scenario-based initialization using unified Scenario component
   */
  init(scenario: Scenario): this;

  /**
   * Start component execution
   */
  start(): Promise<void>;

  /**
   * Stop component execution  
   */
  stop(): Promise<void>;

  /**
   * Get component IOR for reference
   */
  getIOR(): IOR;

  /**
   * Save component state as scenario
   * Web4 Pattern: State hibernation returns actual Scenario component instance
   */
  toScenario(): Promise<Scenario>;

  /**
   * Check if component is running
   */
  isRunning(): boolean;
}