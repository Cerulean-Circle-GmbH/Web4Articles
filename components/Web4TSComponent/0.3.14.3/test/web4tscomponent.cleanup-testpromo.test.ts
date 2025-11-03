/**
 * Automated Test: Cleanup Polluting TestPromo Component
 * 
 * This test proves that test isolation violations can be cleaned up programmatically.
 * TestPromo was accidentally created in production directory instead of test/data.
 * 
 * This test:
 * 1. Detects the pollution
 * 2. Uses web4tscomponent removeComponent to clean it up
 * 3. Verifies cleanup success
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { existsSync, lstatSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Test is at: components/Web4TSComponent/0.3.5.1/test/web4tscomponent.cleanup-testpromo.test.ts
// Project root is: ../../../.. (test -> 0.3.5.1 -> Web4TSComponent -> components -> root)
const projectRoot = path.resolve(__dirname, '../../../..');

describe('🧹 Cleanup: TestPromo Pollution', () => {
  let component: DefaultWeb4TSComponent;
  
  beforeAll(() => {
    component = new DefaultWeb4TSComponent();
    // NO setTargetDirectory - we're cleaning up PRODUCTION pollution
  });
  
  it('should detect and remove TestPromo component from production', async () => {
    const testPromoPath = path.join(projectRoot, 'components', 'TestPromo');
    
    console.log('\n🔍 Checking for TestPromo pollution...');
    console.log(`   Location: ${testPromoPath}`);
    
    if (!existsSync(testPromoPath)) {
      console.log('   ✅ TestPromo not found - already clean!');
      return;
    }
    
    console.log('   ❌ TestPromo found - removing...');
    
    // Remove using web4tscomponent OOP API
    await component.removeComponent('TestPromo');
    
    // Verify removal
    expect(existsSync(testPromoPath)).toBe(false);
    
    // Verify script symlinks cleaned up
    const scriptSymlink = path.join(projectRoot, 'scripts', 'testpromo');
    const versionedSymlinks = path.join(projectRoot, 'scripts', 'versions', 'testpromo');
    
    expect(existsSync(scriptSymlink)).toBe(false);
    expect(existsSync(versionedSymlinks)).toBe(false);
    
    console.log('   ✅ TestPromo removed successfully');
    console.log('   ✅ Script symlinks cleaned up');
    console.log('   ✅ Production environment clean!');
  });
});

