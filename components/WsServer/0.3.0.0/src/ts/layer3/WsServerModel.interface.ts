/**
 * WsServerModel Interface - WebSocket server capability component model
 * 
 * Web4 principle: Single interface per file
 * Pattern Decision: Component-specific model extending Model (type safety approach)
 */

import { Model } from '../../../../IOR/0.3.0.0/src/ts/layer3/Model.interface.js';

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
   * Active WebSocket connections
   */
  connections: WsConnectionInfo[];

  /**
   * WebSocket protocol version
   */
  protocol: string;

  /**
   * Maximum allowed connections
   */
  maxConnections: number;

  /**
   * Server start timestamp
   */
  startedAt?: string;

  /**
   * Server stop timestamp
   */
  stoppedAt?: string;

  /**
   * WebSocket server configuration
   */
  config: WsServerConfig;
}

export interface WsConnectionInfo {
  id: string;
  connectedAt: string;
  lastActivity: string;
  protocol?: string;
}

export interface WsServerConfig {
  maxConnections: number;
  heartbeatInterval: number;
  compression: boolean;
}