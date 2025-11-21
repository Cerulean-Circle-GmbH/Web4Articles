/**
 * IdealMinimalComponent Critical Completion Tests
 * 
 * Tests that completion on IdealMinimalComponent works identically to Web4TSComponent
 * for all 5 critical delegated CLI methods:
 * - setCICDVersion <targetVersion> <?version:'current'>
 * - test <?scope:'all'> <references>
 * - upgrade <?versionPromotion:'nextPatch'>
 * - create <component> <?version:'0.1.0.0'> <?options:'all'>
 * - links <?action>
 * 
 * @pdca 2025-11-19-UTC-1215.pdca.md - Completion testing plan for IdealMinimalComponent
 * @cmm CMM3 - Objective, reproducible verification of completion functionality
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync } from 'fs';
import { readFile, rm, mkdir, symlink, readdir } from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

describe('🎯 IdealMinimalComponent Critical Completion Tests', () => {
  // ✅ Web4 Pattern: No underscore naming, use fileURLToPath for ESM
  const currentFileUrl = new URL(import.meta.url);
  const currentDir = path.dirname(fileURLToPath(currentFileUrl));
  const componentRoot = path.join(currentDir, '../..');
  const testDataDir = path.join(componentRoot, 'test/data');
  const testComponentName = 'IdealMinimalComponent';
  
  // ✅ Use CURRENT version (same as Web4TSComponent version under test)
  const versionMatch = componentRoot.match(/(\d+\.\d+\.\d+\.\d+)$/);
  const testVersion = versionMatch ? versionMatch[1] : '0.0.0.0';
  
  // Component will be created at: targetDirectory/components/IdealMinimalComponent/<current-version>
  const testComponentPath = path.join(testDataDir, 'components', testComponentName, testVersion);
  const testComponentCLI = path.join(testComponentPath, 'idealminimalcomponent');

  /**
   * Setup test isolation environment and create IdealMinimalComponent if needed
   * Reuses pattern from idealminimalcomponent-creation-isolation.test.ts
   */
  beforeAll(async () => {
    // Clean old evidence before tests (fresh start)
    const idealminimalComponentDir = path.join(testDataDir, 'components', testComponentName);
    if (existsSync(idealminimalComponentDir)) {
      await rm(idealminimalComponentDir, { recursive: true, force: true });
      console.log(`   🧹 Cleaned old evidence: test/data/components/${testComponentName}`);
    }
    
    // ✅ SYSTEMATIC: Use initProject to setup test/data (DRY principle)
    const componentPath = path.join(componentRoot, 'dist/ts/layer2/DefaultWeb4TSComponent.js');
    const { DefaultWeb4TSComponent } = await import(componentPath);
    const component = new DefaultWeb4TSComponent().init({ projectRoot: componentRoot });
    await component.initProject(testDataDir);
    console.log(`   ✅ Test isolation environment initialized via initProject`);
    
    // ✅ CRITICAL: Copy Web4TSComponent into test/data for delegation
    const web4tsSourceDir = componentRoot;
    const web4tsTestDataDir = path.join(testDataDir, 'components/Web4TSComponent');
    const web4tsTestVersionDir = path.join(web4tsTestDataDir, testVersion);
    
    // Clean old Web4TSComponent copy
    if (existsSync(web4tsTestDataDir)) {
      await rm(web4tsTestDataDir, { recursive: true, force: true });
      console.log(`   🧹 Cleaned old Web4TSComponent from test/data`);
    }
    
    // Copy Web4TSComponent to test/data using rsync
    await mkdir(web4tsTestDataDir, { recursive: true });
    execSync(`rsync -a --exclude='test/data' "${web4tsSourceDir}/" "${web4tsTestVersionDir}/"`, {
      stdio: 'pipe'
    });
    console.log(`   📦 Copied Web4TSComponent ${testVersion} to test/data for delegation`);
    
    // Create symlinks (latest, dev, test) pointing to the copied version
    const symlinkTargets = ['latest', 'dev', 'test'];
    for (const linkName of symlinkTargets) {
      const linkPath = path.join(web4tsTestDataDir, linkName);
      if (existsSync(linkPath)) {
        await rm(linkPath, { force: true });
      }
      await symlink(testVersion, linkPath, 'dir');
      console.log(`   🔗 Created symlink: Web4TSComponent/${linkName} → ${testVersion}`);
    }
    
    // ✅ CRITICAL: Create web4tscomponent CLI symlink in test/data/scripts
    const scriptsDir = path.join(testDataDir, 'scripts');
    const web4tsComponentCLILink = path.join(scriptsDir, 'web4tscomponent');
    if (existsSync(web4tsComponentCLILink)) {
      await rm(web4tsComponentCLILink, { force: true });
    }
    await symlink('../components/Web4TSComponent/latest/web4tscomponent', web4tsComponentCLILink);
    console.log(`   🔗 Created CLI symlink: scripts/web4tscomponent → Web4TSComponent/latest/web4tscomponent`);
    
    // Create IdealMinimalComponent if it doesn't exist
    if (!existsSync(testComponentPath)) {
      const component = new DefaultWeb4TSComponent().init({
        model: { 
          projectRoot: testDataDir,
          targetDirectory: testDataDir 
        }
      });
      await component.create(testComponentName, testVersion, 'all');
      console.log(`   ✅ Created IdealMinimalComponent ${testVersion} in test/data`);
    } else {
      console.log(`   ✅ IdealMinimalComponent ${testVersion} already exists in test/data`);
    }
    
    // Build the component to ensure dist/ files exist
    if (existsSync(testComponentPath)) {
      try {
        execSync('npm run build', {
          cwd: testComponentPath,
          encoding: 'utf-8',
          stdio: 'pipe',
          timeout: 60000
        });
        console.log(`   ✅ Built IdealMinimalComponent ${testVersion}`);
      } catch (error: any) {
        console.log(`   ⚠️  Build may have failed, but continuing with tests`);
      }
    }
  });

  /**
   * Test Helper: Run completion on IdealMinimalComponent CLI programmatically
   * Uses programmatic approach to ensure component is properly initialized
   */
  async function runIdealMinimalComponentCompletion(cword: number, ...words: string[]): Promise<string> {
    const cliPath = path.join(testComponentPath, `dist/ts/layer5/${testComponentName}CLI.js`);
    const { IdealMinimalComponentCLI } = await import(cliPath);
    const cli = new IdealMinimalComponentCLI();
    
    // CRITICAL: Must initialize component for method discovery!
    await (cli as any).initComponent();
    
    // Set model state directly (Radical OOP pattern)
    cli.model.completionCompCword = cword;
    cli.model.completionCompWords = ['idealminimalcomponent', ...words];
    cli.model.completionCliName = 'idealminimalcomponent';
    
    return await captureShCompletionOutput(cli, cword.toString(), 'idealminimalcomponent', ...words);
  }

  /**
   * Test Helper: Run completion on Web4TSComponent CLI programmatically (baseline)
   * Web4TSComponentCLI initializes component in constructor, no initComponent() needed
   */
  async function runWeb4TSComponentCompletion(cword: number, ...words: string[]): Promise<string> {
    const web4tsCLIPath = path.join(testDataDir, 'components/Web4TSComponent', testVersion, 'dist/ts/layer5/Web4TSComponentCLI.js');
    const { Web4TSComponentCLI } = await import(web4tsCLIPath);
    const cli = new Web4TSComponentCLI();
    
    // Set model state directly (Radical OOP pattern)
    // Web4TSComponentCLI initializes component in constructor, so no initComponent() needed
    cli.model.completionCompCword = cword;
    cli.model.completionCompWords = ['web4tscomponent', ...words];
    cli.model.completionCliName = 'web4tscomponent';
    
    return await captureShCompletionOutput(cli, cword.toString(), 'web4tscomponent', ...words);
  }

  /**
   * Test Helper: Strip ANSI color codes from output
   */
  function stripAnsi(text: string): string {
    return text.replace(/\x1b\[[0-9;]*m/g, '');
  }

  /**
   * Test Helper: Extract WORD lines from completion output
   */
  function extractWordLines(output: string): string[] {
    const clean = stripAnsi(output);
    return clean.split('\n')
      .filter(line => line.startsWith('WORD:'))
      .map(line => line.replace(/^WORD:\s*/, '').trim());
  }

  /**
   * Test Helper: Compare completion output between IdealMinimalComponent and Web4TSComponent
   */
  function compareCompletionOutput(
    idealOutput: string,
    web4tsOutput: string,
    methodName: string
  ): { identical: boolean; differences: string[] } {
    const idealWords = extractWordLines(idealOutput);
    const web4tsWords = extractWordLines(web4tsOutput);
    
    const differences: string[] = [];
    
    // Check if all IdealMinimalComponent words are in Web4TSComponent output
    for (const word of idealWords) {
      if (!web4tsWords.includes(word)) {
        differences.push(`IdealMinimalComponent has "${word}" but Web4TSComponent doesn't`);
      }
    }
    
    // Check if all Web4TSComponent words are in IdealMinimalComponent output (for delegated methods)
    for (const word of web4tsWords) {
      if (!idealWords.includes(word)) {
        differences.push(`Web4TSComponent has "${word}" but IdealMinimalComponent doesn't`);
      }
    }
    
    return {
      identical: differences.length === 0,
      differences
    };
  }

  /**
   * Test Helper: Capture stdout from programmatic shCompletion call
   */
  async function captureShCompletionOutput(
    cliInstance: any,
    cword: string,
    ...words: string[]
  ): Promise<string> {
    const originalLog = console.log;
    const capturedOutput: string[] = [];
    
    console.log = (...args: any[]) => {
      capturedOutput.push(args.join(' '));
    };
    
    try {
      await cliInstance.shCompletion(cword, ...words);
      return capturedOutput.join('\n');
    } finally {
      console.log = originalLog;
    }
  }

  // ============================================================================
  // Test Category 1: setCICDVersion Completion
  // ============================================================================

  describe('1. setCICDVersion Completion', () => {
    it('1.1: should complete method name setCICDVersion', async () => {
      const output = await runIdealMinimalComponentCompletion(1, 'setCICD');
      const clean = stripAnsi(output);
      
      expect(clean).toContain('Completing: METHOD');
      expect(clean).toContain('setCICDVersion');
      expect(clean).toContain('WORD: setCICDVersion');
      
      console.log(`   ✅ Method completion works for setCICDVersion`);
    });

    it('1.2: should complete first parameter (targetVersion)', async () => {
      const output = await runIdealMinimalComponentCompletion(2, 'setCICDVersion', '');
      const clean = stripAnsi(output);
      
      expect(clean).toContain('Completing: PARAMETER');
      expect(clean).toContain('setCICDVersion');
      expect(clean).toContain('targetVersion');
      
      // Should show targetVersion options
      const wordLines = extractWordLines(output);
      expect(wordLines.length).toBeGreaterThan(0);
      expect(wordLines.some(w => ['dev', 'latest', 'test', 'prod'].includes(w))).toBe(true);
      
      console.log(`   ✅ First parameter (targetVersion) completion works`);
    });

    it('1.3: should complete second parameter (version)', async () => {
      const output = await runIdealMinimalComponentCompletion(3, 'setCICDVersion', 'dev', '');
      const clean = stripAnsi(output);
      
      expect(clean).toContain('Completing: PARAMETER');
      expect(clean).toContain('setCICDVersion');
      
      // Should show version options (current or component versions)
      const wordLines = extractWordLines(output);
      expect(wordLines.length).toBeGreaterThan(0);
      
      console.log(`   ✅ Second parameter (version) completion works`);
    });

    it('1.4: should match Web4TSComponent completion output', async () => {
      const idealOutput = await runIdealMinimalComponentCompletion(2, 'setCICDVersion', '');
      const web4tsOutput = await runWeb4TSComponentCompletion(2, 'setCICDVersion', '');
      
      const comparison = compareCompletionOutput(idealOutput, web4tsOutput, 'setCICDVersion');
      
      if (!comparison.identical) {
        console.log(`   ⚠️  Differences found:`, comparison.differences);
      }
      
      // For delegated methods, completion should be identical
      expect(comparison.identical).toBe(true);
      
      console.log(`   ✅ Completion output matches Web4TSComponent`);
    });
  });

  // ============================================================================
  // Test Category 2: test Completion
  // ============================================================================

  describe('2. test Completion', () => {
    it('2.1: should complete method name test', async () => {
      const output = await runIdealMinimalComponentCompletion(1, 't');
      const clean = stripAnsi(output);
      
      expect(clean).toContain('Completing: METHOD');
      expect(clean).toContain('test');
      expect(clean).toContain('WORD: test');
      
      console.log(`   ✅ Method completion works for test`);
    });

    it('2.2: should complete first parameter (scope)', async () => {
      const output = await runIdealMinimalComponentCompletion(2, 'test', '');
      const clean = stripAnsi(output);
      
      expect(clean).toContain('Completing: PARAMETER');
      expect(clean).toContain('test');
      
      // Should show scope options (all or test file names)
      const wordLines = extractWordLines(output);
      expect(wordLines.length).toBeGreaterThan(0);
      
      console.log(`   ✅ First parameter (scope) completion works`);
    });

    it('2.3: should complete second parameter (references)', async () => {
      const output = await runIdealMinimalComponentCompletion(3, 'test', 'all', '');
      const clean = stripAnsi(output);
      
      expect(clean).toContain('Completing: PARAMETER');
      expect(clean).toContain('test');
      expect(clean).toContain('references');
      
      // Should show test references (file numbers, itCase tokens, describe tokens)
      const wordLines = extractWordLines(output);
      expect(wordLines.length).toBeGreaterThan(0);
      
      console.log(`   ✅ Second parameter (references) completion works`);
    });

    it('2.4: should match Web4TSComponent completion output', async () => {
      const idealOutput = await runIdealMinimalComponentCompletion(3, 'test', 'file', '');
      const web4tsOutput = await runWeb4TSComponentCompletion(3, 'test', 'file', '');
      
      const comparison = compareCompletionOutput(idealOutput, web4tsOutput, 'test');
      
      if (!comparison.identical) {
        console.log(`   ⚠️  Differences found:`, comparison.differences);
      }
      
      // For delegated methods, completion should be identical
      expect(comparison.identical).toBe(true);
      
      console.log(`   ✅ Completion output matches Web4TSComponent`);
    });
  });

  // ============================================================================
  // Test Category 3: upgrade Completion
  // ============================================================================

  describe('3. upgrade Completion', () => {
    it('3.1: should complete method name upgrade', async () => {
      const output = await runIdealMinimalComponentCompletion(1, 'u');
      const clean = stripAnsi(output);
      
      expect(clean).toContain('Completing: METHOD');
      expect(clean).toContain('upgrade');
      expect(clean).toContain('WORD: upgrade');
      
      console.log(`   ✅ Method completion works for upgrade`);
    });

    it('3.2: should complete parameter (versionPromotion)', async () => {
      const output = await runIdealMinimalComponentCompletion(2, 'upgrade', '');
      const clean = stripAnsi(output);
      
      expect(clean).toContain('Completing: PARAMETER');
      expect(clean).toContain('upgrade');
      
      // Should show versionPromotion options
      const wordLines = extractWordLines(output);
      expect(wordLines.length).toBeGreaterThan(0);
      expect(wordLines.some(w => ['nextPatch', 'nextMinor', 'nextMajor', 'nextBuild'].includes(w))).toBe(true);
      
      console.log(`   ✅ Parameter (versionPromotion) completion works`);
    });

    it('3.3: should complete filtered versionPromotion options', async () => {
      const output = await runIdealMinimalComponentCompletion(2, 'upgrade', 'n');
      const clean = stripAnsi(output);
      
      expect(clean).toContain('Completing: PARAMETER');
      
      // Should show versionPromotion options starting with 'n'
      const wordLines = extractWordLines(output);
      const nextOptions = wordLines.filter(w => w.startsWith('next'));
      expect(nextOptions.length).toBeGreaterThan(0);
      
      console.log(`   ✅ Filtered completion works for versionPromotion`);
    });

    it('3.4: should match Web4TSComponent completion output', async () => {
      const idealOutput = await runIdealMinimalComponentCompletion(2, 'upgrade', '');
      const web4tsOutput = await runWeb4TSComponentCompletion(2, 'upgrade', '');
      
      const comparison = compareCompletionOutput(idealOutput, web4tsOutput, 'upgrade');
      
      if (!comparison.identical) {
        console.log(`   ⚠️  Differences found:`, comparison.differences);
      }
      
      // For delegated methods, completion should be identical
      expect(comparison.identical).toBe(true);
      
      console.log(`   ✅ Completion output matches Web4TSComponent`);
    });
  });

  // ============================================================================
  // Test Category 4: create Completion
  // ============================================================================

  describe('4. create Completion', () => {
    it('4.1: should complete method name create', async () => {
      const output = await runIdealMinimalComponentCompletion(1, 'c');
      const clean = stripAnsi(output);
      
      expect(clean).toContain('Completing: METHOD');
      expect(clean).toContain('create');
      expect(clean).toContain('WORD: create');
      
      console.log(`   ✅ Method completion works for create`);
    });

    it('4.2: should complete first parameter (component)', async () => {
      const output = await runIdealMinimalComponentCompletion(2, 'create', '');
      const clean = stripAnsi(output);
      
      expect(clean).toContain('Completing: PARAMETER');
      expect(clean).toContain('create');
      expect(clean).toContain('component');
      
      // Should show component name options (existing components or empty for new)
      const wordLines = extractWordLines(output);
      // May be empty for new components, or show existing components
      
      console.log(`   ✅ First parameter (component) completion works`);
    });

    it('4.3: should complete second parameter (version)', async () => {
      const output = await runIdealMinimalComponentCompletion(3, 'create', 'MyComponent', '');
      const clean = stripAnsi(output);
      
      expect(clean).toContain('Completing: PARAMETER');
      expect(clean).toContain('create');
      
      // Should show version options (default: 0.1.0.0, or semantic versions)
      const wordLines = extractWordLines(output);
      // May show default version or semantic version options
      
      console.log(`   ✅ Second parameter (version) completion works`);
    });

    it('4.4: should complete third parameter (options)', async () => {
      const output = await runIdealMinimalComponentCompletion(4, 'create', 'MyComponent', '0.1.0.0', '');
      const clean = stripAnsi(output);
      
      expect(clean).toContain('Completing: PARAMETER');
      expect(clean).toContain('create');
      
      // Should show options (all, cli, spec, etc.)
      const wordLines = extractWordLines(output);
      expect(wordLines.length).toBeGreaterThan(0);
      expect(wordLines.some(w => ['all', 'cli', 'spec'].includes(w))).toBe(true);
      
      console.log(`   ✅ Third parameter (options) completion works`);
    });

    it('4.5: should match Web4TSComponent completion output', async () => {
      const idealOutput = await runIdealMinimalComponentCompletion(4, 'create', 'MyComponent', '0.1.0.0', '');
      const web4tsOutput = await runWeb4TSComponentCompletion(4, 'create', 'MyComponent', '0.1.0.0', '');
      
      const comparison = compareCompletionOutput(idealOutput, web4tsOutput, 'create');
      
      if (!comparison.identical) {
        console.log(`   ⚠️  Differences found:`, comparison.differences);
      }
      
      // For delegated methods, completion should be identical
      expect(comparison.identical).toBe(true);
      
      console.log(`   ✅ Completion output matches Web4TSComponent`);
    });
  });

  // ============================================================================
  // Test Category 5: links Completion
  // ============================================================================

  describe('5. links Completion', () => {
    it('5.1: should complete method name links', async () => {
      const output = await runIdealMinimalComponentCompletion(1, 'l');
      const clean = stripAnsi(output);
      
      expect(clean).toContain('Completing: METHOD');
      expect(clean).toContain('links');
      expect(clean).toContain('WORD: links');
      
      console.log(`   ✅ Method completion works for links`);
    });

    it('5.2: should complete parameter (action)', async () => {
      const output = await runIdealMinimalComponentCompletion(2, 'links', '');
      const clean = stripAnsi(output);
      
      expect(clean).toContain('Completing: PARAMETER');
      expect(clean).toContain('links');
      
      // Should show action options (if any, or empty)
      const wordLines = extractWordLines(output);
      // May be empty if no action parameter completion, or show action options
      
      console.log(`   ✅ Parameter (action) completion works`);
    });

    it('5.3: should match Web4TSComponent completion output', async () => {
      const idealOutput = await runIdealMinimalComponentCompletion(2, 'links', '');
      const web4tsOutput = await runWeb4TSComponentCompletion(2, 'links', '');
      
      const comparison = compareCompletionOutput(idealOutput, web4tsOutput, 'links');
      
      if (!comparison.identical) {
        console.log(`   ⚠️  Differences found:`, comparison.differences);
      }
      
      // For delegated methods, completion should be identical
      expect(comparison.identical).toBe(true);
      
      console.log(`   ✅ Completion output matches Web4TSComponent`);
    });
  });

  // ============================================================================
  // Test Infrastructure Tests
  // ============================================================================

  describe('Test Infrastructure', () => {
    it('Infra 1: compareCompletionOutput helper should detect differences', () => {
      const output1 = 'WORD: test\nWORD: build';
      const output2 = 'WORD: test\nWORD: clean';
      
      const comparison = compareCompletionOutput(output1, output2, 'test');
      
      expect(comparison.identical).toBe(false);
      expect(comparison.differences.length).toBeGreaterThan(0);
      
      console.log(`   ✅ Comparison helper detects differences correctly`);
    });

    it('Infra 2: compareCompletionOutput helper should detect identical outputs', () => {
      const output1 = 'WORD: test\nWORD: build';
      const output2 = 'WORD: test\nWORD: build';
      
      const comparison = compareCompletionOutput(output1, output2, 'test');
      
      expect(comparison.identical).toBe(true);
      expect(comparison.differences.length).toBe(0);
      
      console.log(`   ✅ Comparison helper detects identical outputs correctly`);
    });

    it('Infra 3: extractWordLines helper should extract WORD lines correctly', () => {
      const output = 'DISPLAY: Some text\nWORD: test\nWORD: build\nDISPLAY: More text';
      const wordLines = extractWordLines(output);
      
      expect(wordLines).toContain('test');
      expect(wordLines).toContain('build');
      expect(wordLines.length).toBe(2);
      
      console.log(`   ✅ WORD line extraction works correctly`);
    });
  });
});

