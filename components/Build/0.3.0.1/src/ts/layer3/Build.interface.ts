/**
 * Build Interface - Web4 Build Component Interface
 * 
 * Web4 principle: Single interface per file
 * Version 0.3.0.1: Web4-compliant build interface
 */

export interface Build {
  /**
   * Initialize from scenario (Web4 pattern)
   */
  init(scenario: any): this;

  /**
   * Check build environment
   */
  checkEnvironment(): Promise<any>;

  /**
   * Build specific component by name
   */
  buildComponent(componentName: string): Promise<any>;

  /**
   * Build all components in dependency order
   */
  buildAll(): Promise<any[]>;

  /**
   * Build self (bootstrap capability)
   */
  buildSelf(): Promise<any>;

  /**
   * Get build information
   */
  info(args: string[]): Promise<void>;

  /**
   * Show build help
   */
  help(args: string[]): Promise<void>;

  /**
   * Start build component
   */
  start(args: string[]): Promise<void>;
}