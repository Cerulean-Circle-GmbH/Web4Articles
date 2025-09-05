/**
 * ONCEModel Interface - Object Network Communication Engine Model
 * 
 * Web4 principle: Single interface per file
 * UCP Unit-Component-Package: This is a Unit (single interface definition)
 */

import { IOR } from '../../../../IOR/0.3.0.3/dist/ts/layer3/IOR.interface.js';
// Model interface from IOR component
interface Model {
  createdAt: string;
  updatedAt: string;
}
import { ServiceRegistration } from './ServiceRegistry.interface.js';

export interface ONCEModel extends Model {
  /**
   * Component identifier
   */
  uuid: string;

  /**
   * Component name
   */
  name: string;

  /**
   * Component description
   */
  description: string;

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