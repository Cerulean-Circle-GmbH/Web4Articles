/**
 * TestCompProd - TestCompProd Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { TestCompProdModel } from './TestCompProdModel.interface.js';

export interface TestCompProd {
  init(scenario: Scenario<TestCompProdModel>): this;
  toScenario(name?: string): Promise<Scenario<TestCompProdModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
  test(): Promise<this>;
}
