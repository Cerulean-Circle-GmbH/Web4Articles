/**
 * Layer 3: Interface Definition
 * Web4 Test and TestCase interface contracts
 */

export enum TestStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  PASSED = 'passed', 
  FAILED = 'failed',
  SKIPPED = 'skipped',
  ERROR = 'error'
}

export interface TestCaseMetadata {
  uuid: string;
  title: string;
  description: string;
  status: TestStatus;
  createdAt: string;
  executedAt?: string;
  duration?: number;
  requirementIORs: IOR[];
  tags: string[];
}

export interface TestEvidence {
  input: any;
  expectedOutput: any;
  actualOutput: any;
  assertions: AssertionResult[];
  executionSteps: ExecutionStep[];
  errorDetails?: ErrorDetails;
}

export interface AssertionResult {
  description: string;
  expected: any;
  actual: any;
  passed: boolean;
  message?: string;
}

export interface ExecutionStep {
  step: number;
  action: string;
  timestamp: string;
  result: any;
}

export interface ErrorDetails {
  message: string;
  stack: string;
  code?: string;
  line?: number;
}

export interface TestCaseScenario {
  metadata: TestCaseMetadata;
  testLogic: TestLogicDefinition;
  assertions: AssertionDefinition[];
  setup?: TestSetupDefinition;
  teardown?: TestTeardownDefinition;
}

export interface TestLogicDefinition {
  type: 'function' | 'class' | 'scenario';
  implementation: string;
  parameters: any[];
}

export interface AssertionDefinition {
  type: 'equals' | 'contains' | 'throws' | 'custom';
  description: string;
  expression: string;
}

export interface TestSetupDefinition {
  actions: string[];
  data: any;
}

export interface TestTeardownDefinition {
  actions: string[];
  cleanup: boolean;
}

export interface TestResultScenario {
  testCaseUUID: string;
  executionId: string;
  status: TestStatus;
  startTime: string;
  endTime: string;
  duration: number;
  evidence: TestEvidence;
  hibernatedAt: string;
}

export interface TestCase {
  /**
   * Web4 scenario initialization
   */
  init(scenario: TestCaseScenario): this;
  
  /**
   * Execute test case
   */
  execute(): Promise<TestResultScenario>;
  
  /**
   * Get test metadata
   */
  getMetadata(): TestCaseMetadata;
  
  /**
   * Add requirement traceability
   */
  addRequirementReference(requirementIOR: IOR): void;
  
  /**
   * Setup test environment
   */
  setup(): Promise<void>;
  
  /**
   * Cleanup test environment  
   */
  teardown(): Promise<void>;
  
  /**
   * Serialize component state to scenario
   */
  toScenario(): TestCaseScenario;
}

export interface TestScenario {
  name: string;
  description: string;
  testCaseIORs: IOR[];
  suiteConfiguration: TestSuiteConfiguration;
}

export interface TestSuiteConfiguration {
  parallel: boolean;
  timeout: number;
  retries: number;
  bail: boolean;
  reporter: string;
  environment: string;
}

export interface TestSuiteResult {
  suiteId: string;
  name: string;
  status: TestStatus;
  startTime: string;
  endTime: string;
  duration: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  testResults: TestResultScenario[];
}

export interface Test {
  /**
   * Web4 scenario initialization
   */
  init(scenario: TestScenario): this;
  
  /**
   * Add test case to suite
   */
  addTestCase(testCase: TestCase): void;
  
  /**
   * Execute all test cases
   */
  execute(): Promise<TestSuiteResult>;
  
  /**
   * Get test cases
   */
  getTestCases(): TestCase[];
  
  /**
   * Serialize component state to scenario
   */
  toScenario(): TestScenario;
}

export interface TestSuite {
  /**
   * Execute tests using specific implementation
   */
  executeTests(tests: TestCase[]): Promise<TestResultScenario[]>;
  
  /**
   * Get implementation name
   */
  getImplementationName(): string;
  
  /**
   * Check if implementation is available
   */
  isAvailable(): boolean;
}

export interface IOR {
  uuid: string;
  type: string;
  location: string;
  resolve(): Promise<any>;
}
