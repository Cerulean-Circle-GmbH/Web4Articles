/**
 * TestComp1 - TestComp1 Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { TestComp1Model } from './TestComp1Model.interface.js';

export interface TestComp1 {
  init(scenario: Scenario<TestComp1Model>): this;
  toScenario(name?: string): Promise<Scenario<TestComp1Model>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}