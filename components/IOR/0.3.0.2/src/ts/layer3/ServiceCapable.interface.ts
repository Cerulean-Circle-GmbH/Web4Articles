/**
 * ServiceCapable Interface - Service registration capability for Web4 components
 * 
 * Web4 principle: Single interface per file
 * Universal service registration interface for hybrid component operation
 */

import { ServiceRegistration } from '../../../ONCE/0.3.0.0/src/ts/layer3/ServiceRegistry.interface.js';

export interface ServiceCapable {
  /**
   * Register component as service with ONCE 42777 server
   */
  registerAsService(onceServerEndpoint?: string): Promise<void>;

  /**
   * Unregister component from ONCE service registry
   */
  unregisterFromService(): Promise<void>;

  /**
   * Check if component is registered as service
   */
  isRegisteredAsService(): boolean;

  /**
   * Get service registration information
   */
  getServiceRegistration(): ServiceRegistration | undefined;

  /**
   * Start component in service mode
   */
  startAsService(onceServerEndpoint: string): Promise<void>;

  /**
   * Start component in standalone mode
   */
  startStandalone(): Promise<void>;

  /**
   * Find ONCE server for service registration
   */
  findOnceServer(): string | undefined;

  /**
   * Get component capabilities for service registration
   */
  getCapabilities(): string[];
}