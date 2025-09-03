/**
 * P2PServerModel Interface - P2P server capability component model
 * 
 * Web4 principle: Single interface per file
 * Pattern Decision: Component-specific model extending Model (type safety approach)
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
   * P2P network topology information
   */
  topology: NetworkTopology;

  /**
   * P2P protocol configuration
   */
  protocol: P2PProtocolConfig;

  /**
   * Server start timestamp
   */
  startedAt?: string;

  /**
   * Server stop timestamp  
   */
  stoppedAt?: string;
}

export interface NetworkTopology {
  role: 'primary' | 'secondary' | 'peer';
  connectedPeers: number;
  networkId: string;
}

export interface P2PProtocolConfig {
  webrtc: boolean;
  signaling: boolean;
  encryption: boolean;
  maxPeers: number;
}