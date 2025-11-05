/**
 * ArchTestProd1 - ArchTestProd1 Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { ArchTestProd1Model } from './ArchTestProd1Model.interface.js';

export interface ArchTestProd1 {
  init(scenario: Scenario<ArchTestProd1Model>): this;
  toScenario(name?: string): Promise<Scenario<ArchTestProd1Model>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
  test(): Promise<this>;
}
