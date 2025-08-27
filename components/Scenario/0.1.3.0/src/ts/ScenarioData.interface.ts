/**
 * Web4 Scenario Data Interface
 * 
 * Structure for scenario data objects
 */

import { IOR } from './IOR.interface.js';

export interface ScenarioData {
  IOR: IOR;
  owner: string;
  model: any;
}