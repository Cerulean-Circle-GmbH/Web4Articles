/**
 * VersionNextMajorTest - Test Web4TSComponent version next major functionality
 * Web4 test case for validating major version creation
 */

import { DefaultWeb4TestCase } from '../../../src/ts/layer2/DefaultWeb4TestCase';
import { TestScenario } from '../../../src/ts/layer3/TestScenario';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * VersionNextMajorTest - Validates Web4TSComponent major version creation
 * Tests that `web4tscomponent version next major` creates proper directory with content
 */
export class VersionNextMajorTest extends DefaultWeb4TestCase {
  
  /**
   * Execute test-specific logic for version next major
   */
  protected async executeTestLogic(): Promise<any> {
    if (!this.scenario?.testDataScenario) {
      throw new Error('No test data scenario provided');
    }

    const { projectRoot, componentPath, expectedVersion } = this.scenario.testDataScenario;
    
    // Record input evidence
    this.recordEvidence('input', 'Version next major test input', {
      projectRoot,
      componentPath,
      expectedVersion
    });

    // Get current working directory for restoration
    const originalCwd = process.cwd();
    
    try {
      // Change to project root
      process.chdir(projectRoot);
      
      // Get current latest version before test
      const beforeLatest = this.getCurrentLatest(componentPath);
      this.recordEvidence('step', 'Current latest version before test', { beforeLatest });
      
      // Execute version next major command
      const command = `${componentPath}/web4tscomponent.sh version next major`;
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
      
      // Verify directory has content (not empty)
      const dirContents = fs.readdirSync(newVersionPath);
      this.recordEvidence('assertion', 'Version directory contents', {
        path: newVersionPath,
        contents: dirContents,
        hasContent: dirContents.length > 0
      });
      
      if (dirContents.length === 0) {
        throw new Error(`Version directory is empty: ${newVersionPath}`);
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
      
      // Verify key files were copied
      const requiredFiles = ['README.md', 'package.json', 'web4tscomponent.sh'];
      const missingFiles = requiredFiles.filter(file => 
        !fs.existsSync(path.join(newVersionPath, file))
      );
      
      this.recordEvidence('assertion', 'Required files copied', {
        requiredFiles,
        missingFiles,
        allFilesCopied: missingFiles.length === 0
      });
      
      if (missingFiles.length > 0) {
        throw new Error(`Missing required files in new version: ${missingFiles.join(', ')}`);
      }
      
      return {
        success: true,
        newVersion: expectedVersion,
        directoryCreated: versionExists,
        hasContent: dirContents.length > 0,
        latestUpdated: afterLatest === expectedVersion,
        filesCopied: missingFiles.length === 0,
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
    // This would normally call the parent's recordEvidence method
    // For now, we'll just log it (in real implementation, this would be handled by the parent class)
    console.log(`[${type.toUpperCase()}] ${description}:`, data);
  }
}

/**
 * Create test scenario for version next major test
 */
export function createVersionNextMajorTestScenario(): TestScenario {
  return {
    uuid: 'test:uuid:web4ts-version-next-major-001',
    name: 'Web4TSComponent Version Next Major Test',
    description: 'Validates that web4tscomponent version next major creates proper version with content',
    requirementIORs: [
      'requirement:uuid:web4ts-version-management-001'
    ],
    componentIORs: [
      'component:web4tscomponent:latest'
    ],
    testDataScenario: {
      projectRoot: '/Users/Shared/Workspaces/2cuGitHub/Web4Articles',
      componentPath: 'components/Web4TSComponent/0.1.0.2',
      expectedVersion: '2.0.0.0' // Major version increment
    },
    executionContextScenario: {
      timeout: 30000,
      cleanup: true
    },
    expectedResultScenario: {
      success: true,
      newVersion: '2.0.0.0',
      directoryCreated: true,
      hasContent: true,
      latestUpdated: true,
      filesCopied: true
    },
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString()
  };
}
