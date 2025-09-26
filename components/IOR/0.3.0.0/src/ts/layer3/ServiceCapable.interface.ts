/**
 * ServiceCapable Interface - Service registration capability for Web4 components
 * 
 * Web4 principle: Single interface per file
 * Universal service registration interface for hybrid component operation
 */

import { ServiceRegistration } from './ServiceRegistration.interface.js';

export interface ServiceCapable {
  /**
   * Get component capabilities for ONCE kernel service integration
   * When ONCE kernel loads component into 42777 server, these capabilities
   * determine service availability - no additional endpoints required
   */
  getCapabilities(): string[];

  /**
   * Get service registration information for ONCE kernel
   * Simple data structure for kernel-managed service integration
   */
  getServiceRegistration(): ServiceRegistration | undefined;
}