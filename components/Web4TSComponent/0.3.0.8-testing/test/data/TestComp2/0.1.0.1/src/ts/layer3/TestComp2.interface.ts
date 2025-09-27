/**
 * TestComp2 - TestComp2 Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { TestComp2Model } from './TestComp2Model.interface.js';

export interface TestComp2 {
  init(scenario: Scenario<TestComp2Model>): this;
  toScenario(name?: string): Promise<Scenario<TestComp2Model>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}