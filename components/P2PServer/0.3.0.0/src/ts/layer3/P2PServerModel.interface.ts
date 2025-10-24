/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Model } from '../../../../IOR/0.3.0.0/src/ts/layer3/Model.interface.js';
import { IOR } from '../../../../IOR/0.3.0.0/src/ts/layer3/IOR.interface.js';

export interface P2PServerModel extends Model {
  /**
   * P2P communication port number
   */
  port: number;

  /**
   * P2P server lifecycle state
   */
  state: 'stopped' | 'starting' | 'running' | 'stopping' | 'error';

  /**
   * Connected peer IOR references
   */
  peers: IOR[];

  /**
   * Network role (config in model - scenarios ARE configs)
   */
  role: 'primary' | 'secondary' | 'peer';

  /**
   * Network identifier (config in model - scenarios ARE configs)
   */
  networkId: string;

  /**
   * WebRTC enabled (config in model - scenarios ARE configs)
   */
  webrtc: boolean;

  /**
   * Signaling enabled (config in model - scenarios ARE configs)
   */
  signaling: boolean;

  /**
   * Encryption enabled (config in model - scenarios ARE configs)
   */
  encryption: boolean;

  /**
   * Maximum peer connections (config in model - scenarios ARE configs)
   */
  maxPeers: number;

  /**
   * Server start timestamp
   */
  startedAt?: string;

  /**
   * Server stop timestamp  
   */
  stoppedAt?: string;
}