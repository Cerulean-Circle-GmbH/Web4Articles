/**
 * TestFeatureComponent - TestFeatureComponent Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { TestFeatureComponentModel } from './TestFeatureComponentModel.interface.js';

export interface TestFeatureComponent {
  init(scenario: Scenario<TestFeatureComponentModel>): this;
  toScenario(name?: string): Promise<Scenario<TestFeatureComponentModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}