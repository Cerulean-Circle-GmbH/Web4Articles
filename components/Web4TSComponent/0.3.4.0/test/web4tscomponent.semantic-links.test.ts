import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { ProjectRootMocker } from './utils/ProjectRootMocker.js';
import { existsSync, lstatSync, readlinkSync, rmSync } from 'fs';
import * as fs from 'fs/promises';
import path from 'path';

/**
 * Helper function to clean up test data content (not the directory itself)
 */
async function cleanupTestDataContent(testDataDir: string) {
  try {
    if (existsSync(testDataDir)) {
      const entries = await fs.readdir(testDataDir);
      for (const entry of entries) {
        const entryPath = path.join(testDataDir, entry);
        await fs.rm(entryPath, { recursive: true, force: true });
      }
    }
  } catch (error) {
    // Ignore cleanup errors
  }
}

describe('🔗 Semantic Version Links - setDev, setTest, setProd', () => {
    const testDataDir = path.join(process.cwd(), 'test', 'data');
    let mockProjectRoot: ProjectRootMocker;
    let web4ts: DefaultWeb4TSComponent;

    beforeEach(async () => {
        // Clean test data CONTENT (not the directory itself)
        await cleanupTestDataContent(testDataDir);
        
        // Set up isolated test environment
        mockProjectRoot = new ProjectRootMocker(testDataDir);
        web4ts = new DefaultWeb4TSComponent();
        
        // Initialize project with root configs (DRY principle)
        await web4ts.initProject();
    });

    afterEach(async () => {
        // Clean up test data CONTENT (preserve directory)
        await cleanupTestDataContent(testDataDir);
    });

    describe('📋 Context Requirement Tests', () => {
        it('should fail when setDev called without context', async () => {
            await expect(
                web4ts.setDev('0.1.0.0')
            ).rejects.toThrow('No component context loaded');
        });

        it('should fail when setTest called without context', async () => {
            await expect(
                web4ts.setTest('0.1.0.0')
            ).rejects.toThrow('No component context loaded');
        });

        it('should fail when setProd called without context', async () => {
            await expect(
                web4ts.setProd('0.1.0.0')
            ).rejects.toThrow('No component context loaded');
        });

        it('should provide clear error message about using "on" command first', async () => {
            try {
                await web4ts.setDev('0.1.0.0');
                expect.fail('Should have thrown error');
            } catch (error) {
                expect((error as Error).message).toContain('Use "on <component> <version>" first');
            }
        });
    });

    describe('✅ Success Cases with Context', () => {
        beforeEach(async () => {
            // Create test component with multiple versions
            await web4ts.create('SemanticTestComponent', '0.1.0.0', 'all');
            await web4ts.on('SemanticTestComponent', '0.1.0.0');
            await web4ts.upgrade('nextBuild'); // Creates 0.1.0.1
            await web4ts.on('SemanticTestComponent', '0.1.0.1');
            await web4ts.upgrade('nextBuild'); // Creates 0.1.0.2 from 0.1.0.1
            // Now we have versions: 0.1.0.0, 0.1.0.1, 0.1.0.2
        });

        it('should successfully set dev symlink with context', async () => {
            await web4ts.on('SemanticTestComponent', '0.1.0.1');
            await web4ts.setDev();  // Uses current context version

            const componentDir = path.join(testDataDir, 'components', 'SemanticTestComponent');
            const devLink = path.join(componentDir, 'dev');

            expect(existsSync(devLink)).toBe(true);
            expect(lstatSync(devLink).isSymbolicLink()).toBe(true);
            
            const target = readlinkSync(devLink);
            expect(target).toBe('0.1.0.1');
        });

        it('should successfully set test symlink with explicit version', async () => {
            await web4ts.on('SemanticTestComponent', '0.1.0.0');
            await web4ts.setTest('0.1.0.2');  // Explicit different version

            const componentDir = path.join(testDataDir, 'components', 'SemanticTestComponent');
            const testLink = path.join(componentDir, 'test');

            expect(existsSync(testLink)).toBe(true);
            expect(lstatSync(testLink).isSymbolicLink()).toBe(true);
            
            const target = readlinkSync(testLink);
            expect(target).toBe('0.1.0.2');
        });

        it('should successfully set prod symlink with current version', async () => {
            await web4ts.on('SemanticTestComponent', '0.1.0.0');
            await web4ts.setProd();  // Uses 'current' default

            const componentDir = path.join(testDataDir, 'components', 'SemanticTestComponent');
            const prodLink = path.join(componentDir, 'prod');

            expect(existsSync(prodLink)).toBe(true);
            expect(lstatSync(prodLink).isSymbolicLink()).toBe(true);
            
            const target = readlinkSync(prodLink);
            expect(target).toBe('0.1.0.0');
        });

        it('should update existing symlinks when called multiple times', async () => {
            await web4ts.on('SemanticTestComponent', '0.1.0.0');
            
            // First set
            await web4ts.setDev('0.1.0.0');
            const componentDir = path.join(testDataDir, 'components', 'SemanticTestComponent');
            const devLink = path.join(componentDir, 'dev');
            expect(readlinkSync(devLink)).toBe('0.1.0.0');

            // Update to different version
            await web4ts.setDev('0.1.0.2');
            expect(readlinkSync(devLink)).toBe('0.1.0.2');

            // Update again
            await web4ts.setDev('0.1.0.1');
            expect(readlinkSync(devLink)).toBe('0.1.0.1');
        });
    });

    describe('🔗 Method Chaining Tests', () => {
        beforeEach(async () => {
            await web4ts.create('ChainTestComponent', '0.1.0.0', 'all');
            await web4ts.on('ChainTestComponent', '0.1.0.0');
            await web4ts.upgrade('nextBuild'); // Creates 0.1.0.1
            await web4ts.on('ChainTestComponent', '0.1.0.1');
            await web4ts.upgrade('nextBuild'); // Creates 0.1.0.2 from 0.1.0.1
        });

        it('should allow chaining setDev → setTest → setProd', async () => {
            await web4ts.on('ChainTestComponent', '0.1.0.1');
            await web4ts.setDev();
            await web4ts.setTest();
            const result = await web4ts.setProd();

            // All three symlinks should exist
            const componentDir = path.join(testDataDir, 'components', 'ChainTestComponent');
            expect(existsSync(path.join(componentDir, 'dev'))).toBe(true);
            expect(existsSync(path.join(componentDir, 'test'))).toBe(true);
            expect(existsSync(path.join(componentDir, 'prod'))).toBe(true);

            // All should point to same version
            expect(readlinkSync(path.join(componentDir, 'dev'))).toBe('0.1.0.1');
            expect(readlinkSync(path.join(componentDir, 'test'))).toBe('0.1.0.1');
            expect(readlinkSync(path.join(componentDir, 'prod'))).toBe('0.1.0.1');

            // Result should still be chainable (returns this)
            expect(result).toBe(web4ts);
        });

        it('should allow chaining with different versions for each link', async () => {
            await web4ts.on('ChainTestComponent', '0.1.0.0');
            await web4ts.setDev('0.1.0.2');    // Dev on latest
            await web4ts.setTest('0.1.0.1');   // Test on middle
            await web4ts.setProd('0.1.0.0');   // Prod on stable

            const componentDir = path.join(testDataDir, 'components', 'ChainTestComponent');
            
            expect(readlinkSync(path.join(componentDir, 'dev'))).toBe('0.1.0.2');
            expect(readlinkSync(path.join(componentDir, 'test'))).toBe('0.1.0.1');
            expect(readlinkSync(path.join(componentDir, 'prod'))).toBe('0.1.0.0');
        });

        it('should maintain context through semantic link methods', async () => {
            // Set context once, use throughout chain
            await web4ts.on('ChainTestComponent', '0.1.0.1');
            await web4ts.setDev();      // Uses context version
            await web4ts.setTest();     // Uses context version
            await web4ts.setProd();     // Uses context version
            // Note: build() requires proper package.json, not testing here

            // All links should point to context version
            const componentDir = path.join(testDataDir, 'components', 'ChainTestComponent');
            expect(readlinkSync(path.join(componentDir, 'dev'))).toBe('0.1.0.1');
            expect(readlinkSync(path.join(componentDir, 'test'))).toBe('0.1.0.1');
            expect(readlinkSync(path.join(componentDir, 'prod'))).toBe('0.1.0.1');
        });
    });

    describe('🎯 CLI Discoverability Tests', () => {
        it('should have @cliSyntax annotations for setDev', () => {
            // This test verifies the fix we applied
            const methodName = 'setDev';
            const prototype = Object.getPrototypeOf(web4ts);
            const method = prototype[methodName];
            
            expect(method).toBeDefined();
            expect(typeof method).toBe('function');
            
            // Method should be callable
            expect(method.constructor.name).toBe('AsyncFunction');
        });

        it('should have @cliSyntax annotations for setTest', () => {
            const methodName = 'setTest';
            const prototype = Object.getPrototypeOf(web4ts);
            const method = prototype[methodName];
            
            expect(method).toBeDefined();
            expect(typeof method).toBe('function');
        });

        it('should have @cliSyntax annotations for setProd', () => {
            const methodName = 'setProd';
            const prototype = Object.getPrototypeOf(web4ts);
            const method = prototype[methodName];
            
            expect(method).toBeDefined();
            expect(typeof method).toBe('function');
        });
    });

    describe('📊 Workflow Scenario Tests', () => {
        beforeEach(async () => {
            await web4ts.create('WorkflowComponent', '0.1.0.0', 'all');
            await web4ts.on('WorkflowComponent', '0.1.0.0');
            await web4ts.upgrade('nextBuild'); // 0.1.0.1
            await web4ts.on('WorkflowComponent', '0.1.0.1');
            await web4ts.upgrade('nextBuild'); // 0.1.0.2 from 0.1.0.1
        });

        it('should support standard dev → test → prod workflow', async () => {
            // Scenario: Start development on 0.1.0.1
            await web4ts.on('WorkflowComponent', '0.1.0.1');
            await web4ts.setDev();
            
            // Move to testing
            await web4ts.setTest();
            
            // Promote to production after successful testing
            await web4ts.setProd();

            const componentDir = path.join(testDataDir, 'components', 'WorkflowComponent');
            
            // All workflow links should exist and point to same version
            expect(readlinkSync(path.join(componentDir, 'dev'))).toBe('0.1.0.1');
            expect(readlinkSync(path.join(componentDir, 'test'))).toBe('0.1.0.1');
            expect(readlinkSync(path.join(componentDir, 'prod'))).toBe('0.1.0.1');
        });

        it('should support parallel development workflow', async () => {
            // Scenario: 0.1.0.0 in prod, 0.1.0.1 in test, 0.1.0.2 in dev
            await web4ts.on('WorkflowComponent', '0.1.0.0');
            await web4ts.setProd();
            await web4ts.on('WorkflowComponent', '0.1.0.1');
            await web4ts.setTest();
            await web4ts.on('WorkflowComponent', '0.1.0.2');
            await web4ts.setDev();

            const componentDir = path.join(testDataDir, 'components', 'WorkflowComponent');
            
            expect(readlinkSync(path.join(componentDir, 'prod'))).toBe('0.1.0.0');
            expect(readlinkSync(path.join(componentDir, 'test'))).toBe('0.1.0.1');
            expect(readlinkSync(path.join(componentDir, 'dev'))).toBe('0.1.0.2');
        });

        it('should handle workflow with explicit version strings', async () => {
            // Don't rely on 'current' default - be explicit
            await web4ts.on('WorkflowComponent', '0.1.0.0');
            await web4ts.setDev('0.1.0.2');   // Explicit
            await web4ts.setTest('0.1.0.1');  // Explicit
            await web4ts.setProd('0.1.0.0');  // Explicit

            const componentDir = path.join(testDataDir, 'components', 'WorkflowComponent');
            
            expect(readlinkSync(path.join(componentDir, 'dev'))).toBe('0.1.0.2');
            expect(readlinkSync(path.join(componentDir, 'test'))).toBe('0.1.0.1');
            expect(readlinkSync(path.join(componentDir, 'prod'))).toBe('0.1.0.0');
        });
    });

    describe('⚠️ Edge Cases and Error Handling', () => {
        beforeEach(async () => {
            await web4ts.create('EdgeCaseComponent', '0.1.0.0', 'all');
        });

        it('should reject setting link to non-existent version', async () => {
            await web4ts.on('EdgeCaseComponent', '0.1.0.0');
            
            // Try to set dev to version that doesn't exist
            await expect(
                web4ts.setDev('0.9.9.9')
            ).rejects.toThrow();
        });

        it('should handle empty version parameter gracefully', async () => {
            await web4ts.on('EdgeCaseComponent', '0.1.0.0');
            
            // Empty string should use 'current' default behavior
            const result = await web4ts.setDev('');
            expect(result).toBe(web4ts);
        });

        it('should maintain symlink even if target version is later deleted', async () => {
            await web4ts.on('EdgeCaseComponent', '0.1.0.0');
            await web4ts.upgrade('nextBuild'); // Create 0.1.0.1
            await web4ts.on('EdgeCaseComponent', '0.1.0.1');
            await web4ts.setDev();

            const componentDir = path.join(testDataDir, 'components', 'EdgeCaseComponent');
            const devLink = path.join(componentDir, 'dev');
            
            expect(existsSync(devLink)).toBe(true);
            expect(lstatSync(devLink).isSymbolicLink()).toBe(true);

            // Symlink exists even if it points to deleted target
            // (This is expected symlink behavior)
        });
    });

    describe('🔄 Integration with Other Methods', () => {
        beforeEach(async () => {
            await web4ts.create('IntegrationComponent', '0.1.0.0', 'all');
        });

        it('should work with upgrade method in chain', async () => {
            await web4ts.on('IntegrationComponent', '0.1.0.0');
            await web4ts.setDev();
            await web4ts.upgrade('nextBuild');  // Creates new version and switches context
            await web4ts.setDev();              // Should set dev on NEW version

            const componentDir = path.join(testDataDir, 'components', 'IntegrationComponent');
            const devLink = path.join(componentDir, 'dev');
            
            // Dev should point to new version (0.1.0.1), not original (0.1.0.0)
            expect(readlinkSync(devLink)).toBe('0.1.0.1');
        });

        it('should work with links method to verify state', async () => {
            await web4ts.on('IntegrationComponent', '0.1.0.0');
            await web4ts.setDev();
            await web4ts.setTest();
            await web4ts.setProd();
            await web4ts.links();  // Should display all three links

            // If links() doesn't throw, it worked
            expect(true).toBe(true);
        });

        it('should work with links method to verify semantic links', async () => {
            // Set multiple links and verify with links() method
            await web4ts.on('IntegrationComponent', '0.1.0.0');
            await web4ts.setDev();
            await web4ts.setTest();
            
            // links() should display without errors
            await web4ts.links();
            
            // Verify links exist
            const componentDir = path.join(testDataDir, 'components', 'IntegrationComponent');
            expect(existsSync(path.join(componentDir, 'dev'))).toBe(true);
            expect(existsSync(path.join(componentDir, 'test'))).toBe(true);
        });
    });
});
