/**
 * ONCEDemo Interface - Interactive Demo Capability
 * 
 * Web4 principle: Single interface per file
 * Demo functionality interface for ONCE component
 */

export interface ONCEDemo {
  /**
   * Start interactive demo with browser integration
   */
  demo(args: string[]): Promise<void>;

  /**
   * Run non-interactive test sequences
   */
  test(args: string[]): Promise<void>;

  /**
   * Show demo help and available sequences
   */
  showDemoHelp(): void;

  /**
   * Run test sequence from input string
   */
  runTestSequence(input: string): Promise<void>;

  /**
   * Open browser for demo (platform-specific)
   */
  openBrowser(): Promise<void>;

  /**
   * Sleep utility for test sequences
   */
  sleep(ms: number): Promise<void>;
}