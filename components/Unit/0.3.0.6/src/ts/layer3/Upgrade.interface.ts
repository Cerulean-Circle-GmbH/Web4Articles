/**
 * Upgrade Interface - Radical OOP upgrade capability
 * Web4 principle: Single interface per file, class method implementation
 * Purpose: Enable version upgrade functionality through class method pattern
 */

export interface Upgrade {
  upgrade(targetVersion: string): Promise<boolean>;
}