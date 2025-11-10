/**
 * Test: Component Dependency Auto-Build
 * Purpose: Verify dependencies are automatically built when needed
 * CMM3: Automated, reproducible, verifiable
 * 
 * @pdca 2025-11-05-UTC-0230-component-dependencies.pdca.md
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

const PROJECT_ROOT = process.env.WEB4_PROJECT_ROOT || '/Users/Shared/Workspaces/temp/Web4Articles';

describe('Component Dependency Auto-Build', () => {
  const pdca0352Path = join(PROJECT_ROOT, 'components/PDCA/0.3.5.2');
  const pdca03179Path = join(PROJECT_ROOT, 'components/PDCA/0.3.17.9');
  const pdca0352Dist = join(pdca0352Path, 'dist');
  const pdca03179Dist = join(pdca03179Path, 'dist');

  beforeAll(() => {
    // Ensure we start with a clean state
    console.log('🧹 Cleaning PDCA versions for test...');
  });

  afterAll(() => {
    // Rebuild both versions to restore working state
    console.log('🔧 Restoring PDCA versions after test...');
    try {
      execSync('pdca build', { 
        cwd: PROJECT_ROOT,
        stdio: 'pipe',
        env: { ...process.env, PATH: `${PROJECT_ROOT}/scripts:${process.env.PATH}` }
      });
    } catch (error) {
      console.warn('Warning: Could not restore PDCA after test');
    }
  });

  it('should clean both PDCA versions successfully', () => {
    // Clean PDCA 0.3.17.9
    if (existsSync(pdca03179Dist)) {
      rmSync(pdca03179Dist, { recursive: true, force: true });
    }
    expect(existsSync(pdca03179Dist)).toBe(false);

    // Clean PDCA 0.3.5.2
    if (existsSync(pdca0352Dist)) {
      rmSync(pdca0352Dist, { recursive: true, force: true });
    }
    expect(existsSync(pdca0352Dist)).toBe(false);
  });

  it('should automatically build PDCA 0.3.5.2 when building PDCA 0.3.17.9', () => {
    // Build PDCA 0.3.17.9 (should auto-build 0.3.5.2 as dependency)
    const buildOutput = execSync('pdca build', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      env: { ...process.env, PATH: `${PROJECT_ROOT}/scripts:${process.env.PATH}` }
    });

    // Verify PDCA 0.3.5.2 was built as dependency
    expect(existsSync(pdca0352Dist)).toBe(true);
    expect(buildOutput).toContain('Building 1 dependencies');
    expect(buildOutput).toContain('Building dependency: PDCA/0.3.5.2');
    expect(buildOutput).toContain('Dependency built: PDCA/0.3.5.2');
  });

  it('should have built PDCA 0.3.17.9 successfully', () => {
    expect(existsSync(pdca03179Dist)).toBe(true);
  });

  it('should allow trainAILegacy to access PDCA 0.3.5.2', () => {
    const output = execSync('pdca trainAILegacy decide', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      env: { ...process.env, PATH: `${PROJECT_ROOT}/scripts:${process.env.PATH}` }
    });

    expect(output).toContain('How to Decide');
    expect(output).toContain('QA Decision Framework');
  });

  it('should show dependency detection in build output', () => {
    // Clean and rebuild to capture fresh output
    if (existsSync(pdca0352Dist)) {
      rmSync(pdca0352Dist, { recursive: true, force: true });
    }

    const buildOutput = execSync('pdca build', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      env: { ...process.env, PATH: `${PROJECT_ROOT}/scripts:${process.env.PATH}` }
    });

    // Verify build log shows all expected messages
    expect(buildOutput).toContain('📦 Building 1 dependencies');
    expect(buildOutput).toContain('🔧 Building dependency: PDCA/0.3.5.2');
    expect(buildOutput).toContain('✅ Dependency built: PDCA/0.3.5.2');
    expect(buildOutput).toContain('✅ Build completed for PDCA 0.3.17.9');
  });
});

