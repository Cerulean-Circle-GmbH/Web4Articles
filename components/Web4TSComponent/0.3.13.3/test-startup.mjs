#!/usr/bin/env node
console.log('Starting...');
const start = Date.now();

// Just load the CLI
import { Web4TSComponentCLI } from './dist/ts/layer5/Web4TSComponentCLI.js';

const loadTime = Date.now() - start;
console.log(`Module loaded in ${loadTime}ms`);

// Create instance
const instanceStart = Date.now();
const cli = new Web4TSComponentCLI();
const instanceTime = Date.now() - instanceStart;
console.log(`Instance created in ${instanceTime}ms`);

const total = Date.now() - start;
console.log(`Total: ${total}ms`);

