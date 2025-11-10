/**
 * Test suite for component template context delegation pattern
 * 
 * Verifies that generated components properly delegate to Web4TSComponent
 * with correct context, ensuring they operate on their own data, not
 * Web4TSComponent's data.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../../src/ts/layer2/DefaultWeb4TSComponent.js';
import * as fs from 'fs';
import * as path from 'path';

describe('Component Template Context Delegation', () => {
  let component: DefaultWeb4TSComponent;
  const testComponentName = 'TestContextComponent';
  const testVersion = '0.1.0.0';
  let componentRoot: string;
  let generatedComponentPath: string;

  beforeEach(async () => {
    component = new DefaultWeb4TSComponent();
    await component.init();
    
    // Set target directory to a temp location
    const tempDir = path.join(process.cwd(), 'test', 'temp', 'context-delegation-test');
    await component.setTargetDirectory(tempDir);
    
    componentRoot = path.join(tempDir, 'components', testComponentName, testVersion);
    generatedComponentPath = path.join(componentRoot, 'src', 'ts', 'layer2', `Default${testComponentName}.ts`);
  });

  afterEach(async () => {
    // Cleanup: remove test component
    if (component) {
      try {
        await component.removeComponent(testComponentName, testVersion);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });

  it('should generate component with delegateToWeb4TS helper method', async () => {
    await component.create(testComponentName, testVersion, 'all');
    
    expect(fs.existsSync(generatedComponentPath)).toBe(true);
    
    const content = fs.readFileSync(generatedComponentPath, 'utf-8');
    
    // Check for private helper method
    expect(content).toContain('private async delegateToWeb4TS');
    expect(content).toContain('method: string');
    expect(content).toContain('web4ts.model.context = this');
    expect(content).toContain('await (web4ts as any)[method](...args)');
    expect(content).toContain('return this;');
  });

  it('should generate links() method using delegateToWeb4TS helper', async () => {
    await component.create(testComponentName, testVersion, 'all');
    
    const content = fs.readFileSync(generatedComponentPath, 'utf-8');
    
    // Links should use helper
    expect(content).toMatch(/async links\([^)]*\)[^{]*{[^}]*return this\.delegateToWeb4TS\(['"]links['"][^)]*\)/s);
    
    // Should NOT have manual context setting in links() itself
    const linksMethodMatch = content.match(/async links\([^)]*\)[^{]*{([^}]+)}/s);
    if (linksMethodMatch) {
      const linksBody = linksMethodMatch[1];
      expect(linksBody).not.toContain('const web4ts = await this.getWeb4TSComponent()');
      expect(linksBody).not.toContain('web4ts.model.context = this');
    }
  });

  it('should generate test() method using delegateToWeb4TS helper instead of 178-line implementation', async () => {
    await component.create(testComponentName, testVersion, 'all');
    
    const content = fs.readFileSync(generatedComponentPath, 'utf-8');
    
    // Test should use helper (short implementation)
    expect(content).toMatch(/async test\([^)]*\)[^{]*{[^}]*return this\.delegateToWeb4TS\(['"]test['"][^)]*\)/s);
    
    // Should NOT have manual version promotion logic
    expect(content).not.toContain('setTest()');
    expect(content).not.toContain('setDev()');
    expect(content).not.toContain('setProd()');
    
    // Should NOT have 178-line manual implementation
    const testMethodMatch = content.match(/async test\([^)]*\)[^{]*{([^}]+)}/s);
    if (testMethodMatch) {
      const testBody = testMethodMatch[1];
      const lineCount = testBody.split('\n').length;
      expect(lineCount).toBeLessThan(10); // Should be ~3 lines, not 178
    }
  });

  it('should generate build() method using delegateToWeb4TS helper', async () => {
    await component.create(testComponentName, testVersion, 'all');
    
    const content = fs.readFileSync(generatedComponentPath, 'utf-8');
    
    // Build should use helper
    expect(content).toMatch(/async build\([^)]*\)[^{]*{[^}]*return this\.delegateToWeb4TS\(['"]build['"][^)]*\)/s);
  });

  it('should generate clean() method using delegateToWeb4TS helper', async () => {
    await component.create(testComponentName, testVersion, 'all');
    
    const content = fs.readFileSync(generatedComponentPath, 'utf-8');
    
    // Clean should use helper
    expect(content).toMatch(/async clean\([^)]*\)[^{]*{[^}]*return this\.delegateToWeb4TS\(['"]clean['"][^)]*\)/s);
  });

  it('should generate tree() method using delegateToWeb4TS helper', async () => {
    await component.create(testComponentName, testVersion, 'all');
    
    const content = fs.readFileSync(generatedComponentPath, 'utf-8');
    
    // Tree should use helper
    expect(content).toMatch(/async tree\([^)]*\)[^{]*{[^}]*return this\.delegateToWeb4TS\(['"]tree['"][^)]*\)/s);
  });

  it('should set context only ONCE in delegateToWeb4TS helper (DRY principle)', async () => {
    await component.create(testComponentName, testVersion, 'all');
    
    const content = fs.readFileSync(generatedComponentPath, 'utf-8');
    
    // Count occurrences of context setting
    const contextSetMatches = content.match(/web4ts\.model\.context\s*=\s*this/g);
    
    // Should appear ONCE in helper, not repeated in each method
    expect(contextSetMatches).not.toBeNull();
    expect(contextSetMatches!.length).toBe(1);
  });

  it('should set context before delegating to Web4TSComponent (not after)', async () => {
    await component.create(testComponentName, testVersion, 'all');
    
    const content = fs.readFileSync(generatedComponentPath, 'utf-8');
    
    // Find the delegateToWeb4TS helper
    const helperMatch = content.match(/private async delegateToWeb4TS[^{]*{([^}]+)}/s);
    expect(helperMatch).not.toBeNull();
    
    if (helperMatch) {
      const helperBody = helperMatch[1];
      
      // Context should be set BEFORE method call
      const contextIndex = helperBody.indexOf('web4ts.model.context = this');
      const callIndex = helperBody.indexOf('await (web4ts as any)[method]');
      
      expect(contextIndex).toBeGreaterThan(-1);
      expect(callIndex).toBeGreaterThan(-1);
      expect(contextIndex).toBeLessThan(callIndex);
    }
  });
});

