/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
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
