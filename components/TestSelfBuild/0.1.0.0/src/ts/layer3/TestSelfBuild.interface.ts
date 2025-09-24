/**
 * TestSelfBuild - TestSelfBuild Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { TestSelfBuildModel } from './TestSelfBuildModel.interface.js';

export interface TestSelfBuild {
  init(scenario: Scenario<TestSelfBuildModel>): this;
  toScenario(name?: string): Promise<Scenario<TestSelfBuildModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}