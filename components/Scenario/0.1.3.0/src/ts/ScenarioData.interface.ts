/**
 * Web4 Scenario Data Interface
 * 
 * Structure for scenario data objects
 */

import { ObjectIdentifier } from './ObjectIdentifier.interface.js';

export interface ScenarioData {
  IOR: ObjectIdentifier;
  owner: string;
  model: any;
}