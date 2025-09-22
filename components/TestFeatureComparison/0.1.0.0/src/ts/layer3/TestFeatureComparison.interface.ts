/**
 * TestFeatureComparison - TestFeatureComparison Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { TestFeatureComparisonModel } from './TestFeatureComparisonModel.interface.js';

export interface TestFeatureComparison {
  init(scenario: Scenario<TestFeatureComparisonModel>): this;
  toScenario(name?: string): Promise<Scenario<TestFeatureComparisonModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}