/**
 * EnvironmentInfo Interface - Environment detection information
 * 
 * Web4 principle: Single interface per file
 * Used by ONCE kernel for environment adaptation
 */

export interface EnvironmentInfo {
  /**
   * Platform type where ONCE kernel is running
   */
  platform: 'node' | 'browser' | 'worker' | 'pwa' | 'iframe';

  /**
   * Platform version information
   */
  version: string;

  /**
   * Available platform capabilities
   */
  capabilities: string[];

  /**
   * Whether platform is online/connected
   */
  isOnline: boolean;

  /**
   * Host information where kernel is running
   */
  hostname: string;

  /**
   * IP address information
   */
  ip: string;
}