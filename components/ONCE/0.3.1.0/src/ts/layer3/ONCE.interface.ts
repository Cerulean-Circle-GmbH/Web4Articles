/**
 * ONCE - ONCE Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { ONCEModel } from './ONCEModel.interface.js';

export interface ONCE {
  init(scenario: Scenario<ONCEModel>): this;
  toScenario(name?: string): Promise<Scenario<ONCEModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
  test(): Promise<this>;
}
