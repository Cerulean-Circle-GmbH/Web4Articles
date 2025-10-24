/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { IOR } from '../../../../IOR/0.3.0.0/src/ts/layer3/IOR.interface.js';

export interface BuildResult {
  /**
   * Component that was built
   */
  componentIOR: IOR;

  /**
   * Build success status
   */
  success: boolean;

  /**
   * Build artifacts created
   */
  artifacts: string[];

  /**
   * Build duration in milliseconds
   */
  duration: number;

  /**
   * Build start timestamp
   */
  startedAt: string;

  /**
   * Build completion timestamp
   */
  completedAt: string;

  /**
   * Error details if build failed
   */
  error?: {
    message: string;
    stack?: string;
    code?: number;
  };

  /**
   * Build output logs
   */
  logs: {
    stdout: string;
    stderr: string;
  };

  /**
   * Dependencies that were built
   */
  builtDependencies: IOR[];
}