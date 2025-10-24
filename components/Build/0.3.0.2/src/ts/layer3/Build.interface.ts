/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Scenario } from '../../../../Scenario/0.3.0.2/src/ts/layer2/DefaultScenario.js';
import { IOR } from '../../../../IOR/0.3.0.2/src/ts/layer3/IOR.interface.js';

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
export { Scenario } from '../../../../Scenario/0.3.0.2/src/ts/layer2/DefaultScenario.js';