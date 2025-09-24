/**
 * DefaultWeb4TestSuite - Web4 test suite implementation
 * Layer 2: Test orchestration implementation following Web4 principles
 */

import { Web4TestSuite, TestSuiteScenario, TestSuiteExecutionResult } from '../layer3/Web4TestSuite';
import { TestExecutionScenario } from '../layer3/TestScenario';
import { IORResolver } from './IORResolver';

/**
 * DefaultWeb4TestSuite - Web4 test suite implementation
 * Orchestrates multiple test cases with parallel/serial execution
 */
export class DefaultWeb4TestSuite implements Web4TestSuite {
  private scenario?: TestSuiteScenario;
  private iorResolver: IORResolver;

  /**
   * Web4 empty constructor principle
   */
  constructor() {
    this.iorResolver = new IORResolver();
  }

  /**
   * Initialize test suite from scenario
   */
  init(scenario: TestSuiteScenario): Web4TestSuite {
    this.scenario = scenario;
    return this;
  }

  /**
   * Add test case to suite via IOR
   */
  addTestCase(testCaseIOR: string): void {
    if (!this.scenario) {
      throw new Error('TestSuite not initialized - call init(scenario) first');
    }
    
    if (!this.scenario.testCaseIORs.includes(testCaseIOR)) {
      this.scenario.testCaseIORs.push(testCaseIOR);
      this.scenario.modifiedAt = new Date().toISOString();
    }
  }

  /**
   * Remove test case from suite
   */
  removeTestCase(testCaseIOR: string): void {
    if (!this.scenario) {
      throw new Error('TestSuite not initialized - call init(scenario) first');
    }
    
    const index = this.scenario.testCaseIORs.indexOf(testCaseIOR);
    if (index > -1) {
      this.scenario.testCaseIORs.splice(index, 1);
      this.scenario.modifiedAt = new Date().toISOString();
    }
  }

  /**
   * Execute all test cases in the suite
   */
  async executeAll(): Promise<TestSuiteExecutionResult> {
    if (!this.scenario) {
      throw new Error('TestSuite not initialized - call init(scenario) first');
    }

    const executionId = this.generateExecutionId();
    const startTime = new Date().toISOString();
    const testExecutions: TestExecutionScenario[] = [];

    try {
      // Resolve all test case IORs to actual test case objects
      const testCases = await Promise.all(
        this.scenario.testCaseIORs.map(ior => this.iorResolver.resolveTestCase(ior))
      );

      // Execute tests in parallel or serial based on configuration
      if (this.scenario.parallelExecution) {
        const results = await Promise.allSettled(
          testCases.map(testCase => this.executeTestCase(testCase))
        );
        
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            testExecutions.push(result.value);
          } else {
            // Handle rejected promises
            testExecutions.push(this.createErrorExecution(
              this.scenario!.testCaseIORs[index],
              result.reason
            ));
          }
          
          // Stop on first failure if configured
          if (this.scenario!.stopOnFirstFailure && result.status === 'rejected') {
            return;
          }
        });
      } else {
        // Serial execution
        for (const testCase of testCases) {
          try {
            const result = await this.executeTestCase(testCase);
            testExecutions.push(result);
            
            // Stop on first failure if configured
            if (this.scenario.stopOnFirstFailure && result.status === 'failed') {
              break;
            }
          } catch (error) {
            const errorExecution = this.createErrorExecution(
              testCase.getUUID(),
              error
            );
            testExecutions.push(errorExecution);
            
            if (this.scenario.stopOnFirstFailure) {
              break;
            }
          }
        }
      }

      const endTime = new Date().toISOString();
      
      return this.createSuiteResult(
        executionId,
        startTime,
        endTime,
        testExecutions
      );

    } catch (error) {
      const endTime = new Date().toISOString();
      
      return {
        suiteScenarioIOR: this.scenario.uuid,
        executionId,
        startTime,
        endTime,
        totalTests: this.scenario.testCaseIORs.length,
        passedTests: 0,
        failedTests: 0,
        skippedTests: this.scenario.testCaseIORs.length,
        testExecutionScenarios: testExecutions,
        aggregatedEvidence: [],
        suiteStatus: 'error',
        performanceMetrics: {
          totalExecutionTimeMs: new Date(endTime).getTime() - new Date(startTime).getTime(),
          averageTestTimeMs: 0,
          maxTestTimeMs: 0,
          minTestTimeMs: 0,
          totalMemoryUsageMB: 0
        }
      };
    }
  }

  /**
   * Execute specific test cases by tags
   */
  async executeByTags(tags: string[]): Promise<TestSuiteExecutionResult> {
    if (!this.scenario) {
      throw new Error('TestSuite not initialized - call init(scenario) first');
    }

    // Filter test cases by tags
    const filteredIORs = await this.filterTestCasesByTags(tags);
    
    // Create temporary scenario with filtered test cases
    const filteredScenario: TestSuiteScenario = {
      ...this.scenario,
      testCaseIORs: filteredIORs,
      uuid: `${this.scenario.uuid}-filtered-${Date.now()}`
    };

    // Create temporary suite for execution
    const filteredSuite = new DefaultWeb4TestSuite();
    filteredSuite.init(filteredScenario);
    
    return await filteredSuite.executeAll();
  }

  /**
   * Convert test suite to hibernatable scenario
   */
  toScenario(): TestSuiteScenario {
    if (!this.scenario) {
      throw new Error('TestSuite not initialized - call init(scenario) first');
    }
    
    return {
      ...this.scenario,
      modifiedAt: new Date().toISOString()
    };
  }

  /**
   * Get suite UUID
   */
  getUUID(): string {
    if (!this.scenario) {
      throw new Error('TestSuite not initialized - call init(scenario) first');
    }
    return this.scenario.uuid;
  }

  /**
   * Get all test case IORs in the suite
   */
  getTestCaseIORs(): string[] {
    return this.scenario?.testCaseIORs || [];
  }

  /**
   * Validate suite configuration
   */
  validate(): boolean {
    return !!(
      this.scenario &&
      this.scenario.uuid &&
      this.scenario.name &&
      this.scenario.testCaseIORs.length > 0
    );
  }

  /**
   * Execute individual test case
   */
  private async executeTestCase(testCase: any): Promise<TestExecutionScenario> {
    return await testCase.execute();
  }

  /**
   * Create error execution result
   */
  private createErrorExecution(testCaseIOR: string, error: any): TestExecutionScenario {
    return {
      testScenarioIOR: testCaseIOR,
      executionId: this.generateExecutionId(),
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      status: 'error',
      actualResultScenario: null,
      evidenceScenarios: [],
      errorDetails: error instanceof Error ? error.message : String(error),
      performanceMetrics: {
        executionTimeMs: 0,
        memoryUsageMB: 0
      }
    };
  }

  /**
   * Create suite execution result
   */
  private createSuiteResult(
    executionId: string,
    startTime: string,
    endTime: string,
    testExecutions: TestExecutionScenario[]
  ): TestSuiteExecutionResult {
    const totalTests = testExecutions.length;
    const passedTests = testExecutions.filter(e => e.status === 'passed').length;
    const failedTests = testExecutions.filter(e => e.status === 'failed').length;
    const skippedTests = totalTests - passedTests - failedTests;
    
    const executionTimes = testExecutions
      .filter(e => e.performanceMetrics)
      .map(e => e.performanceMetrics!.executionTimeMs);
    
    return {
      suiteScenarioIOR: this.scenario!.uuid,
      executionId,
      startTime,
      endTime,
      totalTests,
      passedTests,
      failedTests,
      skippedTests,
      testExecutionScenarios: testExecutions,
      aggregatedEvidence: testExecutions.flatMap(e => e.evidenceScenarios),
      suiteStatus: failedTests === 0 ? 'passed' : 'failed',
      performanceMetrics: {
        totalExecutionTimeMs: new Date(endTime).getTime() - new Date(startTime).getTime(),
        averageTestTimeMs: executionTimes.length > 0 
          ? executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length 
          : 0,
        maxTestTimeMs: executionTimes.length > 0 ? Math.max(...executionTimes) : 0,
        minTestTimeMs: executionTimes.length > 0 ? Math.min(...executionTimes) : 0,
        totalMemoryUsageMB: testExecutions
          .filter(e => e.performanceMetrics)
          .reduce((sum, e) => sum + e.performanceMetrics!.memoryUsageMB, 0)
      }
    };
  }

  /**
   * Filter test cases by tags
   */
  private async filterTestCasesByTags(tags: string[]): Promise<string[]> {
    const filteredIORs: string[] = [];
    
    for (const ior of this.scenario!.testCaseIORs) {
      try {
        const testCase = await this.iorResolver.resolveTestCase(ior);
        const metadata = testCase.getMetadata();
        
        // Check if test case has any of the requested tags
        if (metadata.tags.some(tag => tags.includes(tag))) {
          filteredIORs.push(ior);
        }
      } catch (error) {
        // Skip test cases that cannot be resolved
        console.warn(`Cannot resolve test case IOR: ${ior}`, error);
      }
    }
    
    return filteredIORs;
  }

  /**
   * Generate unique execution ID
   */
  private generateExecutionId(): string {
    return `suite-exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
