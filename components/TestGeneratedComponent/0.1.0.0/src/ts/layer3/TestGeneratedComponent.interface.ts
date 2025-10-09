/**
 * TestGeneratedComponent - TestGeneratedComponent Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { TestGeneratedComponentModel } from './TestGeneratedComponentModel.interface.js';

export interface TestGeneratedComponent {
  init(scenario: Scenario<TestGeneratedComponentModel>): this;
  toScenario(name?: string): Promise<Scenario<TestGeneratedComponentModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
  test(): Promise<this>;
}
