import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

describe('🎯 Single-Match Documentation Display', () => {
  const componentPath = process.cwd();
  const sourceEnv = join(componentPath, '../../..', 'source.env');
  
  beforeAll(() => {
    expect(existsSync(sourceEnv), `source.env not found: ${sourceEnv}`).toBe(true);
  });

  it('Should show full documentation for single match: links', () => {
    // Test that single match shows:
    // 1. Signature: links <?action>
    // 2. Separator line
    // 3. Header: 📖 Documentation:
    // 4. Description from TSDoc comment (multi-line)
    
    const cliName = 'web4tscomponent';
    const filterPrefix = 'li';  // Should match only 'links'
    
    // Call completionNameParameterCompletion directly
    const result = execSync(
      `${cliName} completeParameter completionNameParameterCompletion completion method ${filterPrefix}`,
      { encoding: 'utf-8', cwd: componentPath }
    );
    
    console.log('=== Single Match Output ===');
    console.log(result);
    console.log('===========================');
    
    // Check for required elements
    expect(result).toContain('links');  // Method name
    expect(result).toContain('<?action>');  // Parameter syntax
    expect(result).toContain('────');  // Separator
    expect(result).toContain('📖 Documentation:');  // Header
    expect(result).toContain('Display semantic version links');  // Description start
    
    // Check for DISPLAY: protocol
    expect(result).toContain('DISPLAY:');
    
    // Check for WORD: protocol (for bash completion)
    expect(result).toContain('WORD: links');
  });

  it('Should show description from getMethodDoc() - currently only first paragraph', () => {
    // This test documents CURRENT behavior:
    // getMethodDoc() returns only the description text (first paragraph of TSDoc comment)
    // It does NOT include @param, @cliExample, etc.
    
    const cliName = 'web4tscomponent';
    const result = execSync(
      `${cliName} completeParameter completionNameParameterCompletion completion method li`,
      { encoding: 'utf-8', cwd: componentPath }
    );
    
    // What we GET (current behavior):
    expect(result).toContain('Display semantic version links');
    
    // What we DON'T GET (because getMethodDoc only returns description):
    // Note: These assertions document missing functionality
    const hasParamDocs = result.includes('@param action');
    const hasExamples = result.includes('web4tscomponent links fix');
    
    console.log('Has @param docs:', hasParamDocs);  // Expected: false
    console.log('Has examples:', hasExamples);  // Expected: false
    
    // Document the limitation
    expect(hasParamDocs).toBe(false); 
    expect(hasExamples).toBe(false);
  });

  it('TODO: Should ideally show @param and @cliExample in documentation', () => {
    // Future improvement: Extract and display:
    // - @param descriptions
    // - @cliExample examples
    // - @remarks notes
    //
    // This would make single-match documentation much more helpful!
    //
    // Current: Only TSDoc description paragraph
    // Desired: Full formatted documentation with parameters and examples
    
    console.log('📝 TODO: Enhance getMethodDoc() to include @param and @cliExample');
  });
});

