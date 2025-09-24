/**
 * EnvironmentCheckResult Interface - Environment validation result
 * 
 * Web4 principle: Single interface per file
 * Used by Build component for environment validation
 */

export interface EnvironmentCheckResult {
  /**
   * Node.js availability and version
   */
  node: {
    available: boolean;
    version?: string;
    path?: string;
  };

  /**
   * NPM availability and version
   */
  npm: {
    available: boolean;
    version?: string;
    path?: string;
  };

  /**
   * Overall environment readiness
   */
  ready: boolean;

  /**
   * Environment platform detection
   */
  platform: 'linux' | 'darwin' | 'win32' | 'unknown';

  /**
   * Architecture information
   */
  arch: string;

  /**
   * Check timestamp
   */
  checkedAt: string;
}