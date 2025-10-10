import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { existsSync } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * 🛡️ PROMOTION ISOLATION TEST
 * 
 * Verifies that promotion workflows NEVER run in test/data directory.
 * This prevents test runs from accidentally promoting versions in the real component directory.
 */
describe('🛡️ Promotion Isolation', () => {
  let component: DefaultWeb4TSComponent;
  const testDataDir = path.join(__dirname, 'data');

  beforeAll(async () => {
    component = new DefaultWeb4TSComponent();
    
    // Set target directory to test/data
    await fs.mkdir(testDataDir, { recursive: true });
    component.setTargetDirectory(testDataDir);
  });

  afterAll(async () => {
    if (existsSync(testDataDir)) {
      await fs.rm(testDataDir, { recursive: true, force: true });
    }
  });

  it('should detect test environment when targetDirectory contains test/data', () => {
    const isTestEnv = (component as any).isTestEnvironment();
    expect(isTestEnv).toBe(true);
    console.log('✅ Test environment correctly detected');
  });

  it('should block handleTestSuccessPromotion in test environment', async () => {
    // Create a test component first
    await component.create('PromotionTest', '0.1.0.0', 'all');
    
    const componentDir = path.join(testDataDir, 'components', 'PromotionTest');
    const versionsBefore = await fs.readdir(componentDir);
    const versionDirsBefore = versionsBefore.filter(v => v.match(/^\d+\.\d+\.\d+\.\d+$/));
    
    console.log(`📊 Versions before promotion attempt: ${versionDirsBefore.join(', ')}`);
    
    // Try to trigger promotion
    await (component as any).handleTestSuccessPromotion('PromotionTest', '0.1.0.0');
    
    const versionsAfter = await fs.readdir(componentDir);
    const versionDirsAfter = versionsAfter.filter(v => v.match(/^\d+\.\d+\.\d+\.\d+$/));
    
    console.log(`📊 Versions after promotion attempt: ${versionDirsAfter.join(', ')}`);
    
    // Should be the same - no new versions created
    expect(versionDirsAfter.length).toBe(versionDirsBefore.length);
    expect(versionDirsAfter).toEqual(versionDirsBefore);
    
    console.log('✅ Promotion correctly blocked in test environment');
  });

  it('should verify targetDirectory influences isTestEnvironment', () => {
    const component1 = new DefaultWeb4TSComponent();
    component1.setTargetDirectory('/Users/Shared/Workspaces/temp/Web4Articles/components/Web4TSComponent/0.3.4.1/test/data');
    expect((component1 as any).isTestEnvironment()).toBe(true);
    
    const component2 = new DefaultWeb4TSComponent();
    component2.setTargetDirectory('/Users/Shared/Workspaces/temp/Web4Articles');
    expect((component2 as any).isTestEnvironment()).toBe(false);
    
    console.log('✅ isTestEnvironment correctly uses targetDirectory');
  });
});

