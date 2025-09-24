/**
 * CLI Interface - Base CLI component interface with static start pattern
 * Web4 principle: Single interface per file, radical OOP static methods
 * Purpose: Foundation interface for all CLI implementations with static start and component initialization
 */

export interface CLI {
  // Note: Static methods cannot be in TypeScript interfaces
  // Static start() method implemented directly in classes
  
  /**
   * Initialize CLI with component context
   */
  init(component: any): this;
  
  /**
   * Execute CLI commands
   */
  execute(args: string[]): Promise<void>;
  
  /**
   * Show usage information
   */
  showUsage(): void;
}