/**
 * ONCE - ONCE Component Interface
 * Web4 pattern: Component interface definition
 * @pdca 2025-11-10-UTC-1830.migrate-once-to-0.3.20.0.pdca.md - Updated for 0.3.20.0
 */

import { Scenario } from './Scenario.js';
import { ONCE as ONCEDomain } from './ONCE.js';

/**
 * ONCE Component interface - combines domain interface with CLI methods
 */
export interface ONCE extends ONCEDomain {
  info(topic?: string): Promise<this>;
  test(scope?: string, ...references: string[]): Promise<this>;
  build(): Promise<this>;
  clean(): Promise<this>;
  tree(depth?: string, showHidden?: string): Promise<this>;
  links(action?: string): Promise<this>;
}
