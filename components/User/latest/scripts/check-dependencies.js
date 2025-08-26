#!/usr/bin/env node

/**
 * Web4 User Component Dependency Checker
 * Verifies all dependencies are properly installed before build
 */

import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentRoot = resolve(__dirname, '..');

console.log('🔍 Checking Web4 User component dependencies...\n');

let hasErrors = false;

// Check if node_modules exists
const nodeModulesPath = resolve(componentRoot, 'node_modules');
if (!existsSync(nodeModulesPath)) {
  console.error('❌ node_modules not found. Run npm install first.');
  hasErrors = true;
  process.exit(1);
}

// Check required dev dependencies
const requiredDevDeps = [
  'typescript',
  'ts-node',
  '@types/node',
  '@types/glob',
  'vitest',
  'eslint',
  'prettier',
  'glob'
];

console.log('Checking dev dependencies...');
for (const dep of requiredDevDeps) {
  const depPath = resolve(nodeModulesPath, dep);
  if (!existsSync(depPath)) {
    console.error(`❌ Missing dev dependency: ${dep}`);
    hasErrors = true;
  } else {
    console.log(`✅ ${dep}`);
  }
}

// Check Unit component dependency
console.log('\nChecking component dependencies...');
const unitComponentPath = resolve(componentRoot, '../../Unit/latest');
if (!existsSync(unitComponentPath)) {
  console.error('❌ Unit component not found at expected path');
  hasErrors = true;
} else {
  const unitDistPath = resolve(unitComponentPath, 'dist');
  if (!existsSync(unitDistPath)) {
    console.error('❌ Unit component not built (dist/ missing)');
    console.log('  ℹ️  Run: cd ../../Unit/latest && npm install && npm run build');
    hasErrors = true;
  } else {
    console.log('✅ Unit component available');
  }
}

// Check for TypeScript configuration
const tsconfigPath = resolve(componentRoot, 'tsconfig.json');
if (!existsSync(tsconfigPath)) {
  console.error('❌ tsconfig.json not found');
  hasErrors = true;
} else {
  console.log('✅ TypeScript configuration found');
}

// Check if previous build artifacts might cause issues
const distPath = resolve(componentRoot, 'dist');
if (existsSync(distPath)) {
  try {
    const stats = execSync('find dist -name "*.js" | wc -l', { 
      cwd: componentRoot,
      encoding: 'utf-8'
    }).trim();
    console.log(`ℹ️  Found ${stats} JS files in dist/`);
  } catch (error) {
    console.warn('⚠️  Could not count dist files');
  }
}

if (hasErrors) {
  console.error('\n❌ Dependency check failed. Please fix the issues above.');
  process.exit(1);
} else {
  console.log('\n✅ All dependencies satisfied! Ready to build.');
}