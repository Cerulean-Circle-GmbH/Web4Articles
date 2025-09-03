/**
 * HttpServerModel Interface - HTTP server capability component model
 * 
 * Web4 principle: Single interface per file
 * Pattern Decision: Component-specific model extending Model (type safety approach)
 */

import { Model } from '../../../../IOR/0.3.0.0/src/ts/layer3/Model.interface.js';

export interface HttpServerModel extends Model {
  /**
   * HTTP server port number
   */
  port: number;

  /**
   * Server lifecycle state
   */
  state: 'stopped' | 'starting' | 'running' | 'stopping' | 'error';

  /**
   * Registered route information
   */
  routes: RouteInfo[];

  /**
   * Active connection count
   */
  connections: number;

  /**
   * Server start timestamp
   */
  startedAt?: string;

  /**
   * Server stop timestamp
   */
  stoppedAt?: string;

  /**
   * Server configuration options
   */
  config: HttpServerConfig;
}

export interface RouteInfo {
  method: string;
  path: string;
  handler: string; // Handler function name/identifier
}

export interface HttpServerConfig {
  maxConnections: number;
  timeout: number;
  keepAlive: boolean;
}