/**
 * ONCE v0.2.0.0 CLI Entry Point
 * No environment variables required
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
