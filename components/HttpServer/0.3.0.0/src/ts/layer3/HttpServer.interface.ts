/**
 * HttpServer Interface - HTTP server capability component
 * 
 * Web4 principle: Single interface per file
 * UCP Component: Self-managed HTTP server with port and routing capabilities
 */

import { HttpServerScenario } from './HttpServerScenario.interface.js';

export interface HttpServer {
  /**
   * Initialize from scenario (NEVER 'any' type)
   * Web4 Pattern: Scenario-based initialization
   */
  init(scenario: HttpServerScenario): this;

  /**
   * Start HTTP server on configured port
   */
  startServer(): Promise<void>;

  /**
   * Stop HTTP server cleanly
   */
  stopServer(): Promise<void>;

  /**
   * Add route handler to server
   */
  addRoute(path: string, handler: RouteHandler): void;

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
   * Web4 Pattern: State hibernation
   */
  saveAsScenario(): Promise<HttpServerScenario>;
}