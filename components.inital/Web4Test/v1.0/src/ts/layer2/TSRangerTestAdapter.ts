/**
 * Layer 2: Implementation
 * TSRanger test input compatibility adapter
 */

import { TestCase, TestCaseScenario, TestStatus } from '../layer3/Test';

export interface TSRangerTestInput {
  input: string;
  description?: string;
  expectedBehavior?: string;
}

export class TSRangerTestAdapter {
  
  constructor() { // Web4 empty constructor
  }
  
  /**
   * Convert TSRanger test input to Web4 TestCase scenario
   */
  convertToTestCaseScenario(tsrangerInput: TSRangerTestInput): TestCaseScenario {
    const uuid = this.generateUUID();
    const timestamp = new Date().toISOString();
    
    return {
      metadata: {
        uuid,
        title: `TSRanger Test: ${tsrangerInput.input}`,
        description: tsrangerInput.description || `Test TSRanger input: ${tsrangerInput.input}`,
        status: TestStatus.PENDING,
        createdAt: timestamp,
        requirementIORs: [],
        tags: ['tsranger', 'compatibility', 'input-test']
      },
      testLogic: {
        type: 'function',
        implementation: this.generateTSRangerTestFunction(tsrangerInput),
        parameters: [tsrangerInput.input]
      },
      assertions: this.generateTSRangerAssertions(tsrangerInput),
      setup: {
        actions: [
          'process.env.TSRANGER_TEST_MODE = "1"',
          `process.env.TSRANGER_TEST_INPUT = "${tsrangerInput.input}"`
        ],
        data: { originalInput: tsrangerInput.input }
      },
      teardown: {
        actions: [
          'delete process.env.TSRANGER_TEST_MODE',
          'delete process.env.TSRANGER_TEST_INPUT'
        ],
        cleanup: true
      }
    };
  }
  
  /**
   * Create multiple TestCase scenarios from TSRanger test input string
   */
  createTestCasesFromInput(inputString: string): TestCaseScenario[] {
    const inputs = this.parseTSRangerInput(inputString);
    return inputs.map(input => this.convertToTestCaseScenario(input));
  }
  
  /**
   * Parse TSRanger TSRANGER_TEST_INPUT format
   */
  private parseTSRangerInput(inputString: string): TSRangerTestInput[] {
    const inputs: TSRangerTestInput[] = [];
    
    // Handle different TSRanger input formats:
    // 1. Simple command: "g[tab]c"
    // 2. Multi-step: "g[tab]c[enter]"  
    // 3. Complex sequence: "Logger[down][right]log[enter]"
    
    const sequences = inputString.split(/\[enter\]|\n/).filter(s => s.trim());
    
    sequences.forEach((sequence, index) => {
      inputs.push({
        input: sequence.trim(),
        description: `TSRanger test sequence ${index + 1}`,
        expectedBehavior: this.inferExpectedBehavior(sequence.trim())
      });
    });
    
    return inputs;
  }
  
  private generateTSRangerTestFunction(tsrangerInput: TSRangerTestInput): string {
    return `
      async function(input) {
        // Import TSRanger test execution
        const { execSync } = require('child_process');
        const path = require('path');
        
        // Set up test environment
        process.env.TSRANGER_TEST_MODE = '1';
        process.env.TSRANGER_TEST_INPUT = input;
        
        try {
          // Execute TSRanger with test input
          const tsrangerPath = path.join(process.cwd(), 'components/TSRanger/v2.2/sh/tsranger');
          const result = execSync(\`"\${tsrangerPath}" test "\${input}"\`, {
            encoding: 'utf8',
            timeout: 5000,
            env: process.env
          });
          
          return {
            success: true,
            output: result,
            input: input
          };
        } catch (error) {
          return {
            success: false,
            error: error.message,
            input: input
          };
        } finally {
          // Cleanup
          delete process.env.TSRANGER_TEST_MODE;
          delete process.env.TSRANGER_TEST_INPUT;
        }
      }
    `;
  }
  
  private generateTSRangerAssertions(tsrangerInput: TSRangerTestInput): any[] {
    const assertions = [];
    
    // Basic success assertion
    assertions.push({
      type: 'equals',
      description: 'TSRanger execution should succeed',
      expression: 'result.success',
      expected: true
    });
    
    // Input preservation assertion
    assertions.push({
      type: 'equals',
      description: 'Input should be preserved',
      expression: 'result.input',
      expected: tsrangerInput.input
    });
    
    // Output validation if expected behavior is defined
    if (tsrangerInput.expectedBehavior) {
      assertions.push({
        type: 'contains',
        description: 'Output should contain expected behavior',
        expression: 'result.output',
        expected: tsrangerInput.expectedBehavior
      });
    }
    
    // Error handling assertion
    assertions.push({
      type: 'custom',
      description: 'Should handle errors gracefully',
      implementation: `
        function(assertion) {
          const result = eval('result');
          if (!result.success && result.error) {
            return {
              description: assertion.description,
              expected: 'graceful error handling',
              actual: result.error,
              passed: result.error.length > 0,
              message: result.success ? 'No error to handle' : 'Error handled gracefully'
            };
          }
          return {
            description: assertion.description,
            expected: 'no error',
            actual: 'success',
            passed: true,
            message: 'Execution successful, no error handling needed'
          };
        }
      `
    });
    
    return assertions;
  }
  
  private inferExpectedBehavior(input: string): string {
    // Infer expected behavior from TSRanger input patterns
    if (input.includes('[tab]')) {
      return 'tab completion';
    }
    if (input.includes('[down]') || input.includes('[up]')) {
      return 'navigation';
    }
    if (input.includes('[right]') || input.includes('[left]')) {
      return 'advancement';
    }
    if (input.includes('[enter]')) {
      return 'execution';
    }
    if (input.includes('[backspace]')) {
      return 'editing';
    }
    
    return 'command processing';
  }
  
  private generateUUID(): string {
    return 'tsranger-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}
