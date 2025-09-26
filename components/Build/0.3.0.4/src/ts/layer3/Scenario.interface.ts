/**
 * Scenario Interface - Web4 scenario format for Build component
 * Web4 principle: Single interface per file
 */

import { IOR } from './IOR.interface.js';
import { BuildModel } from './BuildModel.interface.js';

export interface Scenario {
  ior: IOR;
  owner: string;
  model: BuildModel;
}