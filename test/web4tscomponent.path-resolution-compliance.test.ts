/**
 * Web4 Path Resolution Compliance Tests
 * Detects and prevents CommonJS violations and bad path patterns
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Use Web4 pattern for path resolution
const currentFileUrl = new URL(import.meta.url);
const currentDir = dirname(currentFileUrl.pathname);
const componentRoot = join(currentDir, '..');

interface ViolationResult {
  file: string;
  line: number;
  content: string;
  violation: string;
}

/**
 * Recursively scan directory for TypeScript and JavaScript files
 */
function scanSourceFiles(dir: string): string[] {
  const files: string[] = [];
  
  try {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, .git, dist directories
        if (!['node_modules', '.git', 'dist'].includes(entry)) {
          files.push(...scanSourceFiles(fullPath));
        }
      } else if (stat.isFile()) {
        // Include TypeScript, JavaScript, and test files
        if (/\.(ts|js|tsx|jsx)$/.test(entry)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not scan directory ${dir}:`, error);
  }
  
  return files;
}

/**
 * Scan for CommonJS violations (__dirname, __filename)
 */
function scanForCommonJSViolations(baseDir: string = componentRoot): ViolationResult[] {
  const violations: ViolationResult[] = [];
  const files = scanSourceFiles(baseDir);
  
  const patterns = [
    { pattern: /__dirname/g, name: '__dirname' },
    { pattern: /__filename/g, name: '__filename' }
  ];
  
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        patterns.forEach(({ pattern, name }) => {
          if (pattern.test(line)) {
            violations.push({
              file: file.replace(componentRoot, ''),
              line: index + 1,
              content: line.trim(),
              violation: name
            });
          }
        });
      });
    } catch (error) {
      console.warn(`Warning: Could not read file ${file}:`, error);
    }
  }
  
  return violations;
}

/**
 * Scan for process.cwd() violations
 */
function scanForProcessCwdViolations(baseDir: string = componentRoot): ViolationResult[] {
  const violations: ViolationResult[] = [];
  const files = scanSourceFiles(baseDir);
  
  const pattern = /process\.cwd\(\)/g;
  
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (pattern.test(line)) {
          violations.push({
            file: file.replace(componentRoot, ''),
            line: index + 1,
            content: line.trim(),
            violation: 'process.cwd()'
          });
        }
      });
    } catch (error) {
      console.warn(`Warning: Could not read file ${file}:`, error);
    }
  }
  
  return violations;
}

/**
 * Verify Web4 import.meta.url pattern usage
 */
function verifyWeb4ImportMetaUsage(baseDir: string = componentRoot): {
  compliant: boolean;
  web4Patterns: number;
  commonjsPatterns: number;
} {
  const files = scanSourceFiles(baseDir);
  let web4Patterns = 0;
  let commonjsPatterns = 0;
  
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8');
      
      // Count Web4 patterns
      if (content.includes('import.meta.url')) {
        web4Patterns++;
      }
      
      // Count CommonJS patterns
      if (content.includes('__dirname') || content.includes('__filename')) {
        commonjsPatterns++;
      }
    } catch (error) {
      console.warn(`Warning: Could not analyze file ${file}:`, error);
    }
  }
  
  return {
    compliant: commonjsPatterns === 0,
    web4Patterns,
    commonjsPatterns
  };
}

describe('🚨 Web4 Path Resolution Compliance', () => {
  
  it('should have ZERO __dirname violations', () => {
    const violations = scanForCommonJSViolations().filter(v => v.violation === '__dirname');
    
    if (violations.length > 0) {
      console.error('\n❌ __dirname violations found:');
      violations.forEach(v => {
        console.error(`   ${v.file}:${v.line} - ${v.content}`);
      });
      console.error('\n🔧 Fix: Replace __dirname with Web4PathResolver.getCurrentFileDir(import.meta.url)');
    }
    
    expect(violations).toHaveLength(0);
  });
  
  it('should have ZERO __filename violations', () => {
    const violations = scanForCommonJSViolations().filter(v => v.violation === '__filename');
    
    if (violations.length > 0) {
      console.error('\n❌ __filename violations found:');
      violations.forEach(v => {
        console.error(`   ${v.file}:${v.line} - ${v.content}`);
      });
      console.error('\n🔧 Fix: Replace __filename with Web4PathResolver.getCurrentFilePath(import.meta.url)');
    }
    
    expect(violations).toHaveLength(0);
  });
  
  it('should have ZERO process.cwd() violations in src/', () => {
    const srcDir = join(componentRoot, 'src');
    const violations = scanForProcessCwdViolations(srcDir);
    
    if (violations.length > 0) {
      console.error('\n❌ process.cwd() violations found in src/:');
      violations.forEach(v => {
        console.error(`   ${v.file}:${v.line} - ${v.content}`);
      });
      console.error('\n🔧 Fix: Use targetDirectory principle or Web4PathResolver.findProjectRoot()');
    }
    
    expect(violations).toHaveLength(0);
  });
  
  it('should resolve test directory correctly without path duplication', () => {
    // Test the actual path resolution that was causing the bug
    const projectRoot = join(componentRoot, '..', '..', '..');
    const expectedTestDir = join(projectRoot, 'components', 'Web4TSComponent', '0.3.15.1', 'test');
    
    // This should NOT have duplicated component paths
    expect(expectedTestDir).not.toContain('/components/Web4TSComponent/0.3.15.1/components/Web4TSComponent');
    
    // The test directory should exist
    expect(existsSync(expectedTestDir)).toBe(true);
    
    console.log(`✅ Correct test directory: ${expectedTestDir}`);
  });
  
  it('should demonstrate Web4 import.meta.url pattern', () => {
    // This test itself demonstrates the correct Web4 pattern
    const currentFileUrl = new URL(import.meta.url);
    const currentDir = dirname(currentFileUrl.pathname);
    
    // Verify the pattern works correctly
    expect(currentDir).toContain('test');
    expect(currentDir).not.toContain('__dirname');
    
    console.log(`✅ Web4 pattern working: ${currentDir}`);
  });
  
  it('should detect path duplication patterns', () => {
    // Scan for suspicious path patterns that indicate duplication
    const files = scanSourceFiles(componentRoot);
    const duplications: ViolationResult[] = [];
    
    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // Look for patterns like: /components/ComponentName/version/components/ComponentName
          if (/\/components\/\w+\/[\d.]+\/components\/\w+/.test(line)) {
            duplications.push({
              file: file.replace(componentRoot, ''),
              line: index + 1,
              content: line.trim(),
              violation: 'path-duplication'
            });
          }
        });
      } catch (error) {
        // Skip files we can't read
      }
    }
    
    if (duplications.length > 0) {
      console.error('\n❌ Path duplication patterns found:');
      duplications.forEach(d => {
        console.error(`   ${d.file}:${d.line} - ${d.content}`);
      });
    }
    
    expect(duplications).toHaveLength(0);
  });
  
  it('should report overall Web4 compliance status', () => {
    const commonJSViolations = scanForCommonJSViolations();
    const processCwdViolations = scanForProcessCwdViolations();
    const web4Usage = verifyWeb4ImportMetaUsage();
    
    console.log('\n📊 Web4 Path Resolution Compliance Report:');
    console.log(`   __dirname violations: ${commonJSViolations.filter(v => v.violation === '__dirname').length}`);
    console.log(`   __filename violations: ${commonJSViolations.filter(v => v.violation === '__filename').length}`);
    console.log(`   process.cwd() violations: ${processCwdViolations.length}`);
    console.log(`   Web4 import.meta.url patterns: ${web4Usage.web4Patterns}`);
    console.log(`   Overall compliance: ${web4Usage.compliant ? '✅ COMPLIANT' : '❌ NON-COMPLIANT'}`);
    
    // This test always passes but provides visibility into compliance status
    expect(true).toBe(true);
  });
  
});
