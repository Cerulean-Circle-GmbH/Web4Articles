/**
 * ONCE Interface - Object Network Communication Engine
 * 
 * Web4 principle: Single interface per file
 * ONCE Role: Environment kernel that loads components from IORs
 * NOT a server implementation - that belongs to capability components
 */

import { IOR } from '../../../../IOR/0.3.0.0/dist/ts/layer3/IOR.interface.js';
import { Scenario } from '../../../../Scenario/0.1.3.0/dist/ts/layer2/DefaultScenario.js';
import { EnvironmentInfo } from './EnvironmentInfo.interface.js';
import { Component } from './Component.interface.js';

export interface ONCE {
  /**
   * Initialize ONCE kernel from scenario
   * Web4 Pattern: Scenario-based initialization using unified Scenario component
   */
  init(scenario: Scenario): this;

  /**
   * Boot environment and prepare for component loading
   * ONCE main feature: Boot in any environment  
   */
  bootEnvironment(): Promise<EnvironmentInfo>;

  /**
   * Load component from IOR and scenario
   * ONCE main feature: Choose components to load from IORs and scenarios
   * Uses unified Scenario component (DRY principle)
   */
  loadComponent(componentIOR: IOR, scenario: Scenario): Promise<Component>;

  /**
   * Unload component by IOR reference
   */
  unloadComponent(componentIOR: IOR): Promise<void>;

  /**
   * Get currently loaded components
   */
  getLoadedComponents(): IOR[];

  /**
   * Get current environment information  
   */
  getEnvironment(): EnvironmentInfo;

  /**
   * Exchange scenarios with peer ONCE kernel
   * Uses unified Scenario component (DRY principle)
   */
  exchangeScenarios(peerONCE: IOR, scenarios: Scenario[]): Promise<void>;

  /**
   * Save kernel state as scenario
   * Web4 Pattern: State hibernation using unified Scenario component
   */
  saveAsScenario(): Promise<Scenario>;
}

/**
 * Web4 Component Exports - Following IOR Pattern (Decision 3b)
 * Integrated exports in interface file - no separate exports.ts
 */

export type { ONCEModel } from './ONCEModel.interface.js';
export type { EnvironmentInfo } from './EnvironmentInfo.interface.js';
export type { Component } from './Component.interface.js';
// Service integration exports
export type { ServiceRegistry, ServiceRegistration } from './ServiceRegistry.interface.js';
export { DefaultServiceRegistry } from '../layer2/DefaultServiceRegistry.js';
export { DefaultONCE } from '../layer2/DefaultONCE.js';
// DRY Compliance: Use unified Scenario component
export { Scenario } from '../../../../Scenario/0.1.3.0/dist/ts/layer2/DefaultScenario.js';