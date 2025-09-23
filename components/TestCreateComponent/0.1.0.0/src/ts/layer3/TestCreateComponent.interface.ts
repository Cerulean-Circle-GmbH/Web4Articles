/**
 * TestCreateComponent - TestCreateComponent Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { TestCreateComponentModel } from './TestCreateComponentModel.interface.js';

export interface TestCreateComponent {
  init(scenario: Scenario<TestCreateComponentModel>): this;
  toScenario(name?: string): Promise<Scenario<TestCreateComponentModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}