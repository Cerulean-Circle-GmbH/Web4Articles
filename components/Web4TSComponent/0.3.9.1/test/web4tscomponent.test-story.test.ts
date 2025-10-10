import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { existsSync, readFileSync, rmSync, readlinkSync } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * 📖 SYSTEMATIC TEST STORY
 * 
 * This test follows the PDCA principle from the README:
 * 1. Tests use setTargetDirectory() to control environment
 * 2. Component has NO test mode detection
 * 3. Same operations work identically in test/data and real project
 * 4. Systematic verification of create → verify → remove → cleanup
 */
describe('📖 Systematic Test Story', () => {
  const testDataDir = path.join(__dirname, 'data');
  const testComponentName = 'StoryTestComponent';
  const testVersion = '0.1.0.0';

  describe('🧪 Part 1: Operations in test/data', () => {
    let component: DefaultWeb4TSComponent;

    beforeAll(async () => {
      // Clean slate
      if (existsSync(testDataDir)) {
        await fs.rm(testDataDir, { recursive: true, force: true });
      }
      await fs.mkdir(testDataDir, { recursive: true });
    });

    beforeEach(() => {
      component = new DefaultWeb4TSComponent();
      // TEST controls environment, component just uses it
      component.setTargetDirectory(testDataDir);
    });

    afterAll(async () => {
      // Clean up test environment
      if (existsSync(testDataDir)) {
        await fs.rm(testDataDir, { recursive: true, force: true });
      }
    });

    it('Story 1: Create component in test/data', async () => {
      console.log('\n📖 Story 1: Creating component in test/data...');
      
      await component.create(testComponentName, testVersion, 'all');
      
      const componentPath = path.join(testDataDir, 'components', testComponentName, testVersion);
      expect(existsSync(componentPath)).toBe(true);
      
      console.log(`✅ Component created at: ${componentPath}`);
    });

    it('Story 2: Verify created component structure', async () => {
      console.log('\n📖 Story 2: Verifying component structure...');
      
      // Recreate for this test
      await component.create(testComponentName, testVersion, 'all');
      
      const componentPath = path.join(testDataDir, 'components', testComponentName, testVersion);
      const structure = {
        'package.json': path.join(componentPath, 'package.json'),
        'tsconfig.json': path.join(componentPath, 'tsconfig.json'),
        'vitest.config.ts': path.join(componentPath, 'vitest.config.ts'),
        'src/ts/layer2': path.join(componentPath, 'src/ts/layer2'),
        'src/ts/layer3': path.join(componentPath, 'src/ts/layer3'),
        'src/ts/layer5': path.join(componentPath, 'src/ts/layer5'),
        'src/sh': path.join(componentPath, 'src/sh'),
        'test': path.join(componentPath, 'test')
      };

      for (const [name, filePath] of Object.entries(structure)) {
        expect(existsSync(filePath), `${name} should exist`).toBe(true);
        console.log(`   ✅ ${name}`);
      }
      
      console.log('✅ All structure verified');
    });

    it('Story 3: Test component removal in test/data', async () => {
      console.log('\n📖 Story 3: Testing component removal...');
      
      // Create first
      await component.create(testComponentName, testVersion, 'all');
      const componentPath = path.join(testDataDir, 'components', testComponentName, testVersion);
      expect(existsSync(componentPath)).toBe(true);
      
      // Now remove
      await component.removeComponent(testComponentName);
      
      const componentDir = path.join(testDataDir, 'components', testComponentName);
      expect(existsSync(componentDir)).toBe(false);
      
      console.log('✅ Component removed successfully');
    });

    it('Story 4: Verify removal cleanup (files + symlinks)', async () => {
      console.log('\n📖 Story 4: Verifying removal cleanup...');
      
      // Create component with version
      await component.create(testComponentName, testVersion, 'all');
      
      // Create a second version
      await component.on(testComponentName, testVersion);
      await component.upgrade('nextBuild');
      
      const componentDir = path.join(testDataDir, 'components', testComponentName);
      
      // Verify we have multiple versions
      const versions = await fs.readdir(componentDir);
      const versionDirs = versions.filter(v => v.match(/^\d+\.\d+\.\d+\.\d+$/));
      expect(versionDirs.length).toBeGreaterThan(0);
      console.log(`   Found ${versionDirs.length} versions: ${versionDirs.join(', ')}`);
      
      // Remove entire component
      await component.removeComponent(testComponentName);
      
      // Verify complete cleanup
      expect(existsSync(componentDir)).toBe(false);
      
      // Verify no script symlinks remain
      const scriptsDir = path.join(testDataDir, 'scripts');
      const versionsDir = path.join(scriptsDir, 'versions');
      
      // Check main scripts directory for main symlink (e.g., scripts/storytestcomponent)
      if (existsSync(scriptsDir)) {
        const scripts = await fs.readdir(scriptsDir);
        const mainScripts = scripts.filter(s => s === testComponentName.toLowerCase());
        expect(mainScripts.length).toBe(0);
        console.log(`   ✅ No main script symlink in scripts/ (checked: ${testComponentName.toLowerCase()})`);
      }
      
      // Check versions directory for version-specific symlinks
      if (existsSync(versionsDir)) {
        const versionScripts = await fs.readdir(versionsDir);
        const componentVersionScripts = versionScripts.filter(s => s.includes(testComponentName.toLowerCase()));
        expect(componentVersionScripts.length).toBe(0);
        console.log(`   ✅ No version symlinks in scripts/versions/`);
      }
      
      console.log('✅ Complete cleanup verified');
    });
  });

  describe('🏭 Part 2: Operations in Real Project (Automated)', () => {
    const projectRoot = path.join(__dirname, '..', '..', '..', '..');
    let component: DefaultWeb4TSComponent;

    beforeEach(() => {
      component = new DefaultWeb4TSComponent();
      // Component already defaults to real project root
    });

    afterAll(async () => {
      // Clean up test component if it exists
      const testComponentDir = path.join(projectRoot, 'components', 'RealTestComponent');
      if (existsSync(testComponentDir)) {
        await fs.rm(testComponentDir, { recursive: true, force: true });
      }
      
      // Clean up script symlinks
      const scriptsDir = path.join(projectRoot, 'scripts', 'versions');
      if (existsSync(scriptsDir)) {
        const files = await fs.readdir(scriptsDir);
        for (const file of files) {
          if (file.includes('realtestcomponent')) {
            await fs.unlink(path.join(scriptsDir, file));
          }
        }
      }
    });

    it('Story 5: Create component in real project', async () => {
      console.log('\n📖 Story 5: Creating component in real project...');
      
      await component.create('RealTestComponent', '0.1.0.0', 'all');
      
      const componentPath = path.join(projectRoot, 'components', 'RealTestComponent', '0.1.0.0');
      expect(existsSync(componentPath)).toBe(true);
      
      console.log(`✅ Component created at: ${componentPath}`);
      console.log(`   Manual equivalent: ./web4tscomponent create RealTestComponent 0.1.0.0 all`);
    });

    it('Story 6: Verify real component structure', async () => {
      console.log('\n📖 Story 6: Verifying real component structure...');
      
      const componentPath = path.join(projectRoot, 'components', 'RealTestComponent', '0.1.0.0');
      
      // Check structure (same checks as Story 2)
      const structure = {
        'package.json': path.join(componentPath, 'package.json'),
        'tsconfig.json': path.join(componentPath, 'tsconfig.json'),
        'vitest.config.ts': path.join(componentPath, 'vitest.config.ts'),
        'src/ts/layer2': path.join(componentPath, 'src/ts/layer2'),
        'src/sh': path.join(componentPath, 'src/sh'),
        'CLI script': path.join(componentPath, 'realtestcomponent')
      };

      for (const [name, filePath] of Object.entries(structure)) {
        expect(existsSync(filePath), `${name} should exist`).toBe(true);
        console.log(`   ✅ ${name}`);
      }
      
      // Check script symlinks
      const versionsDir = path.join(projectRoot, 'scripts', 'versions');
      const scriptsDir = path.join(projectRoot, 'scripts');
      const versionSymlink = path.join(versionsDir, 'realtestcomponent-v0.1.0.0');
      const mainSymlink = path.join(scriptsDir, 'realtestcomponent');
      
      expect(existsSync(versionSymlink), 'Version script symlink should exist').toBe(true);
      expect(existsSync(mainSymlink), 'Main script symlink should exist').toBe(true);
      console.log('   ✅ Script symlinks created');
      
      console.log('✅ Structure matches test/data component');
      console.log(`   Manual equivalent: ls -la components/RealTestComponent/0.1.0.0`);
    });

    it('Story 7: Remove component from real project', async () => {
      console.log('\n📖 Story 7: Removing component from real project...');
      
      const componentPath = path.join(projectRoot, 'components', 'RealTestComponent');
      expect(existsSync(componentPath)).toBe(true);
      
      await component.removeComponent('RealTestComponent');
      
      expect(existsSync(componentPath)).toBe(false);
      console.log('✅ Component removed');
      console.log(`   Manual equivalent: ./web4tscomponent removeComponent RealTestComponent`);
    });

    it('Story 8: Verify real removal cleanup', async () => {
      console.log('\n📖 Story 8: Verifying complete cleanup...');
      
      // Component directory should not exist
      const componentPath = path.join(projectRoot, 'components', 'RealTestComponent');
      expect(existsSync(componentPath)).toBe(false);
      console.log('   ✅ Component directory removed');
      
      // Script symlinks should not exist
      const scriptsDir = path.join(projectRoot, 'scripts', 'versions');
      if (existsSync(scriptsDir)) {
        const files = await fs.readdir(scriptsDir);
        const remainingSymlinks = files.filter(f => f.includes('realtestcomponent'));
        expect(remainingSymlinks.length).toBe(0);
        console.log('   ✅ Script symlinks removed');
      }
      
      console.log('✅ Complete cleanup verified');
      console.log(`   Manual equivalent: ls components/RealTestComponent 2>/dev/null || echo OK`);
      console.log(`                      ls scripts/versions/ | grep realtestcomponent || echo OK`);
    });
  });

  describe('🔧 Part 3: Architecture Fix', () => {
    it('Story 11: Verify test detection uses model (not ENV/globals)', async () => {
      console.log('\n📖 Story 11: Checking test environment detection...');
      
      const componentFile = path.join(__dirname, '..', 'src', 'ts', 'layer2', 'DefaultWeb4TSComponent.ts');
      const content = await fs.readFile(componentFile, 'utf-8');
      
      // Check if isTestEnvironment uses model.targetDirectory (good) or ENV/process (bad)
      const testEnvMethodMatch = content.match(/private isTestEnvironment\(\)[\s\S]{0,200}?{[\s\S]{0,200}?}/);
      
      if (testEnvMethodMatch) {
        const methodBody = testEnvMethodMatch[0];
        const usesModel = methodBody.includes('this.model.targetDirectory');
        const usesEnv = methodBody.includes('process.env') || methodBody.includes('process.cwd()');
        
        if (usesModel && !usesEnv) {
          console.log('✅ isTestEnvironment() uses model state (Web4 OOP compliant)');
          console.log('   Uses: this.model.targetDirectory.includes(\'/test/data\')');
          expect(usesModel).toBe(true);
          expect(usesEnv).toBe(false);
        } else {
          console.log('❌ FAIL: isTestEnvironment() uses forbidden ENV/globals');
          expect(usesModel).toBe(true);
          expect(usesEnv).toBe(false);
        }
      } else {
        console.log('✅ No isTestEnvironment() method found - even better!');
      }
    });

    it('Story 12: All operations work without test mode detection', async () => {
      console.log('\n📖 Story 12: Verifying operations work correctly...');
      
      const component = new DefaultWeb4TSComponent();
      component.setTargetDirectory(testDataDir);
      
      // Create component
      await component.create(testComponentName, testVersion, 'all');
      const componentPath = path.join(testDataDir, 'components', testComponentName, testVersion);
      expect(existsSync(componentPath)).toBe(true);
      console.log('   ✅ Create works');
      
      // Remove component
      await component.removeComponent(testComponentName);
      const componentDir = path.join(testDataDir, 'components', testComponentName);
      expect(existsSync(componentDir)).toBe(false);
      console.log('   ✅ Remove works');
      
      console.log('✅ All operations work correctly with setTargetDirectory()');
    });
  });

  describe('🧹 Part 5: removeVersion Bug Fix', () => {
    const projectRoot = path.join(__dirname, '..', '..', '..', '..');
    let component: DefaultWeb4TSComponent;

    beforeEach(() => {
      component = new DefaultWeb4TSComponent();
    });

    afterAll(async () => {
      // Clean up test component
      const testComponentDir = path.join(projectRoot, 'components', 'RemoveVersionTestComponent');
      if (existsSync(testComponentDir)) {
        await fs.rm(testComponentDir, { recursive: true, force: true });
      }
      
      // Clean up script symlinks
      const scriptsDir = path.join(projectRoot, 'scripts', 'versions');
      if (existsSync(scriptsDir)) {
        const files = await fs.readdir(scriptsDir);
        for (const file of files) {
          if (file.includes('removeversiontestcomponent')) {
            await fs.unlink(path.join(scriptsDir, file));
          }
        }
      }
    });

    it('Story 13: removeVersion should clean up script symlinks', async () => {
      console.log('\n📖 Story 13: Testing removeVersion script cleanup...');
      
      // Create component with 2 versions
      console.log('=== Creating component with version 0.1.0.0 ===');
      await component.create('RemoveVersionTestComponent', '0.1.0.0', 'all');
      
      console.log('=== Creating version 0.1.0.1 ===');
      await component.on('RemoveVersionTestComponent', '0.1.0.0');
      await component.upgrade('nextBuild');
      
      const versionsDir = path.join(projectRoot, 'scripts', 'versions');
      const scriptsDir = path.join(projectRoot, 'scripts');
      
      // Verify both versions have symlinks
      const v0Symlink = path.join(versionsDir, 'removeversiontestcomponent-v0.1.0.0');
      const v1Symlink = path.join(versionsDir, 'removeversiontestcomponent-v0.1.0.1');
      const mainSymlink = path.join(scriptsDir, 'removeversiontestcomponent');
      
      expect(existsSync(v0Symlink), 'v0.1.0.0 symlink should exist').toBe(true);
      expect(existsSync(v1Symlink), 'v0.1.0.1 symlink should exist').toBe(true);
      expect(existsSync(mainSymlink), 'Main symlink should exist').toBe(true);
      console.log('   ✅ All symlinks created');
      
      // Remove version 0.1.0.0
      console.log('=== Removing version 0.1.0.0 ===');
      await component.removeVersion('RemoveVersionTestComponent', '0.1.0.0');
      
      // Verify v0.1.0.0 symlink removed
      expect(existsSync(v0Symlink), 'v0.1.0.0 symlink should be removed').toBe(false);
      console.log('   ✅ Version-specific symlink removed');
      
      // Verify v0.1.0.1 and main still exist
      expect(existsSync(v1Symlink), 'v0.1.0.1 symlink should still exist').toBe(true);
      expect(existsSync(mainSymlink), 'Main symlink should still exist').toBe(true);
      console.log('   ✅ Other symlinks preserved');
      
      console.log('✅ removeVersion correctly cleans up script symlinks');
      console.log(`   Manual equivalent: ./web4tscomponent removeVersion RemoveVersionTestComponent 0.1.0.0`);
    });
  });

  describe('🔗 Part 6: Location Independence', () => {
    const projectRoot = path.join(__dirname, '..', '..', '..', '..');
    
    // Dynamically discover the current version from package.json
    const currentVersion = (() => {
      const packageJsonPath = path.join(__dirname, '..', 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      return packageJson.version;
    })();

    it('Story 14: CLI works from component directory', async () => {
      console.log('\n📖 Story 14: Testing CLI from component directory...');
      console.log(`   Testing version: ${currentVersion}`);
      
      const componentDir = path.join(projectRoot, 'components', 'Web4TSComponent', currentVersion);
      const result = await new Promise<{stdout: string, stderr: string, code: number}>((resolve) => {
        const proc = require('child_process').spawn('./web4tscomponent', [], {
          cwd: componentDir,
          shell: true
        });
        let stdout = '';
        let stderr = '';
        proc.stdout?.on('data', (data: Buffer) => stdout += data.toString());
        proc.stderr?.on('data', (data: Buffer) => stderr += data.toString());
        proc.on('close', (code: number) => resolve({stdout, stderr, code}));
      });
      
      expect(result.code).toBe(0);
      expect(result.stdout).toContain('Web4TSComponent CLI Tool');
      expect(result.stdout).toContain(currentVersion);
      console.log('   ✅ CLI works from component directory');
      console.log(`   Manual: cd components/Web4TSComponent/${currentVersion} && ./web4tscomponent`);
    });

    it('Story 15: CLI works via scripts/web4tscomponent symlink', async () => {
      console.log('\n📖 Story 15: Testing CLI via scripts/web4tscomponent...');
      
      // scripts/web4tscomponent points to latest → highest version (0.3.5.1)
      const latestLink = path.join(projectRoot, 'components', 'Web4TSComponent', 'latest');
      const latestTarget = readlinkSync(latestLink);
      console.log(`   scripts/web4tscomponent → latest → ${latestTarget}`);
      console.log(`   Testing that CLI executes successfully from latest version`);
      
      const result = await new Promise<{stdout: string, stderr: string, code: number}>((resolve) => {
        const proc = require('child_process').spawn('./scripts/web4tscomponent', [], {
          cwd: projectRoot,
          shell: true
        });
        let stdout = '';
        let stderr = '';
        proc.stdout?.on('data', (data: Buffer) => stdout += data.toString());
        proc.stderr?.on('data', (data: Buffer) => stderr += data.toString());
        proc.on('close', (code: number) => resolve({stdout, stderr, code}));
      });
      
      expect(result.code).toBe(0);
      expect(result.stdout).toContain('Web4TSComponent CLI Tool');
      expect(result.stdout).toContain(latestTarget); // Should show latest version (highest)
      console.log(`   ✅ CLI works via scripts/web4tscomponent (v${latestTarget})`);
      console.log(`   Manual: ./scripts/web4tscomponent`);
    });

    it('Story 16: CLI works via scripts/versions/vX.X.X.X', async () => {
      console.log('\n📖 Story 16: Testing CLI via scripts/versions/web4tscomponent-vX.X.X.X...');
      console.log(`   Testing version: ${currentVersion}`);
      
      const versionSymlink = path.join(projectRoot, 'scripts', 'versions', `web4tscomponent-v${currentVersion}`);
      if (!existsSync(versionSymlink)) {
        console.log(`   ⚠️  Skipping: scripts/versions/web4tscomponent-v${currentVersion} does not exist`);
        return;
      }
      
      const result = await new Promise<{stdout: string, stderr: string, code: number}>((resolve) => {
        const proc = require('child_process').spawn(`./scripts/versions/web4tscomponent-v${currentVersion}`, [], {
          cwd: projectRoot,
          shell: true
        });
        let stdout = '';
        let stderr = '';
        proc.stdout?.on('data', (data: Buffer) => stdout += data.toString());
        proc.stderr?.on('data', (data: Buffer) => stderr += data.toString());
        proc.on('close', (code: number) => resolve({stdout, stderr, code}));
      });
      
      expect(result.code).toBe(0);
      expect(result.stdout).toContain('Web4TSComponent CLI Tool');
      expect(result.stdout).toContain(currentVersion);
      console.log(`   ✅ CLI works via scripts/versions/web4tscomponent-v${currentVersion}`);
      console.log(`   Manual: ./scripts/versions/web4tscomponent-v${currentVersion}`);
    });

    it('Story 17: CLI works via latest symlink', async () => {
      console.log('\n📖 Story 17: Testing CLI via latest symlink...');
      
      // Verify latest points to currentVersion
      const latestLink = path.join(projectRoot, 'components', 'Web4TSComponent', 'latest');
      const latestTarget = readlinkSync(latestLink);
      console.log(`   Latest symlink points to: ${latestTarget}`);
      
      const result = await new Promise<{stdout: string, stderr: string, code: number}>((resolve) => {
        const proc = require('child_process').spawn('./components/Web4TSComponent/latest/web4tscomponent', [], {
          cwd: projectRoot,
          shell: true
        });
        let stdout = '';
        let stderr = '';
        proc.stdout?.on('data', (data: Buffer) => stdout += data.toString());
        proc.stderr?.on('data', (data: Buffer) => stderr += data.toString());
        proc.on('close', (code: number) => resolve({stdout, stderr, code}));
      });
      
      expect(result.code).toBe(0);
      expect(result.stdout).toContain('Web4TSComponent CLI Tool');
      expect(result.stdout).toContain(latestTarget);
      console.log('   ✅ CLI works via latest symlink');
      console.log(`   Manual: ./components/Web4TSComponent/latest/web4tscomponent`);
    });
  });

  describe('🚀 Part 7: Version Promotion', () => {
    let component: DefaultWeb4TSComponent;
    const testComponentName = 'UpgradeTestComponent';
    const initialVersion = '0.1.0.0';

    beforeEach(async () => {
      // Clean up from previous runs
      const testCompDir = path.join(testDataDir, 'components', testComponentName);
      if (existsSync(testCompDir)) {
        rmSync(testCompDir, { recursive: true, force: true });
      }
      
      // Initialize component
      component = new DefaultWeb4TSComponent();
      component.setTargetDirectory(testDataDir);
    });

    afterEach(async () => {
      // Clean up after test
      const testCompDir = path.join(testDataDir, 'components', testComponentName);
      if (existsSync(testCompDir)) {
        rmSync(testCompDir, { recursive: true, force: true });
      }
    });

    it('Story 9: Test version upgrade (nextBuild)', async () => {
      console.log('\n📖 Story 9: Testing version upgrade...');
      
      // Create initial component
      await component.create(testComponentName, initialVersion, 'all');
      
      // Set context and upgrade
      await component.on(testComponentName, initialVersion);
      await component.upgrade('nextBuild');
      
      // Verify new version was created
      const newVersion = '0.1.0.1';
      const newVersionDir = path.join(testDataDir, 'components', testComponentName, newVersion);
      expect(existsSync(newVersionDir)).toBe(true);
      console.log(`✅ New version created: ${newVersion}`);
      
      // Verify package.json was updated
      const newPackageJson = JSON.parse(
        readFileSync(path.join(newVersionDir, 'package.json'), 'utf-8')
      );
      expect(newPackageJson.version).toBe(newVersion);
      console.log(`✅ package.json version updated to ${newVersion}`);
      
      console.log(`\n💡 Manual test command:`);
      console.log(`   cd components/Web4TSComponent/0.3.4.1`);
      console.log(`   web4tscomponent on ${testComponentName} ${initialVersion}`);
      console.log(`   web4tscomponent upgrade nextBuild`);
    });

    it('Story 10: Verify semantic link creation', async () => {
      console.log('\n📖 Story 10: Testing semantic link creation...');
      
      // Create component with two versions
      await component.create(testComponentName, initialVersion, 'all');
      await component.on(testComponentName, initialVersion);
      await component.upgrade('nextBuild');
      
      const devVersion = '0.1.0.1';
      
      // Set dev link
      await component.setDev(devVersion);
      
      // Verify dev symlink exists and points to correct version
      const devLink = path.join(testDataDir, 'components', testComponentName, 'dev');
      expect(existsSync(devLink)).toBe(true);
      
      const linkTarget = readlinkSync(devLink);
      expect(linkTarget).toBe(devVersion);
      console.log(`✅ dev symlink → ${linkTarget}`);
      
      // Set test link
      await component.setTest(devVersion);
      const testLink = path.join(testDataDir, 'components', testComponentName, 'test');
      expect(existsSync(testLink)).toBe(true);
      expect(readlinkSync(testLink)).toBe(devVersion);
      console.log(`✅ test symlink → ${devVersion}`);
      
      // Set prod link
      await component.setProd(devVersion);
      const prodLink = path.join(testDataDir, 'components', testComponentName, 'prod');
      expect(existsSync(prodLink)).toBe(true);
      expect(readlinkSync(prodLink)).toBe(devVersion);
      console.log(`✅ prod symlink → ${devVersion}`);
      
      // Verify latest was updated by upgrade
      const latestLink = path.join(testDataDir, 'components', testComponentName, 'latest');
      expect(existsSync(latestLink)).toBe(true);
      expect(readlinkSync(latestLink)).toBe(devVersion);
      console.log(`✅ latest symlink → ${devVersion}`);
      
      console.log(`\n💡 Manual test command:`);
      console.log(`   cd components/Web4TSComponent/0.3.4.1`);
      console.log(`   web4tscomponent on ${testComponentName} 0.1.0.0`);
      console.log(`   web4tscomponent setDev 0.1.0.1`);
      console.log(`   web4tscomponent setTest 0.1.0.1`);
      console.log(`   web4tscomponent setProd 0.1.0.1`);
    });
  });
});

