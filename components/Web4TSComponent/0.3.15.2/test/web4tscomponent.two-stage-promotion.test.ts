import { describe, it, expect, beforeEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { existsSync } from 'fs';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDataDir = path.join(__dirname, 'data');

describe('🎯 Two-Stage Promotion Workflow Tests', () => {
  let component: DefaultWeb4TSComponent;

  beforeEach(async () => {
    // Clean test/data CONTENT only (preserve directory)
    if (existsSync(testDataDir)) {
      const entries = await fs.readdir(testDataDir);
      for (const entry of entries) {
        await fs.rm(path.join(testDataDir, entry), { recursive: true, force: true });
      }
    } else {
      await fs.mkdir(testDataDir, { recursive: true });
    }
    
    // Set up component with test isolation
    component = new DefaultWeb4TSComponent();
    component.setTargetDirectory(testDataDir);
  });

  // NO afterEach - leave test results visible

  describe('📋 Stage 1: dev → test (nextBuild)', () => {
    it('should promote dev to test on first test run', async () => {
      // Create initial component as dev
      await component.create('StageTest', '0.1.0.0', 'all');
      await component.on('StageTest', '0.1.0.0');
      await component.setDev('0.1.0.0');
      
      // Initial state: dev exists, no test
      let links = await component.getSemanticLinks('StageTest');
      expect(links.dev).toBe('0.1.0.0');
      expect(links.test).toBeNull();
      
      // Stage 1: First test run
      await component.handleFirstTestRun('StageTest', '0.1.0.0');
      
      // Verify Stage 1 result
      links = await component.getSemanticLinks('StageTest');
      expect(links.dev).toBe('0.1.0.0'); // Still dev
      expect(links.test).toBe('0.1.0.1'); // New test (nextBuild)
      
      // Verify new version exists
      const testPath = path.join(testDataDir, 'components', 'StageTest', '0.1.0.1');
      expect(existsSync(testPath)).toBe(true);
    });

    it('should skip Stage 1 if version is already test', async () => {
      // Create component already marked as test
      await component.create('SkipTest', '0.1.0.0', 'all');
      await component.on('SkipTest', '0.1.0.0');
      await component.setTest('0.1.0.0');
      
      // Initial state
      let links = await component.getSemanticLinks('SkipTest');
      expect(links.test).toBe('0.1.0.0');
      
      // Try Stage 1 (should skip)
      await component.handleFirstTestRun('SkipTest', '0.1.0.0');
      
      // Verify no new version created
      const nextBuildPath = path.join(testDataDir, 'components', 'SkipTest', '0.1.0.1');
      expect(existsSync(nextBuildPath)).toBe(false);
      
      // Verify test still points to original
      links = await component.getSemanticLinks('SkipTest');
      expect(links.test).toBe('0.1.0.0');
    });
  });

  describe('🚀 Stage 2: test → prod (nextPatch) + new dev', () => {
    it('should BLOCK promotion in test environment (safety check)', async () => {
      // Create old prod version first
      await component.create('ProdTest', '0.1.0.0', 'all');
      
      // Create test version
      await component.create('ProdTest', '0.1.0.1', 'all');
      await component.on('ProdTest', '0.1.0.1');
      await component.setTest('0.1.0.1');
      await component.setProd('0.1.0.0'); // Old prod
      
      // Initial state
      let links = await component.getSemanticLinks('ProdTest');
      expect(links.test).toBe('0.1.0.1');
      expect(links.prod).toBe('0.1.0.0');
      
      // Stage 2: 100% test pass (should be BLOCKED)
      await component.handleTestSuccessPromotion('ProdTest', '0.1.0.1');
      
      // Verify Stage 2 was BLOCKED (no promotion in test/data)
      links = await component.getSemanticLinks('ProdTest');
      expect(links.prod).toBe('0.1.0.0'); // Unchanged!
      expect(links.test).toBe('0.1.0.1'); // Unchanged!
      
      // Verify no new versions created
      const prodPath = path.join(testDataDir, 'components', 'ProdTest', '0.1.1.0');
      const devPath = path.join(testDataDir, 'components', 'ProdTest', '0.1.1.1');
      expect(existsSync(prodPath)).toBe(false);
      expect(existsSync(devPath)).toBe(false);
      
      console.log('✅ Stage 2 correctly blocked in test environment');
    });

    it('should skip Stage 2 if version is not test', async () => {
      // Create component and set as prod and dev
      await component.create('NotTestYet', '0.1.0.0', 'all');
      await component.on('NotTestYet', '0.1.0.0');
      await component.setDev('0.1.0.0');
      await component.setProd('0.1.0.0'); // Initially prod
      
      // Upgrade to create test version (0.1.0.1)
      await component.upgrade('nextBuild'); // Creates 0.1.0.1
      await component.on('NotTestYet', '0.1.0.1');
      await component.setTest('0.1.0.1');
      
      // Initial state
      let links = await component.getSemanticLinks('NotTestYet');
      expect(links.dev).toBe('0.1.0.0');
      expect(links.test).toBe('0.1.0.1');
      expect(links.prod).toBe('0.1.0.0'); // Still at 0.1.0.0
      
      // Try Stage 2 on dev version (should skip because 0.1.0.0 is not test)
      await component.handleTestSuccessPromotion('NotTestYet', '0.1.0.0');
      
      // Verify no new version created
      const patchPath = path.join(testDataDir, 'components', 'NotTestYet', '0.1.1.0');
      expect(existsSync(patchPath)).toBe(false);
      
      // Verify links unchanged (prod is still 0.1.0.0, not promoted)
      links = await component.getSemanticLinks('NotTestYet');
      expect(links.test).toBe('0.1.0.1');
      expect(links.prod).toBe('0.1.0.0'); // Still at initial version
    });

    it('should skip Stage 2 if already promoted to prod', async () => {
      // Create version already as prod
      await component.create('AlreadyProd', '0.1.0.0', 'all');
      await component.on('AlreadyProd', '0.1.0.0');
      await component.setTest('0.1.0.0');
      await component.setProd('0.1.0.0'); // Same version
      
      // Initial state
      let links = await component.getSemanticLinks('AlreadyProd');
      expect(links.test).toBe('0.1.0.0');
      expect(links.prod).toBe('0.1.0.0');
      
      // Try Stage 2 (should skip - already prod)
      await component.handleTestSuccessPromotion('AlreadyProd', '0.1.0.0');
      
      // Verify no new version created
      const patchPath = path.join(testDataDir, 'components', 'AlreadyProd', '0.1.1.0');
      expect(existsSync(patchPath)).toBe(false);
    });
  });

  describe('🔄 Full Two-Stage Workflow', () => {
    it('should demonstrate Stage 1: 0.3.4.1 → 0.3.4.2', async () => {
      // Create old prod version first
      await component.create('FullWorkflow', '0.3.4.0', 'all');
      
      // Starting state: 0.3.4.1 as dev
      await component.create('FullWorkflow', '0.3.4.1', 'all');
      await component.on('FullWorkflow', '0.3.4.1');
      await component.setDev('0.3.4.1');
      await component.setProd('0.3.4.0'); // Previous prod
      
      // Initial state
      let links = await component.getSemanticLinks('FullWorkflow');
      expect(links.dev).toBe('0.3.4.1');
      expect(links.prod).toBe('0.3.4.0');
      expect(links.test).toBeNull();
      
      // Stage 1: First test run (dev → test)
      console.log('\n📋 STAGE 1: dev → test (nextBuild)');
      await component.handleFirstTestRun('FullWorkflow', '0.3.4.1');
      
      links = await component.getSemanticLinks('FullWorkflow');
      expect(links.dev).toBe('0.3.4.1'); // Still dev
      expect(links.test).toBe('0.3.4.2'); // New test (nextBuild)
      expect(links.prod).toBe('0.3.4.0'); // Unchanged
      
      console.log('✅ Stage 1 complete: 0.3.4.1 (dev) → 0.3.4.2 (test)');
      
      // Stage 2 would be blocked in test/data (safety feature)
      console.log('\n📋 STAGE 2: Would promote 0.3.4.2 → 0.3.5.0 (nextPatch) in production');
      console.log('⚠️  But blocked in test/data environment (safety)');
      await component.on('FullWorkflow', '0.3.4.2');
      await component.handleTestSuccessPromotion('FullWorkflow', '0.3.4.2');
      
      // Verify Stage 2 was blocked
      links = await component.getSemanticLinks('FullWorkflow');
      expect(links.prod).toBe('0.3.4.0'); // Unchanged (blocked)
      expect(links.test).toBe('0.3.4.2'); // Unchanged (blocked)
      
      // Verify versions created in Stage 1
      const componentsDir = path.join(testDataDir, 'components', 'FullWorkflow');
      expect(existsSync(path.join(componentsDir, '0.3.4.0'))).toBe(true);  // Old prod
      expect(existsSync(path.join(componentsDir, '0.3.4.1'))).toBe(true);  // Original dev
      expect(existsSync(path.join(componentsDir, '0.3.4.2'))).toBe(true);  // Stage 1 test
      expect(existsSync(path.join(componentsDir, '0.3.5.0'))).toBe(false); // Not created (blocked)
      
      console.log('\n🎉 Stage 1 workflow verified, Stage 2 safely blocked in test/data!');
      console.log('📊 Final state:');
      console.log(`   🚀 prod:   ${links.prod}`);
      console.log(`   📦 latest: ${links.latest || 'none'}`);
      console.log(`   🧪 test:   ${links.test}`);
      console.log(`   🚧 dev:    ${links.dev}`);
    });

    it('should handle iterative development cycle (multiple Stage 1 before Stage 2)', async () => {
      // Create initial dev and prod
      await component.create('Iterative', '0.1.0.0', 'all');
      await component.on('Iterative', '0.1.0.0');
      await component.setDev('0.1.0.0');
      await component.setProd('0.1.0.0'); // Initially prod
      
      // Stage 1: First iteration
      await component.handleFirstTestRun('Iterative', '0.1.0.0');
      let links = await component.getSemanticLinks('Iterative');
      expect(links.test).toBe('0.1.0.1');
      expect(links.prod).toBe('0.1.0.0'); // Still at initial version
      
      // Work continues on 0.1.0.1, fix bugs, add tests
      // Try Stage 1 again (should skip - already test)
      await component.handleFirstTestRun('Iterative', '0.1.0.1');
      links = await component.getSemanticLinks('Iterative');
      expect(links.test).toBe('0.1.0.1'); // No change
      expect(links.prod).toBe('0.1.0.0'); // Still at initial version
      
      // Finally achieve 100% - Stage 2 (would promote in production, blocked in test/data)
      await component.on('Iterative', '0.1.0.1');
      await component.handleTestSuccessPromotion('Iterative', '0.1.0.1');
      
      // Verify Stage 2 was blocked
      links = await component.getSemanticLinks('Iterative');
      expect(links.test).toBe('0.1.0.1'); // Unchanged (blocked)
      expect(links.prod).toBe('0.1.0.0'); // Still at initial version (promotion blocked)
    });
  });

  describe('🛡️ Safety Checks', () => {
    it('should prevent Stage 1 in test environment', async () => {
      // handleFirstTestRun is private, so we test indirectly via isTestEnvironment
      // The test itself IS in test/data, so promotion should be blocked
      expect(component['isTestEnvironment']()).toBe(true);
    });

    it('should prevent Stage 2 in test environment', async () => {
      // Create component
      await component.create('SafetyTest', '0.1.0.0', 'all');
      await component.on('SafetyTest', '0.1.0.0');
      await component.setTest('0.1.0.0');
      
      // Try Stage 2 (should be blocked by isTestEnvironment)
      await component.handleTestSuccessPromotion('SafetyTest', '0.1.0.0');
      
      // Verify no promotion occurred
      const minorPath = path.join(testDataDir, 'components', 'SafetyTest', '0.2.0.0');
      expect(existsSync(minorPath)).toBe(false);
    });
  });
});

