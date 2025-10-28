/**
 * Web4TSComponent - Web4 TypeScript Component Interface
 * Web4 pattern: Component interface for TypeScript component standards enforcement
 * 
 * Extends Component with development methods (test, build, clean, tree, links)
 */

import { Component } from './Component.interface.js';
import { Scenario } from './Scenario.interface.js';
import { Web4TSComponentModel } from './Web4TSComponentModel.interface.js';

export interface Web4TSComponent extends Component<Web4TSComponentModel> {
  // ========================================
  // LIFECYCLE METHODS (Inherited from Component)
  // ========================================
  // init(scenario: Scenario): this;
  // toScenario(name?: string): Promise<Scenario<Web4TSComponentModel>>;
  
  // ========================================
  // DEVELOPMENT METHODS (TypeScript Component Specific)
  // ========================================
  
  /**
   * Run component tests (full suite or selective)
   * Hierarchical testing with numeric references
   * 
   * @param scope Test scope: 'all' | 'file' | 'describe' | 'itCase'
   * @param references Hierarchical test references (e.g., '1', '2a', '3b2')
   * @returns this for method chaining
   * 
   * @example
   * await component.test();              // Run all tests
   * await component.test('file', '1');   // Run test file #1
   * await component.test('itCase', '2a1'); // Run specific test case
   */
  test(scope?: string, ...references: string[]): Promise<this>;
  
  /**
   * Build component (TypeScript compilation)
   * @returns this for method chaining
   */
  build(...flags: string[]): Promise<this>;
  
  /**
   * Clean component build artifacts
   * @returns this for method chaining
   */
  clean(): Promise<this>;
  
  /**
   * Show component directory tree structure
   * @param depth Maximum depth to show (default: 4)
   * @param showHidden Whether to show hidden files (default: false)
   * @returns this for method chaining
   */
  tree?(depth?: string, showHidden?: string): Promise<this>;
  
  /**
   * Show semantic version links (dev, test, prod, latest)
   * @param action Optional action (e.g., 'repair' to fix broken links)
   * @returns this for method chaining
   */
  links?(action?: string): Promise<this>;
  
  // ========================================
  // WEB4TSCOMPONENT SPECIFIC METHODS
  // ========================================
  
  /**
   * Generate location-resilient CLI wrapper
   * @param componentName Name of component
   * @param version Version of component
   * @returns Generated CLI script content
   */
  generateLocationResilientCLI(componentName: string, version: string): Promise<string>;
  
  /**
   * Set target directory for component operations
   * Used for test isolation and context switching
   * @param directory Target directory path
   */
  setTargetDirectory(directory: string): void;
}