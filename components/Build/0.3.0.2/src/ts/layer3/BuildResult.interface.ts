/**
 * BuildResult Interface - Component build result information
 * 
 * Web4 principle: Single interface per file
 * Used by Build component to return build operation results
 */

import { IOR } from '../../../../IOR/0.3.0.2/src/ts/layer3/IOR.interface.js';

export interface BuildResult {
  /**
   * Component that was built
   */
  componentIOR: IOR;

  /**
   * Build success status
   */
  success: boolean;

  /**
   * Build artifacts created
   */
  artifacts: string[];

  /**
   * Build duration in milliseconds
   */
  duration: number;

  /**
   * Build start timestamp
   */
  startedAt: string;

  /**
   * Build completion timestamp
   */
  completedAt: string;

  /**
   * Error details if build failed
   */
  error?: {
    message: string;
    stack?: string;
    code?: number;
  };

  /**
   * Build output logs
   */
  logs: {
    stdout: string;
    stderr: string;
  };

  /**
   * Dependencies that were built
   */
  builtDependencies: IOR[];
}