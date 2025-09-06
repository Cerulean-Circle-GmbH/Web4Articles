/**
 * CLI Interface - Base CLI component interface
 * Web4 principle: Single interface per file
 * Purpose: Foundation interface for all CLI implementations
 */

export interface CLI {
  /**
   * Initialize CLI with component - Web4 pattern
   */
  init(component: any): this;

  /**
   * Run CLI with command line arguments
   */
  run(args: string[]): Promise<void>;

  /**
   * Show usage information
   */
  showUsage(): void;
}