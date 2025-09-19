/**
 * Build Interface - Web4 build and dependency management component
 * 
 * Web4 principle: Single interface per file
 * UCP Component: Self-managed build system with dependency resolution
 */

import { Scenario } from '../../../../Scenario/0.1.3.0/src/ts/layer2/DefaultScenario.js';
import { IOR } from '../../../../IOR/0.3.0.0/src/ts/layer3/IOR.interface.js';

export interface Build {
  /**
   * Initialize from scenario (scenarios ARE configs)
   */
  init(scenario: Scenario): this;

  /**
   * Check environment (node, npm) and validate availability
   */
  checkEnvironment(): Promise<EnvironmentCheckResult>;

  /**
   * Install node/npm if missing (worst case scenario handling)
   */
  installEnvironment(): Promise<void>;

  /**
   * Build single component with dependency resolution
   */
  buildComponent(componentIOR: IOR): Promise<BuildResult>;

  /**
   * Build all components in correct dependency order
   */
  buildAll(): Promise<BuildResult[]>;

  /**
   * Resolve component dependencies recursively
   */
  resolveDependencies(componentIOR: IOR): Promise<IOR[]>;

  /**
   * Get build state information
   */
  getBuildState(): BuildState;

  /**
   * Save build configuration and state as scenario
   */
  saveAsScenario(): Promise<Scenario>;
}

/**
 * Web4 Component Exports - Following IOR Pattern
 * Integrated exports in interface file - no separate exports.ts
 */

export { BuildModel } from './BuildModel.interface.js';
export { EnvironmentCheckResult } from './EnvironmentCheckResult.interface.js';
export { BuildResult } from './BuildResult.interface.js';
export { BuildState } from './BuildState.interface.js';
export { DefaultBuild } from '../layer2/DefaultBuild.js';
// DRY Compliance: Use unified Scenario component
export { Scenario } from '../../../../Scenario/0.1.3.0/src/ts/layer2/DefaultScenario.js';