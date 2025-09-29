/**
 * CMM4TestComponent - CMM4TestComponent Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { CMM4TestComponentModel } from './CMM4TestComponentModel.interface.js';

export interface CMM4TestComponent {
  init(scenario: Scenario<CMM4TestComponentModel>): this;
  toScenario(name?: string): Promise<Scenario<CMM4TestComponentModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}