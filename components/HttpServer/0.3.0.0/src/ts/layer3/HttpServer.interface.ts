/**
 * HttpServer Interface - HTTP server capability component
 * 
 * Web4 principle: Single interface per file
 * UCP Component: Self-managed HTTP server with port and routing capabilities
 */

import { Scenario } from '../../../../Scenario/0.1.3.0/dist/ts/layer2/DefaultScenario.js';
import { IOR, ServiceCapable } from '../../../../IOR/0.3.0.0/dist/ts/layer3/IOR.interface.js';

export interface HttpServer extends ServiceCapable {
  /**
   * Initialize from scenario (using unified Scenario component)
   * Web4 Pattern: Scenario-based initialization - DRY compliance
   */
  init(scenario: Scenario): this;

  /**
   * Start HTTP server on configured port
   */
  startServer(): Promise<void>;

  /**
   * Stop HTTP server cleanly
   */
  stopServer(): Promise<void>;

  /**
   * Add route component to server (Web4 principle: routes are components with IORs)
   */
  addRoute(routeIOR: IOR): void;

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

export { HttpServerModel } from './HttpServerModel.interface.js';
export { DefaultHttpServer } from '../layer2/DefaultHttpServer.js';
// DRY Compliance: Use unified Scenario component
export { Scenario } from '../../../../Scenario/0.1.3.0/dist/ts/layer2/DefaultScenario.js';