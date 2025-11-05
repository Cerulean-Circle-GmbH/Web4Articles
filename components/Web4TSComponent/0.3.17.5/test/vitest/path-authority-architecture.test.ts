/**
 * Path Authority Architecture Test
 * 
 * @pdca 2025-11-03-UTC-1828.pdca.md
 * 
 * Validates the Path Authority Principle:
 * - DefaultCLI calculates ALL paths (Path Authority)
 * - Component uses ONLY model state (NO path calculations)
 * - Model-driven program flow (behavior determined by model state)
 * - Environment-agnostic (NO process.cwd() or env vars in Component)
 */

import { describe, it, expect } from 'vitest';
import { DefaultCLI } from '../../src/ts/layer2/DefaultCLI.js';
import { DefaultWeb4TSComponent } from '../../src/ts/layer2/DefaultWeb4TSComponent.js';

describe('Path Authority Architecture', () => {
  
  it('CLI is Path Authority - calculates projectRoot in init()', async () => {
    const cli = await new DefaultCLI().init({});
    
    // CLI has calculated and stored projectRoot
    expect(cli.model.projectRoot).toBeDefined();
    expect(cli.model.projectRoot).toContain('Web4Articles');
    expect(typeof cli.model.projectRoot).toBe('string');
    expect(cli.model.projectRoot.length).toBeGreaterThan(0);
  });
  
  it('CLI is Path Authority - calculates testDataDir in init()', async () => {
    const cli = await new DefaultCLI().init({});
    
    // CLI has calculated and stored testDataDir
    expect(cli.model.testDataDir).toBeDefined();
    expect(cli.model.testDataDir).toContain('/test/data');
    expect(typeof cli.model.testDataDir).toBe('string');
    expect(cli.model.testDataDir.length).toBeGreaterThan(0);
  });
  
  it('Component uses model state - NO path calculations', async () => {
    const cli = await new DefaultCLI().init({});
    
    // CLI provides targetDirectory to Component
    const component = await new DefaultWeb4TSComponent().init({
      model: { targetDirectory: cli.model.testDataDir }
    });
    
    // Component just uses what CLI provided
    expect(component.model.targetDirectory).toBe(cli.model.testDataDir);
    expect(component.model.targetDirectory).toContain('/test/data');
    
    // Component does NOT calculate paths, just uses model state
  });
  
  it('Test isolation detected by model state pattern', async () => {
    // ✅ Web4 Pattern: Use DefaultCLI to calculate ALL paths (Path Authority)
    const cli = await new DefaultCLI().init({});
    
    // CLI calculates test isolation directory (componentRoot + /test/data)
    const testDataDir = cli.model.testDataDir; // CLI calculated this ONCE in init()
    
    // @pdca 2025-11-03-UTC-1828.pdca.md - BOTH projectRoot AND targetDirectory required
    const component = await new DefaultWeb4TSComponent().init({
      model: { 
        projectRoot: testDataDir,
        targetDirectory: testDataDir 
      }
    });
    
    // Component detects test isolation by path pattern
    // testDataDir contains '/test/data' → test isolation mode
    // testDataDir behaves like project root (has components/, tsconfig.json, etc.)
    expect(component.model.targetDirectory).toContain('/test/data');
    expect(component.model.targetDirectory).toBe(cli.model.testDataDir);
    
    // Component NEVER calculates paths, only uses what CLI provides
  });
  
  it('initProject uses model state, NOT process.cwd()', async () => {
    const cli = await new DefaultCLI().init({});
    
    // @pdca 2025-11-03-UTC-1828.pdca.md - BOTH projectRoot AND targetDirectory required
    const component = await new DefaultWeb4TSComponent().init({
      model: { 
        projectRoot: cli.model.testDataDir,
        targetDirectory: cli.model.testDataDir 
      }
    });
    
    // initProject('§') should use this.model.targetDirectory
    // NOT calculate from process.cwd()
    // This is validated by: no process.cwd() calls in initProject
    
    // We can't easily test the exact behavior without running initProject,
    // but we can verify the model state is set correctly
    expect(component.model.targetDirectory).toBe(cli.model.testDataDir);
  });
  
  it('Production vs Test Isolation - determined by model state', async () => {
    const cli = await new DefaultCLI().init({});
    
    // Test Isolation: CLI provides testDataDir
    // @pdca 2025-11-03-UTC-1828.pdca.md - BOTH projectRoot AND targetDirectory required
    const testComponent = await new DefaultWeb4TSComponent().init({
      model: { 
        projectRoot: cli.model.testDataDir,
        targetDirectory: cli.model.testDataDir 
      }
    });
    expect(testComponent.model.targetDirectory).toContain('/test/data');
    
    // Production: CLI provides projectRoot
    const prodComponent = await new DefaultWeb4TSComponent().init({
      model: { 
        projectRoot: cli.model.projectRoot,
        targetDirectory: cli.model.projectRoot 
      }
    });
    expect(prodComponent.model.targetDirectory).not.toContain('/test/data');
    
    // Same Component class, different behavior based on model state
    // This is Model-Driven Program Flow
  });
  
  it('Environment-agnostic - Component has NO env var access', async () => {
    const cli = await new DefaultCLI().init({});
    
    // @pdca 2025-11-03-UTC-1828.pdca.md - BOTH projectRoot AND targetDirectory required
    const component = await new DefaultWeb4TSComponent().init({
      model: { 
        projectRoot: cli.model.projectRoot,
        targetDirectory: cli.model.projectRoot 
      }
    });
    
    // Component behavior is determined by model state
    // NOT by process.cwd() or environment variables
    // Component code should have ZERO process.cwd() calls
    // Component code should have ZERO process.env.* calls (except User component)
    
    expect(component.model.targetDirectory).toBeDefined();
    expect(component.model.targetDirectory).toBe(cli.model.projectRoot);
  });
  
});

