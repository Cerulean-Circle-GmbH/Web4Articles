/**
 * ComponentScenario Interface - General component scenario for ONCE kernel loading
 * 
 * Web4 principle: Single interface per file
 * Type safety: Proper scenario type for component loading operations
 */

import { IOR } from '../../../../IOR/0.3.0.0/src/ts/layer3/IOR.interface.js';
import { Model } from '../../../../IOR/0.3.0.0/src/ts/layer3/Model.interface.js';

export interface ComponentScenario {
  /**
   * Lowercase ior attribute of type IOR (as required)
   */
  ior: IOR;

  /**
   * Base64 encoded owner information
   */
  owner: string;

  /**
   * Component model data (flexible for different component types)
   */
  model: Model;
}