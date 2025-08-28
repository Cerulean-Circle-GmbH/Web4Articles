/**
 * Web4 Scenario Data Interface
 * 
 * Structure for scenario data objects
 */

import { ObjectIdentifier } from './ObjectIdentifier.interface.js';
import { ScenarioModel } from './Model.interface.js';

export interface ScenarioData {
  ior: ObjectIdentifier;  // lowercase attribute name
  owner: string;
  model: ScenarioModel;
}