/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { OnceCLI } from './ONCECLI.js';

async function main() {
    try {
        const cli = new OnceCLI();
        const args = process.argv.slice(2);
        await cli.handleCommand(args);
    } catch (error) {
        console.error('❌ ONCE CLI Error:', error);
        process.exit(1);
    }
}

// Run CLI
main();
