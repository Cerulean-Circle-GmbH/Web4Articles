/**
 * DemoComponent - DemoComponent Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { DemoComponentModel } from './DemoComponentModel.interface.js';

export interface DemoComponent {
  init(scenario: Scenario<DemoComponentModel>): this;
  toScenario(name?: string): Promise<Scenario<DemoComponentModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
  test(): Promise<this>;
}
