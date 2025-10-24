/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { RangerModel } from '../layer2/RangerModel';
import { RangerView } from '../layer5/RangerView';
import { RangerController } from './RangerController';

export class TSRanger {
  static async start(): Promise<void> {
    const model = new RangerModel();
    const view = new RangerView();
    const controller = new RangerController(model, view);
    await controller.run();
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}` || (process.argv[1] && process.argv[1].endsWith('TSRanger.ts'))) {
  // Ensure any async errors are surfaced clearly rather than as opaque ESM loader objects
  TSRanger.start().catch((error: unknown) => {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    console.error(`[TSRanger] Fatal error: ${message}`);
    process.exitCode = 1;
  });
}