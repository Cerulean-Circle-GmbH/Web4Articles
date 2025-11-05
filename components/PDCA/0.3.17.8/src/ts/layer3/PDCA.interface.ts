/**
 * PDCA - PDCA Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { PDCAModel } from './PDCAModel.interface.js';

export interface PDCA {
  init(scenario: Scenario<PDCAModel>): this;
  toScenario(name?: string): Promise<Scenario<PDCAModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
  test(): Promise<this>;
}
