/**
 * P2PServer - P2PServer Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { P2PServerModel } from './P2PServerModel.interface.js';

export interface P2PServer {
  init(scenario: Scenario<P2PServerModel>): this;
  toScenario(name?: string): Promise<Scenario<P2PServerModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
  test(): Promise<this>;
}
