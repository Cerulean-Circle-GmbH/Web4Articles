/**
 * Web4TestCase - Web4 test case interface
 * Layer 3: Core test case contract for Web4 object-oriented testing
 */

import { TestScenario, TestExecutionScenario } from './TestScenario';

/**
 * Web4TestCase interface - individual test case as Web4 object
 * Follows Web4 principles: empty constructor, scenario initialization, hibernation
 */
export interface Web4TestCase {

  /**
   * Initialize test case from scenario (Web4 pattern)
   * @param scenario TestScenario containing test configuration and data
   * @returns this for method chaining
   */
  init(scenario: TestScenario): Web4TestCase;

  /**
   * Execute the test case
   * @returns TestExecutionScenario with results and evidence
   */
  execute(): Promise<TestExecutionScenario>;

  /**
   * Convert test case to hibernatable scenario
   * @returns TestScenario for state preservation
   */
  toScenario(): TestScenario;

  /**
   * Get test case UUID
   */
  getUUID(): string;

  /**
   * Get requirement IORs this test case validates
   */
  getRequirementIORs(): string[];

  /**
   * Get component IORs this test case tests
   */
  getComponentIORs(): string[];

  /**
   * Validate test case configuration
   * @returns true if test case is properly configured
   */
  validate(): boolean;

  /**
   * Get test case metadata
   */
  getMetadata(): {
    name: string;
    description: string;
    tags: string[];
    priority: 'low' | 'medium' | 'high' | 'critical';
    timeout: number;
  };
}
