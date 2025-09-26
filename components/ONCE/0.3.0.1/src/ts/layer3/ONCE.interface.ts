/**
 * ONCE Interface - Object Network Communication Engine
 * 
 * Web4 principle: Single interface per file
 * ONCE Role: Environment kernel that loads components from IORs
 * Version 0.3.0.1: Web4-compliant with demo/test functionality
 */

export interface ONCE {
  /**
   * Initialize from scenario (Web4 pattern)
   */
  init(scenario: any): this;

  /**
   * Start ONCE kernel
   */
  start(args: string[]): Promise<void>;

  /**
   * Stop ONCE kernel
   */
  stop(args: string[]): Promise<void>;

  /**
   * Get kernel status
   */
  status(args: string[]): Promise<void>;

  /**
   * Get kernel information
   */
  info(args: string[]): Promise<void>;

  /**
   * Show help information
   */
  help(args: string[]): Promise<void>;

  /**
   * Interactive demo functionality (ONCE 0.2.0.0 feature parity)
   */
  demo(args: string[]): Promise<void>;

  /**
   * Non-interactive test sequence functionality
   */
  test(args: string[]): Promise<void>;

  /**
   * Comprehensive ecosystem deinstall
   */
  deinstall(args: string[]): Promise<void>;
}