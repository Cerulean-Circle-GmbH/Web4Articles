/**
 * HttpServerModel Interface - HTTP server capability component model
 * 
 * Web4 principle: Single interface per file
 * Pattern Decision: Component-specific model extending Model (type safety approach) 
 * Configuration: Scenarios ARE configs - no separate config interfaces
 */

import { Model } from '../../../../IOR/0.3.0.0/dist/ts/layer3/Model.interface.js';
import { IOR } from '../../../../IOR/0.3.0.0/dist/ts/layer3/IOR.interface.js';

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