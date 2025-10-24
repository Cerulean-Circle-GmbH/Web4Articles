/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Model } from '../../../../../IOR/0.3.0.3/dist/ts/layer3/Model.interface.js';
import { IOR } from '../../../../../IOR/0.3.0.3/dist/index.js';

export interface HttpServerModel extends Model {
  /**
   * Component identifier
   */
  uuid: string;

  /**
   * Component name
   */
  name: string;

  /**
   * Component description
   */
  description: string;

  /**
   * Host address
   */
  host: string;

  /**
   * SSL enabled flag
   */
  sslEnabled: boolean;

  /**
   * HTTP server port number
   */
  port: number;

  /**
   * Server lifecycle state
   */
  state: 'stopped' | 'starting' | 'running' | 'stopping' | 'error';

  /**
   * Registered route IOR references
   * Web4 principle: Routes are components with IORs, not info objects
   */
  routes: IOR[];

  /**
   * Connected client IOR references  
   * Web4 principle: Connections are components with IORs
   */
  connections: IOR[];

  /**
   * Maximum connections (config in model - scenarios ARE configs)
   */
  maxConnections: number;

  /**
   * Request timeout (config in model - scenarios ARE configs)
   */
  timeout: number;

  /**
   * Keep-alive enabled (config in model - scenarios ARE configs)  
   */
  keepAlive: boolean;

  /**
   * Server start timestamp
   */
  startedAt?: string;

  /**
   * Server stop timestamp
   */
  stoppedAt?: string;
}