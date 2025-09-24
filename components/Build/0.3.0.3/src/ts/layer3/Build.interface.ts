/**
 * Build Interface - Dependency-free build system
 * 
 * Web4 principle: Interface in layer3
 * Version 0.3.0.3: Dependency-free, self-bootstrapping
 */

export interface Build {
  /**
   * Build a component by path
   */
  buildComponent(componentPath: string): Promise<boolean>;

  /**
   * Build ONCE component specifically
   */
  buildONCE(): Promise<boolean>;

  /**
   * Clean component build artifacts
   */
  cleanComponent(componentPath: string): Promise<boolean>;

  /**
   * Resolve component dependencies
   */
  resolveDependencies(componentPath: string): Promise<string[]>;

  /**
   * Check if component needs building
   */
  needsBuild(componentPath: string): boolean;
}