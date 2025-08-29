/**
 * Web4Requirement - Web4 requirement interface
 * Layer 3: Requirement tracking and traceability contract
 */

import { RequirementScenario, TraceabilityLink } from './TestScenario';

/**
 * RequirementStatus - possible requirement states
 */
export type RequirementStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

/**
 * Web4Requirement interface - requirement as Web4 object with test traceability
 */
export interface Web4Requirement {
  /**
   * Web4 empty constructor principle
   */
  constructor(): void;

  /**
   * Initialize requirement from scenario
   * @param scenario RequirementScenario containing requirement data
   * @returns this for method chaining
   */
  init(scenario: RequirementScenario): Web4Requirement;

  /**
   * Update requirement status
   * @param status New requirement status
   * @param reason Optional reason for status change
   */
  updateStatus(status: RequirementStatus, reason?: string): void;

  /**
   * Add test case that validates this requirement
   * @param testCaseIOR Internet Object Reference to test case
   */
  addTestCase(testCaseIOR: string): void;

  /**
   * Remove test case from requirement
   * @param testCaseIOR Internet Object Reference to test case
   */
  removeTestCase(testCaseIOR: string): void;

  /**
   * Add traceability link to another object
   * @param link TraceabilityLink to related object
   */
  addTraceabilityLink(link: TraceabilityLink): void;

  /**
   * Get requirement completion percentage based on test results
   * @returns percentage (0-100) of requirement completion
   */
  getCompletionPercentage(): Promise<number>;

  /**
   * Convert requirement to hibernatable scenario
   * @returns RequirementScenario for state preservation
   */
  toScenario(): RequirementScenario;

  /**
   * Get requirement UUID
   */
  getUUID(): string;

  /**
   * Get requirement status
   */
  getStatus(): RequirementStatus;

  /**
   * Get all test case IORs for this requirement
   */
  getTestCaseIORs(): string[];

  /**
   * Get traceability chain (7-stage)
   */
  getTraceabilityChain(): TraceabilityLink[];

  /**
   * Generate markdown view of requirement for documentation
   * @returns markdown string representation
   */
  generateMDView(): string;

  /**
   * Validate requirement configuration
   * @returns true if requirement is properly configured
   */
  validate(): boolean;
}
