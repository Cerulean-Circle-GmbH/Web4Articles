/**
 * Scenario Interface - Web4 scenario format for CLI component
 * Web4 principle: Single interface per file
 */

import { IOR } from './IOR.interface.js';
import { CLIModel } from './CLIModel.interface.js';

export interface Scenario {
  ior: IOR;
  owner: string;
  model: CLIModel;
}