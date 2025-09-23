/**
 * TestCorrectComponent - TestCorrectComponent Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { TestCorrectComponentModel } from './TestCorrectComponentModel.interface.js';

export interface TestCorrectComponent {
  init(scenario: Scenario<TestCorrectComponentModel>): this;
  toScenario(name?: string): Promise<Scenario<TestCorrectComponentModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}