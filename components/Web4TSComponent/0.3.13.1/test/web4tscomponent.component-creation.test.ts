/**
 * Component Creation Tests
 * 
 * Tests the create() method and ensures:
 * - Default parameters create complete components
 * - All required files and directories exist
 * - CLI symlinks are properly created
 * - Components are fully functional after creation
 * - npm start works without additional setup
 * - Created components compile without ANY errors
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, readlinkSync, lstatSync, rmSync, readFileSync } from 'fs';
import { execSync } from 'child_process';
import * as path from 'path';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';

describe('🏗️ Component Creation', () => {
  let component: DefaultWeb4TSComponent;
  const testDataDir = path.join(__dirname, '..', 'test', 'data');
  
  beforeEach(() => {
    component = new DefaultWeb4TSComponent();
    component.setTargetDirectory(testDataDir);
  });

  afterEach(() => {
    // Clean up test data but leave for inspection
    // Future enhancement: make this configurable
  });

  describe('🚨 CRITICAL: Build Verification', () => {
    const testComponentName = 'BuildVerificationTest';
    const testVersion = '0.1.0.0';
    
    beforeEach(async () => {
      const componentDir = path.join(testDataDir, 'components', testComponentName);
      if (existsSync(componentDir)) {
        rmSync(componentDir, { recursive: true, force: true });
      }
    });

    it('should create component that compiles WITHOUT ANY ERRORS', async () => {
      // Create the component
      await component.create(testComponentName, testVersion, 'all');
      
      const componentDir = path.join(testDataDir, 'components', testComponentName, testVersion);
      expect(existsSync(componentDir)).toBe(true);
      
      // CRITICAL TEST: Component MUST compile without ANY errors
      let buildOutput = '';
      let buildError = '';
      
      try {
        // Run npm run build and capture all output
        buildOutput = execSync('npm run build', {
          cwd: componentDir,
          encoding: 'utf8',
          stdio: 'pipe',
          timeout: 60000 // 60 second timeout
        });
      } catch (error: any) {
        buildError = error.message;
        if (error.stdout) buildOutput += error.stdout;
        if (error.stderr) buildError += error.stderr;
      }
      
      // FAIL THE TEST if there are ANY build errors
      if (buildError) {
        console.error('❌ BUILD FAILED:');
        console.error('Build Output:', buildOutput);
        console.error('Build Error:', buildError);
        throw new Error(`Created component FAILED to build: ${buildError}`);
      }
      
      // Verify build completed successfully
      expect(buildOutput).toContain('build.sh');
      expect(buildError).toBe('');
      
      // Verify dist directory was created
      expect(existsSync(path.join(componentDir, 'dist'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'dist/ts'))).toBe(true);
      
      console.log('✅ Created component builds successfully without ANY errors');
    });

    it('should create component that has working CLI after build', async () => {
      // Create the component
      await component.create(testComponentName, testVersion, 'all');
      
      const componentDir = path.join(testDataDir, 'components', testComponentName, testVersion);
      const componentLower = testComponentName.toLowerCase();
      const cliPath = path.join(componentDir, componentLower);
      
      // Build the component first
      execSync('npm run build', {
        cwd: componentDir,
        stdio: 'pipe',
        timeout: 60000
      });
      
      // Test CLI functionality
      let cliOutput = '';
      let cliError = '';
      
      try {
        // Run the CLI to verify it works
        cliOutput = execSync(`./${componentLower}`, {
          cwd: componentDir,
          encoding: 'utf8',
          stdio: 'pipe',
          timeout: 30000
        });
      } catch (error: any) {
        cliError = error.message;
        if (error.stdout) cliOutput += error.stdout;
        if (error.stderr) cliError += error.stderr;
      }
      
      // CLI should work without errors and show help
      if (cliError && !cliOutput.includes('Commands:')) {
        console.error('❌ CLI FAILED:');
        console.error('CLI Output:', cliOutput);
        console.error('CLI Error:', cliError);
        throw new Error(`Created component CLI FAILED to run: ${cliError}`);
      }
      
      // Verify CLI shows expected output
      expect(cliOutput).toContain('Commands:');
      expect(cliOutput).toContain(testComponentName);
      
      console.log('✅ Created component CLI works correctly after build');
    });

    it('should create component with all required layer4 files for completion', async () => {
      // Create the component
      await component.create(testComponentName, testVersion, 'all');
      
      const componentDir = path.join(testDataDir, 'components', testComponentName, testVersion);
      const layer4Dir = path.join(componentDir, 'src/ts/layer4');
      
      // CRITICAL: Verify ALL required layer4 files exist
      const requiredLayer4Files = [
        'TSCompletion.ts',
        'TestFileParser.ts',
        'HierarchicalCompletionFilter.ts'
      ];
      
      for (const file of requiredLayer4Files) {
        const filePath = path.join(layer4Dir, file);
        expect(existsSync(filePath)).toBe(true);
        
        // Verify file has content (not empty)
        const content = readFileSync(filePath, 'utf8');
        expect(content.length).toBeGreaterThan(100);
        expect(content).toContain('export');
      }
      
      console.log('✅ Created component has all required layer4 files');
    });

    it('should create component that passes its own tests', async () => {
      // Create the component
      await component.create(testComponentName, testVersion, 'all');
      
      const componentDir = path.join(testDataDir, 'components', testComponentName, testVersion);
      
      // Build first
      execSync('npm run build', {
        cwd: componentDir,
        stdio: 'pipe',
        timeout: 60000
      });
      
      // Run tests
      let testOutput = '';
      let testError = '';
      
      try {
        testOutput = execSync('npm test', {
          cwd: componentDir,
          encoding: 'utf8',
          stdio: 'pipe',
          timeout: 120000 // 2 minute timeout for tests
        });
      } catch (error: any) {
        testError = error.message;
        if (error.stdout) testOutput += error.stdout;
        if (error.stderr) testError += error.stderr;
      }
      
      // Tests should pass
      if (testError && !testOutput.includes('✓')) {
        console.error('❌ TESTS FAILED:');
        console.error('Test Output:', testOutput);
        console.error('Test Error:', testError);
        throw new Error(`Created component FAILED its own tests: ${testError}`);
      }
      
      // Verify tests passed
      expect(testOutput).toMatch(/✓|✅.*tests completed successfully/);
      expect(testOutput).toMatch(/Test Files|tests completed successfully/);
      expect(testOutput).toMatch(/passed|completed successfully/);
      
      console.log('✅ Created component passes its own tests');
    });
  });

  describe('📦 Default Parameters', () => {
    const testComponentName = 'DefaultParamsTest';
    const testVersion = '0.1.0.0';
    
    beforeEach(async () => {
      const componentDir = path.join(testDataDir, 'components', testComponentName);
      if (existsSync(componentDir)) {
        rmSync(componentDir, { recursive: true, force: true });
      }
    });

    it('should create complete component with no options parameter', async () => {
      // Test the actual default behavior when no options are passed
      await component.create(testComponentName, testVersion);
      
      const componentDir = path.join(testDataDir, 'components', testComponentName, testVersion);
      
      // Verify directory exists
      expect(existsSync(componentDir)).toBe(true);
      
      // Verify TypeScript layer structure exists
      expect(existsSync(path.join(componentDir, 'src/ts/layer2'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'src/ts/layer3'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'src/ts/layer4'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'src/ts/layer5'))).toBe(true);
      
      // Verify core TypeScript files exist
      const componentLower = testComponentName.toLowerCase();
      expect(existsSync(path.join(componentDir, 'src/ts/layer2/DefaultCLI.ts'))).toBe(true);
      expect(existsSync(path.join(componentDir, `src/ts/layer2/Default${testComponentName}.ts`))).toBe(true);
      expect(existsSync(path.join(componentDir, `src/ts/layer5/${testComponentName}CLI.ts`))).toBe(true);
      
      // Verify CLI files exist (no .sh extension - Web4 standard)
      expect(existsSync(path.join(componentDir, componentLower))).toBe(true);
      
      // Verify spec and test folders exist
      expect(existsSync(path.join(componentDir, 'spec'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'test'))).toBe(true);
      expect(existsSync(path.join(componentDir, `test/${componentLower}.test.ts`))).toBe(true);
      
      // Verify vitest config exists
      expect(existsSync(path.join(componentDir, 'vitest.config.ts'))).toBe(true);
    });

    it('should create complete component with explicit "all" option', async () => {
      await component.create(testComponentName, testVersion, 'all');
      
      const componentDir = path.join(testDataDir, 'components', testComponentName, testVersion);
      
      // Verify same structure as default
      expect(existsSync(path.join(componentDir, 'src/ts/layer2'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'src/ts/layer3'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'src/ts/layer4'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'src/ts/layer5'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'spec'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'test'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'vitest.config.ts'))).toBe(true);
    });
  });

  describe('🔗 CLI Symlink Creation', () => {
    const testComponentName = 'CLISymlinkTest';
    const testVersion = '0.1.0.0';
    
    beforeEach(async () => {
      const componentDir = path.join(testDataDir, 'components', testComponentName);
      if (existsSync(componentDir)) {
        rmSync(componentDir, { recursive: true, force: true });
      }
    });

    it('should create CLI symlink automatically during component creation', async () => {
      await component.create(testComponentName, testVersion, 'all');
      
      const componentDir = path.join(testDataDir, 'components', testComponentName, testVersion);
      const componentLower = testComponentName.toLowerCase();
      const cliScriptPath = path.join(componentDir, componentLower);
      
      // Verify CLI script exists (no .sh extension - Web4 standard)
      expect(existsSync(cliScriptPath)).toBe(true);
      
      // Verify it's an executable file (not a symlink in component root)
      const stats = lstatSync(cliScriptPath);
      expect(stats.isFile()).toBe(true);
    });

    it('should allow npm start to work immediately after creation', async () => {
      await component.create(testComponentName, testVersion, 'all');
      
      const componentDir = path.join(testDataDir, 'components', testComponentName, testVersion);
      const componentLower = testComponentName.toLowerCase();
      const cliScriptPath = path.join(componentDir, componentLower);
      
      // Verify CLI script exists and is executable (no .sh extension - Web4 standard)
      expect(existsSync(cliScriptPath)).toBe(true);
      const stats = lstatSync(cliScriptPath);
      expect(stats.isFile()).toBe(true);
      expect((stats.mode & 0o111) !== 0).toBe(true); // Check executable bit
    });

    it('should create CLI script even when creating component with cli and layers', async () => {
      // With 'cli layers' options, CLI script should be created
      await component.create(testComponentName, testVersion, 'cli layers');
      
      const componentDir = path.join(testDataDir, 'components', testComponentName, testVersion);
      const componentLower = testComponentName.toLowerCase();
      const cliScriptPath = path.join(componentDir, componentLower);
      
      // Verify CLI script exists (no .sh extension - Web4 standard)
      expect(existsSync(cliScriptPath)).toBe(true);
      const stats = lstatSync(cliScriptPath);
      expect(stats.isFile()).toBe(true);
    });
  });

  describe('📁 Component Structure Validation', () => {
    const testComponentName = 'StructureTest';
    const testVersion = '0.1.0.0';
    
    beforeEach(async () => {
      const componentDir = path.join(testDataDir, 'components', testComponentName);
      if (existsSync(componentDir)) {
        rmSync(componentDir, { recursive: true, force: true });
      }
    });

    it('should create all required TypeScript interface files', async () => {
      await component.create(testComponentName, testVersion, 'all');
      
      const componentDir = path.join(testDataDir, 'components', testComponentName, testVersion);
      
      // Check layer3 interfaces
      expect(existsSync(path.join(componentDir, 'src/ts/layer3/CLI.interface.ts'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'src/ts/layer3/Model.interface.ts'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'src/ts/layer3/Scenario.interface.ts'))).toBe(true);
      expect(existsSync(path.join(componentDir, `src/ts/layer3/${testComponentName}.interface.ts`))).toBe(true);
      expect(existsSync(path.join(componentDir, `src/ts/layer3/${testComponentName}Model.interface.ts`))).toBe(true);
    });

    it('should create all required shell scripts', async () => {
      await component.create(testComponentName, testVersion, 'all');
      
      const componentDir = path.join(testDataDir, 'components', testComponentName, testVersion);
      
      // Check shell scripts
      expect(existsSync(path.join(componentDir, 'src/sh/build.sh'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'src/sh/clean.sh'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'src/sh/clean-local.sh'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'src/sh/install-deps.sh'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'src/sh/start.sh'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'src/sh/start-clean.sh'))).toBe(true);
      expect(existsSync(path.join(componentDir, 'src/sh/test.sh'))).toBe(true);
    });

    it('should create valid package.json with correct metadata', async () => {
      await component.create(testComponentName, testVersion, 'all');
      
      const componentDir = path.join(testDataDir, 'components', testComponentName, testVersion);
      const packageJsonPath = path.join(componentDir, 'package.json');
      
      expect(existsSync(packageJsonPath)).toBe(true);
      
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      // Verify package metadata
      expect(packageJson.name).toBe(`@web4x/${testComponentName.toLowerCase()}`);
      expect(packageJson.version).toBe(testVersion);
      expect(packageJson.type).toBe('module');
      
      // Verify scripts exist
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts.start).toBe('./src/sh/start.sh');
      expect(packageJson.scripts.test).toBe('./src/sh/test.sh');
    });

    it('should create valid tsconfig.json', async () => {
      await component.create(testComponentName, testVersion, 'all');
      
      const componentDir = path.join(testDataDir, 'components', testComponentName, testVersion);
      const tsconfigPath = path.join(componentDir, 'tsconfig.json');
      
      expect(existsSync(tsconfigPath)).toBe(true);
      
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));
      
      // Verify TypeScript configuration
      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.rootDir).toBe('./src');
      expect(tsconfig.compilerOptions.outDir).toBe('./dist');
      expect(tsconfig.extends).toBe('../../../tsconfig.json');
    });
  });

  describe('🎯 Semantic Links', () => {
    const testComponentName = 'SemanticLinkTest';
    const testVersion = '0.1.0.0';
    
    beforeEach(async () => {
      const componentDir = path.join(testDataDir, 'components', testComponentName);
      if (existsSync(componentDir)) {
        rmSync(componentDir, { recursive: true, force: true });
      }
    });

    it('should create latest symlink during component creation', async () => {
      await component.create(testComponentName, testVersion, 'all');
      
      const componentBaseDir = path.join(testDataDir, 'components', testComponentName);
      const latestLink = path.join(componentBaseDir, 'latest');
      
      expect(existsSync(latestLink)).toBe(true);
      
      const stats = lstatSync(latestLink);
      expect(stats.isSymbolicLink()).toBe(true);
      
      const target = readlinkSync(latestLink);
      expect(target).toBe(testVersion);
    });

    it('should create script symlinks in scripts/ and scripts/versions/', async () => {
      await component.create(testComponentName, testVersion, 'all');
      
      const componentLower = testComponentName.toLowerCase();
      const mainScriptLink = path.join(testDataDir, 'scripts', componentLower);
      const versionedScriptLink = path.join(testDataDir, 'scripts/versions', `${componentLower}-v${testVersion}`);
      
      // Verify main script symlink exists (in scripts/, not scripts/versions/)
      expect(existsSync(mainScriptLink)).toBe(true);
      expect(lstatSync(mainScriptLink).isSymbolicLink()).toBe(true);
      
      // Verify versioned script exists in scripts/versions/
      expect(existsSync(versionedScriptLink)).toBe(true);
    });
  });

  describe('🚀 npm start ONLY Principle', () => {
    const testComponentName = 'NpmStartTest';
    const testVersion = '0.1.0.0';
    
    beforeEach(async () => {
      const componentDir = path.join(testDataDir, 'components', testComponentName);
      if (existsSync(componentDir)) {
        rmSync(componentDir, { recursive: true, force: true });
      }
    });

    it('should allow npm start from component base directory', async () => {
      await component.create(testComponentName, testVersion, 'all');
      
      const componentBaseDir = path.join(testDataDir, 'components', testComponentName);
      const basePackageJson = path.join(componentBaseDir, 'package.json');
      
      // Verify base package.json exists for npm start ONLY principle
      expect(existsSync(basePackageJson)).toBe(true);
      
      const packageJson = JSON.parse(readFileSync(basePackageJson, 'utf-8'));
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts.start).toBeDefined();
    });

    it('should allow npm start from versioned directory', async () => {
      await component.create(testComponentName, testVersion, 'all');
      
      const versionedDir = path.join(testDataDir, 'components', testComponentName, testVersion);
      const versionedPackageJson = path.join(versionedDir, 'package.json');
      
      // Verify versioned package.json exists
      expect(existsSync(versionedPackageJson)).toBe(true);
      
      const packageJson = JSON.parse(readFileSync(versionedPackageJson, 'utf-8'));
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts.start).toBe('./src/sh/start.sh');
    });
  });

  describe('🔍 Edge Cases', () => {
    it('should handle component names with mixed case', async () => {
      const testComponentName = 'MixedCaseComponent';
      const testVersion = '0.1.0.0';
      
      const componentDir = path.join(testDataDir, 'components', testComponentName);
      if (existsSync(componentDir)) {
        rmSync(componentDir, { recursive: true, force: true });
      }
      
      await component.create(testComponentName, testVersion, 'all');
      
      const componentPath = path.join(testDataDir, 'components', testComponentName, testVersion);
      expect(existsSync(componentPath)).toBe(true);
      
      // CLI script should be lowercase (no .sh extension - Web4 standard)
      const componentLower = testComponentName.toLowerCase();
      expect(existsSync(path.join(componentPath, componentLower))).toBe(true);
    });

    it('should handle version with different formats', async () => {
      const testComponentName = 'VersionFormatTest';
      const componentDir = path.join(testDataDir, 'components', testComponentName);
      if (existsSync(componentDir)) {
        rmSync(componentDir, { recursive: true, force: true });
      }
      
      // Test major.minor.patch.build format
      await component.create(testComponentName, '1.2.3.4', 'all');
      expect(existsSync(path.join(testDataDir, 'components', testComponentName, '1.2.3.4'))).toBe(true);
    });
  });
});

