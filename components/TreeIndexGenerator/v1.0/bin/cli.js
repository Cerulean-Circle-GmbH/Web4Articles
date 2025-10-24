/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

#!/usr/bin/env node

import { TreeIndexGenerator } from '../dist/TreeIndexGenerator.js';

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  TreeIndexGenerator.start(process.argv.slice(2));
}