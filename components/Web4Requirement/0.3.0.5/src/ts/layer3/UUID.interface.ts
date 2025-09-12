/**
 * UUID Interface - Web4 Universal Unique Identifier Contract
 * Web4 principle: Single interface per file, universal identifier standard
 * Purpose: Define contract for all UUID implementations in Web4 ecosystem
 */

export interface UUID {
  /**
   * Get the UUID string representation
   * @returns 36-character UUID string in format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   */
  toString(): string;

  /**
   * Get the UUID as a string (alias for toString)
   * @returns 36-character UUID string
   */
  valueOf(): string;

  /**
   * Check if UUID is valid format
   * @returns true if UUID format is valid
   */
  isValid(): boolean;

  /**
   * Get UUID version number
   * @returns UUID version (1, 2, 3, 4, or 5)
   */
  getVersion(): number;

  /**
   * Compare with another UUID
   * @param other - Another UUID to compare with
   * @returns true if UUIDs are equal
   */
  equals(other: UUID): boolean;

  /**
   * Get UUID as hyphenless string
   * @returns 32-character UUID string without hyphens
   */
  toHex(): string;
}