/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { IOR } from './IOR.interface.js';

export interface ServiceRegistration {
  /**
   * Component IOR for service identification
   */
  componentIOR: IOR;

  /**
   * Service endpoint (provided by ONCE 42777 server)
   */
  serviceEndpoint: string;

  /**
   * Component capabilities list
   */
  capabilities: string[];

  /**
   * Service status
   */
  status: 'registering' | 'active' | 'inactive' | 'error';

  /**
   * Registration timestamp
   */
  registeredAt: string;

  /**
   * Last heartbeat timestamp
   */
  lastHeartbeat?: string;

  /**
   * Additional service metadata
   */
  metadata?: { [key: string]: any; };
}