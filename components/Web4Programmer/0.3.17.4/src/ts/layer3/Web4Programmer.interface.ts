/**
 * Web4Programmer - Web4Programmer Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { Web4ProgrammerModel } from './Web4ProgrammerModel.interface.js';

export interface Web4Programmer {
  init(scenario: Scenario<Web4ProgrammerModel>): this;
  toScenario(name?: string): Promise<Scenario<Web4ProgrammerModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
  test(): Promise<this>;
}
