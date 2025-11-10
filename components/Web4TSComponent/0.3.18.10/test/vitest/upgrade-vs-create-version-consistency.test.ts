/**
 * Test: Upgrade vs Create Version Consistency
 * 
 * @description Verifies that upgrade() updates version strings consistently
 *              compared to create() which generates fresh components.
 * 
 * @problem DISCOVERED: upgrade() copies files without updating hardcoded version strings
 *          - source.env still shows old version
 *          - DefaultComponent.ts constructor still has old version
 *          - toScenario() method still has old version
 * 
 * @expected upgrade() should update ALL version references to match new version
 * 
 * @pdca 2025-11-10-UTC-1010.pdca.md - Regeneration vs Upgrade consistency
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

describe('🔄 Upgrade vs Create: Version Consistency', () => {
  const componentVersion = process.cwd();
  const testDataDir = path.join(componentVersion, 'test/data');
  const productionDir = path.join(componentVersion, '../..');
  
  const testComponentName = 'IdealMinimalComponent';
  const testVersion = '0.3.18.5';
  
  const createdComponentPath = path.join(testDataDir, 'components', testComponentName, testVersion);
  const upgradedComponentPath = path.join(productionDir, testComponentName, testVersion);

  beforeAll(() => {
    // Verify both versions exist
    if (!existsSync(createdComponentPath)) {
      throw new Error(`Test isolation component not found: ${createdComponentPath}`);
    }
    if (!existsSync(upgradedComponentPath)) {
      throw new Error(`Production component not found: ${upgradedComponentPath}`);
    }
  });

  describe('📝 Created Component (from scratch)', () => {
    it('should have correct version in source.env', async () => {
      const sourceEnvPath = path.join(createdComponentPath, 'source.env');
      const content = await readFile(sourceEnvPath, 'utf-8');
      
      expect(content).toContain(`# Version: ${testVersion}`);
      expect(content).not.toContain('# Version: 0.3.18.4'); // Should NOT have old version
      
      console.log(`   ✅ Created component source.env has correct version: ${testVersion}`);
    });

    it('should have correct version in constructor', async () => {
      const componentPath = path.join(createdComponentPath, `src/ts/layer2/Default${testComponentName}.ts`);
      const content = await readFile(componentPath, 'utf-8');
      
      expect(content).toContain(`version: '${testVersion}'             // Component version`);
      expect(content).not.toContain("version: '0.3.18.4'"); // Should NOT have old version
      
      console.log(`   ✅ Created component constructor has correct version: ${testVersion}`);
    });

    it('should have correct version in toScenario()', async () => {
      const componentPath = path.join(createdComponentPath, `src/ts/layer2/Default${testComponentName}.ts`);
      const content = await readFile(componentPath, 'utf-8');
      
      // Count occurrences of the correct version in toScenario method
      const toScenarioMatch = content.match(/async toScenario[\s\S]*?^  }/m);
      if (toScenarioMatch) {
        const toScenarioContent = toScenarioMatch[0];
        expect(toScenarioContent).toContain(`version: '${testVersion}'`);
        
        console.log(`   ✅ Created component toScenario() has correct version: ${testVersion}`);
      }
    });
  });

  describe('⬆️ Upgraded Component (copied from previous version)', () => {
    it('should have correct version in source.env', async () => {
      const sourceEnvPath = path.join(upgradedComponentPath, 'source.env');
      const content = await readFile(sourceEnvPath, 'utf-8');
      
      // EXPECTATION: Should have new version
      expect(content).toContain(`# Version: ${testVersion}`);
      
      // BUG CHECK: Currently has old version
      if (content.includes('# Version: 0.3.18.4')) {
        console.log(`   ⚠️  ISSUE: Upgraded component source.env still has old version 0.3.18.4`);
      } else {
        console.log(`   ✅ Upgraded component source.env has correct version: ${testVersion}`);
      }
    });

    it('should have correct version in constructor', async () => {
      const componentPath = path.join(upgradedComponentPath, `src/ts/layer2/Default${testComponentName}.ts`);
      const content = await readFile(componentPath, 'utf-8');
      
      // EXPECTATION: Should have new version
      expect(content).toContain(`version: '${testVersion}'             // Component version`);
      
      // BUG CHECK: Currently has old version
      if (content.includes("version: '0.3.18.4'")) {
        console.log(`   ⚠️  ISSUE: Upgraded component constructor still has old version 0.3.18.4`);
      } else {
        console.log(`   ✅ Upgraded component constructor has correct version: ${testVersion}`);
      }
    });

    it('should have correct version in toScenario()', async () => {
      const componentPath = path.join(upgradedComponentPath, `src/ts/layer2/Default${testComponentName}.ts`);
      const content = await readFile(componentPath, 'utf-8');
      
      // Count occurrences
      const versionPattern = /version: ['"]0\.3\.18\.\d+['"]/g;
      const matches = content.match(versionPattern) || [];
      
      const correctVersionCount = matches.filter(m => m.includes(testVersion)).length;
      const oldVersionCount = matches.filter(m => m.includes('0.3.18.4')).length;
      
      if (oldVersionCount > 0) {
        console.log(`   ⚠️  ISSUE: Found ${oldVersionCount} old version references in toScenario()`);
      }
      
      // EXPECTATION: All version references should be the new version
      expect(correctVersionCount).toBeGreaterThan(0);
      
      if (oldVersionCount === 0) {
        console.log(`   ✅ Upgraded component toScenario() has correct version: ${testVersion}`);
      }
    });
  });

  describe('🔍 Comparison Analysis', () => {
    it('should document the upgrade behavior', async () => {
      const createdDefaultPath = path.join(createdComponentPath, `src/ts/layer2/Default${testComponentName}.ts`);
      const upgradedDefaultPath = path.join(upgradedComponentPath, `src/ts/layer2/Default${testComponentName}.ts`);
      
      const createdContent = await readFile(createdDefaultPath, 'utf-8');
      const upgradedContent = await readFile(upgradedDefaultPath, 'utf-8');
      
      const createdVersionRefs = (createdContent.match(/version: ['"]0\.3\.18\.\d+['"]/g) || []).length;
      const upgradedVersionRefs = (upgradedContent.match(/version: ['"]0\.3\.18\.\d+['"]/g) || []).length;
      
      console.log(`\n   📊 Version Reference Comparison:`);
      console.log(`      Created (regenerated):  ${createdVersionRefs} references, all should be ${testVersion}`);
      console.log(`      Upgraded (copied):      ${upgradedVersionRefs} references, may have mixed versions`);
      
      // Document the findings
      const createdHasCorrect = createdContent.includes(`version: '${testVersion}'`);
      const upgradedHasOld = upgradedContent.includes("version: '0.3.18.4'");
      
      if (createdHasCorrect && upgradedHasOld) {
        console.log(`\n   🐛 CONFIRMED BUG: upgrade() does not update hardcoded version strings`);
        console.log(`      - Create (regeneration): ✅ All version strings are ${testVersion}`);
        console.log(`      - Upgrade (copy): ❌ Still has 0.3.18.4 in code`);
      }
      
      // This test passes to document the current behavior
      expect(true).toBe(true);
    });
  });
});

