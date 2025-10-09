/**
 * HttpServer - HttpServer Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { HttpServerModel } from './HttpServerModel.interface.js';

export interface HttpServer {
  init(scenario: Scenario<HttpServerModel>): this;
  toScenario(name?: string): Promise<Scenario<HttpServerModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
  test(): Promise<this>;
}
