/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { TestSuite, TestCase, TestResultScenario } from '../layer3/Test';

export class VitestTestSuite implements TestSuite {
  
  constructor() { // Web4 empty constructor
  }
  
  async executeTests(tests: TestCase[]): Promise<TestResultScenario[]> {
    const results: TestResultScenario[] = [];
    
    // Execute tests using Vitest integration
    for (const testCase of tests) {
      try {
        const result = await this.executeVitestTest(testCase);
        results.push(result);
      } catch (error: any) {
        // Create error result scenario
        results.push(this.createErrorResult(testCase, error));
      }
    }
    
    return results;
  }
  
  getImplementationName(): string {
    return 'vitest';
  }
  
  isAvailable(): boolean {
    try {
      // Check if Vitest is available
      require.resolve('vitest');
      return true;
    } catch {
      return false;
    }
  }
  
  private async executeVitestTest(testCase: TestCase): Promise<TestResultScenario> {
    // Convert Web4 TestCase to Vitest format and execute
    const metadata = testCase.getMetadata();
    
    return new Promise((resolve) => {
      // Create Vitest test
      const vitestTest = async () => {
        const result = await testCase.execute();
        resolve(result);
      };
      
      // Register with Vitest (if in test environment)
      if (typeof test !== 'undefined') {
        test(metadata.title, vitestTest);
      } else {
        // Direct execution if not in Vitest environment
        vitestTest();
      }
    });
  }
  
  private createErrorResult(testCase: TestCase, error: Error): TestResultScenario {
    const metadata = testCase.getMetadata();
    const timestamp = new Date().toISOString();
    
    return {
      testCaseUUID: metadata.uuid,
      executionId: `error-${Date.now()}`,
      status: 'error' as any,
      startTime: timestamp,
      endTime: timestamp,
      duration: 0,
      evidence: {
        input: null,
        expectedOutput: null,
        actualOutput: null,
        assertions: [],
        executionSteps: [],
        errorDetails: {
          message: error.message,
          stack: error.stack || '',
          code: 'VITEST_EXECUTION_ERROR'
        }
      },
      hibernatedAt: timestamp
    };
  }
}
