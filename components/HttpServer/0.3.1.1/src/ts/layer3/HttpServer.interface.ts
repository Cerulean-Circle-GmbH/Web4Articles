/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Scenario } from '../../../../../Scenario/0.3.0.2/dist/ts/Scenario.js';
import { IOR } from '../../../../../IOR/0.3.0.3/dist/index.js';

// ServiceCapable interface for service integration
interface ServiceCapable {
  registerAsService(endpoint: string): Promise<void>;
  unregisterFromService(): Promise<void>;
  isRegisteredAsService(): boolean;
}

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
export { Scenario } from '../../../../../Scenario/0.3.0.2/dist/ts/Scenario.js';