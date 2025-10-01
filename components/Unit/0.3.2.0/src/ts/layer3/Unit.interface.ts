/**
 * Unit - Unit Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { UnitModel } from './UnitModel.interface.js';

export interface Unit {
  init(scenario: Scenario<UnitModel>): this;
  toScenario(name?: string): Promise<Scenario<UnitModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}
