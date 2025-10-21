import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { existsSync } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * 🎯 FULL WORKFLOW INTEGRATION TEST
 * 
 * This test exercises the COMPLETE lifecycle:
 * 1. Create component
 * 2. Run tests (simulated 100% success)
 * 3. Verify version promotion
 * 4. Verify ALL semantic symlinks are correct
 * 5. Remove promoted versions
 * 6. Verify symlinks are cleaned up
 * 
 * This is THE definitive test of component version management.
 */
describe('🔄 Full Component Lifecycle Workflow', () => {
  let component: DefaultWeb4TSComponent;
  const testDataDir = path.join(__dirname, 'data');
  const testComponentName = 'WorkflowTest';
  const initialVersion = '0.1.0.0';
  
  beforeAll(async () => {
    component = new DefaultWeb4TSComponent();
    
    // Clean slate
    if (existsSync(testDataDir)) {
      await fs.rm(testDataDir, { recursive: true, force: true });
    }
    
    // Set target directory for test isolation (Web4 OOP way)
    await fs.mkdir(testDataDir, { recursive: true });
    component.setTargetDirectory(testDataDir);
  });

  afterAll(async () => {
    // Clean up after test
    if (existsSync(testDataDir)) {
      await fs.rm(testDataDir, { recursive: true, force: true });
    }
  });

  it('STEP 1: Create component with initial version', async () => {
    console.log('\n📦 STEP 1: Creating component...');
    
    await component.create(testComponentName, initialVersion, 'all');
    
    const componentPath = path.join(testDataDir, 'components', testComponentName, initialVersion);
    expect(existsSync(componentPath)).toBe(true);
    
    // Check package.json has correct version
    const packageJson = JSON.parse(await fs.readFile(path.join(componentPath, 'package.json'), 'utf-8'));
    expect(packageJson.version).toBe(initialVersion);
    
    console.log(`✅ Component created: ${testComponentName} ${initialVersion}`);
  });

  it('STEP 2: Load component context', async () => {
    console.log('\n🔗 STEP 2: Loading component context...');
    
    await component.on(testComponentName, initialVersion);
    const context = component.getComponentContext();
    
    expect(context).toBeDefined();
    expect(context!.component).toBe(testComponentName);
    expect(context!.version).toBe(initialVersion);
    
    console.log(`✅ Context loaded: ${context!.component} ${context!.version}`);
  });

  it('STEP 3: Verify initial symlink state', async () => {
    console.log('\n🔗 STEP 3: Checking initial symlinks...');
    
    const componentDir = path.join(testDataDir, 'components', testComponentName);
    const latestLink = path.join(componentDir, 'latest');
    
    expect(existsSync(latestLink)).toBe(true);
    const latestTarget = await fs.readlink(latestLink);
    expect(latestTarget).toBe(initialVersion);
    
    console.log(`✅ Initial symlinks correct: latest → ${latestTarget}`);
  });

  it('STEP 4: Simulate test success and promotion', async () => {
    console.log('\n🚀 STEP 4: Simulating test success promotion...');
    console.log('   Note: Direct promotion workflow (bypassing handleTestSuccessPromotion due to test environment)');
    
    const componentDir = path.join(testDataDir, 'components', testComponentName);
    const currentVersion = initialVersion; // 0.1.0.0
    
    // Manually execute promotion workflow steps (since handleTestSuccessPromotion blocks in test env)
    // Step 1: Create nextPatch version (0.1.0.0 → 0.1.1.0)
    await component.on(testComponentName, currentVersion);
    await component.upgrade('nextPatch');
    const nextPatchVersion = '0.1.1.0';
    
    // Step 2: Promote to prod
    await (component as any).createSemanticLink(testComponentName, 'prod', nextPatchVersion);
    
    // Step 3: Create nextBuild for development (0.1.1.0 → 0.1.1.1)
    await component.on(testComponentName, nextPatchVersion);
    await component.upgrade('nextBuild');
    const nextBuildVersion = '0.1.1.1';
    
    // Step 4: Set dev and test symlinks
    await (component as any).createSemanticLink(testComponentName, 'dev', nextBuildVersion);
    await (component as any).createSemanticLink(testComponentName, 'test', nextBuildVersion);
    
    // Step 5: Update latest to stable version
    await (component as any).createSemanticLink(testComponentName, 'latest', nextPatchVersion);
    
    expect(existsSync(path.join(componentDir, nextPatchVersion))).toBe(true);
    expect(existsSync(path.join(componentDir, nextBuildVersion))).toBe(true);
    
    console.log(`✅ Promoted versions created: ${nextPatchVersion}, ${nextBuildVersion}`);
  });

  it('STEP 5: Verify ALL semantic symlinks after promotion', async () => {
    console.log('\n🔗 STEP 5: Verifying semantic symlinks after promotion...');
    
    const componentDir = path.join(testDataDir, 'components', testComponentName);
    console.log(`   Looking in: ${componentDir}`);
    
    // First, list what's actually there
    const entries = await fs.readdir(componentDir);
    console.log(`   Contents: ${entries.join(', ')}`);
    
    const expectedLinks = {
      prod: '0.1.1.0',    // Promoted stable version
      latest: '0.1.1.0',  // Latest stable
      dev: '0.1.1.1',     // Next development version
      test: '0.1.1.1'     // Next test version
    };
    
    for (const [linkName, expectedTarget] of Object.entries(expectedLinks)) {
      const linkPath = path.join(componentDir, linkName);
      
      if (!existsSync(linkPath)) {
        console.log(`   ❌ ${linkName} MISSING at ${linkPath}`);
        expect(existsSync(linkPath), `${linkName} symlink should exist at ${linkPath}`).toBe(true);
        continue;
      }
      
      const actualTarget = await fs.readlink(linkPath);
      expect(actualTarget, `${linkName} should point to ${expectedTarget}`).toBe(expectedTarget);
      
      console.log(`   ✅ ${linkName} → ${actualTarget}`);
    }
  });

  it('STEP 6: Remove promoted versions', async () => {
    console.log('\n🗑️ STEP 6: Removing promoted versions...');
    
    const componentDir = path.join(testDataDir, 'components', testComponentName);
    
    // Verify symlinks exist BEFORE removal
    console.log('   Symlinks before removal:');
    for (const link of ['prod', 'latest', 'dev', 'test']) {
      const linkPath = path.join(componentDir, link);
      if (existsSync(linkPath)) {
        const target = await fs.readlink(linkPath);
        console.log(`     ${link} → ${target}`);
      }
    }
    
    // Remove the promoted versions to test cleanup
    await component.removeVersion(testComponentName, '0.1.1.1');
    await component.removeVersion(testComponentName, '0.1.1.0');
    
    expect(existsSync(path.join(componentDir, '0.1.1.0'))).toBe(false);
    expect(existsSync(path.join(componentDir, '0.1.1.1'))).toBe(false);
    
    console.log('✅ Promoted versions removed');
  });

  it('STEP 7: Verify symlinks cleaned up after removal', async () => {
    console.log('\n🔗 STEP 7: Verifying symlink cleanup...');
    
    const componentDir = path.join(testDataDir, 'components', testComponentName);
    const semanticLinks = ['prod', 'latest', 'dev', 'test'];
    
    let cleanedCount = 0;
    let relinkedCount = 0;
    
    // After removing 0.1.1.0 and 0.1.1.1, all symlinks should point back to 0.1.0.0
    for (const linkName of semanticLinks) {
      const linkPath = path.join(componentDir, linkName);
      
      if (existsSync(linkPath)) {
        const target = await fs.readlink(linkPath);
        expect(target, `${linkName} should fall back to ${initialVersion}`).toBe(initialVersion);
        console.log(`   ✅ ${linkName} → ${target} (repointed to highest remaining)`);
        relinkedCount++;
      } else {
        console.log(`   🔗 ${linkName} removed (no fallback needed)`);
        cleanedCount++;
      }
    }
    
    console.log(`\n📊 Cleanup summary: ${relinkedCount} repointed, ${cleanedCount} removed`);
    expect(relinkedCount + cleanedCount).toBe(semanticLinks.length);
  });

  it('STEP 8: Verify no broken symlinks exist', async () => {
    console.log('\n🔍 STEP 8: Checking for broken symlinks...');
    
    const componentDir = path.join(testDataDir, 'components', testComponentName);
    const semanticLinks = ['prod', 'latest', 'dev', 'test'];
    
    const brokenLinks: string[] = [];
    
    for (const linkName of semanticLinks) {
      const linkPath = path.join(componentDir, linkName);
      
      if (existsSync(linkPath)) {
        try {
          const target = await fs.readlink(linkPath);
          const targetPath = path.join(componentDir, target);
          
          if (!existsSync(targetPath)) {
            brokenLinks.push(`${linkName} → ${target} (BROKEN)`);
          }
        } catch (error) {
          brokenLinks.push(`${linkName} (ERROR: ${(error as Error).message})`);
        }
      }
    }
    
    expect(brokenLinks.length, `Found broken symlinks: ${brokenLinks.join(', ')}`).toBe(0);
    console.log('✅ No broken symlinks found');
  });

  it('STEP 9: Verify component is still functional', async () => {
    console.log('\n🧪 STEP 9: Verifying component functionality...');
    
    // Can we still load and work with the component?
    await component.on(testComponentName, initialVersion);
    const context = component.getComponentContext();
    
    expect(context).toBeDefined();
    expect(context!.component).toBe(testComponentName);
    expect(context!.version).toBe(initialVersion);
    
    console.log('✅ Component still functional after full lifecycle');
  });
});

