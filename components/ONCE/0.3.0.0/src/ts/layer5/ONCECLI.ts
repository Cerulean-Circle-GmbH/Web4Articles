#!/usr/bin/env node

/**
 * ONCECLI - ONCE component CLI implementation
 * 
 * Web4 pattern: Uses universal CLI implementation with command delegation
 * Commands delegate to same-named methods in DefaultONCE implementation
 * Following TSRanger 2.2 pattern but simplified
 */

// Temporary: Use minimal ONCE implementation
import { MinimalONCE } from '../MinimalONCE.js';

export class ONCECLI {
  private once: MinimalONCE;

  /**
   * Web4 Pattern: Empty constructor + initialization
   */
  constructor() {
    this.once = new MinimalONCE();
  }

  /**
   * Show colorful usage display - delegate to MinimalONCE
   */
  private showUsage(): void {
    // Delegate to MinimalONCE which has built-in usage display
    return;
  }

  /**
   * Run CLI with command line arguments - delegate to MinimalONCE
   */
  async run(args: string[]): Promise<void> {
    await this.once.run(args);
  }

  /**
   * Radical OOP: Static start method - delegate to MinimalONCE
   * Validates requirement: f016a180-a591-4f5b-ab50-9e6f3186da7d
   */
  static async start(args: string[] = process.argv.slice(2)): Promise<void> {
    await MinimalONCE.start(args);
  }
}

// Radical OOP Entry Point - Static method call
if (import.meta.url === `file://${process.argv[1]}`) {
  ONCECLI.start();
}