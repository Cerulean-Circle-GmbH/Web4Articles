/**
 * Web4TSComponent - Web4TSComponent Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { Web4TSComponentModel } from './Web4TSComponentModel.interface.js';

export interface Web4TSComponent {
  init(scenario: Scenario<Web4TSComponentModel>): this;
  toScenario(name?: string): Promise<Scenario<Web4TSComponentModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}
