/**
 * SessionSummary - SessionSummary Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { SessionSummaryModel } from './SessionSummaryModel.interface.js';

export interface SessionSummary {
  init(scenario: Scenario<SessionSummaryModel>): this;
  toScenario(name?: string): Promise<Scenario<SessionSummaryModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}