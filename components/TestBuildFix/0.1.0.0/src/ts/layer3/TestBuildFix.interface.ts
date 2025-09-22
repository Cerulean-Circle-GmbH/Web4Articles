/**
 * TestBuildFix - TestBuildFix Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { TestBuildFixModel } from './TestBuildFixModel.interface.js';

export interface TestBuildFix {
  init(scenario: Scenario<TestBuildFixModel>): this;
  toScenario(name?: string): Promise<Scenario<TestBuildFixModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}