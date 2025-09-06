/**
 * Scenario Interface - Web4 scenario format
 * Web4 principle: Single interface per file
 */

import { IOR } from './IOR.interface.js';
import { UnitModel } from './UnitModel.interface.js';

export interface Scenario {
  ior: IOR;
  owner: string;
  model: UnitModel;
}