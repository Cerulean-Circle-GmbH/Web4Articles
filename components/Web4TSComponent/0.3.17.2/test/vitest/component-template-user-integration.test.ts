import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { DefaultWeb4TSComponent } from '../../src/ts/layer2/DefaultWeb4TSComponent.js';

/**
 * Component Template User Service Integration Tests
 * @pdca 2025-11-03-1135.pdca.md - Template modernization test-first
 * 
 * Purpose: Verify that components generated from DefaultComponent.ts.template
 * use User service pattern (getUser() + toScenario()) instead of hardcoded env vars
 */

const currentFileUrl = new URL(import.meta.url);
const currentDir = fileURLToPath(new URL('.', currentFileUrl));
const componentRoot = join(currentDir, '../..');
const testDataPath = join(componentRoot, 'test/data');
const testComponentName = 'TestUserComponent';
const testComponentVersion = '0.1.0.0';
const testComponentPath = join(testDataPath, 'components', testComponentName, testComponentVersion);

describe('Component Template - User Service Integration', () => {
  let web4ts: DefaultWeb4TSComponent;

  beforeEach(async () => {
    // Initialize Web4TSComponent for test component creation
    web4ts = new DefaultWeb4TSComponent().init({
      model: { targetDirectory: testDataPath }
    });
  });

  afterEach(() => {
    // Clean up test component
    const componentDir = join(testDataPath, 'components', testComponentName);
    if (existsSync(componentDir)) {
      rmSync(componentDir, { recursive: true, force: true });
    }
  });

  it('should generate component with User interface import', async () => {
    // Create test component
    await web4ts.create(testComponentName, testComponentVersion, 'all');

    // Build component to verify TypeScript compilation
    execSync('npm run build', {
      cwd: testComponentPath,
      stdio: 'pipe'
    });

    // Read generated DefaultTestUserComponent.ts
    const { readFileSync } = await import('fs');
    const componentFile = join(testComponentPath, 'src/ts/layer2', `Default${testComponentName}.ts`);
    const content = readFileSync(componentFile, 'utf-8');

    // Should import User interface
    expect(content).toContain("import { User } from '../layer3/User.interface.js'");
  });

  it('should generate component with private user field', async () => {
    await web4ts.create(testComponentName, testComponentVersion, 'all');

    execSync('npm run build', {
      cwd: testComponentPath,
      stdio: 'pipe'
    });

    const { readFileSync } = await import('fs');
    const componentFile = join(testComponentPath, 'src/ts/layer2', `Default${testComponentName}.ts`);
    const content = readFileSync(componentFile, 'utf-8');

    // Should declare private user field
    expect(content).toMatch(/private\s+user\?\s*:\s*User/);
  });

  it('should generate component with getUser() lazy initialization method', async () => {
    await web4ts.create(testComponentName, testComponentVersion, 'all');

    execSync('npm run build', {
      cwd: testComponentPath,
      stdio: 'pipe'
    });

    const { readFileSync } = await import('fs');
    const componentFile = join(testComponentPath, 'src/ts/layer2', `Default${testComponentName}.ts`);
    const content = readFileSync(componentFile, 'utf-8');

    // Should have getUser() method
    expect(content).toMatch(/private\s+async\s+getUser\(\)\s*:\s*Promise<User>/);
    
    // Should use lazy initialization pattern
    expect(content).toContain('if (this.user) return this.user');
    
    // Should dynamically import User
    expect(content).toContain("import('../../User/latest/dist/ts/layer2/DefaultUser.js')");
    
    // Should handle optional dependency
    expect(content).toContain("throw new Error('User service not available')");
  });

  it('should generate toScenario() using User.toScenario() with fallback', async () => {
    await web4ts.create(testComponentName, testComponentVersion, 'all');

    execSync('npm run build', {
      cwd: testComponentPath,
      stdio: 'pipe'
    });

    const { readFileSync } = await import('fs');
    const componentFile = join(testComponentPath, 'src/ts/layer2', `Default${testComponentName}.ts`);
    const content = readFileSync(componentFile, 'utf-8');

    // Should try to use User service
    expect(content).toMatch(/const\s+user\s*=\s*await\s+this\.getUser\(\)/);
    expect(content).toMatch(/const\s+userScenario\s*=\s*await\s+user\.toScenario\(\)/);
    
    // Should have try-catch for fallback
    expect(content).toMatch(/try\s*\{[\s\S]*?catch\s*\(/);
    
    // Should use base64 encoding
    expect(content).toContain('Buffer.from');
    expect(content).toContain('.toString(\'base64\')');
    
    // Should NOT have hardcoded JSON.stringify of env vars directly in toScenario
    // (it should be in fallback only)
    const lines = content.split('\n');
    const toScenarioStart = lines.findIndex(l => l.includes('async toScenario('));
    const toScenarioEnd = lines.findIndex((l, i) => i > toScenarioStart && l.trim().startsWith('}'));
    const toScenarioContent = lines.slice(toScenarioStart, toScenarioEnd + 1).join('\n');
    
    // In toScenario, env vars should only be in fallback (catch block)
    const tryBlockMatch = toScenarioContent.match(/try\s*\{([\s\S]*?)\}\s*catch/);
    if (tryBlockMatch) {
      const tryBlock = tryBlockMatch[1];
      // Try block should NOT have direct process.env access
      expect(tryBlock).not.toMatch(/process\.env\.USER.*process\.env\.HOSTNAME/);
    }
  });

  it('should generate component toScenario() with base64 encoded owner data', async () => {
    await web4ts.create(testComponentName, testComponentVersion, 'all');

    // Build and import component
    execSync('npm run build', {
      cwd: testComponentPath,
      stdio: 'pipe'
    });

    // Dynamically import the generated component
    const componentModule = await import(
      join(testComponentPath, 'dist/ts/layer2', `Default${testComponentName}.js`)
    );
    const ComponentClass = componentModule[`Default${testComponentName}`];
    const component = new ComponentClass().init();

    // Call toScenario
    const scenario = await component.toScenario();

    // Owner data should be base64 encoded
    expect(scenario.owner).toBeDefined();
    expect(typeof scenario.owner).toBe('string');
    
    // Should be valid base64
    expect(() => Buffer.from(scenario.owner, 'base64')).not.toThrow();
    
    // Decode and verify it's a valid scenario structure
    const decoded = Buffer.from(scenario.owner, 'base64').toString('utf-8');
    const ownerScenario = JSON.parse(decoded);
    
    // Should have scenario structure (IOR + owner + model)
    expect(ownerScenario).toHaveProperty('ior');
    expect(ownerScenario).toHaveProperty('owner');
    expect(ownerScenario).toHaveProperty('model');
    
    // IOR should identify as User component
    expect(ownerScenario.ior.component).toBe('User');
  });

  it('should work with User service unavailable (fallback scenario)', async () => {
    await web4ts.create(testComponentName, testComponentVersion, 'all');

    execSync('npm run build', {
      cwd: testComponentPath,
      stdio: 'pipe'
    });

    // Import component (User service won't be available in test data)
    const componentModule = await import(
      join(testComponentPath, 'dist/ts/layer2', `Default${testComponentName}.js`)
    );
    const ComponentClass = componentModule[`Default${testComponentName}`];
    const component = new ComponentClass().init();

    // Should not throw even without User service
    const scenario = await component.toScenario();

    // Should generate fallback scenario
    expect(scenario).toBeDefined();
    expect(scenario.owner).toBeDefined();
    
    // Decode fallback owner data
    const decoded = Buffer.from(scenario.owner, 'base64').toString('utf-8');
    const ownerScenario = JSON.parse(decoded);
    
    // Fallback should still be valid User scenario structure
    expect(ownerScenario.ior.component).toBe('User');
    expect(ownerScenario.model.user).toBeDefined();
    expect(ownerScenario.model.hostname).toBeDefined();
  });
});

