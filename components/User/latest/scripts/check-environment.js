#!/usr/bin/env node

/**
 * Web4 User Component Environment Checker
 * Ensures the environment is properly configured before installation
 */

import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '../../../../');

console.log('🔍 Checking Web4 User component environment...\n');

let hasErrors = false;

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion < 18) {
  console.error('❌ Node.js 18 or higher required. Found:', nodeVersion);
  hasErrors = true;
} else {
  console.log('✅ Node.js version:', nodeVersion);
}

// Check if TypeScript is available
try {
  const tscPath = resolve(projectRoot, 'node_modules/.bin/tsc');
  if (!existsSync(tscPath)) {
    console.error('❌ TypeScript not found. Run npm install in project root.');
    hasErrors = true;
  } else {
    console.log('✅ TypeScript available');
  }
} catch (error) {
  console.error('❌ Error checking TypeScript:', error.message);
  hasErrors = true;
}

// Check project structure
const requiredPaths = [
  'src/ts/layer2/DefaultUser.ts',
  'src/ts/layer3/IUser.ts',
  'src/ts/layer5/UserCLI.ts',
  'tsconfig.json'
];

for (const path of requiredPaths) {
  const fullPath = resolve(__dirname, '..', path);
  if (!existsSync(fullPath)) {
    console.error(`❌ Required file missing: ${path}`);
    hasErrors = true;
  } else {
    console.log(`✅ Found: ${path}`);
  }
}

// Check ESM configuration
if (!existsSync(resolve(__dirname, '../package.json'))) {
  console.error('❌ package.json not found');
  hasErrors = true;
} else {
  try {
    const pkg = await import('../package.json', { assert: { type: 'json' } });
    if (pkg.default.type !== 'module') {
      console.error('❌ package.json must have "type": "module" for ESM support');
      hasErrors = true;
    } else {
      console.log('✅ ESM configuration correct');
    }
  } catch (error) {
    console.error('❌ Error reading package.json:', error.message);
    hasErrors = true;
  }
}

if (hasErrors) {
  console.error('\n❌ Environment check failed. Please fix the issues above.');
  process.exit(1);
} else {
  console.log('\n✅ Environment check passed! Ready to install.');
}