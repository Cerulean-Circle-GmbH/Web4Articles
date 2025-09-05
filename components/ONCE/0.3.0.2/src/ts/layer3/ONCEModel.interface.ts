/**
 * ONCEModel Interface - Object Network Communication Engine Model
 * 
 * Web4 principle: Single interface per file
 * UCP Unit-Component-Package: This is a Unit (single interface definition)
 */

import { Model } from '../../../../IOR/0.3.0.3/dist/index.js';
import { IOR } from '../../../../IOR/0.3.0.3/dist/index.js';
import { ServiceRegistration } from './ServiceRegistry.interface.js';

export interface ONCEModel extends Model {
  /**
   * Kernel state (not server state - ONCE is a kernel)
   */
  state: 'booting' | 'ready' | 'loading' | 'error';

  /**
   * Environment where kernel is running
   */
  environment: 'node' | 'browser' | 'worker' | 'pwa' | 'iframe';

  /**
   * Domain for component discovery
   */
  domain: string;

  /**
   * Host where kernel is running
   */
  host: string;

  /**
   * Loaded capability components (IOR references, not implementations)
   * Each capability is a separate self-managed component
   */
  capabilities: IOR[];

  /**
   * Currently loaded components managed by this kernel
   */
  loadedComponents: IOR[];

  /**
   * Kernel creation timestamp
   */
  createdAt: string;

  /**
   * Kernel last update timestamp
   */
  updatedAt: string;

  /**
   * Service registry configuration and state (42777 server)
   */
  serviceRegistry?: {
    port: number;
    host: string;
    running: boolean;
    serviceCount: number;
  };
}