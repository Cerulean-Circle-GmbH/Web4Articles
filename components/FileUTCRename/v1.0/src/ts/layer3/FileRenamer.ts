/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface FileRenameOperation {
  originalPath: string;
  newPath: string;
  creationTime: string;
  description: string;
}

export interface FileRenameResult {
  success: boolean;
  operations: FileRenameOperation[];
  errors: string[];
  gitOperations: string[];
}

export interface FileRenamer {
  /**
   * Web4 scenario initialization
   */
  init(scenario: FileRenameScenario): this;
  
  /**
   * Execute file renaming operations
   */
  execute(): Promise<FileRenameResult>;
  
  /**
   * Preview operations without executing
   */
  preview(): Promise<FileRenameOperation[]>;
  
  /**
   * Serialize component state to scenario
   */
  toScenario(): FileRenameScenario;
}

export interface FileRenameScenario {
  sourceDirectory: string;
  filePattern: string;
  utcTimestampFormat: string;
  useGitMv: boolean;
  dryRun: boolean;
}
