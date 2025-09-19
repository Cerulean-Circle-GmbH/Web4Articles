/**
 * BuildModel Interface - Build component model
 * 
 * Web4 principle: Single interface per file
 * Pattern Decision: Component-specific model extending Model (type safety approach)
 * Configuration: Scenarios ARE configs - build configuration in model
 */

import { Model } from '../../../../IOR/0.3.0.2/src/ts/layer3/Model.interface.js';
import { IOR } from '../../../../IOR/0.3.0.2/src/ts/layer3/IOR.interface.js';

export interface BuildModel extends Model {
  /**
   * Target environment for build
   */
  environment: 'node' | 'browser' | 'worker' | 'universal';

  /**
   * Component dependencies (IOR references to required components)
   */
  dependencies: IOR[];

  /**
   * Build order sequence (component names in dependency order)
   */
  buildOrder: string[];

  /**
   * NPM install required (config in model - scenarios ARE configs)
   */
  npmInstall: boolean;

  /**
   * TypeScript build required (config in model - scenarios ARE configs)
   */
  typeScriptBuild: boolean;

  /**
   * Dependency checking enabled (config in model - scenarios ARE configs)
   */
  dependencyCheck: boolean;

  /**
   * Force reinstall dependencies (config in model - scenarios ARE configs)
   */
  forceReinstall: boolean;

  /**
   * Build state tracking
   */
  buildState: 'pending' | 'building' | 'complete' | 'error';

  /**
   * Build artifacts and outputs
   */
  artifacts: string[];
  
  /**
   * Build started timestamp
   */
  buildStarted?: string;

  /**
   * Build completed timestamp
   */
  buildCompleted?: string;

  /**
   * Error details if build failed
   */
  errorDetails?: string;
}