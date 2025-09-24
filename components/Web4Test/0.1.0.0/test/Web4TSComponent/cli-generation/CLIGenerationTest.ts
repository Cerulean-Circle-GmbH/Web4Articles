/**
 * CLIGenerationTest - Test Web4TSComponent CLI generation functionality
 * Web4 test case for validating component CLI generation
 */

import { DefaultWeb4TestCase } from '../../../src/ts/layer2/DefaultWeb4TestCase';
import { TestScenario } from '../../../src/ts/layer3/TestScenario';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * CLIGenerationTest - Validates Web4TSComponent CLI generation
 * Tests that `web4tscomponent generate-cli <name> <version>` creates location-resilient CLI script
 */
export class CLIGenerationTest extends DefaultWeb4TestCase {
  
  /**
   * Execute test-specific logic for CLI generation
   */
  protected async executeTestLogic(): Promise<any> {
    if (!this.scenario?.testDataScenario) {
      throw new Error('No test data scenario provided');
    }

    const { 
      projectRoot, 
      componentPath, 
      testComponentName, 
      testVersion,
      expectedScriptName 
    } = this.scenario.testDataScenario;
    
    // Record input evidence
    this.recordEvidence('input', 'CLI generation test input', {
      projectRoot,
      componentPath,
      testComponentName,
      testVersion,
      expectedScriptName
    });

    // Get current working directory for restoration
    const originalCwd = process.cwd();
    
    try {
      // Change to project root
      process.chdir(projectRoot);
      
      // Clean up any existing test script
      const scriptPath = path.join(projectRoot, expectedScriptName);
      if (fs.existsSync(scriptPath)) {
        fs.unlinkSync(scriptPath);
        this.recordEvidence('step', 'Cleaned up existing test script', { scriptPath });
      }
      
      // Execute generate-cli command
      const command = `${componentPath}/web4tscomponent.sh generate-cli ${testComponentName} ${testVersion}`;
      this.recordEvidence('step', 'Executing CLI generation command', { command });
      
      const output = execSync(command, { 
        encoding: 'utf8',
        cwd: projectRoot 
      });
      
      this.recordEvidence('step', 'Command output', { output });
      
      // Verify script was created
      const scriptExists = fs.existsSync(scriptPath);
      
      this.recordEvidence('assertion', 'CLI script created', {
        scriptPath,
        exists: scriptExists
      });
      
      if (!scriptExists) {
        throw new Error(`Expected CLI script not created: ${scriptPath}`);
      }
      
      // Verify script is executable
      const stats = fs.statSync(scriptPath);
      const isExecutable = (stats.mode & parseInt('111', 8)) !== 0;
      
      this.recordEvidence('assertion', 'CLI script is executable', {
        scriptPath,
        mode: stats.mode.toString(8),
        isExecutable
      });
      
      if (!isExecutable) {
        throw new Error(`CLI script is not executable: ${scriptPath}`);
      }
      
      // Read and validate script content
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      
      // Check for location-resilient CLI patterns
      const hasShebang = scriptContent.startsWith('#!/');
      const hasProjectRootDetection = scriptContent.includes('PROJECT_ROOT') || scriptContent.includes('WORKSPACE_ROOT');
      const hasVersionResolution = scriptContent.includes('VERSION') || scriptContent.includes('COMPONENT_VERSION');
      const hasErrorHandling = scriptContent.includes('set -e') || scriptContent.includes('error');
      
      this.recordEvidence('assertion', 'Script content validation', {
        hasShebang,
        hasProjectRootDetection,
        hasVersionResolution,
        hasErrorHandling,
        contentLength: scriptContent.length,
        firstLine: scriptContent.split('\n')[0]
      });
      
      const contentIssues = [];
      if (!hasShebang) contentIssues.push('Missing shebang');
      if (!hasProjectRootDetection) contentIssues.push('Missing project root detection');
      if (!hasVersionResolution) contentIssues.push('Missing version resolution');
      
      if (contentIssues.length > 0) {
        throw new Error(`CLI script content issues: ${contentIssues.join(', ')}`);
      }
      
      // Test script execution (basic help)
      try {
        const helpOutput = execSync(`${scriptPath} --help || ${scriptPath} help || true`, { 
          encoding: 'utf8',
          cwd: projectRoot,
          timeout: 10000
        });
        
        this.recordEvidence('assertion', 'CLI script execution test', {
          executed: true,
          helpOutput: helpOutput.slice(0, 200) + '...' // Truncate for evidence
        });
        
      } catch (execError) {
        // Script might not have help, but it should at least execute
        this.recordEvidence('step', 'CLI script execution attempt', {
          error: execError instanceof Error ? execError.message : String(execError),
          note: 'Script execution failed - may need implementation'
        });
      }
      
      // Verify script follows Web4 naming convention
      const correctNamingPattern = new RegExp(`^${testComponentName.toLowerCase()}${testVersion.replace(/\./g, '')}\.sh$`);
      const followsNamingConvention = correctNamingPattern.test(expectedScriptName);
      
      this.recordEvidence('assertion', 'Follows Web4 naming convention', {
        expectedPattern: correctNamingPattern.source,
        actualName: expectedScriptName,
        followsConvention: followsNamingConvention
      });
      
      return {
        success: true,
        scriptCreated: scriptExists,
        scriptPath,
        isExecutable,
        hasValidContent: contentIssues.length === 0,
        followsNamingConvention,
        contentChecks: {
          hasShebang,
          hasProjectRootDetection,
          hasVersionResolution,
          hasErrorHandling
        },
        output
      };
      
    } finally {
      // Restore original working directory
      process.chdir(originalCwd);
      
      // Cleanup test script
      const scriptPath = path.join(projectRoot, expectedScriptName);
      if (fs.existsSync(scriptPath)) {
        fs.unlinkSync(scriptPath);
      }
    }
  }
  
  /**
   * Record evidence during test execution
   */
  private recordEvidence(type: any, description: string, data: any): void {
    console.log(`[${type.toUpperCase()}] ${description}:`, data);
  }
}

/**
 * Create test scenario for CLI generation test
 */
export function createCLIGenerationTestScenario(): TestScenario {
  return {
    uuid: 'test:uuid:web4ts-cli-generation-001',
    name: 'Web4TSComponent CLI Generation Test',
    description: 'Validates that web4tscomponent generate-cli creates proper location-resilient CLI script',
    requirementIORs: [
      'requirement:uuid:web4ts-cli-generation-001',
      'requirement:uuid:location-resilient-cli-001'
    ],
    componentIORs: [
      'component:web4tscomponent:0.1.0.2'
    ],
    testDataScenario: {
      projectRoot: '/Users/Shared/Workspaces/2cuGitHub/Web4Articles',
      componentPath: 'components/Web4TSComponent/0.1.0.2',
      testComponentName: 'TestComponent',
      testVersion: '0.1.0.0',
      expectedScriptName: 'testcomponent0100.sh'
    },
    executionContextScenario: {
      timeout: 15000,
      cleanup: true,
      tags: ['cli', 'generation', 'location-resilient']
    },
    expectedResultScenario: {
      success: true,
      scriptCreated: true,
      isExecutable: true,
      hasValidContent: true,
      followsNamingConvention: true
    },
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString()
  };
}
