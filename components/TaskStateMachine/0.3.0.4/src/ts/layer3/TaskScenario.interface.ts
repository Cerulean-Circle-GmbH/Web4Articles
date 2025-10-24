/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

// IOR removed - Occam's Razor simplification for CLI
// import { IOR } from '../../../../IOR/0.3.0.3/src/ts/layer3/IOR.interface.js';
import { TaskModel, TaskStatus, TaskStep } from './TaskStateMachine.interface.js';

export interface TaskScenario {
  // ior: IOR;  // IOR removed - Occam's Razor simplification
  filePath: string;  // Direct file path instead of IOR
  owner: string;  // Encrypted owner information
  model: TaskModel;
  namedLinks?: Array<{
    location: string;  // Relative path for symlink
    filename: string;  // Named link filename
  }>;
  metadata?: {
    created: string;
    updated: string;
    version: string;
  };
}