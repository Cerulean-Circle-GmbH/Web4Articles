#!/usr/bin/env node

import { TreeIndexGenerator } from '../dist/TreeIndexGenerator.js';

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  TreeIndexGenerator.start(process.argv.slice(2));
}