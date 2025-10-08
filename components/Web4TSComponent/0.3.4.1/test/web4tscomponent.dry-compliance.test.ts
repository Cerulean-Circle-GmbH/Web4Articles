import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { existsSync, lstatSync, rmSync } from 'fs';
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

describe('🧽 DRY Principle Compliance Tests', () => {
    const testDataDir = path.join(process.cwd(), 'test', 'data');
    let web4ts: DefaultWeb4TSComponent;

    beforeEach(async () => {
        // Clean test data CONTENT (not the directory itself)
        await cleanupTestDataContent(testDataDir);
        
        // Set up isolated test environment (OOP, no global mocking)
        web4ts = new DefaultWeb4TSComponent();
        web4ts.setTargetDirectory(testDataDir);
    });

    afterEach(async () => {
        // Clean up test data CONTENT (preserve directory)
        await cleanupTestDataContent(testDataDir);
    });

    describe('📦 node_modules DRY Compliance', () => {
        it('should create components with symlinked node_modules (not real directories)', { timeout: 45000 }, async () => {
            // Create a test component
            await web4ts.create('DRYTestComponent', '0.1.0.0', 'all');
            
            const componentDir = path.join(testDataDir, 'components', 'DRYTestComponent', '0.1.0.0');
            const nodeModulesPath = path.join(componentDir, 'node_modules');
            
            // Build the component (this runs install-deps.sh)
            await web4ts.on('DRYTestComponent', '0.1.0.0');
            await web4ts.build();
            
            // Verify node_modules exists
            expect(existsSync(nodeModulesPath)).toBe(true);
            
            // CRITICAL: Must be a symlink, NOT a real directory
            expect(lstatSync(nodeModulesPath).isSymbolicLink()).toBe(true);
            expect(lstatSync(nodeModulesPath).isDirectory()).toBe(false);
            
            console.log('✅ DRY Compliance: Component has symlinked node_modules');
        });

        it.skip('should detect and report DRY violations in existing components', async () => {
            // Create a component first
            await web4ts.create('DRYViolationTest', '0.1.0.0', 'all');
            
            const componentDir = path.join(testDataDir, 'components', 'DRYViolationTest', '0.1.0.0');
            const nodeModulesPath = path.join(componentDir, 'node_modules');
            
            // Simulate a DRY violation by creating a real node_modules
            await web4ts.on('DRYViolationTest', '0.1.0.0');
            await web4ts.build();
            
            // Manually break it (simulate old broken behavior)
            if (lstatSync(nodeModulesPath).isSymbolicLink()) {
                rmSync(nodeModulesPath);
                // Create a real directory (DRY violation)
                const fs = await import('fs');
                fs.mkdirSync(nodeModulesPath);
            }
            
            // Now test should detect the violation
            expect(existsSync(nodeModulesPath)).toBe(true);
            expect(lstatSync(nodeModulesPath).isSymbolicLink()).toBe(false);
            expect(lstatSync(nodeModulesPath).isDirectory()).toBe(true);
            
            console.log('🚨 DRY Violation detected: Real node_modules directory found');
        });

        it.skip('should handle multiple components without node_modules duplication', { timeout: 60000 }, async () => {
            // Create multiple components
            await web4ts.create('Component1', '0.1.0.0', 'all');
            await web4ts.create('Component2', '0.1.0.0', 'all');
            await web4ts.create('Component3', '0.1.0.0', 'all');
            
            // Build all components (await on() first, then build())
            await (await web4ts.on('Component1', '0.1.0.0')).build();
            await (await web4ts.on('Component2', '0.1.0.0')).build();
            await (await web4ts.on('Component3', '0.1.0.0')).build();
            
            // Check all have symlinks
            const components = ['Component1', 'Component2', 'Component3'];
            for (const comp of components) {
                const nodeModulesPath = path.join(testDataDir, 'components', comp, '0.1.0.0', 'node_modules');
                expect(existsSync(nodeModulesPath)).toBe(true);
                expect(lstatSync(nodeModulesPath).isSymbolicLink()).toBe(true);
                console.log(`✅ ${comp}: Symlinked node_modules`);
            }
            
            // Verify only ONE real node_modules exists (at project root)
            const globalNodeModules = path.join(testDataDir, 'node_modules');
            expect(existsSync(globalNodeModules)).toBe(true);
            expect(lstatSync(globalNodeModules).isDirectory()).toBe(true);
            expect(lstatSync(globalNodeModules).isSymbolicLink()).toBe(false);
            
            console.log('✅ DRY Principle: Only one global node_modules exists');
        });
    });

    describe('🔧 install-deps.sh Template Compliance', () => {
        it.skip('should generate install-deps.sh with correct order (npm install BEFORE symlink)', async () => {
            await web4ts.create('TemplateTest', '0.1.0.0', 'all');
            
            const installDepsPath = path.join(testDataDir, 'components', 'TemplateTest', '0.1.0.0', 'src', 'sh', 'install-deps.sh');
            expect(existsSync(installDepsPath)).toBe(true);
            
            const fs = await import('fs');
            const content = fs.readFileSync(installDepsPath, 'utf-8');
            
            // Check for correct order
            const npmInstallIndex = content.indexOf('npm install');
            const symlinkIndex = content.indexOf('ln -sf ../../../node_modules node_modules');
            
            expect(npmInstallIndex).toBeGreaterThan(0);
            expect(symlinkIndex).toBeGreaterThan(0);
            expect(npmInstallIndex).toBeLessThan(symlinkIndex); // npm install BEFORE symlink
            
            // Check for global check
            expect(content).toContain('if [ ! -d "../../../node_modules" ]');
            expect(content).toContain('rm -rf node_modules');
            
            console.log('✅ Template generates correct install-deps.sh order');
        });
    });
});
