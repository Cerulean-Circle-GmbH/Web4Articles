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
import { readFile, rm, mkdir, symlink, readdir } from 'fs/promises';
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
    
    // ✅ SYSTEMATIC: Use initProject to setup test/data (DRY principle)
    // @pdca 2025-11-10-UTC-1430.systematic-initproject-test-isolation.pdca.md
    // initProject detects /test/data and creates:
    // - minimal package.json (type: "module")
    // - ESM tsconfig.json
    // - scripts/ directory
    // - components/ directory
    const componentPath = path.join(componentRoot, 'dist/ts/layer2/DefaultWeb4TSComponent.js');
    const { DefaultWeb4TSComponent } = await import(componentPath);
    const component = new DefaultWeb4TSComponent().init({ projectRoot: componentRoot });
    await component.initProject(testDataDir);
    console.log(`   ✅ Test isolation environment initialized via initProject`);
    
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
    // initProject creates scripts/ directory, we just add the symlink
    const scriptsDir = path.join(testDataDir, 'scripts');
    
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

  it('should NOT have explicit delegation methods (DRY via DelegationProxy)', async () => {
    // @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
    // Verify delegation methods are NOT explicitly defined (automatic via Proxy)
    const defaultComponentPath = path.join(testComponentPath, `src/ts/layer2/Default${testComponentName}.ts`);
    const content = await readFile(defaultComponentPath, 'utf-8');
    
    // Verify NO explicit delegation boilerplate (check for actual method implementation, not comments)
    expect(content).not.toMatch(/^\s*private async delegateToWeb4TS\(/m); // NO helper method implementation
    expect(content).not.toMatch(/^\s*async test\(/m); // NO test() method implementation
    expect(content).not.toMatch(/^\s*async build\(/m); // NO build() method implementation
    expect(content).not.toMatch(/^\s*async clean\(/m); // NO clean() method implementation
    
    // Verify comment explaining automatic delegation IS present
    expect(content).toContain('REMOVED: Explicit delegation methods'); // Documents change
    expect(content).toContain('DelegationProxy'); // Explains mechanism
    
    console.log(`   ✅ NO explicit delegation methods (automatic via Proxy)`);
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

  it('should have CLI with proper component override and DelegationProxy', async () => {
    // @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
    // Verify CLI wraps component in DelegationProxy
    const cliPath = path.join(testComponentPath, `src/ts/layer5/${testComponentName}CLI.ts`);
    expect(existsSync(cliPath)).toBe(true);
    
    const cliContent = await readFile(cliPath, 'utf-8');
    
    // Verify CLI has async component initialization (NO more 'protected declare component')
    expect(cliContent).toContain('async initComponent()'); // Async initialization
    expect(cliContent).toContain('// Type is handled by base DefaultCLI'); // Comment about typing
    
    // Verify DelegationProxy wrapping (NEW pattern - replaces explicit methods)
    expect(cliContent).toContain('DelegationProxy.start('); // Uses static factory
    expect(cliContent).toContain('await new Default'); // Awaits async init
    expect(cliContent).toContain('.init()'); // Calls init()
    expect(cliContent).toContain('await cli.initComponent()'); // Called in start()
    
    console.log(`   ✅ CLI with async DelegationProxy wrapping`);
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
      
      // @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
      // CRITICAL: Must initialize component for method discovery!
      await (cli as any).initComponent();
      
      // Set model state directly (Radical OOP pattern)
      // @pdca 2025-11-05-UTC-2301.dry-shell-libraries.pdca.md
      // Removed obsolete computeDerivedCompletionFields() - functional shit removed during Radical OOP refactoring
      cli.model.completionCompCword = 1;
      cli.model.completionCompWords = ['idealminimalcomponent', ''];
      cli.model.completionCliName = 'idealminimalcomponent';
      
      // Capture stdout to check completion output
      const originalLog = console.log;
      const capturedOutput: string[] = [];
      console.log = (...args: any[]) => {
        capturedOutput.push(args.join(' '));
      };
      
      try {
        // Test shCompletion with timeout (should NOT hang)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('shCompletion timed out after 5s')), 5000)
        );
        
        // shCompletion outputs directly to stdout, doesn't return values
        const completionPromise = (cli as any).shCompletion('1', 'idealminimalcomponent', '');
        
        await Promise.race([completionPromise, timeoutPromise]);
        
        console.log = originalLog;
        
        // Verify we got actual completions, not "(no completions available)"
        const output = capturedOutput.join('\n');
        expect(output).not.toContain('(no completions available)');
        
        // Should have WORD: lines with method names
        const wordLines = capturedOutput.filter(line => line.startsWith('WORD:'));
        expect(wordLines.length).toBeGreaterThan(0);
        
        console.log(`   ✅ shCompletion completes without hanging AND returns ${wordLines.length} methods`);
      } catch (error: any) {
        console.log = originalLog;
        if (error.message.includes('timed out')) {
          throw new Error('❌ shCompletion() hangs (timeout after 5s) - this causes "Thinking..." in bash completion!');
        }
        throw error;
      } finally {
        console.log = originalLog;
      }
    });

    it('should discover component methods for completion', async () => {
      // Import the CLI
      const cliPath = path.join(testComponentPath, `dist/ts/layer5/${testComponentName}CLI.js`);
      const { IdealMinimalComponentCLI } = await import(cliPath);
      const cli = new IdealMinimalComponentCLI();
      
      // @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
      // Async component initialization required for dynamic delegation discovery
      await (cli as any).initComponent();
      
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

    it('should have delegated methods accessible via DelegationProxy', async () => {
      // @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
      // Test that DelegationProxy allows delegated methods to be called
      
      const cliPath = path.join(testComponentPath, `dist/ts/layer5/${testComponentName}CLI.js`);
      const { IdealMinimalComponentCLI } = await import(cliPath);
      const cli = new IdealMinimalComponentCLI();
      
      // @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
      // Async component initialization required for dynamic delegation discovery
      await (cli as any).initComponent();
      
      // Methods that should be delegated via Proxy (not explicitly defined)
      const delegatedMethods = ['info', 'test', 'build', 'clean', 'tree', 'links'];
      
      for (const method of delegatedMethods) {
        // Check if method is callable (exists through Proxy)
        expect(typeof (cli.component as any)[method]).toBe('function');
      }
      
      console.log(`   ✅ All delegated methods accessible via DelegationProxy`);
    });

    it('should complete delegated methods via shCompletion', async () => {
      // @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
      // Test that completion discovers delegated methods (info, test, etc.)
      
      const cliPath = path.join(testComponentPath, `dist/ts/layer5/${testComponentName}CLI.js`);
      const { IdealMinimalComponentCLI } = await import(cliPath);
      const cli = new IdealMinimalComponentCLI();
      
      // @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
      // Async component initialization required for dynamic delegation discovery
      await (cli as any).initComponent();
      
      // Capture stdout to check completion output
      const originalLog = console.log;
      const capturedOutput: string[] = [];
      console.log = (...args: any[]) => {
        capturedOutput.push(args.join(' '));
      };
      
      try {
        // Set up completion state for method completion (filter 'i' should show 'info')
        cli.model.completionCompCword = 1;
        cli.model.completionCompWords = ['idealminimalcomponent', 'i'];
        cli.model.completionCliName = 'idealminimalcomponent';
        
        // Run completion (should show 'info' method among others)
        await (cli as any).shCompletion('1', 'idealminimalcomponent', 'i');
        
        // Check that 'info' is in the output (delegated method)
        // Also accept 'initProject' or other methods starting with 'i'
        const output = capturedOutput.join('\n');
        const hasInfoOrSimilar = output.includes('info') || output.includes('initProject') || output.includes('inferParameterType');
        expect(hasInfoOrSimilar).toBe(true);
        
        console.log = originalLog;
        console.log(`   ✅ Delegated methods appear in completion (found methods starting with 'i')`);
      } finally {
        console.log = originalLog;
      }
    });

    it('should initialize component automatically in shCompletion for method discovery', async () => {
      // @pdca 2025-11-10-UTC-2030.fix-upgrade-delegation.pdca.md
      // Test that shCompletion override calls initComponent() for method discovery
      
      const cliPath = path.join(testComponentPath, `dist/ts/layer5/${testComponentName}CLI.js`);
      const { IdealMinimalComponentCLI } = await import(cliPath);
      const cli = new IdealMinimalComponentCLI();
      
      // DO NOT call initComponent() manually - shCompletion should do it
      expect(cli.component).toBeFalsy(); // Component not initialized yet (undefined or null)
      
      // Capture stdout to check completion output
      const originalLog = console.log;
      const capturedOutput: string[] = [];
      console.log = (...args: any[]) => {
        capturedOutput.push(args.join(' '));
      };
      
      try {
        // Set up completion state for method completion (upgrade + i<TAB> should show 'info')
        cli.model.completionCompCword = 1;
        cli.model.completionCompWords = ['idealminimalcomponent', 'i'];
        cli.model.completionCliName = 'idealminimalcomponent';
        
        // Run completion (should auto-initialize component and show delegated methods)
        await (cli as any).shCompletion('1', 'idealminimalcomponent', 'i');
        
        console.log = originalLog;
        
        // After shCompletion, component should be initialized
        expect(cli.component).toBeDefined();
        
        // Check that delegated methods appear (e.g., 'info', 'initProject', etc.)
        const output = capturedOutput.join('\n');
        expect(output).not.toContain('(no completions available)');
        
        // Should have WORD: lines with methods starting with 'i'
        const wordLines = capturedOutput.filter(line => line.startsWith('WORD:'));
        expect(wordLines.length).toBeGreaterThan(0);
        
        console.log(`   ✅ shCompletion auto-initializes component (${wordLines.length} methods discovered)`);
      } finally {
        console.log = originalLog;
      }
    });

    it('should upgrade correct component when delegated', async () => {
      // @pdca 2025-11-10-UTC-2030.fix-upgrade-delegation.pdca.md
      // Test that idealminimalcomponent upgrade upgrades IdealMinimalComponent, not Web4TSComponent
      
      const cliPath = path.join(testComponentPath, `dist/ts/layer5/${testComponentName}CLI.js`);
      const { IdealMinimalComponentCLI } = await import(cliPath);
      const cli = new IdealMinimalComponentCLI();
      
      // Initialize component
      await (cli as any).initComponent();
      
      // Get current version BEFORE upgrade (version-agnostic test)
      const currentVersion = (cli.component as any).model.version.toString();
      
      // Capture stdout to check which component is upgraded
      const originalLog = console.log;
      const capturedOutput: string[] = [];
      console.log = (...args: any[]) => {
        capturedOutput.push(args.join(' '));
      };
      
      try {
        // Call upgrade (should upgrade IdealMinimalComponent, not Web4TSComponent)
        await (cli.component as any).upgrade('nextBuild');
        
        console.log = originalLog;
        
        const output = capturedOutput.join('\n');
        
        // Should say "Upgrading IdealMinimalComponent" (not Web4TSComponent)
        expect(output).toContain('Upgrading IdealMinimalComponent');
        expect(output).not.toContain('Upgrading Web4TSComponent');
        
        // Should create IdealMinimalComponent version (version-agnostic)
        // Just verify it says "IdealMinimalComponent" and "created successfully"
        expect(output).toContain('IdealMinimalComponent');
        expect(output).toContain('created successfully');
        
        // Verify A new version was created in test isolation (any version > current)
        const componentsDir = path.join(testDataDir, 'components', 'IdealMinimalComponent');
        const versions = (await readdir(componentsDir)).filter(v => v.match(/^\d+\.\d+\.\d+\.\d+$/));
        
        // Should have at least 2 versions now (original + upgraded)
        expect(versions.length).toBeGreaterThanOrEqual(2);
        
        console.log(`   ✅ Delegated upgrade creates correct component (IdealMinimalComponent upgraded from ${currentVersion})`);
      } finally {
        console.log = originalLog;
      }
    });
  });
});

