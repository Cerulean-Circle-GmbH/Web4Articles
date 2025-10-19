/**
 * PDCA - PDCA Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { PDCAModel } from './PDCAModel.interface.js';

export interface PDCA {
  init(scenario: Scenario<PDCAModel>): this;
  toScenario(name?: string): Promise<Scenario<PDCAModel>>;
  setSession(sessionPath: string): Promise<this>;
  cmm3check(pdcaFile: string): Promise<this>;
  cmm3checkSession(sessionPath?: string): Promise<this>;
  updateFeatureTrackingTable(sessionPath?: string): Promise<this>;
  checkCmm3Checklist(): Promise<this>;
  acceptCmm3Checklist(): Promise<this>;
  fixDualLinks(target?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
  test(): Promise<this>;
}
