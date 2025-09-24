#!/usr/bin/env node

/**
 * TestAutoComponent CLI Tool - Web4 Auto-Build Standard
 * Zero-Config Auto-Discovery with Full Auto-Build Chain
 * Handles: npm install → dependencies → build → execute
 * Works from any directory, finds project root via git
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

// Find project root using git
function findProjectRoot() {
    try {
        const gitRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();
        if (existsSync(gitRoot)) {
            return gitRoot;
        }
    } catch {
        // Fallback to directory traversal
    }
    
    let dir = process.cwd();
    while (dir !== '/') {
        if (existsSync(join(dir, '.git')) && existsSync(join(dir, 'package.json'))) {
            return dir;
        }
        dir = dirname(dir);
    }
    
    throw new Error('❌ Error: Not in a Web4 project directory');
}

// Check if npm is available
function ensureNpm() {
    try {
        execSync('npm --version', { stdio: 'ignore' });
        return true;
    } catch {
        console.log('📦 Installing npm...');
        try {
            // Try to install npm via node
            execSync('curl -L https://www.npmjs.com/install.sh | sh', { stdio: 'inherit' });
            return true;
        } catch {
            throw new Error('❌ Failed to install npm. Please install Node.js/npm manually.');
        }
    }
}

// Auto-build component if needed
function autoBuild(componentDir) {
    const distPath = join(componentDir, 'dist');
    const packageJsonPath = join(componentDir, 'package.json');
    const nodeModulesPath = join(componentDir, 'node_modules');
    
    // Change to component directory
    process.chdir(componentDir);
    
    // Install dependencies if needed
    if (!existsSync(nodeModulesPath) && existsSync(packageJsonPath)) {
        console.log('📦 Installing dependencies...');
        execSync('npm install', { stdio: 'inherit' });
    }
    
    // Build if dist doesn't exist or is outdated
    if (!existsSync(distPath) || needsRebuild(componentDir, distPath)) {
        console.log('🔨 Building component...');
        execSync('npm run build', { stdio: 'inherit' });
    }
}

// Check if rebuild is needed
function needsRebuild(componentDir, distPath) {
    try {
        const srcPath = join(componentDir, 'src');
        if (!existsSync(srcPath)) return false;
        
        const srcStat = execSync(`find "${srcPath}" -type f -name "*.ts" -newer "${distPath}" | head -1`, { encoding: 'utf-8' }).trim();
        return srcStat.length > 0;
    } catch {
        return true; // If in doubt, rebuild
    }
}

// Main execution
try {
    const projectRoot = findProjectRoot();
    process.chdir(projectRoot);
    
    // Ensure npm is available
    ensureNpm();
    
    // Component paths
    const componentDir = join(projectRoot, 'components', 'TestAutoComponent', '0.1.0.0');
    const cliPath = join(componentDir, 'dist', 'ts', 'layer5', 'TestAutoComponentCLI.js');
    
    if (!existsSync(componentDir)) {
        throw new Error(`❌ Component not found: TestAutoComponent v0.1.0.0`);
    }
    
    // Auto-build if needed
    autoBuild(componentDir);
    
    if (!existsSync(cliPath)) {
        throw new Error(`❌ TestAutoComponent CLI build failed. Check build output above.`);
    }
    
    // Import and execute component CLI
    const { TestAutoComponentCLI } = await import(cliPath);
    await TestAutoComponentCLI.start(process.argv.slice(2));
    
} catch (error) {
    console.error(error.message || error);
    process.exit(1);
}
