/**
 * IORResolver - Internet Object Reference resolution
 * Layer 2: Implementation for resolving IORs to actual Web4 objects
 */

import { Web4TestCase } from '../layer3/Web4TestCase';
import { Web4Requirement } from '../layer3/Web4Requirement';
import { DefaultWeb4TestCase } from './DefaultWeb4TestCase';
import { DefaultWeb4Requirement } from './DefaultWeb4Requirement';

/**
 * IORResolver - Resolves Internet Object References to Web4 objects
 * Handles local and (future) remote object resolution
 */
export class IORResolver {
  private localRegistry: Map<string, any> = new Map();

  constructor() {}

  /**
   * Register a local object with its IOR
   * @param ior Internet Object Reference
   * @param object The actual object instance
   */
  registerLocalObject(ior: string, object: any): void {
    this.localRegistry.set(ior, object);
  }

  /**
   * Resolve test case IOR to Web4TestCase object
   * @param ior Test case Internet Object Reference
   * @returns Web4TestCase instance
   */
  async resolveTestCase(ior: string): Promise<Web4TestCase> {
    // Check local registry first
    if (this.localRegistry.has(ior)) {
      return this.localRegistry.get(ior) as Web4TestCase;
    }

    // Try to resolve from IOR format
    if (ior.startsWith('test:')) {
      return await this.resolveTestCaseFromIOR(ior);
    }

    throw new Error(`Cannot resolve test case IOR: ${ior}`);
  }

  /**
   * Resolve requirement IOR to Web4Requirement object
   * @param ior Requirement Internet Object Reference
   * @returns Web4Requirement instance
   */
  async resolveRequirement(ior: string): Promise<Web4Requirement> {
    // Check local registry first
    if (this.localRegistry.has(ior)) {
      return this.localRegistry.get(ior) as Web4Requirement;
    }

    // Try to resolve from IOR format
    if (ior.startsWith('requirement:')) {
      return await this.resolveRequirementFromIOR(ior);
    }

    throw new Error(`Cannot resolve requirement IOR: ${ior}`);
  }

  /**
   * Resolve generic object IOR
   * @param ior Internet Object Reference
   * @returns Resolved object
   */
  async resolveObject(ior: string): Promise<any> {
    // Check local registry first
    if (this.localRegistry.has(ior)) {
      return this.localRegistry.get(ior);
    }

    // Parse IOR to determine object type
    const [objectType] = ior.split(':');

    switch (objectType) {
      case 'test':
        return await this.resolveTestCase(ior);
      case 'requirement':
        return await this.resolveRequirement(ior);
      case 'component':
        return await this.resolveComponent(ior);
      default:
        throw new Error(`Unknown object type in IOR: ${ior}`);
    }
  }

  /**
   * Check if IOR is resolvable
   * @param ior Internet Object Reference
   * @returns true if IOR can be resolved
   */
  async isResolvable(ior: string): Promise<boolean> {
    try {
      await this.resolveObject(ior);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all registered local IORs
   * @returns Array of registered IORs
   */
  getLocalIORs(): string[] {
    return Array.from(this.localRegistry.keys());
  }

  /**
   * Clear local registry
   */
  clearLocalRegistry(): void {
    this.localRegistry.clear();
  }

  /**
   * Resolve test case from IOR format
   * @param ior Test case IOR (e.g., "test:uuid:12345-67890")
   */
  private async resolveTestCaseFromIOR(ior: string): Promise<Web4TestCase> {
    // Parse IOR: test:uuid:actual-uuid or test:file:path/to/test
    const parts = ior.split(':');
    
    if (parts.length >= 3 && parts[1] === 'uuid') {
      // Try to load test case by UUID
      // For now, create a mock test case - in real implementation,
      // this would load from storage or registry
      const testCase = new DefaultWeb4TestCase();
      
      // Create minimal scenario for resolution
      const scenario = {
        uuid: parts[2],
        name: `Test Case ${parts[2]}`,
        description: `Test case resolved from IOR: ${ior}`,
        requirementIORs: [],
        componentIORs: [],
        testDataScenario: {
          input: {},
          expected: {}
        },
        executionContextScenario: {},
        expectedResultScenario: {},
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      };
      
      testCase.init(scenario);
      
      // Register for future lookups
      this.registerLocalObject(ior, testCase);
      
      return testCase;
    }

    throw new Error(`Invalid test case IOR format: ${ior}`);
  }

  /**
   * Resolve requirement from IOR format
   * @param ior Requirement IOR (e.g., "requirement:uuid:12345-67890")
   */
  private async resolveRequirementFromIOR(ior: string): Promise<Web4Requirement> {
    const parts = ior.split(':');
    
    if (parts.length >= 3 && parts[1] === 'uuid') {
      const requirement = new DefaultWeb4Requirement();
      
      // Create minimal scenario for resolution
      const scenario = {
        uuid: parts[2],
        name: `Requirement ${parts[2]}`,
        description: `Requirement resolved from IOR: ${ior}`,
        status: 'pending' as const,
        testCaseIORs: [],
        componentIORs: [],
        traceabilityChain: [],
        acceptance_criteria: [],
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      };
      
      requirement.init(scenario);
      
      // Register for future lookups
      this.registerLocalObject(ior, requirement);
      
      return requirement;
    }

    throw new Error(`Invalid requirement IOR format: ${ior}`);
  }

  /**
   * Resolve component from IOR format
   * @param ior Component IOR (e.g., "component:web4tscomponent:0.1.0.2")
   */
  private async resolveComponent(ior: string): Promise<any> {
    // For now, return a mock component object
    // In real implementation, this would load the actual component
    return {
      ior,
      type: 'component',
      name: ior.split(':')[1] || 'unknown',
      version: ior.split(':')[2] || 'unknown'
    };
  }
}
