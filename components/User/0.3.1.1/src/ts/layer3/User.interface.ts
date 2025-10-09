/**
 * User - User Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { UserModel } from './UserModel.interface.js';

export interface User {
  init(scenario: Scenario<UserModel>): this;
  toScenario(name?: string): Promise<Scenario<UserModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
  test(): Promise<this>;
}
