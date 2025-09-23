/**
 * TestUpgradeComponent - TestUpgradeComponent Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { TestUpgradeComponentModel } from './TestUpgradeComponentModel.interface.js';

export interface TestUpgradeComponent {
  init(scenario: Scenario<TestUpgradeComponentModel>): this;
  toScenario(name?: string): Promise<Scenario<TestUpgradeComponentModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}