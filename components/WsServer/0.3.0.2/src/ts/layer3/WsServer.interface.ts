/**
 * WsServer Interface - WebSocket server capability component
 * 
 * Web4 principle: Single interface per file
 * UCP Component: Self-managed WebSocket server with connection management
 */

import { Scenario } from '../../../../Scenario/0.1.3.0/src/ts/layer2/DefaultScenario.js';
import { IOR } from '../../../../IOR/0.3.0.0/src/ts/layer3/IOR.interface.js';

export interface WsServer {
  /**
   * Initialize from scenario (using unified Scenario component)
   * Web4 Pattern: Scenario-based initialization - scenarios ARE configs
   */
  init(scenario: Scenario): this;

  /**
   * Start WebSocket server on configured port
   */
  startServer(): Promise<void>;

  /**
   * Stop WebSocket server cleanly
   */
  stopServer(): Promise<void>;

  /**
   * Add connection component to server (Web4 principle: connections are components with IORs)
   */
  addConnection(connectionIOR: IOR): void;

  /**
   * Remove connection component from server
   */
  removeConnection(connectionIOR: IOR): void;

  /**
   * Get current port number
   */
  getPort(): number;

  /**
   * Check if server is running
   */
  isRunning(): boolean;

  /**
   * Save server state as scenario
   * Web4 Pattern: State hibernation returns actual Scenario component instance
   */
  saveAsScenario(): Promise<Scenario>;
}

/**
 * Web4 Component Exports - Following IOR Pattern
 * Integrated exports in interface file - no separate exports.ts
 */

export { WsServerModel } from './WsServerModel.interface.js';
export { DefaultWsServer } from '../layer2/DefaultWsServer.js';
// DRY Compliance: Use unified Scenario component
export { Scenario } from '../../../../Scenario/0.1.3.0/src/ts/layer2/DefaultScenario.js';