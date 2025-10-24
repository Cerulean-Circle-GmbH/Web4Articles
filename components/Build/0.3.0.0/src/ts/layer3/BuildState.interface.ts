/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { IOR } from '../../../../IOR/0.3.0.0/src/ts/layer3/IOR.interface.js';

export interface BuildState {
  /**
   * Current overall build state
   */
  state: 'pending' | 'building' | 'complete' | 'error';

  /**
   * Currently building component
   */
  currentlyBuilding?: IOR;

  /**
   * Completed builds
   */
  completedBuilds: IOR[];

  /**
   * Failed builds
   */
  failedBuilds: IOR[];

  /**
   * Build queue remaining
   */
  buildQueue: IOR[];

  /**
   * Build progress percentage
   */
  progress: number;

  /**
   * Environment readiness status
   */
  environmentReady: boolean;

  /**
   * Last build operation timestamp
   */
  lastBuildAt?: string;
}