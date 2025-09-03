/**
 * Web4 ONCE (Object Network Communication Engine) Interface - Unified Standard
 * 
 * Radically simplified yet resilient Object Network Communication
 * Following established IOR component pattern exactly
 */

import { Model } from '../../../../IOR/0.3.0.0/src/ts/layer3/Model.interface.js';

export interface ONCE {
  /**
   * Start component with scenario initialization
   * Web4 Pattern: Scenario-based component lifecycle
   */
  startComponent(scenario: any): Promise<any>;

  /**
   * Stop component cleanly with state preservation
   */
  stopComponent(): Promise<void>;

  /**
   * Pause component execution
   */
  pauseComponent(): Promise<void>;

  /**
   * Resume paused component
   */
  resumeComponent(): Promise<void>;

  /**
   * Save current state as scenario
   * Web4 Pattern: State hibernation
   */
  saveAsScenario(): Promise<any>;

  /**
   * Get current environment information
   */
  getEnvironment(): any;

  /**
   * Connect to peer ONCE kernel
   */
  connectPeer(peerLocation: string): Promise<void>;

  /**
   * Exchange scenario with peer
   */
  exchangeScenario(peer: string, scenario: any): Promise<void>;
}

export interface ONCEModel extends Model {
  /**
   * Server state
   */
  state: 'running' | 'stopped' | 'paused' | 'error';

  /**
   * Domain (e.g., "local.once")
   */
  domain: string;

  /**
   * Host address
   */
  host: string;

  /**
   * Primary port number
   */
  port: number;

  /**
   * Available capabilities
   */
  capabilities: string[];

  /**
   * Platform type
   */
  platform: string;

  /**
   * Primary server flag
   */
  isPrimary: boolean;

  /**
   * Creation timestamp
   */
  createdAt: string;

  /**
   * Last update timestamp
   */
  updatedAt: string;
}

/**
 * Web4 Component Exports - Following IOR Pattern (Decision 3b)
 */

export { DefaultONCE } from '../layer2/DefaultONCE.js';
export { DefaultModel } from '../../../../IOR/0.3.0.0/src/ts/layer2/DefaultModel.js';