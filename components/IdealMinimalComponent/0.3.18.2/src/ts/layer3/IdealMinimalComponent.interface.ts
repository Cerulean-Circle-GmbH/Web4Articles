/**
 * IdealMinimalComponent - IdealMinimalComponent Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { IdealMinimalComponentModel } from './IdealMinimalComponentModel.interface.js';

export interface IdealMinimalComponent {
  init(scenario: Scenario<IdealMinimalComponentModel>): this;
  toScenario(name?: string): Promise<Scenario<IdealMinimalComponentModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
  test(): Promise<this>;
}
