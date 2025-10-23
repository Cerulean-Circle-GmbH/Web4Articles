/**
 * LicenseTool - LicenseTool Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { LicenseToolModel } from './LicenseToolModel.interface.js';

export interface LicenseTool {
  init(scenario: Scenario<LicenseToolModel>): this;
  toScenario(name?: string): Promise<Scenario<LicenseToolModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
  test(): Promise<this>;
}
