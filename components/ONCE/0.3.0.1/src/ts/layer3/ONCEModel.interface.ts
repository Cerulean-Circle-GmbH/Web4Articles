/**
 * ONCEModel Interface - ONCE Component Model
 * 
 * Web4 principle: Single interface per file
 * Model interface for ONCE component state
 */

// Local Model interface to avoid import cycles
interface Model {
  uuid: string;
  name: string;
  description: string;
  [key: string]: any;
}

// Local IOR interface to avoid import cycles  
interface IOR {
  uuid: string;
  component: string;
  version: string;
  location?: string;
  endpoint?: string;
}

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
   * Loaded capability components (IOR references)
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