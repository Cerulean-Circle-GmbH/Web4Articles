/**
 * VersionNextPatchTest - Test Web4TSComponent version next patch functionality
 * Web4 test case for validating patch version creation (fixed issue)
 */

import { DefaultWeb4TestCase } from '../../../src/ts/layer2/DefaultWeb4TestCase';
import { TestScenario } from '../../../src/ts/layer3/TestScenario';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * VersionNextPatchTest - Validates Web4TSComponent patch version creation
 * Tests that `web4tscomponent version next patch` creates proper directory with content
 * This test validates the fix for the empty directory issue
 */
export class VersionNextPatchTest extends DefaultWeb4TestCase {
  
  /**
   * Execute test-specific logic for version next patch
   */
  protected async executeTestLogic(): Promise<any> {
    if (!this.scenario?.testDataScenario) {
      throw new Error('No test data scenario provided');
    }

    const { projectRoot, componentPath, currentVersion, expectedVersion } = this.scenario.testDataScenario;
    
    // Record input evidence
    this.recordEvidence('input', 'Version next patch test input', {
      projectRoot,
      componentPath,
      currentVersion,
      expectedVersion
    });

    // Get current working directory for restoration
    const originalCwd = process.cwd();
    
    try {
      // Change to project root
      process.chdir(projectRoot);
      
      // Verify current version exists and has content
      const currentVersionPath = path.join(componentPath, currentVersion);
      const currentVersionExists = fs.existsSync(currentVersionPath);
      const currentVersionContents = currentVersionExists ? fs.readdirSync(currentVersionPath) : [];
      
      this.recordEvidence('step', 'Current version validation', {
        currentVersionPath,
        exists: currentVersionExists,
        hasContent: currentVersionContents.length > 0,
        contents: currentVersionContents
      });
      
      if (!currentVersionExists || currentVersionContents.length === 0) {
        throw new Error(`Current version ${currentVersion} does not exist or is empty`);
      }
      
      // Get latest version before test
      const beforeLatest = this.getCurrentLatest(componentPath);
      this.recordEvidence('step', 'Current latest version before test', { beforeLatest });
      
      // Execute version next patch command
      const command = `${componentPath}/web4tscomponent.sh version next patch`;
      this.recordEvidence('step', 'Executing command', { command });
      
      const output = execSync(command, { 
        encoding: 'utf8',
        cwd: projectRoot 
      });
      
      this.recordEvidence('step', 'Command output', { output });
      
      // Verify new version directory was created
      const newVersionPath = path.join(componentPath, expectedVersion);
      const versionExists = fs.existsSync(newVersionPath);
      
      this.recordEvidence('assertion', 'New version directory exists', {
        path: newVersionPath,
        exists: versionExists
      });
      
      if (!versionExists) {
        throw new Error(`Expected version directory not created: ${newVersionPath}`);
      }
      
      // CRITICAL: Verify directory has content (this was the bug we fixed)
      const dirContents = fs.readdirSync(newVersionPath);
      this.recordEvidence('assertion', 'Version directory contents (CRITICAL TEST)', {
        path: newVersionPath,
        contents: dirContents,
        hasContent: dirContents.length > 0,
        note: 'This validates the fix for empty patch version directories'
      });
      
      if (dirContents.length === 0) {
        throw new Error(`CRITICAL BUG: Version directory is empty: ${newVersionPath}. This indicates the cherry-pick fix failed.`);
      }
      
      // Verify latest symlink was updated
      const afterLatest = this.getCurrentLatest(componentPath);
      this.recordEvidence('assertion', 'Latest symlink updated', {
        beforeLatest,
        afterLatest,
        expectedVersion,
        updated: afterLatest === expectedVersion
      });
      
      if (afterLatest !== expectedVersion) {
        throw new Error(`Latest symlink not updated. Expected: ${expectedVersion}, Got: ${afterLatest}`);
      }
      
      // Verify key files were copied (validates content copying)
      const requiredFiles = ['README.md', 'package.json', 'web4tscomponent.sh', 'src/ts/layer2'];
      const fileChecks = requiredFiles.map(file => {
        const filePath = path.join(newVersionPath, file);
        const exists = fs.existsSync(filePath);
        return { file, exists, path: filePath };
      });
      
      const missingFiles = fileChecks.filter(check => !check.exists).map(check => check.file);
      
      this.recordEvidence('assertion', 'Required files/directories copied', {
        requiredFiles,
        fileChecks,
        missingFiles,
        allFilesCopied: missingFiles.length === 0
      });
      
      if (missingFiles.length > 0) {
        throw new Error(`Missing required files in new version: ${missingFiles.join(', ')}`);
      }
      
      // Verify VersionManager.ts was copied (specific to the fix)
      const versionManagerPath = path.join(newVersionPath, 'src/ts/layer2/VersionManager.ts');
      const versionManagerExists = fs.existsSync(versionManagerPath);
      
      this.recordEvidence('assertion', 'VersionManager.ts copied (validates fix)', {
        path: versionManagerPath,
        exists: versionManagerExists,
        note: 'This file contains the fix for getLatestVersionWithContent()'
      });
      
      if (!versionManagerExists) {
        throw new Error('VersionManager.ts not copied - critical component missing');
      }
      
      return {
        success: true,
        newVersion: expectedVersion,
        directoryCreated: versionExists,
        hasContent: dirContents.length > 0,
        latestUpdated: afterLatest === expectedVersion,
        filesCopied: missingFiles.length === 0,
        versionManagerCopied: versionManagerExists,
        contentCount: dirContents.length,
        fixValidated: true, // This test specifically validates the empty directory fix
        output
      };
      
    } finally {
      // Restore original working directory
      process.chdir(originalCwd);
    }
  }
  
  /**
   * Get current latest version
   */
  private getCurrentLatest(componentPath: string): string {
    const latestPath = path.join(componentPath, 'latest');
    
    try {
      if (fs.existsSync(latestPath) && fs.lstatSync(latestPath).isSymbolicLink()) {
        return fs.readlinkSync(latestPath);
      }
    } catch (error) {
      // Ignore errors, return 'unknown'
    }
    
    return 'unknown';
  }
  
  /**
   * Record evidence during test execution
   */
  private recordEvidence(type: any, description: string, data: any): void {
    console.log(`[${type.toUpperCase()}] ${description}:`, data);
  }
}

/**
 * Create test scenario for version next patch test
 */
export function createVersionNextPatchTestScenario(): TestScenario {
  return {
    uuid: 'test:uuid:web4ts-version-next-patch-001',
    name: 'Web4TSComponent Version Next Patch Test (Fixed Empty Directory Bug)',
    description: 'Validates that web4tscomponent version next patch creates proper version with content, not empty directories. This test specifically validates the fix for the cherry-pick bug.',
    requirementIORs: [
      'requirement:uuid:web4ts-version-management-002',
      'requirement:uuid:web4ts-empty-directory-fix-001'
    ],
    componentIORs: [
      'component:web4tscomponent:0.1.0.2'
    ],
    testDataScenario: {
      projectRoot: '/Users/Shared/Workspaces/2cuGitHub/Web4Articles',
      componentPath: 'components/Web4TSComponent/0.1.0.2',
      currentVersion: '1.0.0.0', // Current latest version with content
      expectedVersion: '1.0.1.0' // Patch version increment
    },
    executionContextScenario: {
      timeout: 30000,
      cleanup: true,
      tags: ['critical', 'bugfix', 'version-management']
    },
    expectedResultScenario: {
      success: true,
      newVersion: '1.0.1.0',
      directoryCreated: true,
      hasContent: true, // CRITICAL: Must not be empty
      latestUpdated: true,
      filesCopied: true,
      versionManagerCopied: true,
      fixValidated: true
    },
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString()
  };
}
