#!/usr/bin/env node
console.log('Starting...');
const start = Date.now();

// Load and call start
import { Web4TSComponentCLI } from './dist/ts/layer5/Web4TSComponentCLI.js';

const loadTime = Date.now() - start;
console.log(`Module loaded in ${loadTime}ms`);

// Call start with no args (shows help)
const startMethodTime = Date.now();
await Web4TSComponentCLI.start([]);
const endTime = Date.now();

console.log(`\nstart() method took ${endTime - startMethodTime}ms`);
console.log(`Total: ${endTime - start}ms`);

