/**
 * ServiceRegistration Interface - Service registration data structure
 * 
 * Web4 principle: Single interface per file
 * Moved from ServiceCapable.interface.ts for compliance
 */

import { IOR } from './IOR.interface.js';

export interface ServiceRegistration {
  /**
   * Component IOR for service identification
   */
  componentIOR: IOR;

  /**
   * Service endpoint (provided by ONCE 42777 server)
   */
  serviceEndpoint: string;

  /**
   * Component capabilities list
   */
  capabilities: string[];

  /**
   * Service status
   */
  status: 'registering' | 'active' | 'inactive' | 'error';

  /**
   * Registration timestamp
   */
  registeredAt: string;

  /**
   * Last heartbeat timestamp
   */
  lastHeartbeat?: string;

  /**
   * Additional service metadata
   */
  metadata?: { [key: string]: any; };
}