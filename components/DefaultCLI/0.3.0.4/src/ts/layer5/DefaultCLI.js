#!/usr/bin/env node

/**
 * DefaultCLI Static Start - Radical OOP compliance
 * Web4 pattern: Static start method receiving shell parameters
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';

// Radical OOP: Static start method with shell parameters (no main functional entity)
DefaultCLI.start(process.argv.slice(2)).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});