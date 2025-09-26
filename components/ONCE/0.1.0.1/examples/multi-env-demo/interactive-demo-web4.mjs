#!/usr/bin/env node

/**
 * ONCE Interactive Demo - Web4 TypeScript Implementation
 * Replacement for interactive-demo.js using proper Web4 architecture
 */

import { InteractiveDemoController, main } from '../../dist/ts/layer5/InteractiveDemoController.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Set base directory for demo
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Execute the main function with command line arguments
main(process.argv.slice(2)).catch(error => {
    console.error('Demo execution failed:', error.message);
    process.exit(1);
});
