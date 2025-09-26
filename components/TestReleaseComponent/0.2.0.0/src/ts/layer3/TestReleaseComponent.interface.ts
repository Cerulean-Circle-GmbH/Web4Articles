/**
 * TestReleaseComponent - TestReleaseComponent Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { TestReleaseComponentModel } from './TestReleaseComponentModel.interface.js';

export interface TestReleaseComponent {
  init(scenario: Scenario<TestReleaseComponentModel>): this;
  toScenario(name?: string): Promise<Scenario<TestReleaseComponentModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}