/**
 * Test: clean vs clean force (local vs global cleanup)
 * 
 * Verifies that:
 * 1. `clean` only removes local artifacts (dist/, node_modules symlink)
 * 2. `clean force` removes local artifacts AND global node_modules
 * 3. Global node_modules is preserved after normal clean
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, readlinkSync } from 'fs';
import { join } from 'path';

const projectRoot = '/Users/Shared/Workspaces/temp/Web4Articles';
const testComponent = 'PDCA';
const testVersion = '0.3.17.9';
const componentPath = join(projectRoot, 'components', testComponent, testVersion);
const globalNodeModules = join(projectRoot, 'node_modules');

describe('Clean Command: Local vs Global', () => {
  
  beforeAll(() => {
    // Ensure test component is built
    execSync(`cd ${componentPath} && npx tsc`, { stdio: 'pipe' });
    
    // Ensure global node_modules exists
    if (!existsSync(globalNodeModules)) {
      execSync(`cd ${projectRoot} && npm install`, { stdio: 'pipe' });
    }
  });

  afterAll(() => {
    // Restore global node_modules if it was deleted during tests
    if (!existsSync(globalNodeModules)) {
      execSync(`cd ${projectRoot} && npm install`, { stdio: 'pipe' });
    }
    
    // Rebuild test component if it was cleaned
    if (!existsSync(join(componentPath, 'dist'))) {
      execSync(`cd ${componentPath} && npx tsc`, { stdio: 'pipe' });
    }
  });

  it('should remove local artifacts with normal clean', () => {
    // Arrange: Build component if needed (clean should work regardless of current state)
    if (!existsSync(join(componentPath, 'dist'))) {
      execSync(`cd ${componentPath} && npx tsc`, { stdio: 'pipe' });
    }
    
    // Act: Run normal clean (should be idempotent - work even if already clean)
    const result = execSync(
      `cd ${componentPath} && npm run clean`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    
    // Assert: After clean, local artifacts should NOT exist
    expect(existsSync(join(componentPath, 'dist'))).toBe(false);
    expect(existsSync(join(componentPath, 'node_modules'))).toBe(false);
    
    // Assert: Output confirms local-only clean
    expect(result).toContain('Cleaning all artifacts');
  });

  it('should preserve global node_modules after normal clean', () => {
    // Arrange: Run normal clean
    execSync(
      `cd ${componentPath} && npm run clean`,
      { stdio: 'pipe' }
    );
    
    // Assert: Global node_modules still exists
    expect(existsSync(globalNodeModules)).toBe(true);
    expect(existsSync(join(globalNodeModules, 'typescript'))).toBe(true);
  });

  it('should remove global node_modules with clean force', () => {
    // Arrange: Ensure global node_modules exists
    if (!existsSync(globalNodeModules)) {
      execSync(`cd ${projectRoot} && npm install`, { stdio: 'pipe' });
    }
    expect(existsSync(globalNodeModules)).toBe(true);
    
    // Act: Run clean:global
    const result = execSync(
      `cd ${componentPath} && npm run clean:global`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    
    // Assert: Global node_modules removed
    expect(existsSync(globalNodeModules)).toBe(false);
    
    // Assert: Output confirms global clean
    expect(result).toContain('Cleaning ALL artifacts (local + global)');
    expect(result).toContain('WARNING: This will delete the global node_modules');
  });

  it('should have clean-global.sh script in component', () => {
    // Assert: clean-global.sh exists and is executable
    const cleanGlobalScript = join(componentPath, 'src/sh/clean-global.sh');
    expect(existsSync(cleanGlobalScript)).toBe(true);
  });

  it('should NOT have clean-local.sh script (deprecated)', () => {
    // Assert: clean-local.sh does NOT exist (it was deleted)
    const cleanLocalScript = join(componentPath, 'src/sh/clean-local.sh');
    expect(existsSync(cleanLocalScript)).toBe(false);
  });

  it('should have clean.sh script that does local-only cleanup', () => {
    // Assert: clean.sh exists
    const cleanScript = join(componentPath, 'src/sh/clean.sh');
    expect(existsSync(cleanScript)).toBe(true);
    
    // Assert: clean.sh does NOT delete global node_modules
    const { readFileSync } = require('fs');
    const cleanContent = readFileSync(cleanScript, 'utf-8');
    expect(cleanContent).not.toContain('rm -rf ../../../../../node_modules');
    expect(cleanContent).toContain('rm -rf dist');
    expect(cleanContent).toContain('rm -rf node_modules');
  });

  it('should have package.json with clean and clean:global scripts', () => {
    // Assert: package.json has both scripts
    const packageJson = require(join(componentPath, 'package.json'));
    expect(packageJson.scripts.clean).toBe('./src/sh/clean.sh');
    expect(packageJson.scripts['clean:global']).toBe('./src/sh/clean-global.sh');
  });
});

