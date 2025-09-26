/**
 * StorageScenario Interface - Storage-specific scenario format
 * Web4 principle: Single interface per file
 */

import { IOR } from './IOR.interface.js';
import { StorageModel } from './StorageModel.interface.js';

export interface StorageScenario {
  ior: IOR;
  owner: string;
  model: StorageModel;
}