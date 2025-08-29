/**
 * Web4TSCTesting - Web4 Architecture Layer 3 Interface
 * Defines the contract for Web4TSComponent testing and validation
 */

export interface TestScenario {
  name: string;
  description: string;
  componentName: string;
  version: string;
  expectedFeatures: string[];
  testType: 'cli-generation' | 'standards-validation' | 'scaffolding' | 'performance' | 'error-handling';
}

export interface TestResult {
  scenarioName: string;
  passed: boolean;
  executionTimeMs: number;
  details: string;
  errors: string[];
  warnings: string[];
}

export interface TestReport {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  executionTimeMs: number;
  coveragePercentage: number;
  results: TestResult[];
}

export interface PerformanceBenchmark {
  operationName: string;
  averageResponseTimeMs: number;
  maxResponseTimeMs: number;
  minResponseTimeMs: number;
  memoryUsageMB: number;
  operationsPerSecond: number;
}

export interface CoverageReport {
  totalFeatures: number;
  coveredFeatures: number;
  coveragePercentage: number;
  uncoveredFeatures: string[];
  featureDetails: Map<string, boolean>;
}

export interface ValidationResult {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
  complianceScore: number;
}

export interface Web4TSCTesting {
  // Web4 Empty Constructor Principle
  // Component must be initialized empty, then configured

  // Configuration methods
  setWeb4TSComponentPath(path: string): void;
  setTestOutputPath(path: string): void;
  setTestMode(mode: 'basic' | 'comprehensive' | 'performance' | 'stress'): void;
  setTimeoutMs(timeoutMs: number): void;

  // Test execution methods
  runComprehensiveTests(): Promise<TestReport>;
  runSpecificTest(scenarioName: string): Promise<TestResult>;
  runPerformanceTests(): Promise<PerformanceBenchmark[]>;
  runStressTests(): Promise<TestReport>;

  // CLI Generation Testing
  testCLIGeneration(componentName: string, version: string): Promise<TestResult>;
  validateGeneratedCLI(cliPath: string): Promise<ValidationResult>;
  testLocationResilienceCompliance(cliPath: string): Promise<TestResult>;

  // Standards Validation Testing  
  testStandardsValidation(componentPath: string): Promise<TestResult>;
  testEmptyConstructorCompliance(componentPath: string): Promise<TestResult>;
  testScenarioSupportCompliance(componentPath: string): Promise<TestResult>;
  testArchitectureCompliance(componentPath: string): Promise<TestResult>;

  // Component Scaffolding Testing
  testComponentScaffolding(options: any): Promise<TestResult>;
  validateScaffoldedComponent(componentPath: string): Promise<ValidationResult>;
  testScaffoldingIntegrity(componentPath: string): Promise<TestResult>;

  // Error Handling Testing
  testErrorHandling(): Promise<TestResult[]>;
  testInvalidInputHandling(): Promise<TestResult>;
  testMissingDependencyHandling(): Promise<TestResult>;
  testCorruptedComponentRecovery(): Promise<TestResult>;

  // Reporting methods
  generateTestReport(): Promise<string>;
  generateCoverageReport(): Promise<CoverageReport>;
  generatePerformanceReport(): Promise<string>;
  exportTestResults(format: 'json' | 'xml' | 'html'): Promise<string>;

  // Benchmark methods
  benchmarkCLIGeneration(iterations: number): Promise<PerformanceBenchmark>;
  benchmarkStandardsValidation(componentCount: number): Promise<PerformanceBenchmark>;
  measureMemoryUsage(): Promise<number>;
  measureResponseTime(operation: string): Promise<number>;

  // Validation methods
  validateWeb4TSComponentInstallation(): Promise<ValidationResult>;
  validateTestEnvironment(): Promise<ValidationResult>;
  validateTestScenarios(): Promise<ValidationResult>;

  // Scenario support (Web4 Scenario-First Development)
  toScenario(): any;
  fromScenario(scenario: any): void;

  // Component lifecycle
  initialize(): Promise<void>;
  cleanup(): Promise<void>;
  reset(): Promise<void>;
}
