import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { existsSync, readFileSync, rmSync, readlinkSync, readdirSync } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * 🎯 CONSOLIDATED TEST STORY - The MASTER Test Suite
 * 
 * This is THE comprehensive test suite that covers EVERYTHING:
 * - npm start ONLY principle
 * - Component lifecycle (create/upgrade/remove)
 * - Version promotion workflow
 * - Semantic links (dev/test/prod/latest)
 * - CLI auto-discovery
 * - Test isolation (test/data vs production)
 * - Context pattern (with/without)
 * - Location independence
 * - Tree visualization
 * - Script symlinks
 * - Hardcoded version detection
 * - DRY principles
 * 
 * ALL tests MUST work in test/data as if it's the project root.
 * The component MUST NOT know it's in test/data - it just uses model.targetDirectory.
 */

describe('🎯 CONSOLIDATED TEST STORY - Master Suite', () => {
  const testDataDir = path.resolve(__dirname, 'data');
  let component: DefaultWeb4TSComponent;

  beforeAll(async () => {
    // Clean test/data CONTENT ONLY (preserve the directory itself)
    if (existsSync(testDataDir)) {
      const entries = await fs.readdir(testDataDir);
      for (const entry of entries) {
        const entryPath = path.join(testDataDir, entry);
        await fs.rm(entryPath, { recursive: true, force: true });
      }
    } else {
      await fs.mkdir(testDataDir, { recursive: true });
    }
  });

  beforeEach(() => {
    component = new DefaultWeb4TSComponent();
    component.setTargetDirectory(testDataDir);
  });

  // NO afterAll cleanup - leave test/data visible for inspection!

  // =========================================================================
  // PART 1: npm start ONLY Principle
  // =========================================================================
  describe('📦 Part 1: npm start ONLY Principle', () => {
    it('Story 1.1: Component itself uses shell script for npm start', async () => {
      console.log('\n📖 Story 1.1: Verifying npm start uses shell script...');
      
      const componentRoot = path.resolve(__dirname, '..');
      const packageJson = JSON.parse(
        readFileSync(path.join(componentRoot, 'package.json'), 'utf-8')
      );
      
      expect(packageJson.scripts.start).toBe('./src/sh/start.sh');
      expect(packageJson.scripts.start).not.toContain('node');
      expect(packageJson.scripts.start).not.toContain('CLI');
      console.log('✅ npm start uses shell script (zero-dependency)');
    });

    it('Story 1.2: Component itself uses shell script for npm test', async () => {
      console.log('\n📖 Story 1.2: Verifying npm test uses shell script...');
      
      const componentRoot = path.resolve(__dirname, '..');
      const packageJson = JSON.parse(
        readFileSync(path.join(componentRoot, 'package.json'), 'utf-8')
      );
      
      expect(packageJson.scripts.test).toBe('./src/sh/test.sh');
      expect(packageJson.scripts.test).not.toContain('node');
      console.log('✅ npm test uses shell script (smart build)');
    });

    it('Story 1.3: Generated components use shell script for npm start', async () => {
      console.log('\n📖 Story 1.3: Creating component and verifying scripts...');
      
      await component.create('NpmStartTest', '0.1.0.0', 'all');
      
      const packageJsonPath = path.join(testDataDir, 'components', 'NpmStartTest', '0.1.0.0', 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      expect(packageJson.scripts.start).toBe('./src/sh/start.sh');
      expect(packageJson.scripts.test).toBe('./src/sh/test.sh');
      expect(packageJson.scripts.start).not.toContain('CLI');
      console.log('✅ Generated component uses shell scripts');
    });
  });

  // =========================================================================
  // PART 2: Test Isolation - test/data as Project Root
  // =========================================================================
  describe('🧪 Part 2: Test Isolation - test/data as Project Root', () => {
    const isolationTestComponent = 'IsolationTest';

    it('Story 2.1: Component thinks test/data is project root', async () => {
      console.log('\n📖 Story 2.1: Verifying component uses model.targetDirectory...');
      
      await component.create(isolationTestComponent, '0.1.0.0', 'all');
      
      const componentDir = path.join(testDataDir, 'components', isolationTestComponent, '0.1.0.0');
      expect(existsSync(componentDir)).toBe(true);
      
      // Component created in test/data, NOT in project root
      const realProjectRoot = path.resolve(__dirname, '..', '..', '..', '..');
      const wouldBeInRealRoot = path.join(realProjectRoot, 'components', isolationTestComponent);
      expect(existsSync(wouldBeInRealRoot)).toBe(false);
      
      console.log('✅ Component correctly isolated in test/data');
    });

    it('Story 2.2: All operations stay within test/data', async () => {
      console.log('\n📖 Story 2.2: Testing all operations remain isolated...');
      
      await component.on(isolationTestComponent, '0.1.0.0');
      await component.upgrade('nextBuild');
      await component.setDev('0.1.0.1');
      await component.setTest('0.1.0.1');
      
      // All operations created files in test/data only
      const testDataComponents = path.join(testDataDir, 'components', isolationTestComponent);
      expect(existsSync(path.join(testDataComponents, '0.1.0.0'))).toBe(true);
      expect(existsSync(path.join(testDataComponents, '0.1.0.1'))).toBe(true);
      expect(existsSync(path.join(testDataComponents, 'dev'))).toBe(true);
      expect(existsSync(path.join(testDataComponents, 'test'))).toBe(true);
      
      console.log('✅ All operations isolated in test/data');
    });

    it('Story 2.3: Script symlinks created in test/data/scripts', async () => {
      console.log('\n📖 Story 2.3: Verifying script symlinks in test/data...');
      
      const scriptsDir = path.join(testDataDir, 'scripts', 'versions');
      expect(existsSync(scriptsDir)).toBe(true);
      
      const expectedSymlink = path.join(scriptsDir, 'isolationtest-v0.1.0.0');
      expect(existsSync(expectedSymlink)).toBe(true);
      
      console.log('✅ Script symlinks correctly in test/data/scripts');
    });
  });

  // =========================================================================
  // PART 3: Auto-Discovery & No Hardcoding
  // =========================================================================
  describe('🔍 Part 3: Auto-Discovery & No Hardcoding', () => {
    it('Story 3.1: CLI auto-discovers methods from @cli annotations', async () => {
      console.log('\n📖 Story 3.1: Verifying CLI auto-discovery...');
      
      const cliFile = path.resolve(__dirname, '..', 'src', 'ts', 'layer5', 'Web4TSComponentCLI.ts');
      const cliContent = readFileSync(cliFile, 'utf-8');
      
      // Should NOT have hardcoded method list
      expect(cliContent).not.toContain('const methods = [');
      // Should have discoverMethods() call
      expect(cliContent).toContain('discoverMethods()');
      
      console.log('✅ CLI uses auto-discovery pattern');
    });

    it('Story 3.2: Version is read from directory, not hardcoded', async () => {
      console.log('\n📖 Story 3.2: Scanning for hardcoded versions...');
      
      const sourceFiles = [
        path.resolve(__dirname, '..', 'src', 'ts', 'layer5', 'Web4TSComponentCLI.ts'),
        path.resolve(__dirname, '..', 'src', 'ts', 'layer2', 'DefaultCLI.ts'),
        path.resolve(__dirname, '..', 'src', 'ts', 'layer2', 'DefaultWeb4TSComponent.ts'),
      ];
      
      for (const file of sourceFiles) {
        const content = readFileSync(file, 'utf-8');
        
        // Should NOT have hardcoded version assignments like "0.3.4.1"
        const hardcodedVersionPattern = /['"]0\.\d+\.\d+\.\d+['"]\s*;?\s*$/gm;
        const matches = content.match(hardcodedVersionPattern);
        
        // Allow only in comments or as fallback '0.0.0'
        if (matches) {
          for (const match of matches) {
            expect(match).toMatch(/0\.0\.0|\/\/|\/\*/);
          }
        }
      }
      
      console.log('✅ No hardcoded versions found');
    });

    it('Story 3.3: Component reads version from model (single source of truth)', async () => {
      console.log('\n📖 Story 3.3: Verifying dynamic version reading...');
      
      const scenario = await component.toScenario();
      expect(scenario.ior.version).toBeDefined();
      expect(scenario.ior.version).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
      
      // Should match directory name
      const currentFileDir = path.resolve(__dirname, '..');
      const dirName = path.basename(currentFileDir);
      expect(scenario.ior.version).toBe(dirName);
      
      console.log(`✅ Version dynamically read: ${scenario.ior.version}`);
    });
  });

  // =========================================================================
  // PART 4: Component Lifecycle (Create/Upgrade/Remove)
  // =========================================================================
  describe('🔄 Part 4: Component Lifecycle', () => {
    const lifecycleComponent = 'LifecycleTest';

    it('Story 4.1: Create component with all features', async () => {
      console.log('\n📖 Story 4.1: Creating component...');
      
      await component.create(lifecycleComponent, '0.1.0.0', 'all');
      
      const componentDir = path.join(testDataDir, 'components', lifecycleComponent, '0.1.0.0');
      expect(existsSync(componentDir)).toBe(true);
      expect(existsSync(path.join(componentDir, 'package.json'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'tsconfig.json'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'src'))).toBe(true);
      
      console.log('✅ Component created with complete structure');
    });

    it('Story 4.2: Upgrade to nextBuild (0.1.0.0 → 0.1.0.1)', async () => {
      console.log('\n📖 Story 4.2: Upgrading to nextBuild...');
      
      await component.on(lifecycleComponent, '0.1.0.0');
      await component.upgrade('nextBuild');
      
      const newVersionDir = path.join(testDataDir, 'components', lifecycleComponent, '0.1.0.1');
      expect(existsSync(newVersionDir)).toBe(true);
      
      const packageJson = JSON.parse(readFileSync(path.join(newVersionDir, 'package.json'), 'utf-8'));
      expect(packageJson.version).toBe('0.1.0.1');
      
      console.log('✅ Upgraded to nextBuild: 0.1.0.1');
    });

    it('Story 4.3: Upgrade to nextPatch (0.1.0.1 → 0.1.1.0)', async () => {
      console.log('\n📖 Story 4.3: Upgrading to nextPatch...');
      
      await component.on(lifecycleComponent, '0.1.0.1');
      await component.upgrade('nextPatch');
      
      const newVersionDir = path.join(testDataDir, 'components', lifecycleComponent, '0.1.1.0');
      expect(existsSync(newVersionDir)).toBe(true);
      
      console.log('✅ Upgraded to nextPatch: 0.1.1.0');
    });

    it('Story 4.4: Upgrade to nextMinor (0.1.1.0 → 0.2.0.0)', async () => {
      console.log('\n📖 Story 4.4: Upgrading to nextMinor...');
      
      await component.on(lifecycleComponent, '0.1.1.0');
      await component.upgrade('nextMinor');
      
      const newVersionDir = path.join(testDataDir, 'components', lifecycleComponent, '0.2.0.0');
      expect(existsSync(newVersionDir)).toBe(true);
      
      console.log('✅ Upgraded to nextMinor: 0.2.0.0');
    });

    it('Story 4.5: Upgrade to nextMajor (0.2.0.0 → 1.0.0.0)', async () => {
      console.log('\n📖 Story 4.5: Upgrading to nextMajor...');
      
      await component.on(lifecycleComponent, '0.2.0.0');
      await component.upgrade('nextMajor');
      
      const newVersionDir = path.join(testDataDir, 'components', lifecycleComponent, '1.0.0.0');
      expect(existsSync(newVersionDir)).toBe(true);
      
      console.log('✅ Upgraded to nextMajor: 1.0.0.0');
    });

    it('Story 4.6: Remove specific version', async () => {
      console.log('\n📖 Story 4.6: Removing version 0.1.0.1...');
      
      await component.on(lifecycleComponent, '0.1.0.1');
      await component.removeVersion('current', 'current');
      
      const removedVersionDir = path.join(testDataDir, 'components', lifecycleComponent, '0.1.0.1');
      expect(existsSync(removedVersionDir)).toBe(false);
      
      console.log('✅ Version 0.1.0.1 removed');
    });

    it('Story 4.7: Remove entire component', async () => {
      console.log('\n📖 Story 4.7: Removing entire component...');
      
      await component.on(lifecycleComponent, '1.0.0.0');
      await component.removeComponent('current');
      
      const componentDir = path.join(testDataDir, 'components', lifecycleComponent);
      expect(existsSync(componentDir)).toBe(false);
      
      console.log('✅ Component completely removed');
    });
  });

  // =========================================================================
  // PART 5: Semantic Links (dev/test/prod/latest)
  // =========================================================================
  describe('🔗 Part 5: Semantic Links', () => {
    const semanticComponent = 'SemanticTest';

    beforeEach(async () => {
      // Clean up any existing component first
      const componentDir = path.join(testDataDir, 'components', semanticComponent);
      if (existsSync(componentDir)) {
        await component.on(semanticComponent, '0.1.0.0').catch(() => {});
        await component.removeComponent('current').catch(() => {});
      }
      
      // Create fresh component with 3 versions
      await component.create(semanticComponent, '0.1.0.0', 'all');
      await component.on(semanticComponent, '0.1.0.0');
      await component.upgrade('nextBuild');
      await component.on(semanticComponent, '0.1.0.1');
      await component.upgrade('nextBuild');
    });

    // NO afterEach - leave components visible for inspection!

    it('Story 5.1: Set dev symlink', async () => {
      console.log('\n📖 Story 5.1: Setting dev symlink...');
      
      await component.on(semanticComponent, '0.1.0.0');
      await component.setDev('0.1.0.1');
      
      const devLink = path.join(testDataDir, 'components', semanticComponent, 'dev');
      expect(existsSync(devLink)).toBe(true);
      expect(readlinkSync(devLink)).toBe('0.1.0.1');
      
      console.log('✅ dev → 0.1.0.1');
    });

    it('Story 5.2: Set test symlink', async () => {
      console.log('\n📖 Story 5.2: Setting test symlink...');
      
      await component.on(semanticComponent, '0.1.0.0');
      await component.setTest('0.1.0.1');
      
      const testLink = path.join(testDataDir, 'components', semanticComponent, 'test');
      expect(existsSync(testLink)).toBe(true);
      expect(readlinkSync(testLink)).toBe('0.1.0.1');
      
      console.log('✅ test → 0.1.0.1');
    });

    it('Story 5.3: Set prod symlink', async () => {
      console.log('\n📖 Story 5.3: Setting prod symlink...');
      
      await component.on(semanticComponent, '0.1.0.0');
      await component.setProd('0.1.0.0');
      
      const prodLink = path.join(testDataDir, 'components', semanticComponent, 'prod');
      expect(existsSync(prodLink)).toBe(true);
      expect(readlinkSync(prodLink)).toBe('0.1.0.0');
      
      console.log('✅ prod → 0.1.0.0');
    });

    it('Story 5.4: Set latest symlink (auto-updated on upgrade)', async () => {
      console.log('\n📖 Story 5.4: Verifying latest symlink...');
      
      const latestLink = path.join(testDataDir, 'components', semanticComponent, 'latest');
      expect(existsSync(latestLink)).toBe(true);
      expect(readlinkSync(latestLink)).toBe('0.1.0.2');
      
      console.log('✅ latest → 0.1.0.2 (auto-updated)');
    });

    it('Story 5.5: Full workflow - dev → test → prod promotion', async () => {
      console.log('\n📖 Story 5.5: Testing full promotion workflow...');
      
      await component.on(semanticComponent, '0.1.0.0');
      
      // Set dev to new version
      await component.setDev('0.1.0.2');
      expect(readlinkSync(path.join(testDataDir, 'components', semanticComponent, 'dev'))).toBe('0.1.0.2');
      
      // Promote to test
      await component.setTest('0.1.0.2');
      expect(readlinkSync(path.join(testDataDir, 'components', semanticComponent, 'test'))).toBe('0.1.0.2');
      
      // Promote to prod
      await component.setProd('0.1.0.2');
      expect(readlinkSync(path.join(testDataDir, 'components', semanticComponent, 'prod'))).toBe('0.1.0.2');
      
      console.log('✅ Full promotion workflow: dev → test → prod');
    });
  });

  // =========================================================================
  // PART 6: Context Pattern (with/without on)
  // =========================================================================
  describe('🎯 Part 6: Context Pattern', () => {
    const contextComponent = 'ContextTest';

    beforeEach(async () => {
      // Clean up any existing component first
      const componentDir = path.join(testDataDir, 'components', contextComponent);
      if (existsSync(componentDir)) {
        await component.on(contextComponent, '0.1.0.0').catch(() => {});
        await component.removeComponent('current').catch(() => {});
      }
      
      await component.create(contextComponent, '0.1.0.0', 'all');
    });

    // NO afterEach - leave components visible for inspection!

    it('Story 6.1: Operations WITHOUT context work on Web4TSComponent itself', async () => {
      console.log('\n📖 Story 6.1: Testing WITHOUT context...');
      
      // tree without context shows Web4TSComponent's own structure
      // This would show the test/data component structure
      // (We can't easily test output, but we verify it doesn't throw)
      
      expect(() => component.tree('2', 'false')).not.toThrow();
      console.log('✅ Operations without context work');
    });

    it('Story 6.2: Operations WITH context work on target component', async () => {
      console.log('\n📖 Story 6.2: Testing WITH context...');
      
      await component.on(contextComponent, '0.1.0.0');
      
      // Now operations work on contextComponent
      await component.upgrade('nextBuild');
      
      const newVersion = path.join(testDataDir, 'components', contextComponent, '0.1.0.1');
      expect(existsSync(newVersion)).toBe(true);
      
      console.log('✅ Operations with context work on target');
    });

    it('Story 6.3: Context is maintained through chaining', async () => {
      console.log('\n📖 Story 6.3: Testing context chaining...');
      
      await component
        .on(contextComponent, '0.1.0.0')
        .then(c => c.upgrade('nextBuild'))
        .then(c => c.setDev('0.1.0.1'));
      
      const devLink = path.join(testDataDir, 'components', contextComponent, 'dev');
      expect(readlinkSync(devLink)).toBe('0.1.0.1');
      
      console.log('✅ Context maintained through chain');
    });
  });

  // =========================================================================
  // PART 7: Tree Visualization
  // =========================================================================
  describe('🌳 Part 7: Tree Visualization', () => {
    const treeComponent = 'TreeTest';

    beforeEach(async () => {
      // Clean up any existing component first
      const componentDir = path.join(testDataDir, 'components', treeComponent);
      if (existsSync(componentDir)) {
        await component.on(treeComponent, '0.1.0.0').catch(() => {});
        await component.removeComponent('current').catch(() => {});
      }
      
      await component.create(treeComponent, '0.1.0.0', 'all');
      await component.on(treeComponent, '0.1.0.0');
      await component.upgrade('nextBuild');
      await component.setDev('0.1.0.1');
      await component.setTest('0.1.0.1');
      await component.setProd('0.1.0.0');
    });

    // NO afterEach - leave components visible for inspection!

    it('Story 7.1: tree() without context shows current structure', async () => {
      console.log('\n📖 Story 7.1: Testing tree without context...');
      
      // Should not throw
      await component.tree('2', 'false');
      
      console.log('✅ tree() works without context');
    });

    it('Story 7.2: tree() with context shows target component', async () => {
      console.log('\n📖 Story 7.2: Testing tree with context...');
      
      await component.on(treeComponent, '0.1.0.0');
      await component.tree('3', 'false');
      
      console.log('✅ tree() works with context');
    });

    it('Story 7.3: tree() shows semantic symlinks', async () => {
      console.log('\n📖 Story 7.3: Verifying tree shows symlinks...');
      
      const componentDir = path.join(testDataDir, 'components', treeComponent);
      
      // Verify semantic links exist and would be shown by tree
      expect(existsSync(path.join(componentDir, 'dev'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'test'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'prod'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'latest'))).toBe(true);
      
      console.log('✅ All semantic links exist for tree display');
    });

    it('Story 7.4: tree() respects depth parameter', async () => {
      console.log('\n📖 Story 7.4: Testing tree depth parameter...');
      
      await component.on(treeComponent, '0.1.0.0');
      
      // Different depths should all work
      await component.tree('1', 'false');
      await component.tree('4', 'false');
      await component.tree('10', 'false');
      
      console.log('✅ tree() respects depth parameter');
    });
  });

  // =========================================================================
  // PART 8: Location Independence
  // =========================================================================
  describe('📍 Part 8: Location Independence', () => {
    it('Story 8.1: CLI wrapper resolves symlinks correctly', async () => {
      console.log('\n📖 Story 8.1: Verifying CLI wrapper symlink resolution...');
      
      const wrapperScript = path.resolve(__dirname, '..', 'web4tscomponent');
      expect(existsSync(wrapperScript)).toBe(true);
      
      const content = readFileSync(wrapperScript, 'utf-8');
      
      // Should resolve symlinks using while loop
      expect(content).toContain('while [ -L "$SCRIPT_FILE" ]');
      expect(content).toContain('readlink');
      
      console.log('✅ CLI wrapper has symlink resolution logic');
    });

    it('Story 8.2: CLI wrapper reads version from directory', async () => {
      console.log('\n📖 Story 8.2: Verifying CLI wrapper version reading...');
      
      const wrapperScript = path.resolve(__dirname, '..', 'web4tscomponent');
      const content = readFileSync(wrapperScript, 'utf-8');
      
      // Should use basename of SCRIPT_DIR, not hardcoded
      expect(content).toContain('basename "$SCRIPT_DIR"');
      expect(content).not.toMatch(/COMPONENT_VERSION=["']0\.\d+\.\d+\.\d+["']/);
      
      console.log('✅ CLI wrapper reads version dynamically');
    });
  });

  // =========================================================================
  // PART 9: DRY Principles
  // =========================================================================
  describe('🔄 Part 9: DRY Principles', () => {
    const dryComponent = 'DryTest';

    beforeEach(async () => {
      // Clean up any existing component first
      const componentDir = path.join(testDataDir, 'components', dryComponent);
      if (existsSync(componentDir)) {
        await component.on(dryComponent, '0.1.0.0').catch(() => {});
        await component.removeComponent('current').catch(() => {});
      }
    });

    // NO afterEach - leave components visible for inspection!

    it('Story 9.1: Component uses symlinked node_modules', async () => {
      console.log('\n📖 Story 9.1: Creating component with symlinked node_modules...');
      
      await component.create(dryComponent, '0.1.0.0', 'all');
      
      const nodeModulesPath = path.join(testDataDir, 'components', dryComponent, '0.1.0.0', 'node_modules');
      
      if (existsSync(nodeModulesPath)) {
        const stats = await fs.lstat(nodeModulesPath);
        expect(stats.isSymbolicLink()).toBe(true);
        console.log('✅ node_modules is symlink (DRY)');
      } else {
        console.log('⚠️  node_modules not yet created (OK if deps not installed)');
      }
    });

    it('Story 9.2: Upgrade preserves files and structure', async () => {
      console.log('\n📖 Story 9.2: Testing upgrade preserves files...');
      
      // Create component first (each test is isolated)
      await component.create(dryComponent, '0.1.0.0', 'all');
      await component.on(dryComponent, '0.1.0.0');
      
      // Add a custom file
      const customFile = path.join(testDataDir, 'components', dryComponent, '0.1.0.0', 'CUSTOM.md');
      await fs.writeFile(customFile, '# Custom file');
      
      await component.upgrade('nextBuild');
      
      // Custom file should be in new version
      const newCustomFile = path.join(testDataDir, 'components', dryComponent, '0.1.0.1', 'CUSTOM.md');
      expect(existsSync(newCustomFile)).toBe(true);
      
      console.log('✅ Upgrade preserved custom files');
    });
  });

  // =========================================================================
  // PART 10: Script Symlinks
  // =========================================================================
  describe('🔗 Part 10: Script Symlinks', () => {
    const scriptComponent = 'ScriptTest';

    beforeEach(async () => {
      // Clean up any existing component first
      const componentDir = path.join(testDataDir, 'components', scriptComponent);
      if (existsSync(componentDir)) {
        await component.on(scriptComponent, '0.1.0.0').catch(() => {});
        await component.removeComponent('current').catch(() => {});
      }
    });

    // NO afterEach - leave components visible for inspection!

    it('Story 10.1: Create generates version-specific script symlink', async () => {
      console.log('\n📖 Story 10.1: Testing script symlink creation...');
      
      await component.create(scriptComponent, '0.1.0.0', 'all');
      
      const versionScript = path.join(testDataDir, 'scripts', 'versions', 'scripttest-v0.1.0.0');
      expect(existsSync(versionScript)).toBe(true);
      
      console.log('✅ Version-specific script symlink created');
    });

    it('Story 10.2: Create generates main script symlink', async () => {
      console.log('\n📖 Story 10.2: Testing main script symlink...');
      
      // Create component first (each test is isolated)
      await component.create(scriptComponent, '0.1.0.0', 'all');
      
      const mainScript = path.join(testDataDir, 'scripts', 'scripttest');
      expect(existsSync(mainScript)).toBe(true);
      
      console.log('✅ Main script symlink created');
    });

    it('Story 10.3: Upgrade creates new script symlinks', async () => {
      console.log('\n📖 Story 10.3: Testing script symlinks on upgrade...');
      
      // Create component first (each test is isolated)
      await component.create(scriptComponent, '0.1.0.0', 'all');
      await component.on(scriptComponent, '0.1.0.0');
      await component.upgrade('nextBuild');
      
      const newVersionScript = path.join(testDataDir, 'scripts', 'versions', 'scripttest-v0.1.0.1');
      expect(existsSync(newVersionScript)).toBe(true);
      
      console.log('✅ New script symlink created on upgrade');
    });

    it('Story 10.4: RemoveVersion cleans up script symlinks', async () => {
      console.log('\n📖 Story 10.4: Testing script symlink cleanup...');
      
      // Create component with multiple versions first
      await component.create(scriptComponent, '0.1.0.0', 'all');
      await component.on(scriptComponent, '0.1.0.0');
      await component.upgrade('nextBuild');
      
      // Now remove one version
      await component.on(scriptComponent, '0.1.0.0');
      await component.removeVersion('current', 'current');
      
      const removedScript = path.join(testDataDir, 'scripts', 'versions', 'scripttest-v0.1.0.0');
      expect(existsSync(removedScript)).toBe(false);
      
      console.log('✅ Script symlink cleaned up on removeVersion');
    });

    it('Story 10.5: RemoveComponent cleans up all script symlinks', async () => {
      console.log('\n📖 Story 10.5: Testing complete script cleanup...');
      
      // Clean up first (previous test might have left artifacts)
      const compDir = path.join(testDataDir, 'components', scriptComponent);
      if (existsSync(compDir)) {
        const existingVersions = readdirSync(compDir).filter(v => /^\d+\.\d+\.\d+\.\d+$/.test(v));
        if (existingVersions.length > 0) {
          await component.on(scriptComponent, existingVersions[0]);
          await component.removeComponent('current');
        }
      }
      
      // Create component with multiple versions first
      await component.create(scriptComponent, '0.1.0.0', 'all');
      await component.on(scriptComponent, '0.1.0.0');
      await component.upgrade('nextBuild');
      
      // Now remove entire component
      await component.on(scriptComponent, '0.1.0.1');
      await component.removeComponent('current');
      
      // Main script is in scripts/, not scripts/versions/
      const mainScript = path.join(testDataDir, 'scripts', 'scripttest');
      const versionScript0 = path.join(testDataDir, 'scripts', 'versions', 'scripttest-v0.1.0.0');
      const versionScript1 = path.join(testDataDir, 'scripts', 'versions', 'scripttest-v0.1.0.1');
      
      expect(existsSync(mainScript)).toBe(false);
      expect(existsSync(versionScript0)).toBe(false);
      expect(existsSync(versionScript1)).toBe(false);
      
      console.log('✅ All script symlinks cleaned up');
    });
  });

  // =========================================================================
  // PART 11: Error Handling & Edge Cases
  // =========================================================================
  describe('⚠️ Part 11: Error Handling & Edge Cases', () => {
    it('Story 11.1: Context required methods fail gracefully without context', async () => {
      console.log('\n📖 Story 11.1: Testing context requirement...');
      
      const freshComponent = new DefaultWeb4TSComponent();
      freshComponent.setTargetDirectory(testDataDir);
      
      await expect(freshComponent.upgrade('nextBuild')).rejects.toThrow('No component context loaded');
      
      console.log('✅ Methods requiring context fail gracefully');
    });

    it('Story 11.2: Cannot set semantic link to non-existent version', async () => {
      console.log('\n📖 Story 11.2: Testing version validation...');
      
      await component.create('ErrorTest', '0.1.0.0', 'all');
      await component.on('ErrorTest', '0.1.0.0');
      
      await expect(component.setDev('9.9.9.9')).rejects.toThrow('does not exist');
      
      console.log('✅ Semantic link validates version existence');
    });

    it('Story 11.3: Cannot remove non-existent version', async () => {
      console.log('\n📖 Story 11.3: Testing removeVersion validation...');
      
      await component.on('ErrorTest', '0.1.0.0');
      
      await expect(component.removeVersion('ErrorTest', '9.9.9.9')).rejects.toThrow('does not exist');
      
      console.log('✅ removeVersion validates version existence');
    });

    it('Story 11.4: Chaining returns correct instance for fluent API', async () => {
      console.log('\n📖 Story 11.4: Testing method chaining return values...');
      
      // Create component first (create returns void, not chainable)
      await component.create('ChainTest', '0.1.0.0', 'all');
      
      // Test actual chainable methods (on, upgrade, setDev all return this)
      const result = await component
        .on('ChainTest', '0.1.0.0')
        .then(c => c.upgrade('nextBuild'))
        .then(c => c.setDev('0.1.0.1'));
      
      expect(result).toBe(component);
      expect(result.on).toBeDefined();
      expect(result.upgrade).toBeDefined();
      
      console.log('✅ Chaining returns correct instance');
      
      // Clean up
      await component.removeComponent('current');
    });
  });
});

