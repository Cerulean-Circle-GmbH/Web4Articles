/**
 * ProjectRootMocker - Utility for mocking project root in tests
 * 
 * This utility allows tests to create components in test/data directory
 * while making the system believe it's working on the actual project root.
 * This prevents project structure contamination during testing.
 */

import * as path from 'path';

export class ProjectRootMocker {
  private originalCwd: () => string;
  private testDataRoot: string;
  private isActive: boolean = false;

  constructor(testDataRoot: string) {
    this.originalCwd = process.cwd;
    this.testDataRoot = testDataRoot;
  }

  /**
   * Activate project root mocking
   * - process.cwd() returns test data directory
   * - This makes all relative path operations work from test data directory
   */
  mock(): void {
    if (this.isActive) {
      return; // Already mocked
    }

    const testRoot = this.testDataRoot;

    // Mock process.cwd() to return test data directory
    process.cwd = () => testRoot;

    this.isActive = true;
  }

  /**
   * Restore original project root behavior
   */
  restore(): void {
    if (!this.isActive) {
      return; // Not currently mocked
    }

    // Restore original functions
    process.cwd = this.originalCwd;

    this.isActive = false;
  }

  /**
   * Get the current test data root path
   */
  getTestRoot(): string {
    return this.testDataRoot;
  }

  /**
   * Check if mocking is currently active
   */
  isMocked(): boolean {
    return this.isActive;
  }

  /**
   * Resolve a path relative to the test root
   * Use this instead of path.resolve for test-aware path resolution
   */
  resolve(...pathSegments: string[]): string {
    // If first segment is absolute, use it as-is
    if (pathSegments.length > 0 && path.isAbsolute(pathSegments[0])) {
      return path.resolve(...pathSegments);
    }
    
    // Otherwise resolve relative to test data root
    return path.resolve(this.testDataRoot, ...pathSegments);
  }
}
