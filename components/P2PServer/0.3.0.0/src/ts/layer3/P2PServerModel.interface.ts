/**
 * P2PServerModel Interface - P2P server capability component model
 * 
 * Web4 principle: Single interface per file
 * Pattern Decision: Component-specific model extending Model (type safety approach)
 * Configuration: Scenarios ARE configs - no separate config interfaces
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