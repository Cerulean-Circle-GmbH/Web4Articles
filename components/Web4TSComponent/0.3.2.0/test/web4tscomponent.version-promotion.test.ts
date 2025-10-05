import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { ProjectRootMocker } from './utils/ProjectRootMocker.js';
import * as fs from 'fs';
import * as path from 'path';

describe('🚀 Web4TSComponent Version Promotion Tests', () => {
  let component: DefaultWeb4TSComponent;
  let rootMocker: ProjectRootMocker;
  let testDataDir: string;

  beforeEach(async () => {
    // Enable test mode for environment-aware path resolution
    (globalThis as any).__TEST_MODE__ = true;
    
    // Setup test data directory
    testDataDir = path.join(__dirname, 'data');
    await fs.promises.mkdir(testDataDir, { recursive: true });
    
    // Mock project root to be test data directory
    rootMocker = new ProjectRootMocker(testDataDir);
    rootMocker.mock();

    component = new DefaultWeb4TSComponent();
    
    // Clean test data directory content but keep the directory
    if (fs.existsSync(testDataDir)) {
      const entries = fs.readdirSync(testDataDir);
      for (const entry of entries) {
        const entryPath = path.join(testDataDir, entry);
        fs.rmSync(entryPath, { recursive: true, force: true });
      }
    }
  });

  afterEach(async () => {
    rootMocker.restore();
    (globalThis as any).__TEST_MODE__ = false;
  });

  describe('Version Promotion Workflow', () => {
    it('should promote version after successful test with complete workflow', async () => {
      // Create initial component in test/data
      await component.create('PromotionTest', '0.1.0.0', 'all');
      await component.on('PromotionTest', '0.1.0.0');
      
      // Create an older version to set as initial prod
      await component.create('PromotionTest', '0.0.1.0', 'all');
      
      // Set initial semantic links to simulate development state
      await component.setDev('0.1.0.0');
      await component.setTest('0.1.0.0');
      await component.setProd('0.0.1.0'); // Older version as prod
      
      // Verify initial state
      const initialLinks = await component.getSemanticLinks('PromotionTest');
      expect(initialLinks.dev).toBe('0.1.0.0');
      expect(initialLinks.test).toBe('0.1.0.0');
      expect(initialLinks.prod).toBe('0.0.1.0'); // Different from current version
      
      // Trigger version promotion workflow
      await component.handleTestSuccessPromotion('PromotionTest', '0.1.0.0');
      
      // Verify promotion workflow results
      const finalLinks = await component.getSemanticLinks('PromotionTest');
      
      // Check that nextPatch (0.1.1.0) was created and set as prod - PATCH increment
      const componentsDir = path.join(testDataDir, 'components', 'PromotionTest');
      expect(fs.existsSync(path.join(componentsDir, '0.1.1.0'))).toBe(true);
      expect(finalLinks.prod).toBe('0.1.1.0');
      expect(finalLinks.latest).toBe('0.1.1.0');

      // Check that nextBuild (0.1.1.1) was created and set as dev/test
      expect(fs.existsSync(path.join(componentsDir, '0.1.1.1'))).toBe(true);
      expect(finalLinks.dev).toBe('0.1.1.1');
      expect(finalLinks.test).toBe('0.1.1.1');
    });

    it('should skip promotion if version is already marked as prod (safety check)', async () => {
      // Create component in test/data
      await component.create('SafetyTest', '0.1.0.0', 'all');
      await component.on('SafetyTest', '0.1.0.0');
      
      // Set current version as prod (simulate already promoted)
      await component.setProd('0.1.0.0');
      
      // Verify initial state
      const initialLinks = await component.getSemanticLinks('SafetyTest');
      expect(initialLinks.prod).toBe('0.1.0.0');
      
      // Count initial versions
      const componentsDir = path.join(testDataDir, 'components', 'SafetyTest');
      const initialVersions = fs.readdirSync(componentsDir).filter(name => 
        fs.statSync(path.join(componentsDir, name)).isDirectory() && 
        name.match(/^\d+\.\d+\.\d+\.\d+$/)
      );
      
      // Trigger promotion workflow (should be skipped)
      await component.handleTestSuccessPromotion('SafetyTest', '0.1.0.0');
      
      // Verify no new versions were created
      const finalVersions = fs.readdirSync(componentsDir).filter(name => 
        fs.statSync(path.join(componentsDir, name)).isDirectory() && 
        name.match(/^\d+\.\d+\.\d+\.\d+$/)
      );
      
      expect(finalVersions.length).toBe(initialVersions.length);
      
      // Verify semantic links unchanged
      const finalLinks = await component.getSemanticLinks('SafetyTest');
      expect(finalLinks.prod).toBe('0.1.0.0'); // Should remain unchanged
    });

    it('should handle promotion workflow errors gracefully', async () => {
      // Create component in test/data
      await component.create('ErrorTest', '0.1.0.0', 'all');
      await component.on('ErrorTest', '0.1.0.0');
      
      // Create an older version to set as initial prod
      await component.create('ErrorTest', '0.0.1.0', 'all');
      
      // Set up scenario that might cause upgrade errors (like missing dependencies)
      await component.setProd('0.0.1.0'); // Different version as prod
      
      // Mock a scenario where upgrade might fail by creating a conflicting file
      const componentsDir = path.join(testDataDir, 'components', 'ErrorTest');
      const conflictPath = path.join(componentsDir, '0.2.0.0');
      fs.mkdirSync(conflictPath, { recursive: true });
      fs.writeFileSync(path.join(conflictPath, 'conflict.txt'), 'blocking file');
      
      // Trigger promotion workflow (should handle errors gracefully)
      let errorThrown = false;
      try {
        await component.handleTestSuccessPromotion('ErrorTest', '0.1.0.0');
      } catch (error) {
        errorThrown = true;
      }
      
      // Should not throw unhandled errors
      expect(errorThrown).toBe(false);
      
      // Original version should still exist
      expect(fs.existsSync(path.join(componentsDir, '0.1.0.0'))).toBe(true);
    });

    it('should maintain correct semantic versioning during promotion', async () => {
      // Create component with specific version in test/data
      await component.create('VersionTest', '1.5.3.2', 'all');
      await component.on('VersionTest', '1.5.3.2');
      
      // Create an older version to set as initial prod
      await component.create('VersionTest', '1.4.0.0', 'all');
      
      // Set up for promotion
      await component.setProd('1.4.0.0'); // Different version as prod
      
      // Trigger promotion
      await component.handleTestSuccessPromotion('VersionTest', '1.5.3.2');
      
      // Verify semantic versioning
      const componentsDir = path.join(testDataDir, 'components', 'VersionTest');
      
      // nextPatch should be 1.5.4.0 (increment patch from 1.5.3.2)
      expect(fs.existsSync(path.join(componentsDir, '1.5.4.0'))).toBe(true);
      
      // nextBuild should be 1.5.4.1 (increment build from 1.5.4.0)  
      expect(fs.existsSync(path.join(componentsDir, '1.5.4.1'))).toBe(true);
      
      // Verify semantic links
      const finalLinks = await component.getSemanticLinks('VersionTest');
      expect(finalLinks.prod).toBe('1.5.4.0');
      expect(finalLinks.latest).toBe('1.5.4.0');
      expect(finalLinks.dev).toBe('1.5.4.1');
      expect(finalLinks.test).toBe('1.5.4.1');
    });

    it('should verify test success before promotion', async () => {
      // Create component in test/data
      await component.create('TestVerify', '0.1.0.0', 'all');
      await component.on('TestVerify', '0.1.0.0');
      
      // Create an older version to set as initial prod
      await component.create('TestVerify', '0.0.1.0', 'all');
      
      // Mock the verifyTestSuccess method to return false
      const originalVerify = component['verifyTestSuccess'];
      component['verifyTestSuccess'] = async () => false;
      
      // Set up for promotion
      await component.setProd('0.0.1.0'); // Different version as prod
      
      // Count initial versions
      const componentsDir = path.join(testDataDir, 'components', 'TestVerify');
      const initialVersions = fs.readdirSync(componentsDir).filter(name => 
        fs.statSync(path.join(componentsDir, name)).isDirectory() && 
        name.match(/^\d+\.\d+\.\d+\.\d+$/)
      );
      
      // Trigger promotion (should be skipped due to test verification failure)
      await component.handleTestSuccessPromotion('TestVerify', '0.1.0.0');
      
      // Verify no new versions were created
      const finalVersions = fs.readdirSync(componentsDir).filter(name => 
        fs.statSync(path.join(componentsDir, name)).isDirectory() && 
        name.match(/^\d+\.\d+\.\d+\.\d+$/)
      );
      
      expect(finalVersions.length).toBe(initialVersions.length);
      
      // Restore original method
      component['verifyTestSuccess'] = originalVerify;
    });
  });

  describe('Test Isolation Verification', () => {
    it('should create all test components in test/data directory only', async () => {
      // Create multiple test components
      await component.create('IsolationTest1', '0.1.0.0', 'all');
      await component.create('IsolationTest2', '0.1.0.0', 'all');
      
      // Verify components exist in test/data
      const testComponentsDir = path.join(testDataDir, 'components');
      expect(fs.existsSync(path.join(testComponentsDir, 'IsolationTest1', '0.1.0.0'))).toBe(true);
      expect(fs.existsSync(path.join(testComponentsDir, 'IsolationTest2', '0.1.0.0'))).toBe(true);
      
      // Verify components do NOT exist in project root
      const projectRoot = path.resolve(__dirname, '../../../../..');
      const realComponentsDir = path.join(projectRoot, 'components');
      expect(fs.existsSync(path.join(realComponentsDir, 'IsolationTest1'))).toBe(false);
      expect(fs.existsSync(path.join(realComponentsDir, 'IsolationTest2'))).toBe(false);
    });

    it('should handle version promotion entirely within test/data', async () => {
      // Create component in test/data
      await component.create('IsolationPromotion', '0.1.0.0', 'all');
      await component.on('IsolationPromotion', '0.1.0.0');
      
      // Create an older version to set as initial prod
      await component.create('IsolationPromotion', '0.0.1.0', 'all');
      
      // Set up for promotion
      await component.setProd('0.0.1.0');
      
      // Trigger promotion
      await component.handleTestSuccessPromotion('IsolationPromotion', '0.1.0.0');
      
      // Verify all created versions are in test/data only
      const testComponentsDir = path.join(testDataDir, 'components', 'IsolationPromotion');
      const testVersions = fs.readdirSync(testComponentsDir).filter(name => 
        fs.statSync(path.join(testComponentsDir, name)).isDirectory() && 
        name.match(/^\d+\.\d+\.\d+\.\d+$/)
      );
      
      // Should have original + old version + nextPatch + nextBuild = 4 versions
      expect(testVersions.length).toBeGreaterThanOrEqual(4);
      expect(testVersions).toContain('0.1.0.0');
      expect(testVersions).toContain('0.0.1.0');
      expect(testVersions).toContain('0.1.1.0'); // nextPatch (increment patch, reset build)
      expect(testVersions).toContain('0.1.1.1'); // nextBuild (increment build from new prod)
      
      // Verify NO contamination in project root
      const projectRoot = path.resolve(__dirname, '../../../../..');
      const realComponentsDir = path.join(projectRoot, 'components');
      expect(fs.existsSync(path.join(realComponentsDir, 'IsolationPromotion'))).toBe(false);
    });
  });
});
