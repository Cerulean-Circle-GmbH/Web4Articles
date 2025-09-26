/**
 * TestProvider - Web4 test framework integration interface
 * Layer 3: Extensible test framework provider contract
 */

import { TestExecutionScenario, TestScenario } from './TestScenario';
import { TestSuiteExecutionResult, TestSuiteScenario } from './Web4TestSuite';

/**
 * TestProvider interface - extensible test framework integration
 * Enables multiple test frameworks (Vitest, Jest, custom) via common interface
 */
export interface TestProvider {
  /**
   * Provider name (e.g., 'vitest', 'jest', 'custom')
   */
  getName(): string;

  /**
   * Initialize provider with configuration
   * @param config Provider-specific configuration
   */
  init(config: any): Promise<void>;

  /**
   * Execute single test case via provider
   * @param testScenario Test scenario to execute
   * @returns TestExecutionScenario with results
   */
  executeTest(testScenario: TestScenario): Promise<TestExecutionScenario>;

  /**
   * Execute test suite via provider
   * @param suiteScenario Test suite scenario to execute
   * @param testScenarios Array of test scenarios in the suite
   * @returns TestSuiteExecutionResult with aggregated results
   */
  executeTestSuite(
    suiteScenario: TestSuiteScenario, 
    testScenarios: TestScenario[]
  ): Promise<TestSuiteExecutionResult>;

  /**
   * Check if provider is available and properly configured
   * @returns true if provider can execute tests
   */
  isAvailable(): Promise<boolean>;

  /**
   * Get provider capabilities
   * @returns object describing provider features
   */
  getCapabilities(): {
    supportsParallelExecution: boolean;
    supportsWatching: boolean;
    supportsCoverage: boolean;
    supportsSnapshots: boolean;
    supportsAsyncTests: boolean;
    supportsTimeouts: boolean;
  };

  /**
   * Cleanup provider resources
   */
  cleanup(): Promise<void>;
}

/**
 * VitestProvider - Vitest integration (primary provider for this project)
 */
export interface VitestProvider extends TestProvider {
  /**
   * Configure Vitest-specific options
   */
  configureVitest(options: VitestOptions): void;

  /**
   * Run Vitest with coverage
   */
  runWithCoverage(): Promise<CoverageReport>;
}

export interface VitestOptions {
  coverage?: boolean;
  watch?: boolean;
  ui?: boolean;
  reporter?: string[];
  threads?: boolean;
  isolate?: boolean;
  environment?: string;
}

export interface CoverageReport {
  totalLines: number;
  coveredLines: number;
  percentage: number;
  files: FileCoverage[];
}

export interface FileCoverage {
  filename: string;
  lines: number;
  covered: number;
  percentage: number;
}

/**
 * TSRangerTestAdapter - Compatibility with TSRanger v2.2 test inputs
 */
export interface TSRangerTestAdapter {
  /**
   * Convert TSRanger test input format to Web4 TestScenario
   * @param tsrangerInput TSRanger test input string
   * @returns TestScenario for Web4 execution
   */
  convertTSRangerInput(tsrangerInput: string): TestScenario;

  /**
   * Execute TSRanger-compatible test
   * @param tsrangerInput Original TSRanger test input
   * @returns TestExecutionScenario with results
   */
  executeTSRangerTest(tsrangerInput: string): Promise<TestExecutionScenario>;
}
