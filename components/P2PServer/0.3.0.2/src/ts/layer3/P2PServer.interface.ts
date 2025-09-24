/**
 * P2PServer Interface - P2P server capability component
 * 
 * Web4 principle: Single interface per file
 * UCP Component: Self-managed P2P server with peer coordination
 */

import { Scenario } from '../../../../Scenario/0.3.0.2/src/ts/layer2/DefaultScenario.js';
import { IOR } from '../../../../IOR/0.3.0.2/src/ts/layer3/IOR.interface.js';

export interface P2PServer {
  /**
   * Initialize from scenario (using unified Scenario component)
   * Web4 Pattern: Scenario-based initialization - scenarios ARE configs
   */
  init(scenario: Scenario): this;

  /**
   * Start P2P server with peer discovery
   */
  startServer(): Promise<void>;

  /**
   * Stop P2P server cleanly
   */
  stopServer(): Promise<void>;

  /**
   * Connect to peer component (Web4 principle: peers are components with IORs)
   */
  connectPeer(peerIOR: IOR): Promise<void>;

  /**
   * Disconnect from peer component
   */
  disconnectPeer(peerIOR: IOR): Promise<void>;

  /**
   * Exchange scenarios with peer
   */
  exchangeScenarios(peerIOR: IOR, scenarios: Scenario[]): Promise<void>;

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

export { P2PServerModel } from './P2PServerModel.interface.js';
export { DefaultP2PServer } from '../layer2/DefaultP2PServer.js';
// DRY Compliance: Use unified Scenario component
export { Scenario } from '../../../../Scenario/0.3.0.2/src/ts/layer2/DefaultScenario.js';