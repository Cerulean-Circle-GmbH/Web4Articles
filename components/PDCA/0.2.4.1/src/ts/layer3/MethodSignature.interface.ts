/**
 * MethodSignature.interface.ts - Simple method metadata for CLI routing
 * Used by DefaultCLI for method discovery and routing
 * 
 * Note: Different from MethodInfo which includes full TSDoc/CLI annotations
 * This interface is for lightweight method signatures used during CLI execution
 */

/**
 * Simple method signature metadata for CLI routing
 */
export interface MethodSignature {
  /**
   * Method name
   */
  name: string;
  
  /**
   * Number of parameters (for validation)
   */
  paramCount: number;
  
  /**
   * Whether method is async (for await handling)
   */
  isAsync: boolean;
}

