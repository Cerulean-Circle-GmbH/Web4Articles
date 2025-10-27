/**
 * TestChainComponent - TestChainComponent Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { TestChainComponentModel } from './TestChainComponentModel.interface.js';

export interface TestChainComponent {
  init(scenario: Scenario<TestChainComponentModel>): this;
  toScenario(name?: string): Promise<Scenario<TestChainComponentModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}