/**
 * BuildState Interface - Current build system state information
 * 
 * Web4 principle: Single interface per file
 * Infos ARE model views - this derives from BuildModel
 */

import { IOR } from '../../../../IOR/0.3.0.2/src/ts/layer3/IOR.interface.js';

export interface BuildState {
  /**
   * Current overall build state
   */
  state: 'pending' | 'building' | 'complete' | 'error';

  /**
   * Currently building component
   */
  currentlyBuilding?: IOR;

  /**
   * Completed builds
   */
  completedBuilds: IOR[];

  /**
   * Failed builds
   */
  failedBuilds: IOR[];

  /**
   * Build queue remaining
   */
  buildQueue: IOR[];

  /**
   * Build progress percentage
   */
  progress: number;

  /**
   * Environment readiness status
   */
  environmentReady: boolean;

  /**
   * Last build operation timestamp
   */
  lastBuildAt?: string;
}