/**
 * DefaultWeb4TestCase - Web4 test case implementation
 * Layer 2: Core test case implementation following Web4 principles
 */

import { Web4TestCase } from '../layer3/Web4TestCase';
import { TestScenario, TestExecutionScenario, EvidenceScenario } from '../layer3/TestScenario';

/**
 * DefaultWeb4TestCase - Web4 test case implementation
 * Follows Web4 principles: empty constructor, scenario initialization, hibernation
 */
export class DefaultWeb4TestCase implements Web4TestCase {
  private scenario?: TestScenario;
  private evidence: EvidenceScenario[] = [];

  /**
   * Web4 empty constructor principle - no dependencies
   */
  constructor() {}

  /**
   * Initialize test case from scenario (Web4 pattern)
   */
  init(scenario: TestScenario): Web4TestCase {
    this.scenario = scenario;
    this.evidence = [];
    return this;
  }

  /**
   * Execute the test case
   */
  async execute(): Promise<TestExecutionScenario> {
    if (!this.scenario) {
      throw new Error('TestCase not initialized - call init(scenario) first');
    }

    const executionId = this.generateExecutionId();
    const startTime = new Date().toISOString();

    try {
      // Record test start evidence
      this.recordEvidence('step', 'Test execution started', {
        testName: this.scenario.name,
        executionId
      });

      // Execute test business logic based on scenario
      const result = await this.executeTestLogic();

      const endTime = new Date().toISOString();
      const executionTimeMs = new Date(endTime).getTime() - new Date(startTime).getTime();

      // Record success evidence
      this.recordEvidence('output', 'Test execution completed successfully', result);

      return {
        testScenarioIOR: this.scenario.uuid,
        executionId,
        startTime,
        endTime,
        status: 'passed',
        actualResultScenario: result,
        evidenceScenarios: [...this.evidence],
        performanceMetrics: {
          executionTimeMs,
          memoryUsageMB: this.measureMemoryUsage()
        }
      };

    } catch (error) {
      const endTime = new Date().toISOString();
      const executionTimeMs = new Date(endTime).getTime() - new Date(startTime).getTime();

      // Record error evidence
      this.recordEvidence('error', 'Test execution failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });

      return {
        testScenarioIOR: this.scenario.uuid,
        executionId,
        startTime,
        endTime,
        status: 'failed',
        actualResultScenario: null,
        evidenceScenarios: [...this.evidence],
        errorDetails: error instanceof Error ? error.message : String(error),
        performanceMetrics: {
          executionTimeMs,
          memoryUsageMB: this.measureMemoryUsage()
        }
      };
    }
  }

  /**
   * Execute test-specific business logic - override in subclasses
   */
  protected async executeTestLogic(): Promise<any> {
    // Default implementation - can be overridden by specific test cases
    if (!this.scenario?.testDataScenario) {
      throw new Error('No test data scenario provided');
    }

    // Basic validation: check if expected result matches test data
    const { input, expected } = this.scenario.testDataScenario;
    
    // Record input evidence
    this.recordEvidence('input', 'Test input data', input);

    // Simulate test execution - in real tests, this would call actual code
    const actual = await this.processTestInput(input);

    // Record assertion evidence
    this.recordEvidence('assertion', 'Comparing expected vs actual', {
      expected,
      actual,
      matches: JSON.stringify(expected) === JSON.stringify(actual)
    });

    if (JSON.stringify(expected) !== JSON.stringify(actual)) {
      throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
    }

    return actual;
  }

  /**
   * Process test input - override in specific test implementations
   */
  protected async processTestInput(input: any): Promise<any> {
    // Default implementation - echo the input
    // In real test cases, this would call the code being tested
    return input;
  }

  /**
   * Convert test case to hibernatable scenario
   */
  toScenario(): TestScenario {
    if (!this.scenario) {
      throw new Error('TestCase not initialized - call init(scenario) first');
    }
    
    // Return deep copy to prevent mutation
    return {
      ...this.scenario,
      modifiedAt: new Date().toISOString()
    };
  }

  /**
   * Get test case UUID
   */
  getUUID(): string {
    if (!this.scenario) {
      throw new Error('TestCase not initialized - call init(scenario) first');
    }
    return this.scenario.uuid;
  }

  /**
   * Get requirement IORs this test case validates
   */
  getRequirementIORs(): string[] {
    return this.scenario?.requirementIORs || [];
  }

  /**
   * Get component IORs this test case tests
   */
  getComponentIORs(): string[] {
    return this.scenario?.componentIORs || [];
  }

  /**
   * Validate test case configuration
   */
  validate(): boolean {
    return !!(
      this.scenario &&
      this.scenario.uuid &&
      this.scenario.name &&
      this.scenario.testDataScenario
    );
  }

  /**
   * Get test case metadata
   */
  getMetadata() {
    return {
      name: this.scenario?.name || 'Unknown Test',
      description: this.scenario?.description || 'No description provided',
      tags: this.extractTags(),
      priority: this.extractPriority(),
      timeout: 30000 // Default 30 second timeout
    };
  }

  /**
   * Record evidence during test execution
   */
  private recordEvidence(type: EvidenceScenario['type'], description: string, data: any): void {
    this.evidence.push({
      uuid: this.generateUUID(),
      type,
      timestamp: new Date().toISOString(),
      data,
      description
    });
  }

  /**
   * Generate unique execution ID
   */
  private generateExecutionId(): string {
    return `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate UUID v4
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Extract tags from scenario
   */
  private extractTags(): string[] {
    // Extract tags from scenario name/description or use defaults
    const tags = [];
    if (this.scenario?.name.includes('Web4TSComponent')) tags.push('web4tscomponent');
    if (this.scenario?.name.includes('Version')) tags.push('version');
    if (this.scenario?.name.includes('CLI')) tags.push('cli');
    return tags.length > 0 ? tags : ['general'];
  }

  /**
   * Extract priority from scenario
   */
  private extractPriority(): 'low' | 'medium' | 'high' | 'critical' {
    if (this.scenario?.name.includes('Critical')) return 'critical';
    if (this.scenario?.name.includes('High')) return 'high';
    if (this.scenario?.name.includes('Low')) return 'low';
    return 'medium';
  }

  /**
   * Measure memory usage (simplified)
   */
  private measureMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed / 1024 / 1024; // MB
    }
    return 0; // Browser environment
  }
}
