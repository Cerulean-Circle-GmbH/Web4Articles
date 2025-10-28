/**
 * Component.interface.ts - Base interface for ALL Web4 components
 * Every Web4 component must implement these fundamental lifecycle methods
 * 
 * Purpose: Provides common contract for:
 * - Lifecycle (init, toScenario)
 * 
 * Note: Development methods (test, build, clean) are in Web4TSComponent interface
 * as they're specific to TypeScript component development, not universal
 */

import { Scenario } from './Scenario.interface.js';
import { Model } from './Model.interface.js';

/**
 * Base interface for all Web4 components
 * Ensures every component has fundamental lifecycle methods
 */
export interface Component<TModel extends Model = Model> {
  // ========================================
  // LIFECYCLE METHODS (Web4 pattern)
  // ========================================
  
  /**
   * Initialize component with scenario
   * @param scenario Scenario containing component configuration
   * @returns this for method chaining
   */
  init(scenario: Scenario<TModel>): this;
  
  /**
   * Convert component state to scenario for persistence
   * @param name Optional scenario name
   * @returns Scenario representation of current state
   */
  toScenario(name?: string): Promise<Scenario<TModel>>;
}


