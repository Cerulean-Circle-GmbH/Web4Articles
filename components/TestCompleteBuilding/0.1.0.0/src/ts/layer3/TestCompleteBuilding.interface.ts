/**
 * TestCompleteBuilding - TestCompleteBuilding Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { TestCompleteBuildingModel } from './TestCompleteBuildingModel.interface.js';

export interface TestCompleteBuilding {
  init(scenario: Scenario<TestCompleteBuildingModel>): this;
  toScenario(name?: string): Promise<Scenario<TestCompleteBuildingModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}