/**
 * CLI Interface - Universal command line interface for all Web4 components
 * 
 * Web4 principle: Single interface per file
 * Pattern: Command delegation to same-named methods in default implementations
 * Inspired by TSRanger 2.2 but simplified for universal component usage
 */

export interface CLI {
  /**
   * Start component (delegates to component.start())
   */
  start(args: string[]): Promise<void>;

  /**
   * Stop component (delegates to component.stop())
   */
  stop(args: string[]): Promise<void>;

  /**
   * Get component status (delegates to component.status())
   */
  status(args: string[]): Promise<void>;

  /**
   * Get component info (delegates to component.info())
   */
  info(args: string[]): Promise<void>;

  /**
   * Show component help (delegates to component.help())
   */
  help(args: string[]): Promise<void>;

  /**
   * Execute component command dynamically
   */
  execute(command: string, args: string[]): Promise<void>;
}