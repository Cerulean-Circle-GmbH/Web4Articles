/**
 * ONCE Interface - Object Network Communication Engine
 * 
 * Web4 principle: Single interface per file
 * ONCE Role: Environment kernel that loads components from IORs
 * NOT a server implementation - that belongs to capability components
 */

import { IOR } from '../../../../IOR/0.3.0.0/src/ts/layer3/IOR.interface.js';
import { ComponentScenario } from './ComponentScenario.interface.js';
import { ONCEScenario } from './ONCEScenario.interface.js';
import { EnvironmentInfo } from './EnvironmentInfo.interface.js';
import { Component } from './Component.interface.js';

export interface ONCE {
  /**
   * Initialize ONCE kernel from scenario
   * Web4 Pattern: Scenario-based initialization (NEVER 'any' type)
   */
  init(scenario: ONCEScenario): this;

  /**
   * Boot environment and prepare for component loading
   * ONCE main feature: Boot in any environment  
   */
  bootEnvironment(): Promise<EnvironmentInfo>;

  /**
   * Load component from IOR and scenario
   * ONCE main feature: Choose components to load from IORs and scenarios
   */
  loadComponent(componentIOR: IOR, scenario: ComponentScenario): Promise<Component>;

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
   */
  exchangeScenarios(peerONCE: IOR, scenarios: ComponentScenario[]): Promise<void>;

  /**
   * Save kernel state as scenario
   * Web4 Pattern: State hibernation
   */
  saveAsScenario(): Promise<ONCEScenario>;
}