/**
 * DemoWeb4Component - DemoWeb4Component Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { DemoWeb4ComponentModel } from './DemoWeb4ComponentModel.interface.js';

export interface DemoWeb4Component {
  init(scenario: Scenario<DemoWeb4ComponentModel>): this;
  toScenario(name?: string): Promise<Scenario<DemoWeb4ComponentModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
  test(): Promise<this>;
}
