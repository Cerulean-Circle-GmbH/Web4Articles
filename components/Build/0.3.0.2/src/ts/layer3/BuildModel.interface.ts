/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
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