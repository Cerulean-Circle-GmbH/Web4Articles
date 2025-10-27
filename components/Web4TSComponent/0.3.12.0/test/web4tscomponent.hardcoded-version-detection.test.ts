import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import path from 'path';

/**
 * 🚨 CRITICAL: Hardcoded Version Detection
 * 
 * This test suite ensures that version numbers are NOT hardcoded in source files.
 * 
 * WHY THIS MATTERS:
 * - Version promotion creates new directories (0.3.4.1 → 0.3.5.0)
 * - If versions are hardcoded, promoted versions break
 * - Self-testing fails because CLI reports wrong version
 * - Auto-discovery breaks because versions mismatch
 * 
 * ALLOWED LOCATIONS:
 * ✅ package.json (single source of truth)
 * ✅ Test files checking specific versions
 * ✅ Template files with {{VERSION}} placeholders
 * ✅ README.md documentation examples
 * 
 * FORBIDDEN LOCATIONS:
 * ❌ src/ts/layer5/Web4TSComponentCLI.ts (must read from package.json or constructor)
 * ❌ src/ts/layer2/DefaultCLI.ts (must use fallback pattern)
 * ❌ src/ts/layer2/DefaultWeb4TSComponent.ts (should be version-agnostic)
 * ❌ Any other .ts files in src/ (must be version-agnostic)
 * 
 * DETECTION STRATEGY:
 * - Scan all .ts files in src/
 * - Find version-like patterns (X.Y.Z.W format)
 * - Exclude known safe patterns
 * - Fail if suspicious hardcoded versions found
 */

describe('🚨 CRITICAL: Hardcoded Version Detection', () => {
  
  // Get the current version from package.json (single source of truth)
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const CURRENT_VERSION = packageJson.version;
  
  // Version pattern to detect (matches X.Y.Z.W or X.Y.Z format)
  const VERSION_PATTERN = /\b\d+\.\d+\.\d+(\.\d+)?\b/g;
  
  /**
   * Recursively get all .ts files in a directory
   */
  function getTsFiles(dir: string, fileList: string[] = []): string[] {
    const files = readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, dist, test directories
        if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist' && file !== 'test') {
          getTsFiles(filePath, fileList);
        }
      } else if (file.endsWith('.ts')) {
        fileList.push(filePath);
      }
    }
    
    return fileList;
  }
  
  /**
   * Check if a version string is suspicious (hardcoded)
   */
  function isSuspiciousVersion(version: string, context: string): boolean {
    // Ignore fallback/placeholder versions (0.0.0, 1.0.0)
    if (version === '0.0.0' || version === '1.0.0') {
      // Only allowed as fallback in error handling
      if (context.includes('fallback') || context.includes('Fallback') || 
          context.includes('error') || context.includes('Warning')) {
        return false;
      }
    }
    
    // Ignore very old versions (likely in comments about history)
    if (version.startsWith('0.1.') || version.startsWith('0.2.')) {
      return false;
    }
    
    // Ignore template placeholder patterns
    if (context.includes('{{VERSION}}') || context.includes('${version}')) {
      return false;
    }
    
    // Ignore import paths (e.g., '../0.3.3.2/src')
    if (context.includes('../') || context.includes('./')) {
      return false;
    }
    
    // Ignore comments about other versions
    if (context.trim().startsWith('//') || context.trim().startsWith('*')) {
      return false;
    }
    
    // Ignore package.json references
    if (context.includes('package.json') || context.includes('packageJson')) {
      return false;
    }
    
    // Suspicious if it looks like a version assignment or initialization
    if (context.includes(`'${version}'`) || context.includes(`"${version}"`)) {
      return true;
    }
    
    return false;
  }

  it('should not have hardcoded versions in CLI entry point', () => {
    const cliPath = path.join(process.cwd(), 'src', 'ts', 'layer5', 'Web4TSComponentCLI.ts');
    const cliContent = readFileSync(cliPath, 'utf-8');
    const lines = cliContent.split('\n');
    
    const suspiciousLines: string[] = [];
    
    lines.forEach((line, index) => {
      const matches = line.match(VERSION_PATTERN);
      if (matches) {
        matches.forEach(version => {
          // Check context (include previous line for error handling context)
          const previousLine = index > 0 ? lines[index - 1] : '';
          const contextLines = previousLine + '\n' + line;
          
          if (isSuspiciousVersion(version, contextLines)) {
            suspiciousLines.push(`Line ${index + 1}: ${line.trim()}`);
          }
        });
      }
    });
    
    if (suspiciousLines.length > 0) {
      console.error('❌ Hardcoded versions found in Web4TSComponentCLI.ts:');
      suspiciousLines.forEach(line => console.error(`   ${line}`));
    }
    
    expect(suspiciousLines.length).toBe(0);
    console.log('✅ Web4TSComponentCLI.ts has no hardcoded versions');
  });

  it('should not have hardcoded versions in DefaultCLI', () => {
    const defaultCliPath = path.join(process.cwd(), 'src', 'ts', 'layer2', 'DefaultCLI.ts');
    const defaultCliContent = readFileSync(defaultCliPath, 'utf-8');
    const lines = defaultCliContent.split('\n');
    
    const suspiciousLines: string[] = [];
    
    lines.forEach((line, index) => {
      const matches = line.match(VERSION_PATTERN);
      if (matches) {
        matches.forEach(version => {
          if (isSuspiciousVersion(version, line)) {
            suspiciousLines.push(`Line ${index + 1}: ${line.trim()}`);
          }
        });
      }
    });
    
    if (suspiciousLines.length > 0) {
      console.error('❌ Hardcoded versions found in DefaultCLI.ts:');
      suspiciousLines.forEach(line => console.error(`   ${line}`));
    }
    
    expect(suspiciousLines.length).toBe(0);
    console.log('✅ DefaultCLI.ts has no hardcoded versions');
  });

  it('should not have hardcoded versions in DefaultWeb4TSComponent', () => {
    const componentPath = path.join(process.cwd(), 'src', 'ts', 'layer2', 'DefaultWeb4TSComponent.ts');
    const componentContent = readFileSync(componentPath, 'utf-8');
    const lines = componentContent.split('\n');
    
    const suspiciousLines: string[] = [];
    
    lines.forEach((line, index) => {
      const matches = line.match(VERSION_PATTERN);
      if (matches) {
        matches.forEach(version => {
          // DefaultWeb4TSComponent should be completely version-agnostic
          // Only allowed versions are in comments or path references
          if (isSuspiciousVersion(version, line)) {
            suspiciousLines.push(`Line ${index + 1}: ${line.trim()}`);
          }
        });
      }
    });
    
    if (suspiciousLines.length > 0) {
      console.error('❌ Hardcoded versions found in DefaultWeb4TSComponent.ts:');
      suspiciousLines.forEach(line => console.error(`   ${line}`));
    }
    
    expect(suspiciousLines.length).toBe(0);
    console.log('✅ DefaultWeb4TSComponent.ts has no hardcoded versions');
  });

  it('should scan all source files for suspicious hardcoded versions', () => {
    const srcDir = path.join(process.cwd(), 'src');
    const tsFiles = getTsFiles(srcDir);
    
    const filesWithSuspiciousVersions: Record<string, string[]> = {};
    
    for (const filePath of tsFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      const suspiciousLines: string[] = [];
      
      lines.forEach((line, index) => {
        const matches = line.match(VERSION_PATTERN);
        if (matches) {
          matches.forEach(version => {
            // Check context (include previous line for error handling context)
            const previousLine = index > 0 ? lines[index - 1] : '';
            const contextLines = previousLine + '\n' + line;
            
            if (isSuspiciousVersion(version, contextLines)) {
              suspiciousLines.push(`Line ${index + 1}: ${line.trim()}`);
            }
          });
        }
      });
      
      if (suspiciousLines.length > 0) {
        const relativePath = path.relative(process.cwd(), filePath);
        filesWithSuspiciousVersions[relativePath] = suspiciousLines;
      }
    }
    
    if (Object.keys(filesWithSuspiciousVersions).length > 0) {
      console.error('❌ Hardcoded versions found in source files:');
      for (const [file, lines] of Object.entries(filesWithSuspiciousVersions)) {
        console.error(`\n📁 ${file}:`);
        lines.forEach(line => console.error(`   ${line}`));
      }
    }
    
    expect(Object.keys(filesWithSuspiciousVersions).length).toBe(0);
    console.log(`✅ Scanned ${tsFiles.length} source files - no hardcoded versions found`);
  });

  it('should verify version is read dynamically from model', () => {
    // Check that CLI reads version from component model (not hardcoded)
    const cliPath = path.join(process.cwd(), 'src', 'ts', 'layer5', 'Web4TSComponentCLI.ts');
    const cliContent = readFileSync(cliPath, 'utf-8');
    
    // Should read version from model
    const readsFromModel = cliContent.includes('.model.version');
    
    // Should NOT have hardcoded version in initWithComponentClass
    const hasNoHardcodedVersion = !cliContent.includes(`initWithComponentClass(DefaultWeb4TSComponent, 'Web4TSComponent', '${CURRENT_VERSION}')`);
    
    expect(readsFromModel).toBe(true);
    expect(hasNoHardcodedVersion).toBe(true);
    console.log('✅ CLI reads version dynamically from component model');
  });

  it('should verify package.json version matches current directory', () => {
    // Get current directory name
    const currentDir = path.basename(process.cwd());
    
    // If directory is a version number, it should match package.json
    if (VERSION_PATTERN.test(currentDir)) {
      expect(currentDir).toBe(CURRENT_VERSION);
      console.log(`✅ Directory version ${currentDir} matches package.json ${CURRENT_VERSION}`);
    } else {
      console.log(`ℹ️  Not in a versioned directory (${currentDir})`);
    }
  });

  it('should document version source in README', () => {
    const readmePath = path.join(process.cwd(), 'README.md');
    const readmeContent = readFileSync(readmePath, 'utf-8');
    
    // README should mention version or package.json
    const hasVersionInfo = readmeContent.toLowerCase().includes('version') ||
                          readmeContent.includes('package.json');
    
    expect(hasVersionInfo).toBe(true);
    console.log('✅ README documents version information');
  });

  it('should fail if old version patterns are found', () => {
    // List of old versions that should NEVER appear in source code
    const OLD_VERSIONS = [
      '0.3.0.9',
      '0.3.1.0',
      '0.3.2.0',
      '0.3.3.0',
      '0.3.3.1',
      '0.3.3.2',
      '0.3.4.0'
    ];
    
    const srcDir = path.join(process.cwd(), 'src');
    const tsFiles = getTsFiles(srcDir);
    
    const filesWithOldVersions: Record<string, string[]> = {};
    
    for (const filePath of tsFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      const suspiciousLines: string[] = [];
      
      lines.forEach((line, index) => {
        // Skip comments
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
          return;
        }
        
        // Check for each old version
        OLD_VERSIONS.forEach(oldVersion => {
          if (line.includes(`'${oldVersion}'`) || line.includes(`"${oldVersion}"`)) {
            suspiciousLines.push(`Line ${index + 1}: ${line.trim()} (contains ${oldVersion})`);
          }
        });
      });
      
      if (suspiciousLines.length > 0) {
        const relativePath = path.relative(process.cwd(), filePath);
        filesWithOldVersions[relativePath] = suspiciousLines;
      }
    }
    
    if (Object.keys(filesWithOldVersions).length > 0) {
      console.error('❌ Old hardcoded versions found:');
      for (const [file, lines] of Object.entries(filesWithOldVersions)) {
        console.error(`\n📁 ${file}:`);
        lines.forEach(line => console.error(`   ${line}`));
      }
    }
    
    expect(Object.keys(filesWithOldVersions).length).toBe(0);
    console.log('✅ No old version strings found in source code');
  });
});

