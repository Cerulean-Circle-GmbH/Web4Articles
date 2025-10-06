/**
 * TestComponent - TestComponent Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { TestComponentModel } from './TestComponentModel.interface.js';

export interface TestComponent {
  init(scenario: Scenario<TestComponentModel>): this;
  toScenario(name?: string): Promise<Scenario<TestComponentModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
  test(): Promise<this>;
}
