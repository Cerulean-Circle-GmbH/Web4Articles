/**
 * WsServerModel Interface - WebSocket server capability component model
 * 
 * Web4 principle: Single interface per file
 * Pattern Decision: Component-specific model extending Model (type safety approach)
 * Configuration: Scenarios ARE configs - no separate config interfaces
 */

import { Model } from '../../../../IOR/0.3.0.0/src/ts/layer3/Model.interface.js';
import { IOR } from '../../../../IOR/0.3.0.0/src/ts/layer3/IOR.interface.js';

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