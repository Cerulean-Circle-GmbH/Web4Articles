/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Model } from './Model.interface.js';
import { IOR } from '../../../../../IOR/0.3.0.3/dist/index.js';

export interface WsServerModel extends Model {
  /**
   * WebSocket server port number
   */
  port: number;

  /**
   * Server lifecycle state
   */
  state: 'stopped' | 'starting' | 'running' | 'stopping' | 'error';

  /**
   * Connected client IOR references
   * Web4 principle: Connections are components with IORs, not info objects
   */
  connections: IOR[];

  /**
   * WebSocket protocol version
   */
  protocol: string;

  /**
   * Maximum allowed connections (config in model - scenarios ARE configs)
   */
  maxConnections: number;

  /**
   * Heartbeat interval (config in model - scenarios ARE configs)  
   */
  heartbeatInterval: number;

  /**
   * Compression enabled (config in model - scenarios ARE configs)
   */
  compression: boolean;

  /**
   * Server start timestamp
   */
  startedAt?: string;

  /**
   * Server stop timestamp
   */
  stoppedAt?: string;
}