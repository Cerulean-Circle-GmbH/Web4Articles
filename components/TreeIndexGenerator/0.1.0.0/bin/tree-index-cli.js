#!/usr/bin/env node

import { TreeIndexGenerator } from '../src/TreeIndexGenerator.js';

// Run the CLI
TreeIndexGenerator.start(process.argv.slice(2));