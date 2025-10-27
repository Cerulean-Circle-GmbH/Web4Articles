import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { existsSync, readdirSync, statSync } from 'fs';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('🚀 Web4TSComponent Version Promotion Tests', () => {
  let component: DefaultWeb4TSComponent;
  const testDataDir = path.join(__dirname, 'data');

  beforeEach(async () => {
    // Clean test data directory content BEFORE each test (not after)
    // This preserves test results for inspection after run
    if (existsSync(testDataDir)) {
      const entries = await fs.readdir(testDataDir);
      for (const entry of entries) {
        const entryPath = path.join(testDataDir, entry);
        await fs.rm(entryPath, { recursive: true, force: true });
      }
    } else {
      await fs.mkdir(testDataDir, { recursive: true });
    }
    
    // Create component with test/data as target
    component = new DefaultWeb4TSComponent();
    component.setTargetDirectory(testDataDir);
  });

  // NO afterEach - leave test/data visible for inspection!

  describe('Version Promotion Isolation', () => {
    it('should BLOCK promotion when running in test/data (isolation protection)', async () => {
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
      
      // Trigger version promotion workflow (should be BLOCKED)
      await component.handleTestSuccessPromotion('PromotionTest', '0.1.0.0');
      
      // Verify promotion was BLOCKED (no new versions created)
      const componentsDir = path.join(testDataDir, 'components', 'PromotionTest');
      
      // ✅ Promotion should be blocked - no new versions
      expect(existsSync(path.join(componentsDir, '0.1.1.0'))).toBe(false);
      expect(existsSync(path.join(componentsDir, '0.1.1.1'))).toBe(false);
      
      // ✅ Semantic links should remain unchanged
      const finalLinks = await component.getSemanticLinks('PromotionTest');
      expect(finalLinks.dev).toBe('0.1.0.0'); // Unchanged
      expect(finalLinks.test).toBe('0.1.0.0'); // Unchanged
      expect(finalLinks.prod).toBe('0.0.1.0'); // Unchanged
    });

    it('should detect test environment correctly based on targetDirectory', async () => {
      // Verify component is in test environment
      expect(component['model'].targetDirectory).toContain('/test/data');
      
      // Create a test component
      await component.create('IsolationTest', '0.1.0.0', 'all');
      
      // Verify it was created in test/data, not production
      const testComponentPath = path.join(testDataDir, 'components', 'IsolationTest', '0.1.0.0');
      expect(existsSync(testComponentPath)).toBe(true);
      
      // Verify NOT in production
      const productionPath = path.resolve(testDataDir, '..', '..', '..', 'components', 'IsolationTest');
      expect(existsSync(productionPath)).toBe(false);
    });

    it('should verify all test operations stay in test/data', async () => {
      // Create component
      await component.create('TestBoundary', '1.0.0.0', 'all');
      await component.on('TestBoundary', '1.0.0.0');
      
      // Perform various operations
      await component.upgrade('nextBuild');
      await component.setDev('1.0.0.1');
      await component.setTest('1.0.0.1');
      
      // Verify all artifacts in test/data only
      const testDir = path.join(testDataDir, 'components', 'TestBoundary');
      expect(existsSync(testDir)).toBe(true);
      
      const versions = readdirSync(testDir).filter(name =>
        statSync(path.join(testDir, name)).isDirectory() &&
        name.match(/^\d+\.\d+\.\d+\.\d+$/)
      );
      
      expect(versions.length).toBeGreaterThan(0);
      expect(versions).toContain('1.0.0.0');
      expect(versions).toContain('1.0.0.1');
      
      // Verify NOT in production
      const productionPath = path.resolve(testDataDir, '..', '..', '..', 'components', 'TestBoundary');
      expect(existsSync(productionPath)).toBe(false);
    });
  });
});
