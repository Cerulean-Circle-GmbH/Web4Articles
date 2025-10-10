/**
 * WsServer - WsServer Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { WsServerModel } from './WsServerModel.interface.js';

export interface WsServer {
  init(scenario: Scenario<WsServerModel>): this;
  toScenario(name?: string): Promise<Scenario<WsServerModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
  test(): Promise<this>;
}
