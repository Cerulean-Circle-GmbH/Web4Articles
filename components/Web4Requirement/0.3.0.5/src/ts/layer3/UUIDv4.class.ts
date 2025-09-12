/**
 * UUIDv4 Class - Web4 Universal Unique Identifier Version 4 Implementation
 * Web4 principle: Single class per file, immutable value objects
 * Purpose: Provide type-safe UUIDv4 implementation for Web4 ecosystem
 */

import { UUID } from './UUID.interface.js';

export class UUIDv4 implements UUID {
  private readonly value: string;

  /**
   * Create UUIDv4 instance
   * Web4 pattern: Empty constructor with factory methods
   * 
   * @param uuidString - Optional UUID string, generates new if not provided
   * @throws Error if provided string is not valid UUIDv4 format
   */
  constructor(uuidString?: string) {
    if (uuidString) {
      if (!this.isValidUUIDv4(uuidString)) {
        throw new Error(`Invalid UUIDv4 format: ${uuidString}`);
      }
      this.value = uuidString.toLowerCase();
    } else {
      this.value = this.generateUUIDv4();
    }
  }

  /**
   * Generate new UUIDv4
   * Web4 pattern: Static factory method for object creation
   * 
   * @returns New UUIDv4 instance
   * @example
   * ```typescript
   * const uuid = UUIDv4.generate();
   * ```
   */
  static generate(): UUIDv4 {
    return new UUIDv4();
  }

  /**
   * Create UUIDv4 from existing string
   * Web4 pattern: Static factory method with validation
   * 
   * @param uuidString - UUID string to parse
   * @returns UUIDv4 instance
   * @throws Error if string is not valid UUIDv4
   * @example
   * ```typescript
   * const uuid = UUIDv4.from('44443290-015c-4720-be80-c42caf842252');
   * ```
   */
  static from(uuidString: string): UUIDv4 {
    return new UUIDv4(uuidString);
  }

  /**
   * Check if string is valid UUIDv4
   * Web4 pattern: Static validation method
   * 
   * @param str - String to validate
   * @returns true if valid UUIDv4 format
   * @example
   * ```typescript
   * if (UUIDv4.isValid('44443290-015c-4720-be80-c42caf842252')) {
   *   // Process as UUID
   * }
   * ```
   */
  static isValid(str: string): boolean {
    const uuid = new UUIDv4();
    return uuid.isValidUUIDv4(str);
  }

  /**
   * Get the UUID string representation
   * @returns 36-character UUID string
   */
  toString(): string {
    return this.value;
  }

  /**
   * Get the UUID as a string (valueOf implementation)
   * @returns 36-character UUID string
   */
  valueOf(): string {
    return this.value;
  }

  /**
   * Check if UUID is valid format
   * @returns true if UUID format is valid
   */
  isValid(): boolean {
    return this.isValidUUIDv4(this.value);
  }

  /**
   * Get UUID version number
   * @returns 4 (always 4 for UUIDv4)
   */
  getVersion(): number {
    return 4;
  }

  /**
   * Compare with another UUID
   * @param other - Another UUID to compare with
   * @returns true if UUIDs are equal
   */
  equals(other: UUID): boolean {
    return this.value === other.toString().toLowerCase();
  }

  /**
   * Get UUID as hyphenless string
   * @returns 32-character UUID string without hyphens
   */
  toHex(): string {
    return this.value.replace(/-/g, '');
  }

  /**
   * Generate new UUIDv4 string
   * Uses crypto.randomUUID() when available, fallback to manual generation
   */
  private generateUUIDv4(): string {
    // Use crypto.randomUUID() if available (Node.js 14.17+ and modern browsers)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Fallback implementation for older environments
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Validate UUIDv4 format
   * @param str - String to validate
   * @returns true if valid UUIDv4 format
   */
  private isValidUUIDv4(str: string): boolean {
    const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidv4Regex.test(str);
  }

  /**
   * JSON serialization support
   * @returns UUID string for JSON serialization
   */
  toJSON(): string {
    return this.value;
  }

  /**
   * Symbol.toPrimitive implementation for automatic conversion
   * @param hint - Conversion hint
   * @returns UUID string
   */
  [Symbol.toPrimitive](hint: 'string' | 'number' | 'default'): string {
    return this.value;
  }
}