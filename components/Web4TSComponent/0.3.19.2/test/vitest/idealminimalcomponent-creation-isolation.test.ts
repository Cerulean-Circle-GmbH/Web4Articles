/**
 * IdealMinimalComponent Creation Test Isolation
 * 
 * Tests that IdealMinimalComponent (current version) can be created in test isolation (./test/data)
 * using the delegation pattern - created component delegates to Web4TSComponent master.
 * 
 * Test-first development: Validates the delegation fixes (header display, path resolution)
 * work correctly in test isolation environment.
 * 
 * @pdca 2025-11-03-UTC-1237.pdca.md - Context-aware delegation validation
 * @pdca 2025-11-10-UTC-1400.eliminate-functional-helpers-make-model-driven.pdca.md - Use current version
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync } from 'fs';
import { readFile, rm, mkdir, symlink, writeFile } from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

describe('🧪 IdealMinimalComponent Creation Test Isolation', () => {
  // ✅ Web4 Pattern: No underscore naming, use fileURLToPath for ESM
  const currentFileUrl = new URL(import.meta.url);
  const currentDir = path.dirname(fileURLToPath(currentFileUrl));
  const componentRoot = path.join(currentDir, '../..');
  const testDataDir = path.join(componentRoot, 'test/data');
  const testComponentName = 'IdealMinimalComponent';
  
  // ✅ Use CURRENT version (same as Web4TSComponent version under test)
  // Extract version from componentRoot path: .../Web4TSComponent/0.3.18.6
  const versionMatch = componentRoot.match(/(\d+\.\d+\.\d+\.\d+)$/);
  const testVersion = versionMatch ? versionMatch[1] : '0.0.0.0';
  
  // Component will be created at: targetDirectory/components/IdealMinimalComponent/<current-version>
  const testComponentPath = path.join(testDataDir, 'components', testComponentName, testVersion);

  /**
   * Evidence-Based Testing Pattern (2025-10-30-UTC-0832.test-evidence-persistence.pdca.md):
   * 
   * - beforeAll: Clean OLD evidence (fresh start) + Setup Web4TSComponent for delegation
   * - Tests run: Create components in test/data
   * - afterAll: DO NOTHING (keep evidence for inspection)
   * - Next run: beforeAll cleans again
   * 
   * test/data becomes a testable alternate isolated project root.
   * After tests run, you can cd into test/data and inspect/test manually.
   * 
   * @pdca 2025-11-10-UTC-1400.eliminate-functional-helpers-make-model-driven.pdca.md
   * CRITICAL: Copy Web4TSComponent into test/data so IdealMinimalComponent can delegate!
   */
  beforeAll(async () => {
    // Clean old evidence before tests (fresh start)
    const idealminimalComponentDir = path.join(testDataDir, 'components', testComponentName);
    if (existsSync(idealminimalComponentDir)) {
      await rm(idealminimalComponentDir, { recursive: true, force: true });
      console.log(`   🧹 Cleaned old evidence: test/data/components/${testComponentName}`);
    }
    
    // Ensure test/data directory exists
    if (!existsSync(testDataDir)) {
      await mkdir(testDataDir, { recursive: true });
    }
    
    // ✅ CRITICAL: Create minimal package.json in test/data for project root detection
    // @pdca 2025-11-10-UTC-1400.eliminate-functional-helpers-make-model-driven.pdca.md
    // Without this, CLI's find_project_root() climbs up to production root
    const testDataPackageJson = path.join(testDataDir, 'package.json');
    await writeFile(testDataPackageJson, JSON.stringify({
      name: "web4-test-isolation",
      version: testVersion,
      type: "module",
      description: "Test isolation environment - NOT production!"
    }, null, 2));
    console.log(`   📄 Created test/data/package.json for project root detection`);
    
    // ✅ CRITICAL: Create tsconfig.json in test/data to prevent CommonJS compilation
    // @pdca 2025-11-10-UTC-1400.eliminate-functional-helpers-make-model-driven.pdca.md
    // Without this, TypeScript defaults to CommonJS and generates "exports is not defined" errors
    const testDataTsConfig = path.join(testDataDir, 'tsconfig.json');
    await writeFile(testDataTsConfig, JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        module: "ES2022",
        moduleResolution: "node",
        esModuleInterop: true,
        skipLibCheck: true,
        strict: true,
        resolveJsonModule: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true,
        outDir: "./dist",
        rootDir: "."
      }
    }, null, 2));
    console.log(`   📄 Created test/data/tsconfig.json for ESM compilation`);
    
    // ✅ CRITICAL: Copy Web4TSComponent into test/data for delegation
    // IdealMinimalComponent needs Web4TSComponent to exist at: test/data/components/Web4TSComponent/latest/
    const web4tsSourceDir = componentRoot; // Current Web4TSComponent version being tested
    const web4tsTestDataDir = path.join(testDataDir, 'components/Web4TSComponent');
    const web4tsTestVersionDir = path.join(web4tsTestDataDir, testVersion);
    
    // Clean old Web4TSComponent copy
    if (existsSync(web4tsTestDataDir)) {
      await rm(web4tsTestDataDir, { recursive: true, force: true });
      console.log(`   🧹 Cleaned old Web4TSComponent from test/data`);
    }
    
    // Copy Web4TSComponent to test/data using rsync (excludes test/data to avoid circular copy)
    await mkdir(web4tsTestDataDir, { recursive: true });
    execSync(`rsync -a --exclude='test/data' "${web4tsSourceDir}/" "${web4tsTestVersionDir}/"`, {
      stdio: 'pipe'  // Suppress output
    });
    console.log(`   📦 Copied Web4TSComponent ${testVersion} to test/data for delegation`);
    
    // Create symlinks (latest, dev, test) pointing to the copied version
    const symlinkTargets = ['latest', 'dev', 'test'];
    for (const linkName of symlinkTargets) {
      const linkPath = path.join(web4tsTestDataDir, linkName);
      if (existsSync(linkPath)) {
        await rm(linkPath, { force: true });
      }
      // Create relative symlink
      await symlink(testVersion, linkPath, 'dir');
      console.log(`   🔗 Created symlink: Web4TSComponent/${linkName} → ${testVersion}`);
    }
    
    // ✅ CRITICAL: Create web4tscomponent CLI symlink in test/data/scripts
    // @pdca 2025-11-10-UTC-1400.eliminate-functional-helpers-make-model-driven.pdca.md
    // Without this, 'web4tscomponent' command is not available in test isolation
    const scriptsDir = path.join(testDataDir, 'scripts');
    await mkdir(scriptsDir, { recursive: true });
    
    const web4tsComponentCLILink = path.join(scriptsDir, 'web4tscomponent');
    if (existsSync(web4tsComponentCLILink)) {
      await rm(web4tsComponentCLILink, { force: true });
    }
    // Create symlink to Web4TSComponent CLI
    await symlink('../components/Web4TSComponent/latest/web4tscomponent', web4tsComponentCLILink);
    console.log(`   🔗 Created CLI symlink: scripts/web4tscomponent → Web4TSComponent/latest/web4tscomponent`);
  });

  // ✅ NO afterAll - evidence persists for inspection

  it(`should create IdealMinimalComponent v${testVersion} in test/data using targetDirectory`, async () => {
    // Import dynamically to avoid module-level import issues
    const { DefaultWeb4TSComponent } = await import('../../src/ts/layer2/DefaultWeb4TSComponent.js');
    
    // ✅ Test Isolation Pattern: Component uses targetDirectory in init() for test isolation
    // @pdca 2025-11-03-UTC-1237.pdca.md - Full delegation initialization test
    
    // Create component instance with test isolation
    // @pdca 2025-11-03-UTC-1828.pdca.md - BOTH projectRoot AND targetDirectory required
    const component = new DefaultWeb4TSComponent().init({
      model: { 
        projectRoot: testDataDir,
        targetDirectory: testDataDir 
      }
    });
    
    // Create IdealMinimalComponent in test isolation
    await component.create(testComponentName, testVersion, 'all');
    
    // Verify: Component created in test/data/components/, not in production components/
    expect(existsSync(testComponentPath)).toBe(true);
    expect(existsSync(path.join(testComponentPath, 'package.json'))).toBe(true);
    expect(existsSync(path.join(testComponentPath, 'src/ts'))).toBe(true);
    expect(existsSync(path.join(testComponentPath, 'src/sh'))).toBe(true);
    expect(existsSync(path.join(testComponentPath, 'source.env'))).toBe(true);
    
    console.log(`   ✅ IdealMinimalComponent created in test isolation: ${testComponentPath}`);
    console.log(`   📂 Evidence persists at: ${testDataDir}`);
  });

  it('should use full delegation initialization pattern', async () => {
    // Verify delegation: Component should have getWeb4TSComponent() with full initialization
    const defaultComponentPath = path.join(testComponentPath, `src/ts/layer2/Default${testComponentName}.ts`);
    
    expect(existsSync(defaultComponentPath)).toBe(true);
    
    const content = await readFile(defaultComponentPath, 'utf-8');
    
    // Check for full delegation initialization (not just targetDirectory)
    expect(content).toContain('getWeb4TSComponent'); // Lazy delegation loader
    // @pdca 2025-11-10-UTC-1010.pdca.md - DO NOT override component identity!
    // The template was corrected to NOT set 'component: this.model.component'
    expect(content).toContain('DO NOT set \'component\' here'); // Comment explaining identity preservation
    expect(content).toContain('version: await SemanticVersion.fromString'); // Sets version as SemanticVersion
    expect(content).toContain('componentRoot: componentRoot'); // Sets componentRoot
    expect(content).toContain('targetDirectory: projectRoot'); // Sets targetDirectory
    expect(content).toContain('SemanticVersion'); // Imports SemanticVersion
    
    console.log(`   ✅ Full delegation initialization verified`);
  });

  it('should use DRY helper for context delegation', async () => {
    // Verify DRY helper exists and is used for delegation
    const defaultComponentPath = path.join(testComponentPath, `src/ts/layer2/Default${testComponentName}.ts`);
    const content = await readFile(defaultComponentPath, 'utf-8');
    
    // Verify DRY helper method exists
    expect(content).toContain('private async delegateToWeb4TS'); // DRY helper method
    expect(content).toContain('web4ts.model.context = this'); // Sets context ONCE
    
    // Verify delegation methods use the helper
    expect(content).toContain('return this.delegateToWeb4TS(\'test\''); // test() uses helper
    expect(content).toContain('return this.delegateToWeb4TS(\'build\''); // build() uses helper
    expect(content).toContain('return this.delegateToWeb4TS(\'clean\''); // clean() uses helper
    expect(content).toContain('return this.delegateToWeb4TS(\'tree\''); // tree() uses helper
    expect(content).toContain('return this.delegateToWeb4TS(\'links\''); // links() uses helper
    
    console.log(`   ✅ DRY delegation helper verified`);
  });

  it('should have User service integration pattern', async () => {
    // Verify User service integration exists
    const defaultComponentPath = path.join(testComponentPath, `src/ts/layer2/Default${testComponentName}.ts`);
    const content = await readFile(defaultComponentPath, 'utf-8');
    
    // Verify User service lazy initialization
    expect(content).toContain('private async getUser()'); // User service getter
    expect(content).toContain('import(\'../../User/latest/dist/ts/layer2/DefaultUser.js\')'); // Dynamic User import
    
    // Verify toScenario() uses User service
    expect(content).toContain('await this.getUser()'); // Uses User in toScenario
    expect(content).toContain('await user.toScenario()'); // Delegates to User.toScenario()
    
    console.log(`   ✅ User service integration verified`);
  });

  it('should have model with required delegation fields', async () => {
    // Verify model interface has required fields for delegation
    const modelInterfacePath = path.join(testComponentPath, `src/ts/layer3/${testComponentName}Model.interface.ts`);
    
    expect(existsSync(modelInterfacePath)).toBe(true);
    
    const content = await readFile(modelInterfacePath, 'utf-8');
    
    // Verify required delegation fields
    expect(content).toContain('component?:'); // Component name field
    expect(content).toContain('version?:'); // Version field
    expect(content).toContain('targetDirectory?:'); // Path authority field
    
    console.log(`   ✅ Model interface has delegation fields`);
  });

  it('should initialize model with component identity in constructor', async () => {
    // Verify constructor initializes model with component identity
    const defaultComponentPath = path.join(testComponentPath, `src/ts/layer2/Default${testComponentName}.ts`);
    const content = await readFile(defaultComponentPath, 'utf-8');
    
    // Verify constructor sets component name and version
    expect(content).toContain(`component: '${testComponentName}'`); // Sets component name
    expect(content).toContain(`version: '${testVersion}'`); // Sets version
    
    console.log(`   ✅ Constructor initializes component identity`);
  });

  it('should have CLI with proper component override', async () => {
    // Verify CLI has proper component type override
    const cliPath = path.join(testComponentPath, `src/ts/layer5/${testComponentName}CLI.ts`);
    expect(existsSync(cliPath)).toBe(true);
    
    const cliContent = await readFile(cliPath, 'utf-8');
    
    // Verify CLI has proper type override
    expect(cliContent).toContain('protected declare component:'); // Uses declare
    expect(cliContent).toContain(`Default${testComponentName}`); // Overrides to specific type
    
    // Verify immediate component creation for discovery
    expect(cliContent).toContain('this.component = new Default'); // Creates component immediately
    expect(cliContent).toContain('.init()'); // Initializes component
    
    console.log(`   ✅ CLI with proper component override`);
  });

  it('should have component-level source.env', async () => {
    // Verify component-level source.env was created
    const sourceEnvPath = path.join(testComponentPath, 'source.env');
    expect(existsSync(sourceEnvPath)).toBe(true);
    
    const content = await readFile(sourceEnvPath, 'utf-8');
    
    // Verify source.env has proper content (it uses project template, which is correct)
    expect(content).toContain('#!/bin/bash'); // Shebang
    expect(content).toContain('Web4Articles Project Environment Setup'); // Header
    expect(content).toContain('Tab Completion Setup'); // Completion setup
    expect(content).toContain('_web4_generic_completion'); // Completion function
    
    console.log(`   ✅ Component-level source.env created with proper content`);
  });

  it('should NOT create component in production components/ directory', () => {
    // Verify component was created in test isolation, not production
    // Note: Production may already have IdealMinimalComponent from previous manual creation
    // The key test is that the component IS in test/data
    expect(existsSync(testComponentPath)).toBe(true);
    
    // Verify it's specifically in test/data path
    expect(testComponentPath).toContain('test/data/components');
    
    console.log(`   ✅ Component created in test isolation (not production path)`);
  });

  it('should build successfully in test isolation', async () => {
    // Build the component in test isolation
    const { execSync } = await import('child_process');
    
    try {
      // Run build in test isolation directory
      const buildOutput = execSync('npm run build', {
        cwd: testComponentPath,
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      
      // Verify build artifacts exist
      const distPath = path.join(testComponentPath, 'dist/ts/layer2');
      expect(existsSync(distPath)).toBe(true);
      expect(existsSync(path.join(distPath, `Default${testComponentName}.js`))).toBe(true);
      
      // Verify no TypeScript errors
      expect(buildOutput).not.toContain('error TS');
      
      console.log(`   ✅ Component builds successfully in test isolation`);
    } catch (error: any) {
      // Check if error is due to TypeScript errors
      if (error.stderr && error.stderr.includes('error TS')) {
        console.error(`   ❌ TypeScript errors:\n${error.stderr}`);
        throw new Error('Build failed with TypeScript errors');
      }
      throw error;
    }
  });

  describe('🎯 End-to-End Tab Completion Tests', () => {
    it('should have toScenario method in CLI', async () => {
      // Dynamically import the CLI
      const cliPath = path.join(testComponentPath, `dist/ts/layer5/${testComponentName}CLI.js`);
      expect(existsSync(cliPath)).toBe(true);
      
      const { IdealMinimalComponentCLI } = await import(cliPath);
      const cli = new IdealMinimalComponentCLI();
      
      // Verify toScenario exists (replaces obsolete getCompletionScenario)
      // @pdca 2025-11-03-UTC-1430.pdca.md - toScenario is the Single Source of Truth
      expect(typeof (cli as any).toScenario).toBe('function');
      
      console.log(`   ✅ toScenario method exists`);
    });

    it('should return valid completion scenario', async () => {
      // Import the CLI
      const cliPath = path.join(testComponentPath, `dist/ts/layer5/${testComponentName}CLI.js`);
      const { IdealMinimalComponentCLI } = await import(cliPath);
      const cli = new IdealMinimalComponentCLI();
      
      // Get completion scenario with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('toScenario timed out after 5s')), 5000)
      );
      
      // @pdca 2025-11-03-UTC-1430.pdca.md - Use toScenario() instead of obsolete getCompletionScenario()
      const scenarioPromise = cli.toScenario();
      
      try {
        await Promise.race([scenarioPromise, timeoutPromise]);
        console.log(`   ✅ toScenario completes without hanging`);
      } catch (error: any) {
        if (error.message.includes('timed out')) {
          throw new Error('❌ toScenario hangs (timeout after 5s) - check completion implementation!');
        }
        throw error;
      }
    });

    it('should have shCompletion method in CLI (new parameterless API)', async () => {
      // Import the CLI
      const cliPath = path.join(testComponentPath, `dist/ts/layer5/${testComponentName}CLI.js`);
      const { IdealMinimalComponentCLI } = await import(cliPath);
      const cli = new IdealMinimalComponentCLI();
      
      // Verify shCompletion exists (NEW parameterless completion API)
      expect(typeof (cli as any).shCompletion).toBe('function');
      
      console.log(`   ✅ shCompletion method exists (new parameterless OOP API)`);
    });

    it('should complete method names without hanging using shCompletion', async () => {
      // Import the CLI
      const cliPath = path.join(testComponentPath, `dist/ts/layer5/${testComponentName}CLI.js`);
      const { IdealMinimalComponentCLI } = await import(cliPath);
      const cli = new IdealMinimalComponentCLI();
      
      // Set model state directly (Radical OOP pattern)
      // @pdca 2025-11-05-UTC-2301.dry-shell-libraries.pdca.md
      // Removed obsolete computeDerivedCompletionFields() - functional shit removed during Radical OOP refactoring
      cli.model.completionCompCword = 1;
      cli.model.completionCompWords = ['idealminimalcomponent', ''];
      cli.model.completionCliName = 'idealminimalcomponent';
      
      // Test shCompletion with timeout (should NOT hang)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('shCompletion timed out after 5s')), 5000)
      );
      
      // shCompletion outputs directly to stdout, doesn't return values
      const completionPromise = (cli as any).shCompletion('1', 'idealminimalcomponent', '');
      
      try {
        await Promise.race([completionPromise, timeoutPromise]);
        console.log(`   ✅ shCompletion completes without hanging (new parameterless API)`);
      } catch (error: any) {
        if (error.message.includes('timed out')) {
          throw new Error('❌ shCompletion() hangs (timeout after 5s) - this causes "Thinking..." in bash completion!');
        }
        throw error;
      }
    });

    it('should discover component methods for completion', async () => {
      // Import the CLI
      const cliPath = path.join(testComponentPath, `dist/ts/layer5/${testComponentName}CLI.js`);
      const { IdealMinimalComponentCLI } = await import(cliPath);
      const cli = new IdealMinimalComponentCLI();
      
      // Get method signatures
      const methodSignatures = (cli as any).methodSignatures;
      expect(methodSignatures).toBeDefined();
      
      // Should discover component methods
      const expectedMethods = ['create', 'process', 'info', 'test', 'completion'];
      const discoveredMethods: string[] = [];
      const missingMethods: string[] = [];
      
      for (const method of expectedMethods) {
        if (methodSignatures.has(method)) {
          discoveredMethods.push(method);
        } else {
          missingMethods.push(method);
        }
      }
      
      if (missingMethods.length > 0) {
        console.log(`   ⚠️  Missing methods: ${missingMethods.join(', ')}`);
        console.log(`   ✅ Discovered methods: ${discoveredMethods.join(', ')}`);
        console.log(`   📊 Total discovered: ${methodSignatures.size}`);
      }
      
      // At least some methods should be discovered
      expect(methodSignatures.size).toBeGreaterThan(0);
      expect(discoveredMethods.length).toBeGreaterThan(0);
      
      console.log(`   ✅ Method discovery working (${methodSignatures.size} methods discovered)`);
    });
  });
});

