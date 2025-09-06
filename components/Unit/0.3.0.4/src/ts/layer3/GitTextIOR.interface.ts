/**
 * GitTextIOR Interface - Git Text Interoperable Object Reference
 * Web4 principle: Single interface per file
 * Purpose: Handle git URL references with precise line/column and character positioning
 */

export interface GitTextIOR {
  /**
   * Parse git URL with line/column or character positioning
   * @param gitUrl - Git URL with positioning (e.g., #L42:15-67:23 or #L1250-1890)
   * @returns Parsed git text IOR format
   */
  parse(gitUrl: string): string;

  /**
   * Format git URL as IOR text format
   * @param gitUrl - Raw GitHub URL with positioning
   * @returns IOR format: ior:git:text:giturl
   */
  format(gitUrl: string): string;

  /**
   * Validate git URL format and positioning
   * @param gitUrl - Git URL to validate
   * @returns True if valid git URL with proper positioning
   */
  validate(gitUrl: string): boolean;

  /**
   * Extract positioning information from git URL
   * @param gitUrl - Git URL with positioning
   * @returns Positioning data (line/column or character range)
   */
  extractPositioning(gitUrl: string): GitPositioning;

  /**
   * Convert to scenario for hibernation
   */
  toScenario(): Promise<GitTextIORScenario>;
}

export interface GitPositioning {
  type: 'line-column' | 'character';
  startLine?: number;
  startColumn?: number;
  endLine?: number;
  endColumn?: number;
  startChar?: number;
  endChar?: number;
}

export interface GitTextIORScenario {
  ior: {
    uuid: string;
    component: string;
    version: string;
  };
  owner: string;
  model: {
    uuid: string;
    gitUrl: string;
    iorFormat: string;
    positioning: GitPositioning;
    createdAt: string;
    updatedAt: string;
  };
}