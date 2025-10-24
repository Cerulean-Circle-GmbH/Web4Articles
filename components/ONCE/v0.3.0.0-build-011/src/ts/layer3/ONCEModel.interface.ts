/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Model } from '../../../../IOR/0.3.0.0/src/ts/layer3/Model.interface.js';
import { IOR } from '../../../../IOR/0.3.0.0/src/ts/layer3/IOR.interface.js';

export interface ONCEModel extends Model {
  /**
   * Kernel state (not server state - ONCE is a kernel)
   */
  state: 'booting' | 'ready' | 'loading' | 'error';

  /**
   * Environment where kernel is running
   */
  environment: 'node' | 'browser' | 'worker' | 'pwa' | 'iframe';

  /**
   * Domain for component discovery
   */
  domain: string;

  /**
   * Host where kernel is running
   */
  host: string;

  /**
   * Loaded capability components (IOR references, not implementations)
   * Each capability is a separate self-managed component
   */
  capabilities: IOR[];

  /**
   * Currently loaded components managed by this kernel
   */
  loadedComponents: IOR[];

  /**
   * Kernel creation timestamp
   */
  createdAt: string;

  /**
   * Kernel last update timestamp
   */
  updatedAt: string;
}