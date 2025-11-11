/**
 * PDCA - PDCA Component Interface
 * Web4 pattern: Component interface definition
 * 
 * @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
 * NOTE: Delegated methods (info, test, build, clean, tree, links, etc.) are NOT declared here.
 * They are automatically available via DelegationProxy wrapping in the CLI.
 */

import { Scenario } from './Scenario.interface.js';
import { PDCAModel } from './PDCAModel.interface.js';

export interface PDCA {
  init(scenario?: Scenario<PDCAModel>): Promise<this>;
  toScenario(name?: string): Promise<Scenario<PDCAModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  // Delegated methods (info, test, etc.) are available via DelegationProxy but not declared here
}

