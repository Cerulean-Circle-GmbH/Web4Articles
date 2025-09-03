/**
 * ONCEScenario Interface - Object Network Communication Engine Scenario
 * 
 * Web4 principle: Single interface per file  
 * Type safety: Replaces 'any' type usage with proper scenario definition
 */

import { IOR } from '../../../../IOR/0.3.0.0/src/ts/layer3/IOR.interface.js';
import { ONCEModel } from './ONCEModel.interface.js';

export interface ONCEScenario {
  /**
   * Lowercase ior attribute of type IOR (as required)
   */
  ior: IOR;

  /**
   * Base64 encoded owner information
   */
  owner: string;

  /**
   * ONCE kernel model data
   */
  model: ONCEModel;
}