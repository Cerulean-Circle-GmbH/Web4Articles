/**
 * TestComp - TestComp Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { TestCompModel } from './TestCompModel.interface.js';

export interface TestComp {
  init(scenario: Scenario<TestCompModel>): this;
  toScenario(name?: string): Promise<Scenario<TestCompModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
  test(): Promise<this>;
}
