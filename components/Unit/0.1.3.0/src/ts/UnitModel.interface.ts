/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface ExecutionRecord {
  timestamp: string;
  input: unknown;
  output: unknown;
  status: 'success' | 'failed';
}

export interface UnitModel {
  uuid: string;
  name: string;
  description: string;
  state: 'uninitialized' | 'initialized' | 'executed';
  capabilities: string[];
  executionHistory: ExecutionRecord[];
  owner?: string;
}

export interface UnitInput {
  [key: string]: unknown;
}

export interface UnitOutput {
  [key: string]: unknown;
}