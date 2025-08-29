/**
 * Web4TestSuite - Web4 test suite interface
 * Layer 3: Test orchestration and grouping contract
 */

import { TestExecutionScenario } from './TestScenario';
import { Web4TestCase } from './Web4TestCase';

/**
 * TestSuiteScenario - scenario for test suite configuration
 */
export interface TestSuiteScenario {
  uuid: string;
  name: string;
  description: string;
  testCaseIORs: string[];
  parallelExecution: boolean;
  stopOnFirstFailure: boolean;
  timeout: number;
  tags: string[];
  createdAt: string;
  modifiedAt: string;
}

/**
 * TestSuiteExecutionResult - aggregated results from suite execution
 */
export interface TestSuiteExecutionResult {
  suiteScenarioIOR: string;
  executionId: string;
  startTime: string;
  endTime: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  testExecutionScenarios: TestExecutionScenario[];
  aggregatedEvidence: any[];
  suiteStatus: 'passed' | 'failed' | 'error';
  performanceMetrics: {
    totalExecutionTimeMs: number;
    averageTestTimeMs: number;
    maxTestTimeMs: number;
    minTestTimeMs: number;
    totalMemoryUsageMB: number;
  };
}

/**
 * Web4TestSuite interface - test case orchestration as Web4 object
 */
export interface Web4TestSuite {
  /**
   * Web4 empty constructor principle
   */
  constructor(): void;

  /**
   * Initialize test suite from scenario
   * @param scenario TestSuiteScenario containing suite configuration
   * @returns this for method chaining
   */
  init(scenario: TestSuiteScenario): Web4TestSuite;

  /**
   * Add test case to suite via IOR
   * @param testCaseIOR Internet Object Reference to test case
   */
  addTestCase(testCaseIOR: string): void;

  /**
   * Remove test case from suite
   * @param testCaseIOR Internet Object Reference to test case
   */
  removeTestCase(testCaseIOR: string): void;

  /**
   * Execute all test cases in the suite
   * @returns TestSuiteExecutionResult with aggregated results
   */
  executeAll(): Promise<TestSuiteExecutionResult>;

  /**
   * Execute specific test cases by tags
   * @param tags Filter tests by these tags
   * @returns TestSuiteExecutionResult with filtered results
   */
  executeByTags(tags: string[]): Promise<TestSuiteExecutionResult>;

  /**
   * Convert test suite to hibernatable scenario
   * @returns TestSuiteScenario for state preservation
   */
  toScenario(): TestSuiteScenario;

  /**
   * Get suite UUID
   */
  getUUID(): string;

  /**
   * Get all test case IORs in the suite
   */
  getTestCaseIORs(): string[];

  /**
   * Validate suite configuration
   * @returns true if suite is properly configured
   */
  validate(): boolean;
}
