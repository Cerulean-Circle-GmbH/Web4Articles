/**
 * Scenario Interface - Object hibernation format
 * 
 * Web4 principle: Single interface per file
 * Scenario structure with IOR, owner, and model
 */

import { IOR } from './IOR.interface.js';
import { UserModel } from './UserModel.interface.js';

export interface Scenario {
  ior: IOR;
  owner: string;
  model: UserModel;
}