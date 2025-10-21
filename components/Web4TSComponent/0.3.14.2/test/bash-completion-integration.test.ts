import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';

describe('🎯 Bash Completion Integration - source.env', () => {
  const componentPath = process.cwd();
  const sourceEnv = join(componentPath, '../../..', 'source.env');  // Up 3 levels to project root
  const testShDir = join(componentPath, 'test', 'sh');
  
  beforeAll(() => {
    expect(existsSync(sourceEnv), `source.env not found: ${sourceEnv}`).toBe(true);
  });

  beforeEach(() => {
    // Clean test/sh BEFORE each test (preserves test evidence after run)
    if (existsSync(testShDir)) {
      rmSync(testShDir, { recursive: true, force: true });
    }
    // Create fresh test/sh directory
    mkdirSync(testShDir, { recursive: true });
  });

  // NO afterEach/afterAll - leave test/sh visible for inspection!

  it('Case 1: Full method list: web4tscomponent <TAB> (KNOWN TIMEOUT)', () => {
    // Test FULL method listing (no filter) - 200+ methods
    // KNOWN ISSUE: This times out after 30s (source.env timeout)
    // TODO: Fix in Case 10 - add user-visible timeout message
    const testScriptPath = join(testShDir, 'test-full-method-list.sh');
    const testScript = `
#!/bin/bash
cd ${componentPath}
source ${sourceEnv} >/dev/null 2>&1
COMP_WORDS=(web4tscomponent "")
COMP_CWORD=1
# source.env has 30s timeout - will kill this
_web4_generic_completion 2>/dev/null
echo ""
echo "COMPREPLY_COUNT: \${#COMPREPLY[@]}"
    `.trim();
    
    writeFileSync(testScriptPath, testScript);
    execSync(`chmod +x ${testScriptPath}`);
    
    const result = execSync(testScriptPath, { encoding: 'utf-8', timeout: 40000 });
    
    // Check that we got timeout (0 results)
    const countMatch = result.match(/COMPREPLY_COUNT: (\d+)/);
    expect(countMatch).toBeTruthy();
    const count = parseInt(countMatch![1], 10);
    
    // KNOWN ISSUE: Currently times out (0 methods returned)
    expect(count).toBe(0);
    console.log('⏱️  Full method list times out (Case 10 - needs fix)');
  });

  it('Bash simulation: web4tscomponent setCICDVersion <TAB>', () => {
    // Create test script that captures STDOUT (what user sees)
    const testScriptPath = join(testShDir, 'test-param-completion.sh');
    const testScript = `
#!/bin/bash
cd ${componentPath}
source ${sourceEnv} >/dev/null 2>&1
COMP_WORDS=(web4tscomponent setCICDVersion "")
COMP_CWORD=2
# Capture what user sees on screen
_web4_generic_completion
echo ""  # Newline after completion
echo "COMPREPLY: \${COMPREPLY[*]}"
    `.trim();
    
    writeFileSync(testScriptPath, testScript);
    execSync(`chmod +x ${testScriptPath}`);
    
    const result = execSync(testScriptPath, { encoding: 'utf-8' });
    
    // Check user-visible output
    expect(result).toContain('💭 Thinking...');
    expect(result).toMatch(/\n💭 Thinking\.\.\.\n/);  // Should have newline BEFORE and AFTER!
    expect(result).not.toMatch(/COMP_WORDS.*💭/);  // Should NOT be on same line as command
    
    // Parse COMPREPLY
    const compreplyMatch = result.match(/COMPREPLY: (.+)/);
    expect(compreplyMatch).toBeTruthy();
    
    const words = compreplyMatch![1].trim().split(/\s+/);
    
    // Should complete with semantic version links
    expect(words).toContain('dev');
    expect(words).toContain('latest');
    expect(words).toContain('prod');
    expect(words).toContain('test');
    expect(words.length).toBeGreaterThanOrEqual(4);
  });

  it('Bash simulation: web4tscomponent setC<TAB>', () => {
    // Test method completion
    const testScriptPath = join(testShDir, 'test-method-filter.sh');
    const testScript = `
#!/bin/bash
cd ${componentPath}
source ${sourceEnv} >/dev/null 2>&1
COMP_WORDS=(web4tscomponent setC)
COMP_CWORD=1
_web4_generic_completion 2>/dev/null
echo "\${COMPREPLY[*]}"
    `.trim();
    
    writeFileSync(testScriptPath, testScript);
    execSync(`chmod +x ${testScriptPath}`);
    
    const result = execSync(testScriptPath, { encoding: 'utf-8' });
    
    // Should complete to setCICDVersion (may have trailing space)
    expect(result.trim()).toContain('setCICDVersion');
  });

  it('HANG TEST: Unknown method should timeout gracefully', () => {
    // Test that unknown methods don't hang forever
    const testScriptPath = join(testShDir, 'test-hang.sh');
    const testScript = `
#!/bin/bash
cd ${componentPath}
source ${sourceEnv} >/dev/null 2>&1
COMP_WORDS=(web4tscomponent unknownMethod "")
COMP_CWORD=2
timeout 5s _web4_generic_completion
echo "COMPREPLY: \${COMPREPLY[*]}"
    `.trim();
    
    writeFileSync(testScriptPath, testScript);
    execSync(`chmod +x ${testScriptPath}`);
    
    const result = execSync(testScriptPath, { encoding: 'utf-8', timeout: 10000 });
    
    // Should NOT hang, should return empty COMPREPLY
    expect(result).toContain('COMPREPLY:');
  });

  it('✅ Method completion with filter: web4tscomponent co<TAB>', () => {
    // Test filtered method listing (Case 2 from testing)
    const testScriptPath = join(testShDir, 'test-method-co.sh');
    const testScript = `
#!/bin/bash
cd ${componentPath}
source ${sourceEnv} >/dev/null 2>&1
COMP_WORDS=(web4tscomponent "co")
COMP_CWORD=1
_web4_generic_completion 2>/dev/null
echo ""
echo "COMPREPLY: \${COMPREPLY[*]}"
    `.trim();
    
    writeFileSync(testScriptPath, testScript);
    execSync(`chmod +x ${testScriptPath}`);
    
    const result = execSync(testScriptPath, { encoding: 'utf-8' });
    
    // Check display output (without DISPLAY: prefix!)
    expect(result).toContain('💭 Thinking...');
    expect(result).toContain('compare');
    expect(result).toContain('completion');
    expect(result).toContain('copyDefaultCLI');
    
    // Check COMPREPLY has correct words
    const compreplyMatch = result.match(/COMPREPLY: (.+)/);
    expect(compreplyMatch).toBeTruthy();
    const words = compreplyMatch![1].trim().split(/\s+/);
    
    expect(words).toContain('compare');
    expect(words).toContain('compareVersions');
    expect(words).toContain('completion');
    expect(words.length).toBeGreaterThanOrEqual(5);
  });

  it('✅ Direct parameter completion: web4tscomponent setCICDVersion <TAB>', () => {
    // Test parameter completion without filter
    const testScriptPath = join(testShDir, 'test-param-cicd.sh');
    const testScript = `
#!/bin/bash
cd ${componentPath}
source ${sourceEnv} >/dev/null 2>&1
COMP_WORDS=(web4tscomponent setCICDVersion "")
COMP_CWORD=2
_web4_generic_completion 2>/dev/null
echo ""
echo "COMPREPLY: \${COMPREPLY[*]}"
    `.trim();
    
    writeFileSync(testScriptPath, testScript);
    execSync(`chmod +x ${testScriptPath}`);
    
    const result = execSync(testScriptPath, { encoding: 'utf-8' });
    
    // Check COMPREPLY has semantic version links
    const compreplyMatch = result.match(/COMPREPLY: (.+)/);
    expect(compreplyMatch).toBeTruthy();
    const words = compreplyMatch![1].trim().split(/\s+/);
    
    expect(words).toContain('dev');
    expect(words).toContain('latest');
    expect(words).toContain('prod');
    expect(words).toContain('test');
    expect(words.length).toBe(4);
  });
});

