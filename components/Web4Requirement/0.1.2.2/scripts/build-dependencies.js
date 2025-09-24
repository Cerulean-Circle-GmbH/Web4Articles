#!/usr/bin/env node
/**
 * Build Dependencies Script for Web4Requirement
 * Ensures all component dependencies are built before building this component
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentRoot = resolve(__dirname, '..');

// Read buildDependencies from package.json
const packageJson = JSON.parse(readFileSync(resolve(componentRoot, 'package.json'), 'utf-8'));
const buildDependencies = packageJson.buildDependencies || {};

// Default paths if not in buildDependencies
const defaultDependencies = {
  '@web4/unit': '../../Unit/latest',
  '@web4/user': '../../User/0.1.3.0'
};

// Merge with defaults
const dependencies = { ...defaultDependencies, ...buildDependencies };

async function buildDeps() {
  console.log('🔨 Building Web4Requirement dependencies...\n');
  
  for (const [name, relativePath] of Object.entries(dependencies)) {
    const componentPath = resolve(componentRoot, relativePath);
    const distPath = resolve(componentPath, 'dist');
    
    if (!existsSync(componentPath)) {
      console.error(`❌ Dependency ${name} not found at ${componentPath}`);
      process.exit(1);
    }
    
    if (!existsSync(distPath)) {
      console.log(`📦 Building ${name} at ${relativePath}...`);
      try {
        // Check if already has node_modules
        const nodeModulesPath = resolve(componentPath, 'node_modules');
        if (!existsSync(nodeModulesPath)) {
          console.log(`  Installing dependencies for ${name}...`);
          execSync('npm install', {
            cwd: componentPath,
            stdio: 'inherit'
          });
        }
        
        // Build the component
        console.log(`  Building ${name}...`);
        execSync('npm run build', {
          cwd: componentPath,
          stdio: 'inherit'
        });
        
        console.log(`✅ ${name} built successfully\n`);
      } catch (error) {
        console.error(`❌ Failed to build ${name}`);
        console.error(error.message);
        process.exit(1);
      }
    } else {
      console.log(`✅ ${name} already built`);
    }
  }
  
  console.log('✅ All dependencies built successfully!\n');
}

// Run the build process
buildDeps().catch(error => {
  console.error('❌ Build dependencies failed:', error);
  process.exit(1);
});