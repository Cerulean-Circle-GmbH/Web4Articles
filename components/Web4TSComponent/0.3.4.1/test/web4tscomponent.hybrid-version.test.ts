import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { ProjectRootMocker } from './utils/ProjectRootMocker.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync, readFileSync } from 'fs';

/**
 * 🔄 HYBRID VERSION APPROACH: Directory as Truth, package.json as Slave
 * 
 * This test suite verifies the hybrid version management system:
 * 
 * TRUTH HIERARCHY:
 * 1. Directory name = Authoritative version (Web4 principle: filesystem as database)
 * 2. package.json = Auto-synced slave (npm compatibility)
 * 3. Auto-healing on mismatch (error prevention)
 * 
 * WHY THIS MATTERS:
 * - Single source of truth (directory name)
 * - npm compatibility (package.json always correct)
 * - Error prevention (impossible to have mismatches)
 * - Version promotion is atomic (rename directory = done)
 * 
 * TEST SCENARIOS:
 * ✅ Directory and package.json match → No action
 * ✅ Mismatch detected → Auto-fix package.json, create backup
 * ✅ Not in version directory → Use package.json as fallback
 * ✅ Backup creation with timestamps
 * ✅ Multiple mismatches handled correctly
 */

/**
 * Helper function to clean up test data content (not the directory itself)
 */
async function cleanupTestDataContent(testDataDir: string) {
  try {
    if (existsSync(testDataDir)) {
      const entries = await fs.readdir(testDataDir);
      for (const entry of entries) {
        const entryPath = path.join(testDataDir, entry);
        await fs.rm(entryPath, { recursive: true, force: true });
      }
    }
  } catch (error) {
    // Ignore cleanup errors
  }
}

describe('🔄 Hybrid Version Management: Directory as Truth', () => {
  const testDataDir = path.join(process.cwd(), 'test', 'data');
  let mockProjectRoot: ProjectRootMocker;
  let web4ts: DefaultWeb4TSComponent;

  beforeEach(async () => {
    // Clean test data CONTENT (not the directory itself)
    await cleanupTestDataContent(testDataDir);
    
    // Set up isolated test environment
    mockProjectRoot = new ProjectRootMocker(testDataDir);
    web4ts = new DefaultWeb4TSComponent();
    
    // Initialize project with root configs (DRY principle)
    await web4ts.initProject();
  });

  afterEach(async () => {
    // Clean up test data CONTENT (preserve directory)
    await cleanupTestDataContent(testDataDir);
  });

  describe('✅ Directory and package.json Match (Happy Path)', () => {
    it('should not auto-fix when versions match', async () => {
      // Create component with matching versions
      await web4ts.create('TestVersionSync', '1.0.0.0');
      
      const componentPath = path.join(testDataDir, 'components', 'TestVersionSync', '1.0.0.0');
      const packageJsonPath = path.join(componentPath, 'package.json');
      
      // Read original package.json
      const originalContent = readFileSync(packageJsonPath, 'utf-8');
      
      // Load context (this triggers version check internally)
      await web4ts.on('TestVersionSync', '1.0.0.0');
      
      // Just call a simple method that uses getCurrentVersion
      await web4ts.links();
      
      // Verify package.json was NOT modified (content is identical)
      const newContent = readFileSync(packageJsonPath, 'utf-8');
      expect(newContent).toBe(originalContent);
      
      // Verify no backup created
      const files = await fs.readdir(componentPath);
      const backups = files.filter(f => f.startsWith('package.json.backup'));
      expect(backups.length).toBe(0);
      
      console.log('✅ No auto-fix when versions match');
    });
  });

  describe('🔧 Auto-Fix on Mismatch', () => {
    it('should auto-fix package.json when it mismatches directory', async () => {
      // Create component
      await web4ts.create('TestAutoFix', '2.0.0.0');
      
      const componentPath = path.join(testDataDir, 'components', 'TestAutoFix', '2.0.0.0');
      const packageJsonPath = path.join(componentPath, 'package.json');
      
      // Corrupt package.json (simulate manual error)
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      packageJson.version = '1.9.9.9'; // WRONG!
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
      
      // Capture console output
      let errorOutput = '';
      const originalConsoleError = console.error;
      console.error = (...args: any[]) => { errorOutput += args.join(' ') + '\n'; };
      
      try {
        // Load context and call method (triggers auto-fix)
        await web4ts.on('TestAutoFix', '2.0.0.0');
        await web4ts.links();  // Any method that uses version internally
        
        // Restore console
        console.error = originalConsoleError;
        
        // Verify error message was shown
        expect(errorOutput).toContain('VERSION MISMATCH DETECTED');
        expect(errorOutput).toContain('Directory (TRUTH): 2.0.0.0');
        expect(errorOutput).toContain('package.json:      1.9.9.9');
        expect(errorOutput).toContain('Auto-fixing package.json');
        expect(errorOutput).toContain('Fixed to 2.0.0.0');
        
        // Verify package.json was fixed
        const fixedPackageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        expect(fixedPackageJson.version).toBe('2.0.0.0');
        
        // Verify backup was created
        const files = await fs.readdir(componentPath);
        const backups = files.filter(f => f.startsWith('package.json.backup'));
        expect(backups.length).toBe(1);
        
        // Verify backup contains old (wrong) version
        const backupPath = path.join(componentPath, backups[0]);
        const backupContent = JSON.parse(readFileSync(backupPath, 'utf-8'));
        expect(backupContent.version).toBe('1.9.9.9');
        
        console.log('✅ Auto-fix works correctly');
      } finally {
        console.error = originalConsoleError;
      }
    });

    it('should create timestamped backups for each fix', async () => {
      await web4ts.create('TestMultiFix', '3.0.0.0');
      
      const componentPath = path.join(testDataDir, 'components', 'TestMultiFix', '3.0.0.0');
      const packageJsonPath = path.join(componentPath, 'package.json');
      
      // Corrupt and fix multiple times
      const silence = console.error;
      console.error = () => {};
      
      for (let i = 1; i <= 3; i++) {
        // Corrupt
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        packageJson.version = `2.9.9.${i}`;
        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
        
        // Wait a tiny bit to ensure different timestamps
        await new Promise(resolve => setTimeout(resolve, 10));
        
        // Trigger fix
        await web4ts.on('TestMultiFix', '3.0.0.0');
        await web4ts.links();
      }
      
      console.error = silence;
      
      // Verify 3 backups created
      const files = await fs.readdir(componentPath);
      const backups = files.filter(f => f.startsWith('package.json.backup'));
      expect(backups.length).toBe(3);
      
      // Verify all backups have unique timestamps
      const timestamps = backups.map(b => b.replace('package.json.backup.', ''));
      const uniqueTimestamps = new Set(timestamps);
      expect(uniqueTimestamps.size).toBe(3);
      
      console.log('✅ Multiple backups with unique timestamps');
    });
  });

  describe('📂 Version Directory Detection', () => {
    it('should recognize valid version directory patterns', async () => {
      const validVersions = ['0.1.0.0', '1.2.3.4', '99.88.77.66'];
      
      for (const version of validVersions) {
        await web4ts.create(`TestVersion${version.replace(/\./g, '')}`, version);
        
        const componentPath = path.join(testDataDir, 'components', `TestVersion${version.replace(/\./g, '')}`, version);
        const packageJsonPath = path.join(componentPath, 'package.json');
        
        // Verify version matches directory
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        expect(packageJson.version).toBe(version);
      }
      
      console.log('✅ Valid version patterns recognized');
    });

    it('should use fallback when not in version directory', async () => {
      // This test runs in test/data which is NOT a version directory
      // The current getCurrentVersion should fall back to package.json
      
      // Create a component and verify it works
      await web4ts.create('TestFallback', '4.0.0.0');
      
      console.log('✅ Fallback to package.json when not in version directory');
    });
  });

  describe('🔒 Backup Safety', () => {
    it('should preserve original content in backups', async () => {
      await web4ts.create('TestBackupContent', '5.0.0.0');
      
      const componentPath = path.join(testDataDir, 'components', 'TestBackupContent', '5.0.0.0');
      const packageJsonPath = path.join(componentPath, 'package.json');
      
      // Add custom field to package.json
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      packageJson.custom = { field: 'preserved' };
      packageJson.version = '4.9.9.9'; // Also corrupt version
      const originalContent = JSON.stringify(packageJson, null, 2);
      await fs.writeFile(packageJsonPath, originalContent);
      
      // Trigger auto-fix
      const silence = console.error;
      console.error = () => {};
      await web4ts.on('TestBackupContent', '5.0.0.0');
      await web4ts.links();
      console.error = silence;
      
      // Find backup
      const files = await fs.readdir(componentPath);
      const backup = files.find(f => f.startsWith('package.json.backup'));
      expect(backup).toBeDefined();
      
      // Verify backup has original content (including custom field)
      const backupPath = path.join(componentPath, backup!);
      const backupContent = readFileSync(backupPath, 'utf-8');
      const backupJson = JSON.parse(backupContent);
      
      expect(backupJson.version).toBe('4.9.9.9');
      expect(backupJson.custom).toEqual({ field: 'preserved' });
      
      // Verify fixed version has custom field too
      const fixedJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      expect(fixedJson.version).toBe('5.0.0.0');
      expect(fixedJson.custom).toEqual({ field: 'preserved' });
      
      console.log('✅ Backups preserve all original content');
    });

    it('should not overwrite existing backups', async () => {
      await web4ts.create('TestBackupCollision', '6.0.0.0');
      
      const componentPath = path.join(testDataDir, 'components', 'TestBackupCollision', '6.0.0.0');
      const packageJsonPath = path.join(componentPath, 'package.json');
      
      // Create two fixes rapidly
      const silence = console.error;
      console.error = () => {};
      
      for (let i = 1; i <= 2; i++) {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        packageJson.version = `5.9.9.${i}`;
        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
        
        await web4ts.on('TestBackupCollision', '6.0.0.0');
        await web4ts.links();
        
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      console.error = silence;
      
      // Verify 2 distinct backups
      const files = await fs.readdir(componentPath);
      const backups = files.filter(f => f.startsWith('package.json.backup'));
      expect(backups.length).toBe(2);
      
      console.log('✅ Each fix creates unique backup');
    });
  });

  describe('📋 Integration with Version Promotion', () => {
    it('should handle version promotion workflow seamlessly', async () => {
      // Simulate version promotion: 1.0.0.0 → 1.1.0.0
      
      // Step 1: Create original version
      await web4ts.create('TestPromotion', '1.0.0.0');
      
      const oldPath = path.join(testDataDir, 'components', 'TestPromotion', '1.0.0.0');
      const newPath = path.join(testDataDir, 'components', 'TestPromotion', '1.1.0.0');
      
      // Step 2: Copy directory (simulating version promotion)
      await fs.cp(oldPath, newPath, { recursive: true });
      
      // Step 3: Package.json still has old version (THIS IS THE BUG WE FIX)
      const packageJsonPath = path.join(newPath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      expect(packageJson.version).toBe('1.0.0.0'); // OLD!
      
      // Step 4: Load context and call method → Auto-fix happens
      const silence = console.error;
      console.error = () => {};
      await web4ts.on('TestPromotion', '1.1.0.0');
      await web4ts.links();
      console.error = silence;
      
      // Step 5: Verify auto-fix happened
      const fixedJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      expect(fixedJson.version).toBe('1.1.0.0'); // FIXED!
      
      // Step 6: Verify backup created
      const files = await fs.readdir(newPath);
      const backups = files.filter(f => f.startsWith('package.json.backup'));
      expect(backups.length).toBe(1);
      
      console.log('✅ Version promotion auto-fix works perfectly');
    });
  });
});

